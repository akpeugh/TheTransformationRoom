import { GoogleGenAI, Modality } from "@google/genai";
import StreamingAvatar, { AvatarQuality, VoiceEmotion, TaskType } from "@heygen/streaming-avatar";

export type NovaState = 'idle' | 'initializing' | 'listening' | 'thinking' | 'speaking' | 'error' | 'disconnected';

export interface VideoSessionConfig {
  apiKey: string; // Gemini API Key
  systemInstruction: string;
  provider?: 'gemini-live' | 'heygen';
}

export interface NovaUpdate {
  state: NovaState;
  transcript?: string;
  aiResponse?: string;
  audioLevel?: number;
  error?: string;
  videoStream?: MediaStream;
  debug?: {
    apiKeyFound?: boolean;
    avatarIdFound?: boolean;
    voiceIdFound?: boolean;
    sessionCreated?: boolean;
    streamConnected?: boolean;
    lastError?: string;
    apiRouteReached?: boolean;
  };
}

export class NovaVideoProvider {
  private state: NovaState = 'idle';
  private onUpdate: (update: NovaUpdate) => void;
  private audioContext: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private session: any = null;
  private avatar: StreamingAvatar | null = null;

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

      // 1. Initialize Gemini Brain
      const genAI = new GoogleGenAI({ apiKey: config.apiKey });
      this.session = await genAI.live.connect({
        model: "gemini-2.0-flash-exp",
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

      // 2. Initialize HeyGen Video Avatar if requested
      if (config.provider === 'heygen') {
        const responseData = await this.getHeyGenToken();
        this.update({ 
          debug: { 
            apiRouteReached: true, 
            ...responseData.debug 
          } 
        });

        const token = responseData.token;
        this.avatar = new StreamingAvatar({ token });
        
        const avatarId = responseData.avatarId || "92ef99d925184626bdd01572101baf81";
        const voiceId = responseData.voiceId || "42d00d4aac5441279d8536cd6b52c53c";

        console.log("[NovaProvider] Starting HeyGen Session with:", { avatarId, voiceId });

        const sessionData = await this.avatar.createStartAvatar({
          quality: AvatarQuality.Medium,
          avatarName: avatarId,
          voice: {
            rate: 1,
            emotion: VoiceEmotion.FRIENDLY,
            voiceId: voiceId || undefined
          }
        });

        if (sessionData && this.avatar) {
          console.log("[NovaProvider] HeyGen Session Created:", sessionData.session_id);
          this.update({ debug: { sessionCreated: true } });
          // @ts-ignore - The SDK version might differ slightly in its implementation of stream events
          this.avatar.on('stream_ready', (event: any) => {
            console.log("[NovaProvider] HeyGen Stream Ready");
            this.update({ videoStream: event.detail, debug: { streamConnected: true } });
          });
          
          // Fallback if event doesn't fire but we have session
          if ((sessionData as any).video_url) {
             console.log("[NovaProvider] HeyGen Session Data has video_url");
          }
        }
      }

      await this.setupAudio();

    } catch (err) {
      console.error("[NovaProvider] Init Failed:", err);
      this.update({ state: 'error', error: "Failed to initialize Nova systems. Check API console." });
    }
  }

  private async getHeyGenToken(): Promise<any> {
    const response = await fetch("/api/heygen-token", { method: "POST" });
    const data = await response.json();
    if (!response.ok) {
      this.update({ debug: { lastError: data.error, apiRouteReached: true, ...data.debug } });
      throw new Error(data.error || "Failed to fetch HeyGen token");
    }
    return data;
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

        if (this.session && level > 0.01) {
           const bytes = new Uint8Array(int16Data.buffer);
           let binary = '';
           for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
           this.session.sendRealtimeInput({
             audio: { data: btoa(binary), mimeType: 'audio/pcm;rate=16000' }
           });
        }
      };

      source.connect(processor);
      processor.connect(this.audioContext.destination);
    } catch (err) {
      console.error("[NovaProvider] Audio Setup Failed:", err);
      this.update({ state: 'error', error: "Microphone access is required for Nova Video." });
    }
  }

  private handleBrainMessage(msg: any) {
    if (msg.serverContent?.modelTurn) {
      this.update({ state: 'speaking' });
    }

    if (msg.serverContent?.outputTranscription?.text) {
      const text = msg.serverContent.outputTranscription.text;
      this.update({ aiResponse: text });

      // Feed text to HeyGen to sync lips
      if (this.avatar && text) {
        this.avatar.speak({ text, task_type: TaskType.REPEAT }).catch(e => console.error("HeyGen Speak Error:", e));
      }

      if (msg.serverContent.outputTranscription.finished) {
        setTimeout(() => this.update({ state: 'listening' }), 500);
      }
    }

    if (msg.serverContent?.inputTranscription?.text) {
      this.update({ transcript: msg.serverContent.inputTranscription.text });
    }

    if (msg.serverContent?.interrupted) {
      // In newer SDKs it might be stopSpeaking or we just let it finish if short
      this.update({ state: 'listening', aiResponse: "... Nova listens ..." });
    }
  }

  private sendFirstMessage() {
    if (this.session) {
      this.session.sendClientContent({
        turns: [{ role: "user", parts: [{ text: "Introduce yourself as Nova briefly and tell me you're ready to guide my transformation visually." }] }],
        turnComplete: true
      });
    }
  }

  async stop() {
    if (this.stream) this.stream.getTracks().forEach(t => t.stop());
    if (this.audioContext) this.audioContext.close();
    if (this.session) this.session.close();
    if (this.avatar) {
      try {
        await this.avatar.stopAvatar();
      } catch (e) {
        console.error("HeyGen Stop Error:", e);
      }
      this.avatar = null;
    }
    this.update({ state: 'disconnected' });
  }
}
