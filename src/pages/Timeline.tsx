import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { timelineEntries } from "@/data/media";

const Timeline = () => {
  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-12 px-4 bg-blush-gradient">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl sm:text-5xl font-heading font-semibold text-foreground mb-3">
              Our Story
            </h1>
            <p className="font-handwritten text-xl text-muted-foreground">
              every chapter matters 📖
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 md:-translate-x-px" />

            {timelineEntries.map((entry, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  className={`relative flex items-start mb-12 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  {/* Dot */}
                  <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-primary rounded-full -translate-x-1/2 mt-2 shadow-glow z-10" />

                  {/* Content card */}
                  <div
                    className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${
                      isLeft ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"
                    }`}
                  >
                    <div className="glass rounded-2xl overflow-hidden shadow-card hover:shadow-glow transition-shadow">
                      {entry.photo && (
                        <img
                          src={`/photos/${entry.photo}`}
                          alt={entry.title}
                          className="w-full h-48 object-cover"
                          loading="lazy"
                        />
                      )}
                      <div className="p-6">
                        <span className="text-3xl mb-2 block">{entry.emoji}</span>
                        <span className="text-sm font-body text-primary font-medium">
                          {entry.date}
                        </span>
                        <h3 className="font-heading text-xl text-foreground mt-1 mb-2">
                          {entry.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {entry.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Timeline;
