import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { photos } from "@/data/media";

const Gallery = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const hasPhotos = photos.length > 0;

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
              Captured Smiles
            </h1>
            <p className="font-handwritten text-xl text-muted-foreground">
              every picture tells our story 📸
            </p>
          </motion.div>

          {hasPhotos ? (
            <div className="columns-2 md:columns-3 gap-4 space-y-4">
              {photos.map((photo, i) => (
                <motion.div
                  key={photo}
                  className="break-inside-avoid cursor-pointer group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedPhoto(`/photos/${photo}`)}
                >
                  <div className="rounded-2xl overflow-hidden shadow-card transition-all duration-300 group-hover:shadow-glow group-hover:scale-[1.02]">
                    <img
                      src={`/photos/${photo}`}
                      alt={`Memory ${i + 1}`}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
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
              <span className="text-5xl mb-4 block">📷</span>
              <p className="font-heading text-xl text-foreground mb-2">No photos yet</p>
              <p className="text-muted-foreground max-w-md mx-auto">
                Nishant, add your photos to <code className="bg-muted px-2 py-1 rounded text-sm">/public/photos/</code> and list them in <code className="bg-muted px-2 py-1 rounded text-sm">src/data/media.ts</code>
              </p>
            </motion.div>
          )}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
            >
              <motion.div
                className="relative max-w-4xl max-h-[85vh]"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-background text-foreground flex items-center justify-center shadow-card z-10"
                >
                  <X size={20} />
                </button>
                <img
                  src={selectedPhoto}
                  alt="Full view"
                  className="w-full h-full object-contain rounded-2xl shadow-glow"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default Gallery;
