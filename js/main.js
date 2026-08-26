/* main.js — boot sequence */
(function () {
  const FC = window.FC;

  function boot() {
    document.title = /^[\[{]/.test(FC.content.couple.herName)
      ? "Something for you."
      : "For " + FC.content.couple.herName + " ❤";

    FC.render.all();      // build every chapter from js/content.js
    FC.audio.init();      // song + voice + ambient pill
    FC.gallery.init();    // lightbox, stack, film reel
    FC.widgets.init();    // modals, slider, quiz, desk, envelopes, letter, videos
    FC.interactions.init(); // intro, reveals, scroll scenes, cursor, eggs
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
