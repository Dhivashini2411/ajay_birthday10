/* ==========================================================================
   WEB AUDIO & MP3 AUDIO MANAGER
   Supports AJAYSONG.mpeg / AJAYSONG.mp3 custom background music + built-in synth & SFX
   ========================================================================== */

export class AudioManager {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.melodyTimer = null;
    this.bgAudio = null;
    this.useMp3 = false;

    // List of audio candidate sources to auto-detect
    this.audioSources = [
      '/AJAYSONG.mpeg',
      '/AJAYSONG.mp3',
      '/AJAYSONG',
      '/music.mp3'
    ];

    this.initAudioSources();

    // Built-in Synth Happy Birthday melody fallback
    this.notes = [
      { note: 261.63, duration: 0.4 }, { note: 261.63, duration: 0.2 }, { note: 293.66, duration: 0.6 },
      { note: 261.63, duration: 0.6 }, { note: 349.23, duration: 0.6 }, { note: 329.63, duration: 1.0 },

      { note: 261.63, duration: 0.4 }, { note: 261.63, duration: 0.2 }, { note: 293.66, duration: 0.6 },
      { note: 261.63, duration: 0.6 }, { note: 392.00, duration: 0.6 }, { note: 349.23, duration: 1.0 },

      { note: 261.63, duration: 0.4 }, { note: 261.63, duration: 0.2 }, { note: 523.25, duration: 0.6 },
      { note: 440.00, duration: 0.6 }, { note: 349.23, duration: 0.6 }, { note: 329.63, duration: 0.6 },
      { note: 293.66, duration: 0.8 },

      { note: 466.16, duration: 0.4 }, { note: 466.16, duration: 0.2 }, { note: 440.00, duration: 0.6 },
      { note: 349.23, duration: 0.6 }, { note: 392.00, duration: 0.6 }, { note: 349.23, duration: 1.2 }
    ];

    this.currentNoteIndex = 0;
  }

  initAudioSources() {
    this.bgAudio = new Audio();
    this.bgAudio.loop = true;

    // Try loading primary candidate: AJAYSONG.mpeg
    let currentIndex = 0;

    const tryNextSource = () => {
      if (currentIndex >= this.audioSources.length) {
        this.useMp3 = false;
        return;
      }

      const src = this.audioSources[currentIndex];
      this.bgAudio.src = src;
      this.bgAudio.load();

      const onCanPlay = () => {
        this.useMp3 = true;
        this.bgAudio.removeEventListener('canplaythrough', onCanPlay);
        this.bgAudio.removeEventListener('error', onError);
      };

      const onError = () => {
        this.bgAudio.removeEventListener('canplaythrough', onCanPlay);
        this.bgAudio.removeEventListener('error', onError);
        currentIndex++;
        tryNextSource();
      };

      this.bgAudio.addEventListener('canplaythrough', onCanPlay);
      this.bgAudio.addEventListener('error', onError);
    };

    tryNextSource();
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleMusic(onStateChange) {
    this.initContext();
    if (this.isPlaying) {
      this.stopMelody();
      if (onStateChange) onStateChange(false);
    } else {
      this.startMelody();
      if (onStateChange) onStateChange(true);
    }
  }

  startMelody() {
    this.isPlaying = true;
    if (this.useMp3 && this.bgAudio) {
      this.bgAudio.play().then(() => {
        this.useMp3 = true;
      }).catch((e) => {
        console.warn('Custom audio play error, falling back to synth melody:', e);
        this.currentNoteIndex = 0;
        this.playNextNote();
      });
    } else {
      this.currentNoteIndex = 0;
      this.playNextNote();
    }
  }

  stopMelody() {
    this.isPlaying = false;
    if (this.bgAudio) {
      this.bgAudio.pause();
    }
    if (this.melodyTimer) {
      clearTimeout(this.melodyTimer);
      this.melodyTimer = null;
    }
  }

  playNextNote() {
    if (!this.isPlaying || !this.audioCtx) return;

    const current = this.notes[this.currentNoteIndex];
    this.playTone(current.note, current.duration);

    this.currentNoteIndex = (this.currentNoteIndex + 1) % this.notes.length;
    this.melodyTimer = setTimeout(() => {
      this.playNextNote();
    }, (current.duration + 0.1) * 1000);
  }

  playTone(freq, duration) {
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0, this.audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, this.audioCtx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  playPop() {
    this.initContext();
    if (!this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch (e) {}
  }

  playChime() {
    this.initContext();
    if (!this.audioCtx) return;
    const chimeNotes = [523.25, 659.25, 783.99, 1046.50];
    chimeNotes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.4);
      }, idx * 80);
    });
  }
}
