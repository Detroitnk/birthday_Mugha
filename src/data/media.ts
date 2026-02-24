// ============================================
// 📸 PHOTO & VIDEO CONFIGURATION
// ============================================
// Nishant: Add your photos and videos here!
// Just add the file to /public/photos or /public/videos
// and add the filename to the array below.

export const photos: string[] = [
  "1 (1).jpg",
  "1 (2).jpg",
  "1 (3).jpg",
  "1 (4).jpg",
  "1 (5).jpg",
  "1 (6).jpg",
  "1 (7).jpg",
  "1 (8).jpg",
  "1 (9).jpg",
  "1 (10).jpg",
  "1 (11).jpg",
];

export const videos: string[] = [
];

// ============================================
// 🌐 GOOGLE DRIVE VIDEOS
// ============================================
// Add Google Drive videos here!
// Get the file ID from the Google Drive URL:
// https://drive.google.com/file/d/FILE_ID/view
// Example: https://drive.google.com/file/d/1kBDL0xF1hsAxN_wTDXnov3IIXK4ibM_2/view
// File ID: 1kBDL0xF1hsAxN_wTDXnov3IIXK4ibM_2

export interface GoogleDriveVideo {
  id: string; // The file ID from Google Drive
  title: string; // Video title
}

export const googleDriveVideos: GoogleDriveVideo[] = [
  {
    id: "1CGlJeHz-bZs1z-UcBh-1cnegybGedWux",
    title: "Video 1",
  },
  {
    id: "1Fve5rkq4bQfCP1wQMRzfU2Xd8FLFt-9G",
    title: "Video 2",
  },
];

// ============================================
// 📝 TIMELINE MEMORIES
// ============================================
// Edit these to add your real memories!

export interface TimelineEntry {
  date: string;
  title: string;
  description: string;
  emoji: string;
  photo?: string; // Optional photo filename from /public/photos/
}

export const timelineEntries: TimelineEntry[] = [
  {
    date: "Date To Nhi pta paar",
    title: "Yaha se Starting Hue 😂",
    description: "Celebrating your special day...",
    emoji: "🎂",
    photo: "Littlebutki.jpg",
  },
  {
    date: "25/10/2023",
    title: "Ghume Ghume",
    description: "Sab ke sab ek saath ghumne nikle the...",
    emoji: "🎉",
    photo: "8th.jpg",
  },
  {
    date: "29/01/2024",
    title: "Ashwani's Party",
    description: "Chidiya yaha chugte hue",
    emoji: "💕",
    photo: "Ashwaniparty.jpg",
  },
  {
    date: "02/02/2024",
    title: "Farewell",
    description: "Personal camera bana hua tha me 😂",
    emoji: "📝",
    photo: "Farewell.jpg",
  },
  {
    date: "20/02/2024",
    title: "Scribble Day",
    description: "Bakchodi to bahut kari the is din",
    emoji: "🌟",
    photo: "Scribbleday.jpg",
  },
  {
    date: "12/02/2025",
    title: "Movie time",
    description: "Sabse mast din tha 😂 aunty ne call kiya uske vaje se jaldi jana padha aur bhi bakchodi😂",
    emoji: "📝",
    photo: "Intersellar.jpg",
  },
];

// ============================================
// 💌 LOVE NOTES
// ============================================
// These pop up randomly when clicking the heart button

export const loveNotes: string[] = [
"You make every day brighter just by being you 💖",
"Your smile can fix even the worst days ✨",
"I'm so lucky to have a best friend like you 🌸",
"You're not just amazing — you're one of a kind 💫",
"Every memory with you is special to me 🌷",
"You deserve all the happiness in the world 🎀",
"I'm so happy I get to celebrate you today 💕",
"Life is so much more fun with you around 🌈",
"Happy Birthday to my favorite human ever 🎂",
"You turn ordinary moments into unforgettable ones ✨",
"Your laugh is honestly the best sound ever 💗",
"Cheers to more memories, more fun, and more chaos together 🎉",
];
