import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, Film, PenLine, Clock, BookOpen, Sparkles, Home } from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/gallery", icon: Camera, label: "Photos" },
  { path: "/videos", icon: Film, label: "Videos" },
  { path: "/letter", icon: PenLine, label: "Letter" },
  { path: "/timeline", icon: Clock, label: "Timeline" },
  { path: "/book", icon: BookOpen, label: "Book" },
  { path: "/finale", icon: Sparkles, label: "Finale" },
];

const Navigation = () => {
  const location = useLocation();

  // Hide nav on landing page
  if (location.pathname === "/") return null;

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 glass"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.3, type: "spring", damping: 20 }}
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-center gap-1 overflow-x-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm transition-all whitespace-nowrap ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default Navigation;
