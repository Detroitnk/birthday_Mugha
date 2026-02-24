import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import PageTransition from "@/components/PageTransition";
import FloatingParticles from "@/components/FloatingParticles";

const Finale = () => {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const duration = 4000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#e8a0bf", "#c4a0e8", "#a0cfe8", "#f5d5c8"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#e8a0bf", "#c4a0e8", "#a0cfe8", "#f5d5c8"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };

    frame();
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-4 bg-blush-gradient relative overflow-hidden">
        <FloatingParticles />

        <motion.div
          className="relative z-10 text-center max-w-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <motion.div
            className="text-7xl mb-6"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎂
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl font-heading font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <span className="text-gradient">Happy Birthday</span>
            <br />
            <span className="font-handwritten text-primary">Butki 💖</span>
          </motion.h1>

          <motion.div
            className="w-16 h-0.5 bg-primary/40 mx-auto mb-6"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1 }}
          />

          <motion.p
            className="text-lg text-muted-foreground leading-relaxed font-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            I know this is a little late — but that's only because I wanted to
            make something truly special for you. You deserve more than just a
            text or a call. You deserve something that lasts.
          </motion.p>

          <motion.p
            className="font-handwritten text-2xl text-primary mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            With all my love — Nishant 💕
          </motion.p>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Finale;
