// ============================================
// 📸 PHOTO & VIDEO CONFIGURATION
// ============================================
// Nishant: Add your photos and videos here!
// Just add the file to /public/photos or /public/videos
// and add the filename to the array below.

export const photos: string[] = [
  // Add your photo filenames here, e.g.:
  // "photo1.jpg",
  // "photo2.png",
  // "us-at-the-park.jpg",
];

export const videos: string[] = [
  // Add your video filenames here, e.g.:
  // "video1.mp4",
  // "our-trip.mp4",
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
    date: "The Day We Met",
    title: "Where It All Began",
    description: "Add your memory of how you met here...",
    emoji: "✨",
    // photo: "met.jpg",  // Add a photo from /public/photos/
  },
  {
    date: "First Adventure",
    title: "Our First Trip Together",
    description: "Describe your first adventure together...",
    emoji: "🌸",
    // photo: "adventure.jpg",
  },
  {
    date: "A Special Moment",
    title: "That One Time...",
    description: "Write about a moment you'll never forget...",
    emoji: "💫",
    // photo: "special.jpg",
  },
  {
    date: "Recently",
    title: "Still Making Memories",
    description: "A recent memory that made you smile...",
    emoji: "💖",
    // photo: "recent.jpg",
  },
];

// ============================================
// 💌 LOVE NOTES
// ============================================
// These pop up randomly when clicking the heart button

export const loveNotes: string[] = [
  "You make every day feel like a celebration 💖",
  "Your smile is my favorite thing in the world ✨",
  "I'm so grateful the universe brought us together 🌸",
  "You're not just beautiful — you're magic 💫",
  "Every moment with you is a memory I treasure 🌷",
  "You deserve all the happiness in the world 🎀",
  "I fall for you a little more every single day 💕",
  "You're the plot twist I never saw coming 📖",
  "Life is better because you're in it 🌈",
  "Happy birthday to my favorite person ever 🎂",
  "You make ordinary moments extraordinary ✨",
  "I love the way you laugh 💗",
];

// ============================================
// 📖 MESSAGE BOOK PAGES
// ============================================

export const messageBookPages: string[] = [
  "Dear Butki,\n\nWhere do I even begin? This page is yours — fill it with everything you feel...",
  "Remember that time we couldn't stop laughing? Write about it here...",
  "If I could give you one thing, it would be... (write your thoughts here)",
  "The thing I admire most about you is... (Nishant, write from the heart)",
  "Here's to many more birthdays together, many more adventures, and a lifetime of love. 💖",
];
