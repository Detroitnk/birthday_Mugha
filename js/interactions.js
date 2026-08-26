/* interactions.js — intro choreography, reveals, scroll-driven scenes,
   navigation, timers, cursor, easter eggs */
(function () {
  const FC = window.FC;
  const U = FC.util;
  const C = FC.content;
  const I = (FC.interactions = {});

  let opened = false;

  /* ═════════ intro / envelope / pin ═════════ */
  function initIntro() {
    const intro = U.$("#intro");
    const envelope = U.$("#envelope");
    const seal = U.$("#env-seal");
    const openBtn = U.$("#open-story");
    const skip = U.$("#skip-intro");
    const pinForm = U.$("#pin-form");
    const pinInput = U.$("#pin-input");
    const pinHint = U.$("#pin-hint");

    document.documentElement.classList.add("locked");

    // The gate comes BEFORE the envelope: lines → secret code → envelope.
    // It asks on every visit and nothing is remembered — the code is the door.
    const hasPin = C.settings.pin != null && String(C.settings.pin).length > 0;
    let unlocked = !hasPin;

    function showPin() {
      if (unlocked) return;
      intro.classList.add("pin-mode");
      pinForm.hidden = false;
      pinInput.focus();
    }

    function showEnvelope() {
      intro.classList.add("s3");
      if (U.prefersReduced()) envelope.classList.add("is-open");
    }

    if (U.prefersReduced()) {
      intro.classList.add("s1", "s2");
      if (hasPin) showPin();
      else showEnvelope();
    } else {
      setTimeout(() => intro.classList.add("s1"), 350);
      setTimeout(() => intro.classList.add("s2"), 2300);
      setTimeout(() => { if (hasPin) showPin(); else showEnvelope(); }, 3900);
    }

    seal.addEventListener("click", () => {
      if (unlocked) envelope.classList.add("is-open");
    });

    openBtn.addEventListener("click", () => {
      if (unlocked) launch(intro, envelope);
    });

    let tries = 0;
    pinForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (pinInput.value.trim() === String(C.settings.pin)) {
        unlocked = true;
        pinForm.hidden = true;
        intro.classList.remove("pin-mode");
        intro.classList.add("is-unlocked");
        showEnvelope();
        seal.focus({ preventScroll: true });
      } else {
        tries++;
        pinForm.classList.add("is-error");
        setTimeout(() => pinForm.classList.remove("is-error"), 500);
        if (tries >= 2 && C.settings.pinHint) pinHint.textContent = U.t(C.settings.pinHint);
        pinInput.select();
      }
    });

    skip.addEventListener("click", () => {
      if (!unlocked) showPin(); // the intro can be skipped — the code cannot
      else launch(intro, envelope, true);
    });
  }

  function launch(intro, envelope, instant) {
    if (opened) return;
    opened = true;
    envelope.classList.add("is-out");
    const go = () => {
      intro.classList.add("is-done");
      document.documentElement.classList.remove("locked");
      I.afterOpen();
      setTimeout(() => intro.remove(), 1300);
    };
    if (instant || U.prefersReduced()) go();
    else setTimeout(go, 650);
  }

  /* ═════════ everything that starts once the story is open ═════════ */
  I.afterOpen = function () {
    const story = U.$("#story");
    story.hidden = false;
    window.scrollTo(0, 0);

    U.$("#navpill").hidden = false;
    const soundpill = U.$("#soundpill");
    if (FC.audio.song) soundpill.hidden = false;

    initReveals();
    initScrollDriven();
    initScrollSpy();
    startClock();
    showSoundToast();
  };

  /* ═════════ reveals ═════════ */
  function initReveals() {
    U.$$("[data-split]").forEach((el) => U.splitWords(el));
    const targets = U.$$("[data-reveal], [data-split]");
    U.onIO(targets, (en, io) => {
      if (en.isIntersecting) {
        en.target.classList.add("is-in");
        io.unobserve(en.target);
      }
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.06 });

    // chapter 02: the album recedes when "and then you happened" arrives
    const turn = U.$("#before .turnline");
    if (turn) {
      U.onIO(turn, (en) => {
        if (en.isIntersecting) U.$("#before").classList.add("is-turned");
      }, { threshold: 0.4 });
    }

    // chapter 03: sticky panel crossfade
    const moments = U.$$(".moment");
    if (moments.length) {
      U.onIO(moments, (en) => {
        if (!en.isIntersecting) return;
        const i = en.target.dataset.idx;
        U.$$(".moments__media img").forEach((img) =>
          img.classList.toggle("is-on", img.dataset.for === i)
        );
      }, { rootMargin: "-32% 0px -48% 0px", threshold: 0 });
    }

    // timeline dots light up
    const tlItems = U.$$(".tl__item");
    if (tlItems.length) {
      U.onIO(tlItems, (en) => {
        if (en.isIntersecting) en.target.classList.add("is-in");
      }, { rootMargin: "-20% 0px -30% 0px", threshold: 0 });
    }
  }

  /* ═════════ scroll-driven scenes ═════════ */
  function initScrollDriven() {
    const reduced = U.prefersReduced();
    const hairline = U.$("#hairline");
    const navpill = U.$("#navpill");
    const heroImg = U.$(".hero__media img");
    const tl = U.$(".tl");
    const cosmos = U.$('[data-mount="cosmos"]');
    const routeDraw = cosmos && cosmos.querySelector(".cosmos__route-draw");
    const finalePin = U.$(".finale__pin");
    const finaleScene = U.$("#finale-scene");
    const finalePhoto = U.$(".finale__photo");

    let routeLen = 0;
    if (routeDraw) {
      try {
        routeLen = routeDraw.getTotalLength();
        routeDraw.style.strokeDasharray = routeLen;
        routeDraw.style.strokeDashoffset = routeLen;
      } catch { routeDraw.remove(); }
    }

    U.onScroll((y) => {
      // top hairline + navpill ring
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const p = total > 0 ? U.clamp(y / total, 0, 1) : 0;
      hairline.style.setProperty("--p", p.toFixed(4));
      navpill.style.setProperty("--p", p.toFixed(4));

      const vh = window.innerHeight;

      if (heroImg && !reduced && y < vh * 1.3) {
        heroImg.style.transform = "translate3d(0," + (y * 0.16).toFixed(1) + "px,0)";
      }

      if (tl) {
        const r = tl.getBoundingClientRect();
        const fp = U.clamp((vh * 0.55 - r.top) / r.height, 0, 1);
        tl.style.setProperty("--p", fp.toFixed(4));
      }

      if (routeDraw && routeLen) {
        const r = cosmos.getBoundingClientRect();
        const rp = U.clamp((vh * 0.8 - r.top) / (r.height * 0.95), 0, 1);
        routeDraw.style.strokeDashoffset = (routeLen * (1 - rp)).toFixed(1);
      }

      if (finalePin && finaleScene) {
        const fp = U.stickyProgress(finaleScene);
        const scale = Math.max(0.13, 1 - fp * 0.9);
        const fade = fp < 0.8 ? 1 : U.clamp(1 - (fp - 0.8) / 0.14, 0, 1);
        finalePhoto.style.setProperty("--ph-s", reduced ? 1 : scale.toFixed(3));
        finalePhoto.style.setProperty("--ph-o", reduced ? 1 : fade.toFixed(3));
        finalePin.querySelector(".starfield").style.setProperty("--sf", U.clamp(fp * 1.25, 0, 1).toFixed(3));
        const her = finalePin.querySelector(".starfield i.her");
        if (her) her.style.setProperty("--her", U.clamp((fp - 0.78) / 0.2, 0, 1).toFixed(3));
      }
    });
  }

  /* ═════════ chapter scrollspy + navsheet ═════════ */
  function initScrollSpy() {
    const sections = U.$$(".chapter").filter((s) => !s.hidden);
    const num = U.$("#navpill-num");
    const links = U.$$("#navsheet-list a");

    U.onIO(sections, (en) => {
      if (!en.isIntersecting) return;
      const s = en.target;
      num.textContent = s.dataset.num || "01";
      links.forEach((a) => a.classList.toggle("is-current", a.dataset.for === s.id));
    }, { rootMargin: "-42% 0px -42%", threshold: 0 });

    const sheet = U.$("#navsheet");
    FC.dlg.wire(sheet);
    U.$("#navpill").addEventListener("click", () => FC.dlg.open(sheet));
    links.forEach((a) =>
      a.addEventListener("click", () => FC.dlg.close(sheet))
    );
  }

  /* ═════════ the clock: together-counter + birthday countdown ═════════ */
  function startClock() {
    const anniversary = U.parseDate(C.dates.anniversary);
    const counter = U.$('[data-mount="counter"]');
    const units = {};
    U.$$("[data-unit]", counter).forEach((b) => (units[b.dataset.unit] = b));
    if (!anniversary) counter.hidden = true;

    const cd = U.$("#hero-countdown");
    const hero = U.$("#hero");
    const isToday = () =>
      C.settings.forceBirthdayMode || U.isBirthdayToday(C.dates.birthday);

    function tick() {
      const now = new Date();
      if (anniversary && now > anniversary) {
        const d = U.diffParts(anniversary, now);
        units.y.textContent = d.y;
        units.mo.textContent = d.mo;
        units.d.textContent = d.d;
        units.h.textContent = String(d.h).padStart(2, "0");
        units.mi.textContent = String(d.mi).padStart(2, "0");
      }

      if (isToday()) {
        hero.classList.add("is-today");
        cd.classList.add("is-today");
        cd.textContent = U.t(C.hero.todayLabel);
        cd.hidden = false;
      } else if (C.settings.showCountdown && C.dates.birthday) {
        const target = U.nextBirthday(C.dates.birthday, now);
        if (target) {
          let s = Math.max(0, Math.floor((target - now) / 1000));
          const dd = Math.floor(s / 86400); s %= 86400;
          const hh = Math.floor(s / 3600); s %= 3600;
          const mm = Math.floor(s / 60);
          const ss = s % 60;
          cd.replaceChildren(
            document.createTextNode(U.t(C.hero.countdownLabel) + "  "),
            Object.assign(document.createElement("b"), {
              textContent:
                String(dd).padStart(2, "0") + " : " +
                String(hh).padStart(2, "0") + " : " +
                String(mm).padStart(2, "0") + " : " +
                String(ss).padStart(2, "0"),
            })
          );
          cd.hidden = false;
        }
      }
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ═════════ sound toast ═════════ */
  function showSoundToast() {
    if (!FC.audio.song) return;
    const toast = U.$("#sound-toast");
    toast.hidden = false;
    setTimeout(() => toast.classList.add("is-show"), 1100);
    setTimeout(() => toast.classList.remove("is-show"), 6200);
    setTimeout(() => (toast.hidden = true), 7000);
  }

  /* ═════════ custom cursor + magnetic buttons (fine pointers only) ═════════ */
  function initPointerExtras() {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || U.prefersReduced()) return;

    document.documentElement.classList.add("custom-cursor");
    const cursor = U.$("#cursor");
    const dot = cursor.querySelector(".cursor__dot");
    const ring = cursor.querySelector(".cursor__ring");
    let tx = -100, ty = -100, rx = -100, ry = -100, raf = null;

    function loop() {
      rx += (tx - rx) * 0.16;
      ry += (ty - ry) * 0.16;
      ring.style.transform = "translate(" + rx.toFixed(1) + "px," + ry.toFixed(1) + "px)";
      raf = Math.abs(tx - rx) + Math.abs(ty - ry) > 0.3 ? requestAnimationFrame(loop) : null;
    }
    window.addEventListener("pointermove", (e) => {
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = "translate(" + tx + "px," + ty + "px)";
      const hot = e.target.closest("a, button, [role='slider'], .wave, input, .stack__card.is-top, .desk__item");
      cursor.classList.toggle("is-active", !!hot);
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    window.addEventListener("pointerdown", () => cursor.classList.add("is-down"));
    window.addEventListener("pointerup", () => cursor.classList.remove("is-down"));
    document.documentElement.addEventListener("mouseleave", () => {
      tx = ty = -100;
      dot.style.transform = "translate(-100px,-100px)";
      if (!raf) raf = requestAnimationFrame(loop);
    });

    // magnetic buttons
    U.$$("[data-magnet]").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const mx = U.clamp((e.clientX - (r.left + r.width / 2)) * 0.22, -7, 7);
        const my = U.clamp((e.clientY - (r.top + r.height / 2)) * 0.22, -7, 7);
        btn.style.transform = "translate(" + mx.toFixed(1) + "px," + my.toFixed(1) + "px)";
      });
      btn.addEventListener("pointerleave", () => (btn.style.transform = ""));
    });
  }

  /* ═════════ easter eggs ═════════ */
  function initEggs() {
    // 1 · type the secret word anywhere
    const word = (C.settings.secretWord || "").toLowerCase();
    if (word.length >= 3) {
      let buffer = "";
      document.addEventListener("keydown", (e) => {
        if (e.target && e.target.closest && e.target.closest("input, textarea")) return;
        if (!/^[a-z]$/i.test(e.key)) return;
        buffer = (buffer + e.key.toLowerCase()).slice(-24);
        if (buffer.endsWith(word)) {
          buffer = "";
          FC.widgets.eggModal("typed");
        }
      });
    }

    // 2 · tap the "×" between the names five times
    const x = U.$("#credits-x");
    if (x) {
      let taps = 0, timer = null;
      x.addEventListener("click", () => {
        taps++;
        clearTimeout(timer);
        timer = setTimeout(() => (taps = 0), 2500);
        x.style.transform = "scale(" + (1 + taps * 0.12) + ")";
        setTimeout(() => (x.style.transform = ""), 220);
        if (taps >= 5) {
          taps = 0;
          FC.widgets.eggModal("credits");
        }
      });
    }

    // 3 · the face-down photo on the desk is wired in widgets.js

    try {
      console.log(
        "%c" + U.t("Hi {her}. Yes, even the console is celebrating you today. Happy birthday. — the website"),
        "color:#c6a267;font-style:italic;font-size:13px;font-family:Georgia,serif;"
      );
    } catch { /* no console, no problem */ }
  }

  /* ═════════ init ═════════ */
  I.init = function () {
    if (U.prefersReduced()) document.documentElement.classList.add("reduced");
    initIntro();
    initPointerExtras();
    initEggs();
  };
})();
