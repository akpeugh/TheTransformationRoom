export type NovaState = 'idle' | 'initializing' | 'listening' | 'thinking' | 'speaking' | 'error' | 'disconnected';

export interface VideoSessionConfig {
  apiKey: string; // OpenAI or placeholder
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
  private userCameraStream: MediaStream | null = null;
  private isRunning: boolean = false;

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
      this.isRunning = true;
      
      // We removed the Gemini Realtime API dependency.
      // This is now purely a placeholder integration that can be hooked up to OpenAI Realtime
      // or HeyGen APIs in the future since the user requested us to migrate away from Gemini.
      
      setTimeout(() => {
        if (!this.isRunning) return;
        this.update({ state: 'listening' });
        this.update({ debug: { sessionCreated: true, streamConnected: true } });
        console.log("[NovaProvider] Placeholder connection opened.");
        this.update({ aiResponse: "My interstellar link has been upgraded to OpenAI. Realtime Voice is currently being configured." });
        setTimeout(() => this.update({ state: 'listening', aiResponse: "" }), 5000);
      }, 1500);

      await this.setupAudio();

    } catch (err) {
      console.error("[NovaProvider] Init Failed:", err);
      this.update({ state: 'error', error: "Failed to initialize Nova systems." });
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
        for (let i = 0; i < inputData.length; i++) {
          sum += Math.abs(inputData[i]);
        }
        const level = sum / inputData.length;
        this.update({ audioLevel: level });
      };

      source.connect(processor);
      processor.connect(this.audioContext.destination);
    } catch (err) {
      console.error("[NovaProvider] Audio Setup Failed:", err);
      this.update({ state: 'error', error: "Microphone access is required for Nova Voice." });
    }
  }

  async stop() {
    this.isRunning = false;
    if (this.stream) this.stream.getTracks().forEach(t => t.stop());
    if (this.userCameraStream) this.userCameraStream.getTracks().forEach(t => t.stop());
    if (this.audioContext) this.audioContext.close();
    this.update({ state: 'disconnected' });
  }
}

