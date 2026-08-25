export interface AudioRecordingResult {
  blob: Blob;
  base64: string;
  mimeType: string;
  durationSeconds: number;
  audioUrl: string;
}

export class WakingVoiceRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private startTime: number = 0;
  private animationFrameId: number | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;

  public isRecording: boolean = false;
  public onVolumeUpdate?: (volume: number) => void;

  async start(): Promise<void> {
    if (this.isRecording) return;
    this.audioChunks = [];

    // Request microphone stream
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    // Setup visualizer analyser
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx();
      const source = this.audioContext.createMediaStreamSource(this.stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;
      source.connect(this.analyser);
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
      this.trackVolume();
    } catch (e) {
      console.warn("AudioContext setup warning:", e);
    }

    // Determine supported mime type
    let mimeType = "audio/webm;codecs=opus";
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      if (MediaRecorder.isTypeSupported("audio/webm")) {
        mimeType = "audio/webm";
      } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
        mimeType = "audio/mp4";
      } else if (MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")) {
        mimeType = "audio/ogg;codecs=opus";
      } else {
        mimeType = "";
      }
    }

    this.mediaRecorder = mimeType
      ? new MediaRecorder(this.stream, { mimeType })
      : new MediaRecorder(this.stream);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.startTime = Date.now();
    this.isRecording = true;
    this.mediaRecorder.start(250); // collect chunks every 250ms
  }

  private trackVolume = () => {
    if (!this.isRecording || !this.analyser || !this.dataArray) return;
    this.analyser.getByteFrequencyData(this.dataArray);
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i];
    }
    const average = sum / this.dataArray.length;
    const normalized = Math.min(1, average / 128);
    if (this.onVolumeUpdate) {
      this.onVolumeUpdate(normalized);
    }
    this.animationFrameId = requestAnimationFrame(this.trackVolume);
  };

  stop(): Promise<AudioRecordingResult> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || !this.isRecording) {
        reject(new Error("No active recording found"));
        return;
      }

      this.isRecording = false;
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }

      const durationSeconds = Math.max(1, Math.round((Date.now() - this.startTime) / 1000));
      const mimeType = this.mediaRecorder.mimeType || "audio/webm";

      this.mediaRecorder.onstop = async () => {
        try {
          const blob = new Blob(this.audioChunks, { type: mimeType });
          const audioUrl = URL.createObjectURL(blob);
          const base64 = await blobToBase64(blob);

          // Clean up tracks
          if (this.stream) {
            this.stream.getTracks().forEach((track) => track.stop());
            this.stream = null;
          }
          if (this.audioContext && this.audioContext.state !== "closed") {
            this.audioContext.close().catch(() => {});
          }

          resolve({
            blob,
            base64,
            mimeType,
            durationSeconds,
            audioUrl,
          });
        } catch (err) {
          reject(err);
        }
      };

      this.mediaRecorder.stop();
    });
  }

  cancel(): void {
    this.isRecording = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      try {
        this.mediaRecorder.stop();
      } catch {}
    }
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close().catch(() => {});
    }
  }
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      // remove data:audio/xyz;base64, prefix
      const base64 = dataUrl.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
