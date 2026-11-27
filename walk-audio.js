window.createWalkAudio = (toggle, musicUrl) => {
  const Context = window.AudioContext || window.webkitAudioContext;
  const preference = 'our-walk-muted';
  let muted = false;
  try { muted = localStorage.getItem(preference) === 'yes'; } catch {}
  let context;
  let output;
  let bed;
  let noise;
  let music;
  let ducked = false;
  const lastCue = new Map();

  function updateToggle() {
    toggle.setAttribute('aria-pressed', String(!muted));
  }

  function startMusic() {
    if (music && music.paused && !muted && !document.hidden) music.play().catch(() => {});
  }

  function unlock(event) {
    if (muted || !Context || event?.target?.closest?.('.sound-toggle')) return;
    if (!context) {
      context = new Context();
      output = context.createGain();
      output.connect(context.destination);
      noise = context.createBuffer(1, Math.ceil(context.sampleRate * .55), context.sampleRate);
      const samples = noise.getChannelData(0);
      for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
      if (musicUrl) {
        music = new Audio();
        music.crossOrigin = 'anonymous';
        music.loop = true;
        music.src = musicUrl;
        bed = context.createGain();
        bed.gain.value = ducked ? .045 : .17;
        context.createMediaElementSource(music).connect(bed).connect(output);
      }
    }
    if (context.state !== 'running') context.resume().catch(() => {});
    startMusic();
  }

  function burst(time, duration, frequency, amount, filterType = 'bandpass') {
    const source = context.createBufferSource();
    source.buffer = noise;
    const filter = context.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = frequency;
    const level = context.createGain();
    level.gain.setValueAtTime(.001, time);
    level.gain.exponentialRampToValueAtTime(amount, time + .006);
    level.gain.exponentialRampToValueAtTime(.001, time + duration);
    source.connect(filter).connect(level).connect(output);
    source.start(time, 0, duration);
  }

  function tone(time, duration, start, end, amount) {
    const oscillator = context.createOscillator();
    oscillator.frequency.setValueAtTime(start, time);
    oscillator.frequency.exponentialRampToValueAtTime(end, time + duration);
    const level = context.createGain();
    level.gain.setValueAtTime(.001, time);
    level.gain.exponentialRampToValueAtTime(amount, time + .009);
    level.gain.exponentialRampToValueAtTime(.001, time + duration);
    oscillator.connect(level).connect(output);
    oscillator.start(time);
    oscillator.stop(time + duration);
  }

  const cues = {
    shutter(time) {
      burst(time, .044, 2250, .32, 'highpass');
      burst(time + .047, .066, 1490, .24, 'highpass');
      tone(time, .08, 280, 88, .15);
      tone(time + .048, .065, 242, 104, .09);
    },
    photo(time) {
      burst(time, .17, 1350, .16);
      burst(time + .08, .085, 830, .08);
    },
    message(time) { tone(time, .103, 720, 465, .075); },
    notification(time) {
      tone(time, .14, 650, 643, .09);
      tone(time + .075, .16, 875, 868, .065);
    },
    envelope(time) {
      burst(time, .075, 1260, .19);
      burst(time + .08, .31, 1770, .21);
      burst(time + .27, .12, 1020, .12);
    },
    fold(time) {
      burst(time, .26, 1160, .15);
      tone(time + .20, .08, 165, 92, .055);
    },
    film(time) { burst(time, .4, 830, .15, 'lowpass'); },
    disc(time) { tone(time, .16, 480, 520, .075); },
    star(time) {
      tone(time, .24, 880, 872, .088);
      tone(time + .065, .26, 1320, 1314, .069);
    }
  };

  function play(name) {
    if (muted || !context || document.hidden) return;
    const now = performance.now();
    if (now - (lastCue.get(name) ?? -Infinity) < 115) return;
    lastCue.set(name, now);
    cues[name](context.currentTime + .012);
  }

  function setDucked(value) {
    ducked = value;
    if (bed) bed.gain.setTargetAtTime(value ? .045 : .17, context.currentTime, .18);
  }

  toggle.hidden = !Context;
  updateToggle();
  toggle.addEventListener('click', () => {
    muted = !muted;
    try { localStorage.setItem(preference, muted ? 'yes' : 'no'); } catch {}
    updateToggle();
    if (output) output.gain.setTargetAtTime(muted ? 0 : 1, context.currentTime, .024);
    if (muted) music?.pause();
    else {
      unlock();
      play('disc');
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) music?.pause();
    else startMusic();
  });

  return { unlock, play, setDucked };
};
