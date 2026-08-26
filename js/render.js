/* render.js — builds all data-driven DOM from FC.content. Text is inserted with
   textContent throughout, so content strings can never inject markup. */
(function () {
  const FC = window.FC;
  const U = FC.util;
  const C = FC.content;
  const R = (FC.render = {});

  const mount = (name) => U.$(`[data-mount="${name}"]`);
  const rot = (seedStr, range) => ((U.rng(U.seed(seedStr))() * 2 - 1) * range).toFixed(2) + "deg";

  function reveal(el, i, media) {
    el.setAttribute("data-reveal", media ? "media" : "");
    if (i) el.style.setProperty("--rvd", Math.min(i, 6));
    return el;
  }

  function hide(sectionId) {
    const s = document.getElementById(sectionId);
    if (s) s.hidden = true;
  }

  /* ————— [data-t] text binding ————— */
  R.bindText = function () {
    U.$$("[data-t]").forEach((el) => {
      const val = U.path(el.dataset.t);
      if (typeof val === "string") el.textContent = U.t(val);
    });
    U.$$('[data-name="her"]').forEach((el) => (el.textContent = C.couple.herName));
  };

  /* ————— 01 · hero ————— */
  R.hero = function () {
    const media = mount("hero-media");
    const img = U.img(C.hero.photo, { eager: true, w: 1400, h: 1800 });
    img.setAttribute("fetchpriority", "high");
    media.appendChild(img);

    const counter = mount("counter");
    const label = U.el("p", "counter__label", U.t(C.hero.counterLabel));
    counter.appendChild(label);
    [["y", "years"], ["mo", "months"], ["d", "days"], ["h", "hours"], ["mi", "minutes"]].forEach(([key, name]) => {
      const cu = U.el("div", "cu");
      const b = U.el("b", "", "0");
      b.dataset.unit = key;
      cu.appendChild(b);
      cu.appendChild(U.el("span", "", name));
      counter.appendChild(cu);
    });

    // wax seal initial: her first letter, or a heart while the name is a placeholder
    const initial = /^[\[{]/.test(C.couple.herName) ? "♥" : C.couple.herName.trim().charAt(0).toUpperCase();
    U.$("#seal-initial").textContent = initial;
  };

  /* ————— 02 · before you ————— */
  R.before = function () {
    const b = C.beforeYou;
    if ((!b.photos || !b.photos.length) && !b.firstPhoto) return hide("before");

    const album = mount("album");
    (b.photos || []).forEach((p, i) => {
      const fig = U.el("figure", "album__print");
      fig.style.setProperty("--rot", rot("before" + i, 4));
      fig.appendChild(U.img(p, { w: 700, h: 875 }));
      if (p.caption) fig.appendChild(U.el("figcaption", "", U.t(p.caption)));
      album.appendChild(reveal(fig, i));
    });

    if (b.firstPhoto) {
      const wrap = mount("firstphoto");
      const pol = U.el("figure", "polaroid");
      pol.appendChild(U.img(b.firstPhoto, { w: 900, h: 1125 }));
      if (b.firstPhoto.caption) pol.appendChild(U.el("figcaption", "polaroid__cap", U.t(b.firstPhoto.caption)));
      wrap.appendChild(reveal(pol, 0, true));
      if (b.firstPhoto.date) {
        const chip = U.el("p", "chip firstphoto__date", U.fmtDate(b.firstPhoto.date));
        wrap.appendChild(chip);
      }
    }
  };

  /* ————— 03 · how we became us ————— */
  R.became = function () {
    const moments = C.becameUs.moments || [];
    if (!moments.length) return hide("became");
    const root = mount("moments");

    const flow = U.el("div", "moments__flow");
    const mediaCol = U.el("div", "moments__media");
    mediaCol.setAttribute("aria-hidden", "true");

    moments.forEach((m, i) => {
      const art = U.el("article", "moment");
      art.dataset.idx = i;

      if (m.photo) {
        const fig = U.el("figure", "moment__photo");
        fig.appendChild(U.img(m.photo, { w: 1000, h: 750 }));
        art.appendChild(reveal(fig, 0, true));
      }
      if (m.date) art.appendChild(reveal(U.el("p", "moment__date", U.fmtDate(m.date)), 0));
      art.appendChild(reveal(U.el("h3", "moment__title", U.t(m.title)), 1));
      if (m.story) art.appendChild(reveal(U.el("p", "moment__story", U.t(m.story)), 2));
      if (m.location) {
        const extra = U.el("div", "moment__extra");
        const chip = U.el("span", "chip");
        chip.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-pin"/></svg>';
        chip.appendChild(document.createTextNode(U.t(m.location)));
        extra.appendChild(chip);
        art.appendChild(reveal(extra, 3));
      }
      if (m.note) art.appendChild(reveal(U.el("p", "moment__note", U.t(m.note)), 3));
      flow.appendChild(art);

      // the sticky panel crossfades between the same photos on desktop
      const img = U.img(m.photo || null, { w: 1000, h: 1300 });
      img.dataset.for = i;
      if (i === 0) img.classList.add("is-on");
      mediaCol.appendChild(img);
    });

    root.appendChild(flow);
    root.appendChild(mediaCol);
  };

  /* ————— 04 · timeline ————— */
  R.timeline = function () {
    const items = C.timeline.milestones || [];
    if (!items.length) return hide("timeline");
    const tl = mount("timeline");

    const rail = U.el("div", "tl__rail");
    rail.appendChild(U.el("div", "tl__fill"));
    tl.appendChild(rail);

    items.forEach((m, i) => {
      const art = U.el("article", "tl__item");
      if (m.date === "today") art.classList.add("tl__item--today");
      art.appendChild(U.el("span", "tl__dot"));

      const hasMore = !!(m.story || m.photo || m.location || m.song);
      const host = U.el(hasMore ? "button" : "div", "tl__btn");
      if (hasMore) {
        host.type = "button";
        host.dataset.tl = i;
        host.setAttribute("aria-haspopup", "dialog");
      }
      host.appendChild(U.el("p", "tl__date", U.fmtDate(m.date)));
      host.appendChild(U.el("h3", "tl__title", U.t(m.title)));
      if (m.blurb) host.appendChild(U.el("p", "tl__blurb", U.t(m.blurb)));
      if (hasMore) {
        const open = U.el("span", "tl__open", "open this memory");
        open.innerHTML += ' <svg class="icon" aria-hidden="true"><use href="#i-right"/></svg>';
        host.appendChild(open);
      }
      art.appendChild(host);
      tl.appendChild(reveal(art, 0));
    });
  };

  /* ————— 05 · our little universe ————— */
  R.universe = function () {
    const places = C.universe.places || [];
    if (!places.length) return hide("universe");
    const cosmos = mount("cosmos");
    const NS = "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("class", "cosmos__svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("aria-hidden", "true");

    ["M -5,66 C 15,56 30,72 46,63 S 80,50 105,58",
     "M -5,38 C 18,28 40,44 60,35 S 88,24 105,32",
     "M -5,84 C 25,76 50,90 72,80 S 92,72 105,78",
     "M -5,14 C 22,20 48,8 70,16 S 92,10 105,16"].forEach((d) => {
      const p = document.createElementNS(NS, "path");
      p.setAttribute("class", "cosmos__contour");
      p.setAttribute("d", d);
      svg.appendChild(p);
    });

    // dotted route through the stars, in the order the places are listed
    if (places.length > 1) {
      let d = `M ${places[0].x},${places[0].y}`;
      for (let i = 1; i < places.length; i++) {
        const mx = (places[i - 1].x + places[i].x) / 2;
        const my = (places[i - 1].y + places[i].y) / 2;
        d += ` Q ${places[i - 1].x},${places[i - 1].y} ${mx},${my}`;
      }
      d += ` L ${places[places.length - 1].x},${places[places.length - 1].y}`;
      ["cosmos__route-base", "cosmos__route-draw"].forEach((cls) => {
        const p = document.createElementNS(NS, "path");
        p.setAttribute("class", cls);
        p.setAttribute("d", d);
        svg.appendChild(p);
      });
    }
    cosmos.appendChild(svg);

    // stardust
    const rnd = U.rng(U.seed("dust"));
    for (let i = 0; i < 26; i++) {
      const dust = U.el("i", "dust");
      dust.style.left = (rnd() * 96 + 2).toFixed(1) + "%";
      dust.style.top = (rnd() * 96 + 2).toFixed(1) + "%";
      dust.style.setProperty("--tw", (2.4 + rnd() * 3).toFixed(2) + "s");
      dust.style.setProperty("--td", (-rnd() * 4).toFixed(2) + "s");
      cosmos.appendChild(dust);
    }

    places.forEach((pl, i) => {
      const star = U.el("button", "star");
      star.type = "button";
      star.style.left = pl.x + "%";
      star.style.top = pl.y + "%";
      star.style.setProperty("--pd", (i * 0.5).toFixed(1) + "s");
      star.dataset.place = i;
      star.setAttribute("aria-haspopup", "dialog");
      star.setAttribute("aria-label", "Open the memory at " + U.t(pl.name));
      star.appendChild(U.el("span", "star__dot"));
      star.appendChild(U.el("span", "star__name", U.t(pl.name)));
      cosmos.appendChild(star);
    });

    cosmos.appendChild(U.el("span", "cosmos__compass", "N ✦"));
  };

  /* ————— 06 · archive ————— */
  R.archive = function () {
    const a = C.archive;
    const empty = (l) => !l || !l.length;
    if (empty(a.photos) && empty(a.filmstrip) && empty(a.stack)) return hide("archive");

    const mas = mount("masonry");
    (a.photos || []).forEach((p, i) => {
      const btn = U.el("button", "ph" + (p.style === "polaroid" ? " ph--polaroid" : ""));
      btn.type = "button";
      btn.dataset.lb = i;
      btn.setAttribute("aria-haspopup", "dialog");
      btn.setAttribute("aria-label", "Open photo: " + U.t(p.caption || p.alt || "memory " + (i + 1)));
      if (p.style === "polaroid") btn.style.setProperty("--rot", rot("pol" + i, 2.4));
      const ratio = (p.ratio || "3/4").replace("/", " / ");
      const img = U.img(p, { w: 800, h: 1000 });
      img.style.setProperty("--ratio", ratio);
      btn.appendChild(img);
      if (p.style === "polaroid") {
        btn.appendChild(U.el("span", "ph__polcap", U.t(p.caption || "")));
      } else if (p.caption) {
        btn.appendChild(U.el("span", "ph__cap", U.t(p.caption)));
      }
      mas.appendChild(reveal(btn, i % 3));
    });

    const strip = mount("filmstrip");
    if (!a.filmstrip || !a.filmstrip.length) {
      const blk = U.$('[data-block="filmstrip"]');
      if (blk) blk.hidden = true;
    } else {
      a.filmstrip.forEach((p) => {
        const fig = U.el("figure", "strip__frame");
        fig.appendChild(U.img(p, { w: 720, h: 540 }));
        if (p.caption) fig.appendChild(U.el("figcaption", "", U.t(p.caption)));
        strip.appendChild(fig);
      });
    }

    if (!a.stack || !a.stack.length) {
      const blk = U.$('[data-block="stack"]');
      if (blk) blk.hidden = true;
    } else {
      const stack = mount("stack");
      a.stack.forEach((p, i) => {
        const card = U.el("div", "stack__card");
        card.style.setProperty("--rot", rot("stack" + i, 3.4));
        card.dataset.idx = i;
        card.appendChild(U.img(p, { w: 800, h: 1000 }));
        stack.appendChild(card);
      });
    }
  };

  /* ————— 07 · videos ————— */
  function videoBlock(v, tall) {
    const block = U.el("div", "video-block");
    const card = U.el("div", "video-card" + (tall ? " video-card--tall" : ""));

    const video = document.createElement("video");
    video.preload = "none";
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    if (v.poster) video.poster = v.poster;
    video.src = v.src || "";

    const poster = U.el("button", "video-card__poster");
    poster.type = "button";
    poster.setAttribute("aria-label", "Play video: " + U.t(v.caption || "memory"));
    poster.style.backgroundImage = v.poster
      ? `url("${v.poster}"), url("${U.phSrc(v.poster, tall ? 720 : 1280, tall ? 1280 : 720)}")`
      : `url("${U.phSrc(v.src || "add a video file", tall ? 720 : 1280, tall ? 1280 : 720)}")`;
    const play = U.el("span", "play-btn");
    play.innerHTML =
      '<svg class="icon icon--play" aria-hidden="true"><use href="#i-play"/></svg>';
    poster.appendChild(play);

    card.appendChild(video);
    card.appendChild(poster);
    block.appendChild(card);

    const meta = U.el("div", "video-card__meta");
    meta.appendChild(U.el("p", "video-card__cap", U.t(v.caption || "")));
    if (v.date) meta.appendChild(U.el("span", "chip", U.fmtDate(v.date)));
    block.appendChild(meta);
    return block;
  }

  R.videos = function () {
    const v = C.videos;
    const hasFeature = v.feature && v.feature.src;
    const hasReels = v.reels && v.reels.length;
    if (!hasFeature && !hasReels) return hide("films");

    if (hasFeature) mount("cinema").appendChild(reveal(videoBlock(v.feature, false), 0, true));
    else mount("cinema").hidden = true;

    const reels = mount("reels");
    // clips render as tall 9:16 cards unless the entry says tall: false
    if (hasReels) v.reels.forEach((r, i) => reels.appendChild(reveal(videoBlock(r, r.tall !== false), i)));
    else reels.hidden = true;
  };

  /* ————— 08 · then & now ————— */
  R.compare = function () {
    const pairs = C.thenNow.pairs || [];
    if (!pairs.length) return hide("then-now");
    const list = mount("compare");

    pairs.forEach((pair, i) => {
      const c = U.el("div", "compare");
      c.style.setProperty("--x", ".5");

      const thenImg = U.img(pair.then, { w: 900, h: 1125 });
      c.appendChild(thenImg);

      const top = U.el("div", "compare__top");
      top.appendChild(U.img(pair.now, { w: 900, h: 1125 }));
      c.appendChild(top);

      c.appendChild(U.el("span", "compare__line"));

      const grip = U.el("button", "compare__grip");
      grip.type = "button";
      grip.innerHTML =
        '<svg class="icon" aria-hidden="true"><use href="#i-left"/></svg><svg class="icon" aria-hidden="true"><use href="#i-right"/></svg>';
      grip.setAttribute("role", "slider");
      grip.setAttribute("aria-label", "Reveal then and now");
      grip.setAttribute("aria-valuemin", "0");
      grip.setAttribute("aria-valuemax", "100");
      grip.setAttribute("aria-valuenow", "50");
      c.appendChild(grip);

      c.appendChild(U.el("span", "compare__tag compare__tag--then", "Then"));
      c.appendChild(U.el("span", "compare__tag compare__tag--now", "Now"));
      if (pair.then.label) c.appendChild(U.el("span", "compare__sub compare__sub--then", U.t(pair.then.label)));
      if (pair.now.label) c.appendChild(U.el("span", "compare__sub compare__sub--now", U.t(pair.now.label)));

      list.appendChild(reveal(c, i, true));
    });
  };

  /* ————— 09 · quiz shell (widgets.js drives the state) ————— */
  R.quiz = function () {
    if (!C.quiz.questions || !C.quiz.questions.length) return hide("game");
    const root = mount("quiz");
    const card = U.el("div", "quiz__card");
    card.innerHTML = `
      <div class="quiz__meta"><span id="quiz-progress"></span><span id="quiz-score"></span></div>
      <h3 class="quiz__q" id="quiz-q"></h3>
      <div class="quiz__opts" id="quiz-opts"></div>
      <p class="quiz__after" id="quiz-after" hidden></p>
      <div class="quiz__foot">
        <span class="quiz__follow" id="quiz-follow"></span>
        <button class="btn btn--ghost btn--small" id="quiz-next" type="button" hidden>next</button>
      </div>
      <div class="quiz__stamp" id="quiz-stamp"><span id="quiz-stamp-text"></span></div>`;
    root.appendChild(reveal(card, 0));
  };

  /* ————— 10 · love list ————— */
  R.loveList = function () {
    const items = C.loveList.items || [];
    if (!items.length) return hide("love-list");
    const root = mount("lovelist");

    const tokens = U.el("div", "lovelist__tokens");
    items.forEach((_, i) => {
      const b = U.el("button", "love-token" + (i > 0 ? " is-locked" : ""), String(i + 1).padStart(2, "0"));
      b.type = "button";
      b.disabled = i > 0; // unlocked one at a time
      b.dataset.love = i;
      b.setAttribute("aria-label", "Reveal thing number " + (i + 1));
      tokens.appendChild(b);
    });
    root.appendChild(reveal(tokens, 0));

    const card = U.el("div", "love-card");
    card.id = "love-card";
    card.appendChild(U.el("p", "love-card__num"));
    card.appendChild(U.el("p", "love-card__text"));
    root.appendChild(card);
  };

  /* ————— 11 · the little things (desk) ————— */
  const DESK_SLOTS = [
    { x: 3, y: 4 },  { x: 36, y: 2 },  { x: 68, y: 6 },
    { x: 6, y: 40 }, { x: 39, y: 34 }, { x: 71, y: 42 },
    { x: 4, y: 72 }, { x: 36, y: 68 }, { x: 69, y: 74 },
    { x: 22, y: 20 },
  ];

  function deskItem(item, i) {
    let node;
    if (item.type === "note") {
      node = U.el("div", "sticky-note", U.t(item.text));
      if (item.paper) node.dataset.paper = item.paper;
    } else if (item.type === "photo") {
      node = U.el("figure", "polaroid desk-photo");
      node.appendChild(U.img(item, { w: 600, h: 600 }));
      if (item.caption) node.appendChild(U.el("figcaption", "polaroid__cap", U.t(item.caption)));
    } else if (item.type === "chat") {
      node = U.el("div", "chat-card");
      if (item.title) node.appendChild(U.el("p", "chat-card__time", U.t(item.title)));
      (item.bubbles || []).forEach((b) => {
        node.appendChild(U.el("p", "bubble bubble--" + (b.from === "me" ? "me" : "her"), U.t(b.text)));
      });
    } else if (item.type === "ticket") {
      node = U.el("div", "ticket");
      node.appendChild(U.el("p", "ticket__title", U.t(item.title)));
      if (item.line) node.appendChild(U.el("p", "ticket__line", U.t(item.line)));
      if (item.date) node.appendChild(U.el("p", "ticket__date", U.fmtDate(item.date)));
    } else if (item.type === "receipt") {
      node = U.el("div", "receipt");
      node.appendChild(U.el("p", "receipt__title", U.t(item.title)));
      node.appendChild(document.createElement("hr"));
      (item.lines || []).forEach((l) => {
        const row = U.el("p", "receipt__row");
        row.appendChild(U.el("span", "", U.t(l)));
        row.appendChild(U.el("span", "", "✓"));
        node.appendChild(row);
      });
      node.appendChild(document.createElement("hr"));
      const total = U.el("p", "receipt__total");
      total.appendChild(U.el("span", "", "total"));
      total.appendChild(U.el("span", "", U.t(item.total || "")));
      node.appendChild(total);
    } else {
      node = U.el("div", "sticky-note", "[unknown item type]");
    }

    const wrap = U.el("div", "desk__item");
    if (item.type === "photo" || item.type === "ticket") wrap.appendChild(U.el("span", "tape"));
    wrap.appendChild(node);
    const slot = DESK_SLOTS[i % DESK_SLOTS.length];
    wrap.style.setProperty("--x", slot.x + "%");
    wrap.style.setProperty("--y", slot.y + "%");
    wrap.style.setProperty("--rot", rot("desk" + i, 4.5));
    return wrap;
  }

  R.desk = function () {
    const items = C.littleThings.items || [];
    if (!items.length) return hide("little-things");
    const desk = mount("desk");
    items.forEach((item, i) => desk.appendChild(reveal(deskItem(item, i), i % 4)));

    // the face-down secret photo — one of the hidden things
    if (C.eggs.desk) {
      const secret = U.el("button", "desk-secret", "no peeking.");
      secret.type = "button";
      secret.id = "desk-secret";
      const wrap = U.el("div", "desk__item");
      wrap.appendChild(U.el("span", "tape"));
      wrap.appendChild(secret);
      const slot = DESK_SLOTS[items.length % DESK_SLOTS.length];
      wrap.style.setProperty("--x", slot.x + "%");
      wrap.style.setProperty("--y", slot.y + "%");
      wrap.style.setProperty("--rot", rot("desksecret", 5));
      desk.appendChild(wrap);
    }
  };

  /* ————— 12 · open when ————— */
  R.openWhen = function () {
    const envs = C.openWhen.envelopes || [];
    if (!envs.length) return hide("open-when");
    const grid = mount("openwhen");

    envs.forEach((env, i) => {
      const b = U.el("button", "ow-env");
      b.type = "button";
      b.dataset.ow = i;
      b.setAttribute("aria-haspopup", "dialog");
      const seal = U.el("span", "ow-env__seal");
      seal.dataset.seal = env.seal || "gold";
      b.appendChild(seal);
      b.appendChild(U.el("span", "ow-env__pre", "open when"));
      b.appendChild(U.el("span", "ow-env__label", U.t(env.label)));
      b.appendChild(U.el("span", "ow-env__tag", "opened ✓"));
      if (U.store.get("ow" + i)) b.classList.add("is-opened");
      grid.appendChild(reveal(b, i % 3));
    });
  };

  /* ————— 13 · our song / 14 · voice (audio.js wires these up) ————— */
  R.player = function () {
    const s = C.settings.song;
    if (!s || !s.src) return hide("our-song");
    const root = mount("player");

    const player = U.el("div", "player");
    player.id = "song-player";

    const vinyl = U.el("div", "vinyl");
    const label = U.el("div", "vinyl__label");
    if (s.cover) {
      label.appendChild(U.img({ src: s.cover, alt: "" }, { w: 400, h: 400 }));
    } else {
      label.appendChild(U.el("span", "", "♪"));
    }
    vinyl.appendChild(label);
    player.appendChild(vinyl);

    const info = U.el("div", "player__info");
    info.appendChild(U.el("p", "player__title", U.t(s.title)));
    info.appendChild(U.el("p", "player__artist", U.t(s.artist)));
    const controls = U.el("div", "player__controls");
    const btn = U.el("button", "play-btn");
    btn.type = "button";
    btn.id = "song-play";
    btn.setAttribute("aria-label", "Play our song");
    btn.innerHTML =
      '<svg class="icon icon--play" aria-hidden="true"><use href="#i-play"/></svg><svg class="icon icon--pause" aria-hidden="true"><use href="#i-pause"/></svg>';
    controls.appendChild(btn);
    const wave = U.el("div", "wave");
    wave.id = "song-wave";
    controls.appendChild(wave);
    info.appendChild(controls);
    const time = U.el("div", "player__time");
    time.innerHTML = '<span id="song-cur">0:00</span><span id="song-dur">–:––</span>';
    info.appendChild(time);
    player.appendChild(info);

    root.appendChild(reveal(player, 0));
  };

  R.voice = function () {
    const v = C.settings.voice;
    if (!v || !v.src) return hide("voice");
    const root = mount("voiceplayer");

    const player = U.el("div", "player");
    player.id = "voice-box";
    const info = U.el("div", "player__info");
    const controls = U.el("div", "player__controls");
    const btn = U.el("button", "play-btn");
    btn.type = "button";
    btn.id = "voice-play";
    btn.setAttribute("aria-label", "Play the voice message");
    btn.innerHTML =
      '<svg class="icon icon--play" aria-hidden="true"><use href="#i-play"/></svg><svg class="icon icon--pause" aria-hidden="true"><use href="#i-pause"/></svg>';
    controls.appendChild(btn);
    const wave = U.el("div", "wave");
    wave.id = "voice-wave";
    controls.appendChild(wave);
    info.appendChild(controls);
    const time = U.el("div", "player__time");
    time.innerHTML = '<span id="voice-cur">0:00</span><span id="voice-dur">–:––</span>';
    info.appendChild(time);
    player.appendChild(info);

    root.appendChild(reveal(player, 0));
  };

  /* ————— 15 · letter teaser handled by widgets; 16 · future ————— */
  R.future = function () {
    const plans = C.future.plans || [];
    if (!plans.length) return hide("future");
    const strip = mount("plans");

    plans.forEach((p, i) => {
      const card = U.el("article", "plan-card");
      card.appendChild(U.el("p", "plan-card__num", "№ " + String(i + 1).padStart(2, "0")));
      card.appendChild(U.el("h3", "plan-card__title", U.t(p.title)));
      if (p.note) card.appendChild(U.el("p", "plan-card__note", U.t(p.note)));
      strip.appendChild(reveal(card, i % 4));
    });
    if (C.future.lastCard) {
      const last = U.el("article", "plan-card plan-card--last", U.t(C.future.lastCard));
      strip.appendChild(reveal(last, plans.length % 4));
    }
  };

  /* ————— 17 · finale ————— */
  R.finale = function () {
    const f = C.finale;
    const quiet = mount("finale-quiet");

    (f.lines || []).forEach((line, i) => {
      const p = U.el("p", "finale__line" + (i === (f.lines.length - 1) ? " finale__line--heart" : ""), U.t(line));
      quiet.appendChild(reveal(p, 0));
    });
    if (f.message) quiet.appendChild(reveal(U.el("p", "finale__msg", U.t(f.message)), 0));
    if (f.closing) quiet.appendChild(reveal(U.el("p", "finale__closing", U.t(f.closing)), 0));

    const credits = U.el("p", "credits");
    credits.appendChild(U.el("span", "", U.t(f.creditsLeft)));
    const x = U.el("button", "credits__x", "×");
    x.type = "button";
    x.id = "credits-x";
    x.setAttribute("aria-label", "and");
    credits.appendChild(x);
    credits.appendChild(U.el("span", "", U.t(f.creditsRight)));
    quiet.appendChild(reveal(credits, 0));

    if (f.tbc) quiet.appendChild(reveal(U.el("p", "finale__tbc", U.t(f.tbc)), 0));

    // the photo that becomes a star
    const fig = mount("finale-photo");
    fig.appendChild(U.img(f.photo, { w: 900, h: 1125 }));

    // starfield: scattered dust + the constellation from chapter 05 + her star
    const field = U.$("#starfield");
    const rnd = U.rng(U.seed("finale"));
    for (let i = 0; i < 64; i++) {
      const s = U.el("i", i % 9 === 0 ? "gold" : "");
      s.style.left = (rnd() * 98 + 1).toFixed(1) + "%";
      s.style.top = (rnd() * 98 + 1).toFixed(1) + "%";
      s.style.setProperty("--tw", (2.2 + rnd() * 3.4).toFixed(2) + "s");
      s.style.setProperty("--td", (-rnd() * 4).toFixed(2) + "s");
      field.appendChild(s);
    }
    (C.universe.places || []).forEach((pl) => {
      const s = U.el("i", "gold");
      s.style.left = (pl.x * 0.7 + 15).toFixed(1) + "%";
      s.style.top = (pl.y * 0.55 + 12).toFixed(1) + "%";
      s.style.setProperty("--tw", "4s");
      field.appendChild(s);
    });
    const her = U.el("i", "her");
    her.style.left = "50%";
    her.style.top = "50%";
    field.appendChild(her);

    // one more thing
    const more = mount("finale-more");
    if (f.surprise && f.surprise.enabled) {
      const btn = U.el("button", "btn btn--ghost");
      btn.type = "button";
      btn.id = "one-more";
      btn.setAttribute("aria-haspopup", "dialog");
      const span = U.el("span", "", U.t(f.surprise.teaser));
      btn.appendChild(span);
      more.appendChild(btn);
    }
    more.appendChild(U.el("p", "finale__foot", "· fin ·"));
    // CC BY credit for the soundtrack — keep this if you keep the music
    more.appendChild(
      U.el("p", "finale__foot finale__foot--credit",
        "music · Kevin MacLeod (incompetech.com) · CC BY")
    );
  };

  /* ————— story navigator ————— */
  R.nav = function () {
    const acts = C.nav.acts;
    const list = U.$("#navsheet-list");
    const sections = U.$$(".chapter").filter((s) => !s.hidden);
    let lastAct = null;
    sections.forEach((s, i) => {
      const act = s.dataset.act;
      if (act !== lastAct) {
        list.appendChild(U.el("p", "navsheet__act", acts[act] || act));
        lastAct = act;
      }
      const a = document.createElement("a");
      a.href = "#" + s.id;
      a.dataset.for = s.id;
      a.appendChild(U.el("span", "num", String(i + 1).padStart(2, "0")));
      a.appendChild(U.el("span", "ttl", s.dataset.title || s.id));
      list.appendChild(a);
      s.dataset.num = String(i + 1).padStart(2, "0");
    });
  };

  /* ————— run everything ————— */
  R.all = function () {
    R.bindText();
    R.hero();
    R.before();
    R.became();
    R.timeline();
    R.universe();
    R.archive();
    R.videos();
    R.compare();
    R.quiz();
    R.loveList();
    R.desk();
    R.openWhen();
    R.player();
    R.voice();
    if (!C.letter.paragraphs || !C.letter.paragraphs.length) hide("letter");
    R.future();
    R.finale();
    R.nav();
  };
})();
