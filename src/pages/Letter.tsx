import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import paperTexture from "@/assets/paper-texture.jpg";

const Letter = () => {
  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-12 px-4 bg-blush-gradient flex items-center justify-center">
        <motion.div
          className="max-w-2xl w-full rounded-2xl shadow-card overflow-hidden"
          initial={{ opacity: 0, rotateY: -10 }}
          animate={{ opacity: 1, rotateY: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div
            className="relative p-8 sm:p-12 min-h-[600px]"
            style={{
              backgroundImage: `url(${paperTexture})`,
              backgroundSize: "cover",
            }}
          >
            {/* Decorative corner */}
            <div className="absolute top-4 right-4 font-handwritten text-2xl text-primary/40">
              ✿
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <h2 className="font-handwritten text-3xl sm:text-4xl text-foreground mb-2">
                A Page From My Heart
              </h2>
              <div className="w-20 h-0.5 bg-primary/30 mb-8" />

              <div className="font-handwritten text-xl sm:text-2xl text-foreground/80 leading-relaxed space-y-6">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  Dear Butki,
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  Nishant will write his message here…
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                >
                  This is where the words that matter most go. The ones that are hard to say out loud sometimes. The ones that deserve their own page.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.7 }}
                >
                  Write from your heart. She'll love every word. 💌
                </motion.p>

                <motion.p
                  className="text-right mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                >
                  With all my love,
                  <br />
                  — Nishant 💖
                </motion.p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Letter;
