class AudioManager {
  constructor() {
    if (!AudioManager.instance) {
      this.audio = new Audio();
      this.currentSrc = null;
      this.isPlaying = false;
      this.subscribers = new Set();

      this.audio.addEventListener("ended", () => {
        this.isPlaying = false;
        this.notifySubscribers();
      });

      this.audio.addEventListener("error", (e) => {
        console.error("Audio playback error:", e);
      });

      AudioManager.instance = this;
    }
    return AudioManager.instance;
  }

  play(src) {
    console.log("AudioManager: play called with src:", src);
    if (this.currentSrc !== src) {
      this.audio.src = src;
      this.currentSrc = src;
    }
    this.audio.play().catch((err) => {
      console.error("Play error:", err);
    });
    this.isPlaying = true;
    this.notifySubscribers();
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.notifySubscribers();
  }

  toggle(src) {
    if (this.isPlaying && this.currentSrc === src) {
      this.pause();
    } else {
      this.play(src);
    }
  }

  subscribe(callback) {
    this.subscribers.add(callback);
  }

  unsubscribe(callback) {
    this.subscribers.delete(callback);
  }

  notifySubscribers() {
    this.subscribers.forEach((callback) =>
      callback(this.isPlaying, this.currentSrc)
    );
  }
}

const instance = new AudioManager();

export default instance;
