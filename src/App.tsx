import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "@/components/Navigation";
import MusicPlayer from "@/components/MusicPlayer";
import LoveNotes from "@/components/LoveNotes";
import Landing from "./pages/Landing";
import Gallery from "./pages/Gallery";
import Videos from "./pages/Videos";
import Letter from "./pages/Letter";
import Timeline from "./pages/Timeline";

import Finale from "./pages/Finale";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navigation />
        <MusicPlayer />
        <LoveNotes />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/letter" element={<Letter />} />
          <Route path="/timeline" element={<Timeline />} />
          
          <Route path="/finale" element={<Finale />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
