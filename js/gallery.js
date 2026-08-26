/* gallery.js — lightbox viewer, draggable photo stack, film-reel scrolling */
(function () {
  const FC = window.FC;
  const U = FC.util;

  FC.gallery = { init };

  function init() {
    initLightbox();
    initStack();
    initStrip();
  }

  /* ————— lightbox ————— */
  function initLightbox() {
    const photos = FC.content.archive.photos || [];
    const dlg = U.$("#lightbox");
    if (!dlg || !photos.length) return;
    FC.dlg.wire(dlg);

    const img = U.$("#lb-img");
    const cap = U.$("#lb-caption");
    const date = U.$("#lb-date");
    const count = U.$("#lb-count");
    let idx = 0;

    function srcFor(i) {
      return photos[i].src || U.phSrc("(no file set)", 1000, 1250);
    }

    function show(i, animate) {
      idx = (i + photos.length) % photos.length;
      const p = photos[idx];
      const apply = () => {
        img.dataset.ph = p.src || ""; // re-arm the broken-image fallback
        if (!p.src) delete img.dataset.ph;
        img.dataset.phw = 1000; img.dataset.phh = 1250;
        img.src = srcFor(idx);
        img.alt = U.t(p.alt || "");
        cap.textContent = U.t(p.caption || "");
        date.textContent = U.fmtDate(p.date || "");
        count.textContent = (idx + 1) + " / " + photos.length;
        img.addEventListener("load", () => img.classList.remove("is-swap"), { once: true });
        img.addEventListener("error", () => img.classList.remove("is-swap"), { once: true });
      };
      if (animate && !U.prefersReduced()) {
        img.classList.add("is-swap");
        setTimeout(apply, 140);
      } else {
        apply();
      }
      // warm the neighbours
      [idx + 1, idx - 1].forEach((n) => {
        const p2 = photos[(n + photos.length) % photos.length];
        if (p2.src) { const pre = new Image(); pre.src = p2.src; }
      });
    }

    U.$$("[data-lb]").forEach((btn) => {
      btn.addEventListener("click", () => {
        show(+btn.dataset.lb, false);
        FC.dlg.open(dlg);
      });
    });

    U.$("#lb-prev").addEventListener("click", () => show(idx - 1, true));
    U.$("#lb-next").addEventListener("click", () => show(idx + 1, true));

    dlg.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); show(idx - 1, true); }
      if (e.key === "ArrowRight") { e.preventDefault(); show(idx + 1, true); }
    });

    // swipe between photos
    let sx = null, sy = null;
    img.addEventListener("pointerdown", (e) => { sx = e.clientX; sy = e.clientY; });
    img.addEventListener("pointerup", (e) => {
      if (sx == null) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      sx = null;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) show(idx + (dx < 0 ? 1 : -1), true);
    });
  }

  /* ————— draggable photo stack ————— */
  function initStack() {
    const stack = U.$('[data-mount="stack"]');
    const data = FC.content.archive.stack || [];
    if (!stack || !data.length) return;

    const capEl = U.$("#stack-caption");
    const countEl = U.$("#stack-count");
    const nextBtn = U.$("#stack-next");
    let busy = false;

    function cards() { return Array.from(stack.children); }
    function top() { const c = cards(); return c[c.length - 1]; }

    function layout() {
      const c = cards();
      c.forEach((card, i) => {
        const depth = c.length - 1 - i;
        card.style.setProperty("--depth", Math.min(depth, 3));
        card.classList.toggle("is-top", depth === 0);
        if (depth > 3) card.setAttribute("data-gone", "");
        else card.removeAttribute("data-gone");
      });
      const t = top();
      const d = data[+t.dataset.idx];
      capEl.textContent = U.t((d && d.caption) || "");
      countEl.textContent = (+t.dataset.idx + 1) + " / " + data.length;
    }

    function fling(dir) {
      if (busy) return;
      busy = true;
      const card = top();
      const w = stack.getBoundingClientRect().width;
      card.style.setProperty("--dx", dir * w * 1.4 + "px");
      card.style.setProperty("--dr", dir * 14 + "deg");
      card.setAttribute("data-gone", "");
      setTimeout(() => {
        card.style.transition = "none"; // snap to the bottom invisibly
        card.style.setProperty("--dx", "0px");
        card.style.setProperty("--dy", "0px");
        card.style.setProperty("--dr", "0deg");
        stack.insertBefore(card, stack.firstChild); // to the bottom of the pile
        layout();
        void card.offsetWidth;
        card.style.transition = "";
        busy = false;
      }, U.prefersReduced() ? 30 : 380);
    }

    // pointer drag on the top card
    let drag = null;
    stack.addEventListener("pointerdown", (e) => {
      const card = top();
      if (busy || !card || !card.contains(e.target)) return;
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false, card };
      card.setPointerCapture(e.pointerId);
      card.classList.add("is-dragging");
    });
    stack.addEventListener("pointermove", (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) drag.moved = true;
      drag.card.style.setProperty("--dx", dx + "px");
      drag.card.style.setProperty("--dy", dy * .4 + "px");
      drag.card.style.setProperty("--dr", dx * .05 + "deg");
    });
    function endDrag(e) {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x;
      const card = drag.card;
      card.classList.remove("is-dragging");
      const wasDrag = drag.moved;
      drag = null;
      if (Math.abs(dx) > 80) {
        fling(Math.sign(dx));
      } else {
        card.style.setProperty("--dx", "0px");
        card.style.setProperty("--dy", "0px");
        card.style.setProperty("--dr", "0deg");
        if (!wasDrag) fling(1); // a plain tap also turns the pile
      }
    }
    stack.addEventListener("pointerup", endDrag);
    stack.addEventListener("pointercancel", endDrag);

    nextBtn.addEventListener("click", () => fling(1));
    layout();
  }

  /* ————— film strip: arrows + mouse drag (touch scrolls natively) ————— */
  function initStrip() {
    const strip = U.$('[data-mount="filmstrip"]');
    if (!strip || !strip.children.length) return;

    const step = () => {
      const frame = strip.querySelector(".strip__frame");
      return frame ? frame.getBoundingClientRect().width + 14 : 300;
    };
    const arrowL = U.$(".strip-arrow--l");
    const arrowR = U.$(".strip-arrow--r");
    if (arrowL) arrowL.addEventListener("click", () => strip.scrollBy({ left: -step(), behavior: "smooth" }));
    if (arrowR) arrowR.addEventListener("click", () => strip.scrollBy({ left: step(), behavior: "smooth" }));

    let drag = null;
    strip.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse") return;
      drag = { x: e.clientX, left: strip.scrollLeft };
      strip.classList.add("is-grabbing");
    });
    strip.addEventListener("pointermove", (e) => {
      if (!drag) return;
      strip.scrollLeft = drag.left - (e.clientX - drag.x);
    });
    ["pointerup", "pointerleave", "pointercancel"].forEach((ev) =>
      strip.addEventListener(ev, () => {
        drag = null;
        strip.classList.remove("is-grabbing");
      })
    );
  }
})();
