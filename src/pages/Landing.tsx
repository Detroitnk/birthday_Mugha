import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import FloatingParticles from "@/components/FloatingParticles";
import heroBg from "@/assets/hero-bg.jpg";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
      </div>

      <FloatingParticles />

      <motion.div
        className="relative z-10 text-center px-6 max-w-lg"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring", damping: 12 }}
          className="mb-8"
        >
          <span className="text-6xl">🎀</span>
        </motion.div>

        <motion.p
          className="font-handwritten text-2xl text-muted-foreground mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          a little late, a lot of love
        </motion.p>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-heading font-semibold text-foreground mb-4 leading-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Let's create something{" "}
          <span className="text-gradient">magical</span>
          {" "}for Butki
        </motion.h1>

        <motion.p
          className="font-handwritten text-3xl text-primary mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          💖
        </motion.p>

        <motion.button
          onClick={() => navigate("/gallery")}
          className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-heading text-lg shadow-glow hover:shadow-lg transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <Sparkles size={20} className="group-hover:animate-sparkle" />
          Start the Journey
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Landing;
