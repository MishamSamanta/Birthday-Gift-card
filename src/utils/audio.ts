/**
 * Magical Synthesizer utilizing Web Audio API for highly responsive
 * client-side sound effects without loading external files.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playPop() {
    this.init();
    if (!this.ctx) return;
    
    // Quick, sweet sound for small buttons or pop up elements
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
    
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  }

  playMagicUnlock() {
    this.init();
    if (!this.ctx) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;
    
    // Play a lovely, ascending chime arpeggio: C5 -> E5 -> G5 -> C6
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    
    notes.forEach((freq, idx) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      
      o.type = 'sine';
      o.frequency.value = freq;
      
      const startTime = now + idx * 0.12;
      const duration = 0.8;
      
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      o.connect(g);
      g.connect(ctx.destination);
      
      o.start(startTime);
      o.stop(startTime + duration);
    });
  }

  playSparkle() {
    this.init();
    if (!this.ctx) return;
    
    const ctx = this.ctx;
    const now = ctx.currentTime;
    // Fast, glittering random notes for hovering sparkles
    const freq = 1200 + Math.random() * 600;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(now + 0.3);
  }
}

export const sound = new SoundEngine();
