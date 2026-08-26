# For her ❤ — the "all about her" edition

A private, hand-built birthday website that celebrates **one person**. It never
says "I", "we" or "us" — the whole site speaks only about the birthday girl.
Her 22 photos and 3 videos from `fried_chic/` are already examined, cast and
placed. The story runs in eleven chapters:

> secret code → envelope → **Happy Birthday** → once upon a you (childhood →
> the editorial reveal) → the archive (gallery · film reel · photo stack) →
> you, in motion (her clips) → then & now (toddler in traditional dress ⟷ the
> same beads today) → a little game → things that are just so you → the little
> things (desk) → open when… → the year ahead → finale (her photo becomes a
> star) → one more thing…

Zero build step, zero dependencies. Double-click `index.html` to preview.

---

## 1 · What's left for you

Her name (**Mugha**) is set. All that remains, in **`js/content.js`**:

1. **The entrance code** — `settings.pin` is set to `2708`. Make sure
   `settings.pinHint` ("Four digits. You know the ones.") points her to it, or
   tell her the code. `null` removes the gate.
2. **Birthday mode** — `settings.forceBirthdayMode: true` keeps the hero on
   "Today is your day." permanently. For a live countdown instead: set it
   `false` and fill `dates.birthday` as `"MM-DD"`.

## 1½ · The music

The original clip audio (background noise) is gone. Each video now carries a
royalty-free track, cut from its most energetic passage, volume-matched, and
faded in/out:

| Video | Track | Section used |
|---|---|---|
| feature.mp4 (golden hour) | "There is Romance" — Kevin MacLeod | 1:36–1:49, the swell |
| clip-01.mp4 (the walk) | "Heartwarming" — Kevin MacLeod | 0:06–0:10, flowing piano |
| clip-02.mp4 (roses) | "What Is Love" — Kevin MacLeod | 0:33–0:46, the beat-drop chorus |

**The site-wide theme** is your own `new-instrument.mp3` (root folder), with
its first 5 seconds trimmed and a soft fade-in, installed as
`assets/audio/her-song.mp3`. It starts as early as the browser allows —
immediately where permitted, otherwise at her **very first tap or keystroke**
(typing the entrance code starts it; browsers physically block sound before
any interaction, so this is the closest thing to autoplay that exists). It
loops for the whole visit, the floating sound button pauses/resumes it,
videos duck it and hand back when they finish, and the **Your soundtrack**
chapter plays the same track on a vinyl wearing her hero photo. Set the real
song name in `settings.song.title` if you want it shown.

**License:** the three *video* tracks are Kevin MacLeod / incompetech.com,
Creative Commons BY — the small "music · Kevin MacLeod" line at the bottom of
the page is the required credit; keep it while you keep those. Your own theme
track is yours to answer for: fine for a private link shared with one person
at your discretion, but know a commercial song on a public site isn't legal to
re-distribute. Source tracks live in the session scratchpad for re-cutting.

## 2 · Where each photo went

Everything was placed by looking at the actual images — captions only describe
what's visible, nothing invented. The mapping lives in
`assets/photos/README.txt` and in `js/content.js` (each entry has alt text
describing the photo). Highlights:

- **Hero** — the red-drape portrait. **Finale** — the soft warm smile.
- **Once upon a you** — the scanned childhood prints, ending on the editorial
  night shot ("…and then you turned into this").
- **Then & now** — toddler in traditional dress vs. the glam shot in the same
  style of coral beads.
- **The reel** — six frames from baby photos to the night shot, captioned like
  film acts.
- **Hidden** — the second baby photo waits behind the face-down polaroid.

To recast anything, change paths/captions in `content.js`. Chapters that need
couple-content (timeline, memory map, letter, voice) are empty and hidden —
fill their lists to bring them back someday.

## 3 · The hidden things (don't tell her)

| Secret | How she finds it | Content lives in |
|---|---|---|
| Typed word | typing `queen` anywhere on the site | `eggs.typed` |
| The × | tapping the `×` in "the one × the only" (finale) **5 times** | `eggs.credits` |
| Face-down photo | flipping the "no peeking" polaroid on the desk | `eggs.desk` — reveals the baby photo |
| Console note | opening browser dev tools | automatic |

## 4 · The entrance code

On by default, asked **before the envelope appears, every visit**, nothing
remembered. Honest note: it's a charming lock, not security — the code sits in
readable JavaScript. Real privacy = keeping the link private (the page is
`noindex`).

## 5 · Put it online

Fully static — drag the folder onto **Netlify Drop** (`app.netlify.com/drop`),
or use Cloudflare Pages / Vercel / GitHub Pages with no build command. Then
send her the link. Designed phone-first (WhatsApp/Instagram in-app browsers
included). The `fried_chic/` folder is only your source material — you can
exclude it when uploading; the site uses the copies in `assets/`.

## 6 · Before you hit send

- [ ] Your own entrance code set (and a hint she can actually solve)
- [ ] Opened it on your phone once, end to end
- [ ] Played all three videos **with sound on** and the soundtrack chapter
- [ ] Tried the quiz, found all three secrets
- [ ] Decided: permanent birthday mode, or countdown with her real date

## Tech notes

Vanilla HTML/CSS/JS. Fraunces + Inter + Caveat via Google Fonts. Respects
`prefers-reduced-motion`, keyboard-navigable dialogs, lazy media, no
analytics, no tracking. Works from `file://` and any static host. Each photo
entry supports `pos: "x% y%"` (object-position) so crops keep her face in
frame — already tuned for every placement.
