import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { messageBookPages } from "@/data/media";

const MessageBook = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextPage = () => {
    if (currentPage < messageBookPages.length - 1) {
      setDirection(1);
      setCurrentPage((p) => p + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage((p) => p - 1);
    }
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      rotateY: dir > 0 ? 15 : -15,
    }),
    center: { x: 0, opacity: 1, rotateY: 0 },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      rotateY: dir > 0 ? -15 : 15,
    }),
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-12 px-4 bg-blush-gradient flex flex-col items-center justify-center">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl sm:text-5xl font-heading font-semibold text-foreground mb-3">
            Forever Pages
          </h1>
          <p className="font-handwritten text-xl text-muted-foreground">
            turn each page with love 📖
          </p>
        </motion.div>

        <div className="relative w-full max-w-lg" style={{ perspective: 1000 }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentPage}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="glass rounded-2xl p-8 sm:p-10 min-h-[400px] shadow-card flex flex-col justify-between"
            >
              <div>
                <span className="text-sm text-muted-foreground font-body">
                  Page {currentPage + 1} of {messageBookPages.length}
                </span>
                <div className="w-12 h-0.5 bg-primary/30 mt-2 mb-6" />
                <p className="font-handwritten text-xl sm:text-2xl text-foreground leading-relaxed whitespace-pre-line">
                  {messageBookPages[currentPage]}
                </p>
              </div>
              <div className="text-right mt-6">
                <span className="font-handwritten text-lg text-primary/50">~ 💕 ~</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-6 mt-8">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="w-12 h-12 rounded-full glass flex items-center justify-center shadow-soft disabled:opacity-30 hover:shadow-glow transition-all"
          >
            <ChevronLeft size={20} className="text-foreground" />
          </button>
          <div className="flex gap-2">
            {messageBookPages.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentPage ? "bg-primary" : "bg-primary/20"
                }`}
              />
            ))}
          </div>
          <button
            onClick={nextPage}
            disabled={currentPage === messageBookPages.length - 1}
            className="w-12 h-12 rounded-full glass flex items-center justify-center shadow-soft disabled:opacity-30 hover:shadow-glow transition-all"
          >
            <ChevronRight size={20} className="text-foreground" />
          </button>
        </div>
      </div>
    </PageTransition>
  );
};

export default MessageBook;
