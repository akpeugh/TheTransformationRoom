import { GoogleGenAI, Modality } from "@google/genai";

export type NovaState = 'idle' | 'initializing' | 'listening' | 'thinking' | 'speaking' | 'error' | 'disconnected';

export interface VideoSessionConfig {
  apiKey: string; // Gemini API Key
  systemInstruction: string;
}

export interface NovaUpdate {
  state: NovaState;
  transcript?: string;
  aiResponse?: string;
  audioLevel?: number;
  error?: string;
  debug?: {
    apiKeyFound?: boolean;
    sessionCreated?: boolean;
    streamConnected?: boolean;
    lastError?: string;
    appUrl?: string;
  };
}

export class NovaVideoProvider {
  private state: NovaState = 'idle';
  private onUpdate: (update: NovaUpdate) => void;
  private audioContext: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private geminiSession: any = null;
  private userCameraStream: MediaStream | null = null;

  constructor(onUpdate: (update: NovaUpdate) => void) {
    this.onUpdate = onUpdate;
  }

  private update(data: Partial<NovaUpdate>) {
    if (data.state) this.state = data.state;
    this.onUpdate({
      state: this.state,
      ...data
    });
  }

  async initialize(config: VideoSessionConfig) {
    try {
      this.update({ state: 'initializing' });

      // Initialize Gemini Brain
      const genAI = new GoogleGenAI({ apiKey: config.apiKey });
      this.geminiSession = await genAI.live.connect({
        model: "gemini-3.1-flash-live-preview",
        callbacks: {
          onopen: () => {
            console.log("[NovaProvider] Brain connection opened");
            this.update({ state: 'listening' });
            this.sendFirstMessage();
          },
          onmessage: (msg: any) => this.handleBrainMessage(msg),
          onerror: (err: any) => {
            console.error("[NovaProvider] Brain Error:", err);
            this.update({ state: 'error', error: "Neural link disrupted." });
          },
          onclose: () => {
            console.log("[NovaProvider] Brain connection closed");
            this.update({ state: 'disconnected' });
          }
        },
        config: {
          systemInstruction: config.systemInstruction,
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Charon" } }
          }
        }
      });

      await this.setupAudio();
      this.update({ debug: { sessionCreated: true, streamConnected: true } });

    } catch (err) {
      console.error("[NovaProvider] Init Failed:", err);
      this.update({ state: 'error', error: "Failed to initialize Nova systems. Check API console." });
    }
  }

  async enableUserCamera(): Promise<MediaStream | null> {
    try {
      this.userCameraStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 }, 
        audio: false 
      });
      return this.userCameraStream;
    } catch (error) {
      console.error("[NovaProvider] User camera access failed:", error);
      return null;
    }
  }

  disableUserCamera() {
    if (this.userCameraStream) {
      this.userCameraStream.getTracks().forEach(track => track.stop());
      this.userCameraStream = null;
    }
  }

  private async setupAudio() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new AudioContext({ sampleRate: 16000 });
      const source = this.audioContext.createMediaStreamSource(this.stream);
      const processor = this.audioContext.createScriptProcessor(4096, 1, 1);

      processor.onaudioprocess = (e) => {
        if (this.state !== 'listening' && this.state !== 'speaking') return;

        const inputData = e.inputBuffer.getChannelData(0);
        let sum = 0;
        const int16Data = new Int16Array(inputData.length);
        
        for (let i = 0; i < inputData.length; i++) {
          const val = Math.max(-1, Math.min(1, inputData[i]));
          int16Data[i] = val < 0 ? val * 32768 : val * 32767;
          sum += Math.abs(val);
        }

        const level = sum / inputData.length;
        this.update({ audioLevel: level });

        if (this.geminiSession && level > 0.01) {
           const bytes = new Uint8Array(int16Data.buffer);
           let binary = '';
           for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
           this.geminiSession.sendRealtimeInput({
             audio: { data: btoa(binary), mimeType: 'audio/pcm;rate=16000' }
           });
        }
      };

      source.connect(processor);
      processor.connect(this.audioContext.destination);
    } catch (err) {
      console.error("[NovaProvider] Audio Setup Failed:", err);
      this.update({ state: 'error', error: "Microphone access is required for Nova Voice." });
    }
  }

  private handleBrainMessage(msg: any) {
    if (msg.serverContent?.modelTurn) {
      this.update({ state: 'speaking' });
    }

    if (msg.serverContent?.outputTranscription?.text) {
      const text = msg.serverContent.outputTranscription.text;
      this.update({ aiResponse: text });

      if (msg.serverContent.outputTranscription.finished) {
        setTimeout(() => this.update({ state: 'listening' }), 500);
      }
    }

    if (msg.serverContent?.inputTranscription?.text) {
      this.update({ transcript: msg.serverContent.inputTranscription.text });
    }

    if (msg.serverContent?.interrupted) {
      this.update({ state: 'listening', aiResponse: "... Nova listens ..." });
    }
  }

  private sendFirstMessage() {
    if (this.geminiSession) {
      this.geminiSession.sendClientContent({
        turns: [{ role: "user", parts: [{ text: "Introduce yourself as Nova briefly and tell me you're ready to guide my transformation." }] }],
        turnComplete: true
      });
    }
  }

  async stop() {
    if (this.stream) this.stream.getTracks().forEach(t => t.stop());
    if (this.userCameraStream) this.userCameraStream.getTracks().forEach(t => t.stop());
    if (this.audioContext) this.audioContext.close();
    if (this.geminiSession) this.geminiSession.close();
    this.update({ state: 'disconnected' });
  }
}

