// Web Audio API synthesized camera shutter sound
let audioCtx: AudioContext | null = null;

export const playShutterSound = () => {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // First click sound (mirror/shutter open)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(400, now);
    osc1.frequency.exponentialRampToValueAtTime(80, now + 0.05);

    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);

    osc1.start(now);
    osc1.stop(now + 0.05);

    // Second mechanical click sound (shutter close)
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();

    const t2 = now + 0.08;
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(600, t2);
    osc2.frequency.exponentialRampToValueAtTime(120, t2 + 0.06);

    gain2.gain.setValueAtTime(0.2, t2);
    gain2.gain.exponentialRampToValueAtTime(0.01, t2 + 0.06);

    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);

    osc2.start(t2);
    osc2.stop(t2 + 0.06);
  } catch (e) {
    console.log('Audio playback prevented or unsupported:', e);
  }
};
