/* audio.js — one hub for the song, the voice note, and the ambient toggle.
   Only one piece of media plays at a time, and nothing ever autoplays. */
(function () {
  const FC = window.FC;
  const U = FC.util;
  const A = (FC.audio = {});

  const players = [];   // every audio player registered here
  A.videos = [];        // widgets.js registers <video> elements here

  A.pauseAllExcept = function (keep) {
    players.forEach((p) => {
      if (p.audio !== keep && !p.audio.paused) {
        // remember when the ambient theme is interrupted by other media,
        // so it can resume once that media finishes
        if (A.song && p === A.song && keep) A._resume = true;
        p.audio.pause();
      }
    });
    A.videos.forEach((v) => { if (v !== keep && !v.paused) v.pause(); });
  };

  A.resumeAmbient = function () {
    if (A._resume && A.song && A.song.audio.paused && !A.song.isFailed()) {
      A._resume = false;
      A.song.audio.play().catch(() => {});
    }
  };

  /* decorative waveform: deterministic heights seeded from the file name */
  function buildWave(waveEl, seedStr, n) {
    const rnd = U.rng(U.seed(seedStr));
    let prev = 40;
    const bars = [];
    for (let i = 0; i < n; i++) {
      const target = 16 + rnd() * 78;
      prev = prev * .55 + target * .45; // smooth neighbours
      const bar = document.createElement("i");
      bar.style.setProperty("--h", prev.toFixed(1));
      bar.style.setProperty("--i", i);
      waveEl.appendChild(bar);
      bars.push(bar);
    }
    return bars;
  }

  function wirePlayer(opts) {
    const root = document.getElementById(opts.root);
    if (!root) return null;
    const btn = document.getElementById(opts.btn);
    const waveEl = document.getElementById(opts.wave);
    const curEl = document.getElementById(opts.cur);
    const durEl = document.getElementById(opts.dur);

    const audio = new Audio();
    audio.preload = "none";
    audio.src = opts.src;
    if (opts.loop) audio.loop = true;

    const bars = buildWave(waveEl, opts.src, opts.bars || 52);
    let lastIdx = -1;
    let failed = false;

    function paint() {
      const dur = audio.duration;
      if (!isFinite(dur) || !dur) return;
      curEl.textContent = U.fmtTime(audio.currentTime);
      const idx = Math.floor((audio.currentTime / dur) * bars.length);
      if (idx === lastIdx) return;
      lastIdx = idx;
      bars.forEach((b, i) => b.classList.toggle("is-past", i < idx));
    }

    audio.addEventListener("loadedmetadata", () => {
      durEl.textContent = U.fmtTime(audio.duration);
    });
    audio.addEventListener("timeupdate", paint);
    audio.addEventListener("play", () => {
      A.pauseAllExcept(audio);
      root.classList.add("is-playing");
      if (opts.onstate) opts.onstate(true);
    });
    audio.addEventListener("pause", () => {
      root.classList.remove("is-playing");
      if (opts.onstate) opts.onstate(false);
    });
    audio.addEventListener("ended", () => {
      audio.currentTime = 0;
      lastIdx = -1;
      bars.forEach((b) => b.classList.remove("is-past"));
      curEl.textContent = "0:00";
    });
    audio.addEventListener("error", () => {
      if (failed) return;
      failed = true;
      root.classList.remove("is-playing");
      const hint = U.el("p", "media-hint", "add this file to hear it: " + opts.src);
      root.appendChild(hint);
      if (opts.onstate) opts.onstate(false);
    });

    function toggle() {
      if (failed) return;
      if (audio.paused) audio.play().catch(() => {});
      else audio.pause();
    }
    btn.addEventListener("click", toggle);

    // tap the waveform to seek
    waveEl.addEventListener("click", (e) => {
      if (failed || !isFinite(audio.duration) || !audio.duration) return;
      const r = waveEl.getBoundingClientRect();
      audio.currentTime = U.clamp((e.clientX - r.left) / r.width, 0, 1) * audio.duration;
      paint();
    });

    const p = { audio, toggle, root, isFailed: () => failed };
    players.push(p);
    return p;
  }

  /* start the theme as early as the browser allows: immediately if permitted,
     otherwise at the very first touch or keypress (e.g. typing the code) */
  function fadeInPlay(p) {
    const a = p.audio;
    a.volume = 0;
    return a.play().then(() => {
      let v = 0;
      const iv = setInterval(() => {
        v += 0.06;
        if (v >= 0.9) { a.volume = 0.9; clearInterval(iv); }
        else a.volume = v;
      }, 120);
    });
  }

  A.tryAutoplay = function () {
    if (!A.song) return;
    const arm = () => {
      let kicked = false;
      const kick = () => {
        if (kicked) return;
        kicked = true;
        if (A.song.audio.paused && !A.song.isFailed()) fadeInPlay(A.song).catch(() => {});
      };
      ["pointerdown", "keydown", "touchstart"].forEach((ev) =>
        window.addEventListener(ev, kick, { once: true, capture: true })
      );
    };
    fadeInPlay(A.song).catch(arm);
  };

  A.init = function () {
    const songCfg = FC.content.settings.song;
    const voiceCfg = FC.content.settings.voice;

    const soundpill = U.$("#soundpill");

    A.song = songCfg && songCfg.src && document.getElementById("song-player")
      ? wirePlayer({
          root: "song-player", btn: "song-play", wave: "song-wave",
          cur: "song-cur", dur: "song-dur", src: songCfg.src, bars: 56,
          loop: !!songCfg.loop,
          onstate: (playing) => {
            if (!soundpill) return;
            soundpill.classList.toggle("is-on", playing);
            soundpill.classList.toggle("is-live", playing);
            soundpill.setAttribute("aria-pressed", String(playing));
            soundpill.setAttribute("aria-label", playing ? "Pause the soundtrack" : "Play the soundtrack");
          },
        })
      : null;

    A.voice = voiceCfg && voiceCfg.src && document.getElementById("voice-box")
      ? wirePlayer({
          root: "voice-box", btn: "voice-play", wave: "voice-wave",
          cur: "voice-cur", dur: "voice-dur", src: voiceCfg.src, bars: 40,
        })
      : null;

    // the floating pill plays/pauses the same song as the chapter player
    if (soundpill) {
      if (A.song) {
        soundpill.addEventListener("click", () => {
          A._resume = false; // an explicit pause means: stay quiet
          A.song.toggle();
        });
      } else {
        soundpill.hidden = true;
      }
    }

    if (A.song && songCfg.autoplay) A.tryAutoplay();
  };
})();
