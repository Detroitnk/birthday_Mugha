import { motion } from "framer-motion";
import { Play } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { videos } from "@/data/media";

const Videos = () => {
  const hasVideos = videos.length > 0;

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-12 px-4 bg-blush-gradient">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl sm:text-5xl font-heading font-semibold text-foreground mb-3">
              Moving Memories
            </h1>
            <p className="font-handwritten text-xl text-muted-foreground">
              moments that move us 🎬
            </p>
          </motion.div>

          {hasVideos ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((video, i) => (
                <motion.div
                  key={video}
                  className="rounded-2xl overflow-hidden shadow-card group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                >
                  <div className="relative">
                    <video
                      src={`/videos/${video}`}
                      className="w-full rounded-2xl"
                      controls
                      preload="metadata"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 rounded-full glass flex items-center justify-center">
                        <Play size={28} className="text-primary ml-1" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center py-24 glass rounded-2xl shadow-soft"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="text-5xl mb-4 block">🎥</span>
              <p className="font-heading text-xl text-foreground mb-2">No videos yet</p>
              <p className="text-muted-foreground max-w-md mx-auto">
                Add videos to <code className="bg-muted px-2 py-1 rounded text-sm">/public/videos/</code> and list them in <code className="bg-muted px-2 py-1 rounded text-sm">src/data/media.ts</code>
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Videos;
