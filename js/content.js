/* =============================================================================
   CONTENT — the only file you need to edit.
   -----------------------------------------------------------------------------
   THIS EDITION IS ALL ABOUT HER. No "I", no "we" — the site speaks only about
   the birthday girl. Her photos and videos from the fried_chic folder are
   already placed (renamed copies live in assets/photos and assets/videos).

   Still to do by you:
     · herName below (the only [BRACKET] left that shows on the page)
     · dates.birthday if you want a live countdown instead of permanent
       birthday mode (see settings.forceBirthdayMode)
     · the entrance code (settings.pin) — pick one she can guess
     · optionally a song file → assets/audio/her-song.mp3 (see settings.song)

   Tokens usable inside any string: {her} {herNick}
   Emptying a list hides that block/chapter; the navigator renumbers itself.
============================================================================= */

window.FC = window.FC || {};

FC.content = {

  /* ————————————————————————————————— people ——————————————————————————————— */
  couple: {
    herName: "Mugha",
    herNickname: "Mugha",
    myName: "",                   // intentionally unused — this site is only about her
    myNickname: "",
  },

  /* ————————————————————————————————— dates ———————————————————————————————— */
  dates: {
    anniversary: "",              // unused in this edition (hides the counter)
    // Her birthday, MONTH-DAY (e.g. "03-14"). With forceBirthdayMode off, this
    // shows a live countdown until the day, then flips to "Today is your day."
    birthday: "",
  },

  /* ——————————————————————————————— settings ——————————————————————————————— */
  settings: {
    // Entrance code — asked before the envelope appears, every visit.
    // REPLACE with something only she would guess, and keep pinHint in sync.
    // Set to null to remove the gate. (Cute lock, not real security.)
    pin: "2708",
    pinHint: "Four digits. You know the ones.",

    // Typing this word anywhere on the site reveals a hidden note (eggs.typed).
    secretWord: "queen",

    showCountdown: true,

    // true = the hero always says "Today is your day." — right for a page that
    // exists purely to celebrate her. Set false + dates.birthday for countdown.
    forceBirthdayMode: true,

    // Her soundtrack — your new-instrument.mp3 (first 5s trimmed off), playing
    // across the whole site. autoplay: starts the moment the browser allows —
    // instantly where permitted, otherwise at her very first tap or keystroke
    // (typing the entrance code counts). loop keeps it going; the floating
    // sound button pauses it; videos duck it and hand back when they end.
    song: {
      src: "assets/audio/her-song.mp3",
      title: "Your theme",               // ← put the song's real name here if you like
      artist: "",
      cover: "assets/photos/hero.jpg",   // her face is the album art. as it should be.
      line: "Every icon needs a theme song.",
      autoplay: true,
      loop: true,
    },

    // Optional voice note — empty src hides the chapter entirely.
    voice: { src: "" },
  },

  /* ——————————————————————— chapter 00 · the invitation ———————————————————— */
  invitation: {
    line1: "There’s something here for you.",
    line2: "Don’t rush.",
    cardTitle: "Happy Birthday, {her}",
    cardLine: "A whole little universe, made for exactly one person.",
    button: "Open your story",
    pinPrompt: "Only one person is supposed to see this.",
    pinLabel: "Enter the secret code",
  },

  /* ———————————————————————— chapter 01 · happy birthday ——————————————————— */
  hero: {
    photo: { src: "assets/photos/hero.jpg", alt: "Portrait of the birthday girl, dark top with a red drape", pos: "50% 25%" },
    title1: "Happy",
    title2: "Birthday",
    kicker: "To the one and only.",
    counterLabel: "",             // counter hidden in this edition
    countdownLabel: "Something is waiting for you…",
    todayLabel: "Today is your day.",
    scrollHint: "scroll slowly",
  },

  /* ————————————————————————— chapter 02 · once upon a you ————————————————— */
  beforeYou: {
    kicker: "Chapter 02",
    title: "Once upon a you…",
    line: "The evidence says you’ve been like this from the very start.",
    photos: [
      {
        src: "assets/photos/before-01.jpg",
        alt: "Baby her in a white frilly dress on plastic chairs, teddy bears beside her",
        caption: "the original", pos: "47% 50%",
      },
      {
        src: "assets/photos/before-02.jpg",
        alt: "Little her on a doorstep hugging two teddy bears",
        caption: "already had an entourage", pos: "52% 45%",
      },
      {
        src: "assets/photos/before-03.jpg",
        alt: "Young her in a mint dress looking at the camera",
        caption: "the stare was born early", pos: "50% 30%",
      },
    ],
    turn: "And you never stopped.",
    firstPhoto: {
      src: "assets/photos/grown-up.jpg",
      alt: "Editorial night photo in a patterned dress with a black shoulder bag",
      caption: "…and then you turned into this.",
      date: "",
      pos: "52% 40%",
    },
  },

  /* ——————————————— chapter · how we became us (unused here) ———————————————— */
  becameUs: {
    kicker: "Chapter",
    title: "How it began",
    intro: "",
    moments: [],                  // hidden in this edition
  },

  /* ————————————————————— chapter · timeline (unused here) —————————————————— */
  timeline: {
    kicker: "Chapter",
    title: "The timeline",
    intro: "",
    milestones: [],               // hidden in this edition
  },

  /* ——————————————— chapter · little universe map (unused here) ————————————— */
  universe: {
    kicker: "Chapter",
    title: "The universe",
    intro: "",
    places: [],                   // hidden in this edition
  },

  /* ————————————————————————— chapter 03 · the archive ————————————————————— */
  archive: {
    kicker: "Chapter 03",
    title: "The archive",
    intro: "Twenty-two exhibits of being effortlessly photogenic. Tap any of them.",
    photos: [
      { src: "assets/photos/archive-01.jpg", alt: "Calm car selfie in natural light",                         caption: "car seat, main character",     date: "", style: "plain",    ratio: "848/464" },
      { src: "assets/photos/archive-02.jpg", alt: "In the car with a red bindi and red lip, mid-story, kitten sticker in the corner", caption: "mid-story, full glam", date: "", style: "plain", ratio: "1280/688" },
      { src: "assets/photos/archive-03.jpg", alt: "Street selfie with greenery behind",                       caption: "street light, golden mood",    date: "", style: "plain",    ratio: "1248/688" },
      { src: "assets/photos/archive-04.jpg", alt: "Soft indoor smile",                                        caption: "that smile.",                  date: "", style: "polaroid", ratio: "1/1", pos: "55% 45%" },
      { src: "assets/photos/archive-05.jpg", alt: "Holding a black-wrapped bouquet of red roses, kitten sticker in the corner", caption: "roses. obviously.", date: "", style: "plain", ratio: "832/448" },
      { src: "assets/photos/archive-06.jpg", alt: "Plum top, teddy bears in the background",                  caption: "note the teddies. still here.", date: "", style: "plain",   ratio: "832/448" },
      { src: "assets/photos/archive-07.jpg", alt: "Doe-eyed look with the coral bead necklace",               caption: "doe eyes, expert level",       date: "", style: "plain",    ratio: "832/448" },
      { src: "assets/photos/archive-08.jpg", alt: "Mirror photo in a maroon lace dress with a white corset belt", caption: "the maroon dress moment",  date: "", style: "plain",    ratio: "699/1280" },
      { src: "assets/photos/archive-09.jpg", alt: "Mirror fit photo, flared jeans, a cat sticker over the face", caption: "cat sticker security",      date: "", style: "polaroid", ratio: "1/1" },
      { src: "assets/photos/archive-10.jpg", alt: "Two-panel moody bedroom collage",                          caption: "moody hours",                  date: "", style: "plain",    ratio: "1131/1280" },
      { src: "assets/photos/archive-11.jpg", alt: "Curly hair, eyes closed, soft smile, purple tee",          caption: "the curly era ☁",              date: "", style: "plain",    ratio: "1280/726" },
      { src: "assets/photos/archive-12.jpg", alt: "Resting chin on hand in bed, cozy stare",                  caption: "do not disturb",               date: "", style: "plain",    ratio: "1280/720" },
    ],
    stripTitle: "the reel",
    filmstrip: [
      { src: "assets/photos/before-01.jpg", alt: "Baby her with teddy bears",             caption: "act i" },
      { src: "assets/photos/before-02.jpg", alt: "Little her hugging two teddy bears",    caption: "act i, scene ii" },
      { src: "assets/photos/before-03.jpg", alt: "Young her in a mint dress",             caption: "act ii" },
      { src: "assets/photos/archive-11.jpg", alt: "Curly hair era",                       caption: "act iii" },
      { src: "assets/photos/now-01.jpg",    alt: "Glam look with traditional coral beads", caption: "act iv" },
      { src: "assets/photos/grown-up.jpg",  alt: "Editorial night photo",                 caption: "the premiere" },
    ],
    stackTitle: "worth keeping on top",
    stackHint: "drag the top photo away",
    stack: [
      { src: "assets/photos/archive-08.jpg", alt: "Maroon lace dress mirror photo",  caption: "the fit" },
      { src: "assets/photos/archive-10.jpg", alt: "Moody two-panel collage",         caption: "double feature" },
      { src: "assets/photos/archive-07.jpg", alt: "Doe-eyed look",                   caption: "those eyes", pos: "40% 50%" },
      { src: "assets/photos/archive-03.jpg", alt: "Street selfie with greenery",     caption: "street light", pos: "52% 50%" },
      { src: "assets/photos/hero.jpg",       alt: "The hero portrait",               caption: "the one from the poster", pos: "50% 30%" },
    ],
  },

  /* ————————————————————————— chapter 04 · you, in motion —————————————————— */
  videos: {
    kicker: "Chapter 04",
    title: "You, in motion",
    intro: "Short films. One lead. No script.",
    feature: {
      src: "assets/videos/feature.mp4",
      poster: "assets/photos/poster-feature.jpg",
      caption: "Twelve seconds of golden hour, beads on.",
      date: "",
    },
    reels: [
      { src: "assets/videos/clip-01.mp4", poster: "assets/photos/poster-clip-01.jpg", caption: "the walk.",        date: "", tall: false },
      { src: "assets/videos/clip-02.mp4", poster: "assets/photos/poster-clip-02.jpg", caption: "roses, live on air.", date: "", tall: false },
    ],
  },

  /* ————————————————————————— chapter 05 · then & now ——————————————————————— */
  thenNow: {
    kicker: "Chapter 05",
    title: "Then & now",
    caption: "Same beads. Same girl. More legend.",
    hint: "drag the line",
    pairs: [
      {
        then: { src: "assets/photos/then-01.jpg", alt: "Her as a toddler in traditional dress and bead necklaces", label: "little you", pos: "56% 50%" },
        now:  { src: "assets/photos/now-01.jpg",  alt: "Her now, glam, wearing traditional coral beads",           label: "you, upgraded", pos: "40% 50%" },
      },
    ],
  },

  /* ————————————————————————— chapter 06 · a little game ——————————————————— */
  quiz: {
    kicker: "Chapter 06",
    title: "A little game",
    intro: "Five questions about today’s most important person. No pressure — every answer flatters you.",
    right: ["Obviously.", "Correct. Effortlessly.", "The judges agree.", "No hesitation. Respect."],
    wrong: ["Bold. Wrong, but bold.", "The disrespect.", "Objection. Overruled."],
    wrongFollow: "Kidding — it’s your birthday, wrong answers don’t count.",
    results: {
      perfect: "Flawless. As expected of the birthday girl.",
      good: "Strong performance. The cake is earned.",
      low: "Scandalous. Luckily, the cake is unconditional.",
    },
    questions: [
      {
        q: "First things first — whose day is it today?",
        options: ["Mine.", "Mine, obviously.", "MINE.", "All of the above."],
        answer: 3,
        after: "Correct. It’s the law.",
      },
      {
        q: "Best hair era?",
        options: ["The curls", "The long waves", "The night-out waves", "All of them. Every single one."],
        answer: 3,
        after: "The archive agrees.",
      },
      {
        q: "Correct protocol when the mirror fit goes hard?",
        options: ["Post it", "Cat sticker over the face", "Both, simultaneously", "Keep it for the archive"],
        answer: 2,
        after: "Documented behavior. See chapter three.",
      },
      {
        q: "How many candles should the cake brace for?",
        options: ["A polite amount", "A mild fire hazard", "One per compliment", "The cake doesn’t survive tonight"],
        answer: 3,
        after: "",
      },
      {
        q: "Final question. Rate today’s birthday girl.",
        options: ["10/10", "10/10", "10/10", "10/10"],
        answer: 0,
        after: "There was never a wrong answer.",
      },
    ],
  },

  /* ————————————————————— chapter 07 · things that are so you ——————————————— */
  loveList: {
    kicker: "Chapter 07",
    title: "Things that are just… so you",
    intro: "Not compliments. Documented facts. Tap a number.",
    items: [
      "That smile that shows up a second before the photo does.",
      "The cat stickers. Always the cat stickers.",
      "Traditional beads one day, flared jeans the next — every era suits you.",
      "The teddy bear era, which clearly never ended.",
      "The curly-hair chapter. Iconic.",
      "Front camera, mirror, someone else’s camera — zero bad angles detected.",
      "Main-character energy in a parked car.",
      "Roses in hand like it’s the most natural thing in the world.",
    ],
    outro: "…and about a hundred more that don’t fit on cards.",
  },

  /* ————————————————————————— chapter 08 · the little things ———————————————— */
  littleThings: {
    kicker: "Chapter 08",
    title: "The little things",
    intro: "The stuff that never makes it into albums. The best stuff.",
    hint: "everything on the desk moves — go on, rearrange it",
    items: [
      { type: "note", paper: "gold", text: "certified: best laugh in any room" },
      {
        type: "photo",
        src: "assets/photos/gown.jpg", alt: "In a pale blue draped gown, from a story post",
        caption: "gown hours.", pos: "45% 40%",
      },
      { type: "note", paper: "rose", text: "reminder: you’ve survived 100% of your worst days" },
      {
        type: "ticket",
        title: "ADMIT ONE",
        line: "to the best year yet — front row",
        date: "",
      },
      {
        type: "receipt",
        title: "BIRTHDAY TAB",
        lines: ["1 × cake (mandatory)", "∞ × compliments", "0 × responsibilities today"],
        total: "on the house",
      },
      { type: "note", paper: "lavender", text: "icon. legend. birthday girl." },
      {
        type: "photo",
        src: "assets/photos/archive-05.jpg", alt: "Holding the red rose bouquet",
        caption: "flowers. deserved.", pos: "40% 45%",
      },
    ],
  },

  /* ————————————————————————— chapter 09 · open when… ——————————————————————— */
  openWhen: {
    kicker: "Chapter 09",
    title: "Open when…",
    intro: "Not all of these are for today. Some are for the days that need backup.",
    envelopes: [
      {
        label: "you’re sad",
        seal: "rose",
        message: "Bad days don’t get the final word.\n\nYou have outlasted every single one so far — a perfect record. Be soft with yourself tonight; tomorrow is already on its way.",
        photo: null,
      },
      {
        label: "you can’t sleep",
        seal: "lavender",
        message: "Nothing needs solving at 2 AM.\n\nPut the phone down (after this), close your eyes, and let today be done. The world will still be impressed by you in the morning.",
        photo: null,
      },
      {
        label: "you need to smile",
        seal: "gold",
        message: "Cat sticker: deployed. Smile: achieved.",
        photo: { src: "assets/photos/archive-09.jpg", alt: "Mirror photo with a cat sticker over the face" },
      },
      {
        label: "you doubt yourself",
        seal: "wine",
        message: "Scroll back through this page.\n\nExhibit A through Z says otherwise. Case closed.",
        photo: null,
      },
      {
        label: "it’s your next birthday",
        seal: "gold",
        message: "See? Still iconic.\n\nSome things don’t change. Happy birthday, again.",
        photo: null,
      },
    ],
  },

  /* ————————————————————————— chapter · your soundtrack ————————————————————— */
  ourSong: {
    kicker: "Chapter 10",
    title: "Your soundtrack",
    note: "The one that started playing the moment you walked in.",
  },

  /* ————————————————————————— chapter · in your ears (unused) ——————————————— */
  voice: {
    kicker: "Chapter",
    line1: "Some things are better heard.",
    line2: "Press play when you’re alone.",
    caption: "Press play when you’re alone.",
  },

  /* ————————————————————————— chapter · a letter (unused here) —————————————— */
  letter: {
    kicker: "Chapter",
    teaser: "Some things belong on paper.",
    button: "Open the letter",
    date: "",
    salutation: "Dear {her},",
    paragraphs: [],               // hidden in this edition
    signature: "",
  },

  /* ————————————————————————— chapter 10 · the year ahead ——————————————————— */
  future: {
    kicker: "Chapter 11",
    titleA: "This year already looks good on you.",
    titleB: "And it’s only getting started.",
    plans: [
      { title: "More golden-hour photos",      note: "the archive demands growth" },
      { title: "Cake, frequently",             note: "birthdays are a mindset" },
      { title: "New places, same main character", note: "passport-ready" },
      { title: "The comfiest naps",            note: "professionally earned" },
      { title: "Every fit going hard",         note: "the mirror agrees in advance" },
      { title: "A year that’s kind to you",    note: "the big one" },
    ],
    lastCard: "…and everything you’re quietly wishing for tonight.",
  },

  /* ————————————————————————— chapter 11 · finale ——————————————————————————— */
  finale: {
    photo: { src: "assets/photos/finale.jpg", alt: "Her smiling softly in warm indoor light", pos: "50% 42%" },
    lines: [
      "Some people make a day brighter just by being in it.",
      "You’ve been doing it your whole life.",
      "Happy Birthday, {her}. ❤",
    ],
    message: "May this year be ridiculously good to you — loud laughs, soft days, great hair, zero bad angles, and every quiet wish coming true.",
    closing: "This is only the beginning.",
    creditsLeft: "the one",
    creditsRight: "the only",
    tbc: "To be continued…",
    surprise: {
      enabled: true,
      teaser: "One more thing…",
      type: "text",
      title: "A final decree",
      body: "Today, this entire corner of the internet exists to celebrate you.\n\nGo eat the cake. That’s an order.",
      photo: { src: "", alt: "" },
      video: { src: "", poster: "" },
    },
  },

  /* ————————————————————————— hidden things ————————————————————————————————— */
  eggs: {
    // Revealed by typing settings.secretWord ("queen") anywhere on the site.
    typed: {
      title: "You found the hidden note.",
      body: "For the record: the world is measurably better with you in it.\n\nThat’s the whole note. Carry on.",
      photo: null,
    },
    // Revealed by tapping the “×” between the words in the finale, five times.
    credits: {
      title: "Five taps. Detective-level curiosity.",
      body: "Fine — one more secret: this entire page was always going to end the same way. With you smiling.\n\nMission status: check the mirror.",
      photo: null,
    },
    // Revealed by flipping the face-down photo on the desk.
    desk: {
      title: "No peeking… okay, peek.",
      body: "You’ve been this adorable since before you could walk. The evidence is timestamped.",
      photo: { src: "assets/photos/egg-baby.jpg", alt: "Baby her in a frilly white dress on plastic chairs, teddies beside her" },
    },
  },

  /* —————————————————————— story navigator labels ——————————————————————————— */
  nav: {
    acts: {
      begin:   "I — The birthday girl",
      story:   "II — The story",
      memory:  "II — The evidence",
      you:     "III — All about you",
      always:  "IV — The year ahead",
    },
  },
};
