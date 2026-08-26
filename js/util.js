/* util.js — shared helpers. No dependencies, no build step. */
(function () {
  const FC = (window.FC = window.FC || {});
  const U = (FC.util = {});

  /* ————— DOM ————— */
  U.$ = (sel, root) => (root || document).querySelector(sel);
  U.$$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  U.el = function (tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  U.clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ————— environment ————— */
  const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  U.prefersReduced = () => mqReduce.matches;
  mqReduce.addEventListener?.("change", () => {
    document.documentElement.classList.toggle("reduced", mqReduce.matches);
  });

  U.isTouch = () => window.matchMedia("(pointer: coarse)").matches;

  /* ————— token replacement: {her} {me} {herNick} {myNick} ————— */
  U.t = function (str) {
    if (typeof str !== "string") return str == null ? "" : String(str);
    const c = FC.content.couple;
    return str
      .replace(/\{her\}/g, c.herName)
      .replace(/\{me\}/g, c.myName)
      .replace(/\{herNick\}/g, c.herNickname)
      .replace(/\{myNick\}/g, c.myNickname);
  };

  /* Resolve "a.b.c" against FC.content */
  U.path = function (p) {
    return p.split(".").reduce((o, k) => (o == null ? o : o[k]), FC.content);
  };

  /* ————— guarded localStorage ————— */
  U.store = {
    get(key) {
      try { return localStorage.getItem("fc:" + key); } catch { return null; }
    },
    set(key, val) {
      try { localStorage.setItem("fc:" + key, val); } catch { /* private mode */ }
    },
  };

  /* ————— seeded pseudo-random (deterministic scatter, waveforms) ————— */
  U.seed = function (str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  };
  U.rng = function (seedNum) {
    let s = seedNum || 1;
    return function () {
      s |= 0; s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  /* ————— dates ————— */
  // Parse "YYYY-MM-DD" as a LOCAL date (new Date("YYYY-MM-DD") would be UTC).
  U.parseDate = function (iso) {
    if (typeof iso !== "string") return null;
    const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return null;
    return new Date(+m[1], +m[2] - 1, +m[3]);
  };

  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  U.fmtDate = function (iso) {
    if (iso === "today") return "Today";
    const d = U.parseDate(iso);
    if (!d) return iso || ""; // placeholders like "[DATE]" pass through untouched
    return `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  };

  // Calendar-aware difference for the "we've been us for" counter.
  U.diffParts = function (from, to) {
    let y = to.getFullYear() - from.getFullYear();
    let mo = to.getMonth() - from.getMonth();
    let d = to.getDate() - from.getDate();
    let h = to.getHours() - from.getHours();
    let mi = to.getMinutes() - from.getMinutes();
    if (mi < 0) { mi += 60; h--; }
    if (h < 0) { h += 24; d--; }
    if (d < 0) {
      const prevMonthDays = new Date(to.getFullYear(), to.getMonth(), 0).getDate();
      d += prevMonthDays; mo--;
    }
    if (mo < 0) { mo += 12; y--; }
    return { y, mo, d, h, mi };
  };

  // Next occurrence of "MM-DD" from now (midnight local). Null if invalid.
  U.nextBirthday = function (mmdd, now) {
    const m = /^(\d{2})-(\d{2})$/.exec(mmdd || "");
    if (!m) return null;
    now = now || new Date();
    let d = new Date(now.getFullYear(), +m[1] - 1, +m[2]);
    const endOfDay = new Date(d); endOfDay.setHours(23, 59, 59, 999);
    if (endOfDay < now) d = new Date(now.getFullYear() + 1, +m[1] - 1, +m[2]);
    return d;
  };
  U.isBirthdayToday = function (mmdd, now) {
    const m = /^(\d{2})-(\d{2})$/.exec(mmdd || "");
    if (!m) return false;
    now = now || new Date();
    return now.getMonth() === +m[1] - 1 && now.getDate() === +m[2];
  };

  U.fmtTime = function (sec) {
    if (!isFinite(sec)) return "0:00";
    sec = Math.max(0, Math.round(sec));
    return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
  };

  /* ————— placeholder artwork —————
     A soft gradient wash in the site palette, with film grain and a tiny
     hint naming the file to add. Shown whenever a real image is missing. */
  const PH_TONES = [
    ["#3a1620", "#7c2f3a"], // wine
    ["#1e161c", "#4a3644"], // night plum
    ["#a96f70", "#c98f8c"], // dusty rose
    ["#8a6a3f", "#c6a267"], // gold
    ["#5a4f6e", "#b3a4c9"], // lavender dusk
  ];
  U.phSrc = function (label, w, h) {
    w = w || 1200; h = h || 1500;
    const tone = PH_TONES[U.seed(label || "x") % PH_TONES.length];
    const small = Math.min(w, h) < 420;
    const fs1 = Math.round(Math.min(w, h) * (small ? 0.085 : 0.055));
    const fs2 = Math.round(fs1 * 0.62);
    const hint = (label || "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
    const svg =
`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${tone[0]}"/><stop offset="1" stop-color="${tone[1]}"/>
    </linearGradient>
    <radialGradient id="r" cx="0.3" cy="0.25" r="0.9">
      <stop offset="0" stop-color="#f2e9dc" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#f2e9dc" stop-opacity="0"/>
    </radialGradient>
    <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.14"/></feComponentTransfer>
    </filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect width="${w}" height="${h}" fill="url(#r)"/>
  <rect width="${w}" height="${h}" filter="url(#n)" opacity="0.5"/>
  <rect x="${w*0.045}" y="${h*0.045}" width="${w*0.91}" height="${h*0.91}" fill="none" stroke="#f2e9dc" stroke-opacity="0.28" stroke-width="${Math.max(1, w*0.0016)}"/>
  <text x="50%" y="48%" text-anchor="middle" fill="#f2e9dc" fill-opacity="0.85"
        font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="${fs1}">a photo goes here</text>
  <text x="50%" y="48%" dy="${fs1 * 1.6}" text-anchor="middle" fill="#f2e9dc" fill-opacity="0.55"
        font-family="Consolas, monospace" font-size="${fs2}">${hint}</text>
</svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  };

  // <img> factory: expected src now, graceful placeholder if the file is absent.
  U.img = function (photo, opts) {
    opts = opts || {};
    const img = document.createElement("img");
    img.alt = photo && photo.alt ? U.t(photo.alt) : "";
    img.decoding = "async";
    if (!opts.eager) img.loading = "lazy";
    const src = photo && photo.src;
    if (src) {
      img.dataset.ph = src; // remembered for the error fallback
      img.src = src;
    } else {
      img.src = U.phSrc("(no file set)", opts.w, opts.h);
      img.classList.add("is-ph");
    }
    if (opts.w) img.dataset.phw = opts.w;
    if (opts.h) img.dataset.phh = opts.h;
    // optional per-photo framing, e.g. pos: "50% 25%" keeps a face in the crop
    if (photo && photo.pos) img.style.objectPosition = photo.pos;
    return img;
  };

  // One capture-phase listener swaps any broken <img> for placeholder art.
  window.addEventListener(
    "error",
    function (e) {
      const img = e.target;
      if (!(img instanceof HTMLImageElement) || !img.dataset.ph) return;
      const label = img.dataset.ph;
      delete img.dataset.ph; // never loop
      img.src = U.phSrc(label, +img.dataset.phw || 1200, +img.dataset.phh || 1500);
      img.classList.add("is-ph");
    },
    true
  );

  /* ————— single rAF scroll manager ————— */
  const scrollFns = [];
  let ticking = false;
  function pump() {
    ticking = false;
    const y = window.scrollY;
    for (const fn of scrollFns) fn(y);
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(pump); }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  U.onScroll = function (fn) { scrollFns.push(fn); fn(window.scrollY); };

  // 0 → 1 as `el` travels through the viewport (0 = top edge entering bottom).
  U.progress = function (el) {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    return U.clamp((vh - r.top) / (r.height + vh), 0, 1);
  };
  // 0 → 1 across a tall sticky scene: 0 when pinned starts, 1 when it ends.
  U.stickyProgress = function (scene) {
    const r = scene.getBoundingClientRect();
    const vh = window.innerHeight;
    return U.clamp(-r.top / Math.max(1, r.height - vh), 0, 1);
  };

  /* ————— IntersectionObserver helper ————— */
  U.onIO = function (targets, cb, options) {
    const io = new IntersectionObserver(function (entries) {
      for (const en of entries) cb(en, io);
    }, options || { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
    (targets.length != null ? Array.from(targets) : [targets]).forEach((t) => io.observe(t));
    return io;
  };

  /* ————— dialogs (native <dialog>, with a fallback for old engines) ————— */
  FC.dlg = {
    open(dlg) {
      if (typeof dlg.showModal === "function") {
        if (!dlg.open) dlg.showModal();
      } else {
        dlg.setAttribute("open", "");
      }
      document.documentElement.classList.add("dlg-open");
    },
    close(dlg) {
      if (typeof dlg.close === "function") {
        try { dlg.close(); } catch { /* not open */ }
      } else {
        dlg.removeAttribute("open");
      }
      document.documentElement.classList.remove("dlg-open");
    },
    // click-outside + [data-close] + Esc housekeeping
    wire(dlg) {
      dlg.addEventListener("click", (e) => {
        if (e.target === dlg || e.target.closest("[data-close]")) FC.dlg.close(dlg);
      });
      dlg.addEventListener("close", () =>
        document.documentElement.classList.remove("dlg-open")
      );
    },
  };

  /* ————— staggered word reveal ————— */
  U.splitWords = function (el) {
    if (el.dataset.split === "done") return;
    const words = (el.textContent || "").trim().split(/\s+/);
    el.textContent = "";
    words.forEach(function (w, i) {
      const span = U.el("span", "w");
      span.style.setProperty("--i", i);
      span.textContent = w;
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
    });
    el.dataset.split = "done";
  };
})();
