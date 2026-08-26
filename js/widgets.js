/* widgets.js — modals, slider, quiz, love list, desk, envelopes, letter, videos */
(function () {
  const FC = window.FC;
  const U = FC.util;
  const C = FC.content;
  const W = (FC.widgets = {});

  /* ————— generic modal ————— */
  let modal, modalCard, modalBody;

  function openModal(variant, build) {
    modalBody.replaceChildren();
    modalCard.parentElement.className = "dlg" + (variant ? " " + variant : "");
    build(modalBody);
    FC.dlg.open(modal);
  }

  function addPhoto(body, photo, w, h) {
    if (!photo || !photo.src) return;
    const fig = U.el("figure", "modal__photo");
    fig.appendChild(U.img(photo, { w: w || 1000, h: h || 750 }));
    body.appendChild(fig);
  }

  function addParas(body, text) {
    String(text).split(/\n{2,}/).forEach((part) => {
      if (part.trim()) body.appendChild(U.el("p", "modal__text", U.t(part.trim())));
    });
  }

  /* ————— timeline detail ————— */
  function openTimeline(i) {
    const m = C.timeline.milestones[i];
    openModal("", (body) => {
      body.appendChild(U.el("p", "kicker", U.fmtDate(m.date)));
      body.appendChild(U.el("h3", "modal__title", U.t(m.title)));
      if (m.story) addParas(body, m.story);
      else if (m.blurb) addParas(body, m.blurb);
      addPhoto(body, m.photo);
      const chips = U.el("div", "modal__chips");
      if (m.location) chips.appendChild(chip("#i-pin", m.location));
      if (m.song) chips.appendChild(chip("#i-note", m.song));
      if (chips.children.length) body.appendChild(chips);
    });
  }

  function chip(iconRef, text) {
    const c = U.el("span", "chip");
    c.innerHTML = `<svg class="icon" aria-hidden="true"><use href="${iconRef}"/></svg>`;
    c.appendChild(document.createTextNode(U.t(text)));
    return c;
  }

  /* ————— universe star detail ————— */
  function openPlace(i) {
    const p = C.universe.places[i];
    openModal("", (body) => {
      body.appendChild(U.el("p", "kicker", "a place of ours"));
      body.appendChild(U.el("h3", "modal__title", U.t(p.name)));
      if (p.date) {
        const chips = U.el("div", "modal__chips");
        chips.appendChild(U.el("span", "chip", U.fmtDate(p.date)));
        body.appendChild(chips);
      }
      if (p.memory) addParas(body, p.memory);
      addPhoto(body, p.photo);
    });
  }

  /* ————— open when… ————— */
  function openEnvelope(i, btn) {
    const env = C.openWhen.envelopes[i];
    btn.classList.add("is-opened");
    U.store.set("ow" + i, "1");
    openModal("modal--paper", (body) => {
      body.appendChild(U.el("p", "kicker", "open when " + U.t(env.label)));
      addParas(body, env.message || "[write this message in js/content.js]");
      addPhoto(body, env.photo, 900, 700);
    });
  }

  /* ————— the letter ————— */
  function openLetter() {
    const L = C.letter;
    openModal("modal--letter", (body) => {
      const paper = U.el("div", "letterpaper");
      if (L.date) paper.appendChild(U.el("p", "letterpaper__date", U.fmtDate(L.date)));
      paper.appendChild(U.el("p", "letterpaper__salut", U.t(L.salutation)));
      (L.paragraphs || []).forEach((para, i) => {
        const p = U.el("p", "letterpaper__p", U.t(para));
        p.style.setProperty("--i", Math.min(i, 8));
        paper.appendChild(p);
      });
      if (L.signature) paper.appendChild(U.el("p", "letterpaper__sig", U.t(L.signature)));
      body.appendChild(paper);
    });
  }

  /* ————— hidden things ————— */
  W.eggModal = function (key) {
    const egg = C.eggs[key];
    if (!egg) return;
    openModal("modal--paper", (body) => {
      body.appendChild(U.el("p", "kicker", "you found a secret"));
      body.appendChild(U.el("h3", "modal__title", U.t(egg.title)));
      if (egg.body) addParas(body, egg.body);
      addPhoto(body, egg.photo, 900, 900);
    });
  };

  /* ————— the last surprise ————— */
  function openSurprise() {
    const s = C.finale.surprise;
    openModal("modal--paper", (body) => {
      body.appendChild(U.el("p", "kicker", "one more thing"));
      body.appendChild(U.el("h3", "modal__title", U.t(s.title)));
      if (s.body) addParas(body, s.body);
      if (s.type === "photo") addPhoto(body, s.photo, 900, 900);
      if (s.type === "video" && s.video && s.video.src) {
        const wrap = U.el("div", "surprise-media");
        const v = document.createElement("video");
        v.src = s.video.src;
        v.controls = true;
        v.preload = "none";
        v.playsInline = true;
        if (s.video.poster) v.poster = s.video.poster;
        v.addEventListener("play", () => FC.audio.pauseAllExcept(v));
        v.addEventListener("ended", () => FC.audio.resumeAmbient());
        wrap.appendChild(v);
        body.appendChild(wrap);
      }
    });
  }

  /* ————— then & now sliders ————— */
  function initCompare() {
    U.$$(".compare").forEach((c) => {
      const grip = c.querySelector(".compare__grip");
      let x = 0.5;

      function set(val) {
        x = U.clamp(val, 0, 1);
        c.style.setProperty("--x", x.toFixed(4));
        grip.setAttribute("aria-valuenow", Math.round(x * 100));
      }
      function fromEvent(e) {
        const r = c.getBoundingClientRect();
        set((e.clientX - r.left) / r.width);
      }

      let dragging = false;
      c.addEventListener("pointerdown", (e) => {
        dragging = true;
        c.setPointerCapture(e.pointerId);
        fromEvent(e);
      });
      c.addEventListener("pointermove", (e) => { if (dragging) fromEvent(e); });
      ["pointerup", "pointercancel"].forEach((ev) =>
        c.addEventListener(ev, () => { dragging = false; })
      );
      grip.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") { e.preventDefault(); set(x - 0.04); }
        if (e.key === "ArrowRight") { e.preventDefault(); set(x + 0.04); }
        if (e.key === "Home") { e.preventDefault(); set(0); }
        if (e.key === "End") { e.preventDefault(); set(1); }
      });
    });
  }

  /* ————— quiz ————— */
  function initQuiz() {
    const Q = C.quiz;
    const qs = Q.questions || [];
    const card = U.$(".quiz__card");
    if (!card || !qs.length) return;

    const el = {
      progress: U.$("#quiz-progress"),
      score: U.$("#quiz-score"),
      q: U.$("#quiz-q"),
      opts: U.$("#quiz-opts"),
      after: U.$("#quiz-after"),
      follow: U.$("#quiz-follow"),
      next: U.$("#quiz-next"),
      stamp: U.$("#quiz-stamp"),
      stampText: U.$("#quiz-stamp-text"),
    };
    let i = 0, score = 0, answered = false, followTimer = null;

    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)] || "";

    function renderQ() {
      answered = false;
      clearTimeout(followTimer);
      el.progress.textContent = (i + 1) + " / " + qs.length;
      el.score.textContent = score + " right";
      el.q.textContent = U.t(qs[i].q);
      el.after.hidden = true;
      el.after.textContent = "";
      el.follow.textContent = "";
      el.next.hidden = true;
      el.stamp.classList.remove("is-show");
      el.opts.replaceChildren();
      qs[i].options.forEach((opt, oi) => {
        const b = U.el("button", "quiz__opt");
        b.type = "button";
        b.appendChild(U.el("span", "num", String.fromCharCode(97 + oi) + "."));
        b.appendChild(document.createTextNode(U.t(opt)));
        b.addEventListener("click", () => answer(oi, b));
        el.opts.appendChild(b);
      });
    }

    function answer(oi, btn) {
      if (answered) return;
      answered = true;
      const right = oi === qs[i].answer;
      if (right) score++;
      el.score.textContent = score + " right";

      Array.from(el.opts.children).forEach((b, bi) => {
        b.disabled = true;
        if (bi === qs[i].answer) b.classList.add("is-right");
      });
      if (!right) btn.classList.add("is-wrong");

      el.stampText.textContent = U.t(pick(right ? Q.right : Q.wrong));
      el.stamp.classList.add("is-show");
      if (!right && Q.wrongFollow) {
        followTimer = setTimeout(() => { el.follow.textContent = U.t(Q.wrongFollow); }, 900);
      }
      if (qs[i].after) {
        el.after.textContent = U.t(qs[i].after);
        el.after.hidden = false;
      }
      el.next.textContent = i === qs.length - 1 ? "see how you did" : "next";
      el.next.hidden = false;
      el.next.focus({ preventScroll: true });
    }

    function finish() {
      const ratio = score / qs.length;
      const msg = ratio === 1 ? Q.results.perfect : ratio >= 0.6 ? Q.results.good : Q.results.low;
      card.replaceChildren();
      const end = U.el("div", "quiz__end");
      end.appendChild(U.el("p", "kicker", "your score"));
      end.appendChild(U.el("p", "quiz__score", score + " / " + qs.length));
      end.appendChild(U.el("p", "lede", U.t(msg)));
      const again = U.el("button", "btn btn--ghost btn--small", "play again");
      again.type = "button";
      again.addEventListener("click", () => {
        i = 0; score = 0;
        card.replaceChildren(...rebuildShell());
        renderQ();
      });
      end.appendChild(again);
      card.appendChild(end);
      if (ratio === 1 && !U.prefersReduced()) burst(card);
    }

    // keep original shell nodes so "play again" can restore them
    const shellNodes = Array.from(card.children);
    function rebuildShell() { return shellNodes; }

    function burst(host) {
      for (let n = 0; n < 16; n++) {
        const b = U.el("i", "burst");
        const ang = (n / 16) * Math.PI * 2;
        const dist = 70 + Math.random() * 90;
        b.style.setProperty("--bx", Math.cos(ang) * dist + "px");
        b.style.setProperty("--by", Math.sin(ang) * dist - 40 + "px");
        b.style.setProperty("--rr", Math.random() * 90 - 45 + "deg");
        if (n % 3 === 0) b.style.background = "var(--rose)";
        if (n % 4 === 0) b.style.background = "var(--lavender)";
        host.appendChild(b);
        setTimeout(() => b.remove(), 1100);
      }
    }

    el.next.addEventListener("click", () => {
      if (i === qs.length - 1) finish();
      else { i++; renderQ(); }
    });

    renderQ();
  }

  /* ————— things I love about you ————— */
  function initLoveList() {
    const items = C.loveList.items || [];
    const card = U.$("#love-card");
    if (!card || !items.length) return;
    const tokens = U.$$(".love-token");
    const numEl = card.querySelector(".love-card__num");
    const textEl = card.querySelector(".love-card__text");
    const outro = U.$("#lovelist-outro");
    const opened = new Set();

    tokens.forEach((tok) => {
      tok.addEventListener("click", () => {
        const i = +tok.dataset.love;
        opened.add(i);
        tok.classList.add("is-open");
        const next = tokens[i + 1];
        if (next) { next.classList.remove("is-locked"); next.disabled = false; }

        card.classList.remove("is-show");
        setTimeout(() => {
          numEl.textContent = "№ " + String(i + 1).padStart(2, "0") + " — of " + items.length;
          textEl.textContent = U.t(items[i]);
          card.classList.add("is-show");
        }, U.prefersReduced() ? 0 : 180);

        if (opened.size === items.length && outro) outro.hidden = false;
      });
    });
  }

  /* ————— the desk ————— */
  function initDesk() {
    const desk = U.$('[data-mount="desk"]');
    if (!desk) return;
    const wide = window.matchMedia("(min-width: 900px)");
    let z = 5;

    desk.addEventListener("pointerdown", (e) => {
      if (!wide.matches) return;
      const item = e.target.closest(".desk__item");
      if (!item) return;
      const rect = desk.getBoundingClientRect();
      const start = {
        id: e.pointerId,
        x: e.clientX, y: e.clientY,
        left: parseFloat(item.style.getPropertyValue("--x")),
        top: parseFloat(item.style.getPropertyValue("--y")),
        moved: false,
      };
      item.style.zIndex = ++z;
      item.setPointerCapture(e.pointerId);
      item.classList.add("is-drag");

      function move(ev) {
        if (ev.pointerId !== start.id) return;
        const dx = ((ev.clientX - start.x) / rect.width) * 100;
        const dy = ((ev.clientY - start.y) / rect.height) * 100;
        if (Math.abs(dx) + Math.abs(dy) > 0.6) start.moved = true;
        item.style.setProperty("--x", U.clamp(start.left + dx, -4, 88) + "%");
        item.style.setProperty("--y", U.clamp(start.top + dy, -4, 88) + "%");
      }
      function up(ev) {
        if (ev.pointerId !== start.id) return;
        item.classList.remove("is-drag");
        item.removeEventListener("pointermove", move);
        item.removeEventListener("pointerup", up);
        item.removeEventListener("pointercancel", up);
        // a real drag shouldn't also trigger the secret's click
        if (start.moved) item.dataset.squelch = "1";
        else delete item.dataset.squelch;
      }
      item.addEventListener("pointermove", move);
      item.addEventListener("pointerup", up);
      item.addEventListener("pointercancel", up);
    });

    const secret = U.$("#desk-secret");
    if (secret) {
      secret.addEventListener("click", () => {
        if (secret.closest(".desk__item").dataset.squelch) return;
        W.eggModal("desk");
      });
    }
  }

  /* ————— videos ————— */
  function initVideos() {
    U.$$(".video-card").forEach((card) => {
      const video = card.querySelector("video");
      const poster = card.querySelector(".video-card__poster");
      if (!video || !poster) return;
      FC.audio.videos.push(video);
      let failed = false;

      video.addEventListener("error", () => {
        if (failed) return;
        failed = true;
        card.classList.remove("is-started");
        video.controls = false;
        const meta = card.parentElement.querySelector(".video-card__meta");
        if (meta) meta.appendChild(U.el("p", "media-hint", "add this file to play it: " + (video.getAttribute("src") || "")));
      });
      video.addEventListener("play", () => FC.audio.pauseAllExcept(video));
      video.addEventListener("ended", () => FC.audio.resumeAmbient());

      poster.addEventListener("click", () => {
        if (failed) return;
        card.classList.add("is-started");
        video.controls = true;
        FC.audio.pauseAllExcept(video);
        video.play().catch(() => {});
      });
    });
  }

  /* ————— init ————— */
  W.init = function () {
    modal = U.$("#modal");
    modalCard = U.$("#modal-card");
    modalBody = U.$("#modal-body");
    FC.dlg.wire(modal);

    document.addEventListener("click", (e) => {
      const tl = e.target.closest("[data-tl]");
      if (tl) return openTimeline(+tl.dataset.tl);
      const star = e.target.closest("[data-place]");
      if (star) return openPlace(+star.dataset.place);
      const ow = e.target.closest("[data-ow]");
      if (ow) return openEnvelope(+ow.dataset.ow, ow);
    });

    const letterBtn = U.$("#open-letter");
    if (letterBtn) letterBtn.addEventListener("click", openLetter);

    const oneMore = U.$("#one-more");
    if (oneMore) oneMore.addEventListener("click", openSurprise);

    initCompare();
    initQuiz();
    initLoveList();
    initDesk();
    initVideos();
  };
})();
