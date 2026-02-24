import { useState } from "react";
import { Heart, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { loveNotes } from "@/data/media";

const LoveNotes = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState("");

  const showRandomNote = () => {
    const note = loveNotes[Math.floor(Math.random() * loveNotes.length)];
    setCurrentNote(note);
    setIsOpen(true);
  };

  return (
    <>
      <motion.button
        onClick={showRandomNote}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-glow"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        aria-label="Show love note"
      >
        <Heart size={24} fill="currentColor" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="relative glass rounded-2xl p-8 max-w-sm text-center shadow-glow"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
              <Heart className="mx-auto mb-4 text-primary" size={32} fill="currentColor" />
              <p className="font-handwritten text-2xl text-foreground leading-relaxed">
                {currentNote}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LoveNotes;
