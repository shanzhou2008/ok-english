import { useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Songs from "@/pages/Songs";
import SongPlayer from "@/pages/SongPlayer";
import Games from "@/pages/Games";
import GameLevels from "@/pages/GameLevels";
import GamePlay from "@/pages/GamePlay";
import Speaking from "@/pages/Speaking";
import Pet from "@/pages/Pet";
import Parent from "@/pages/Parent";
import { unlockAudio } from "@/lib/sound";

export default function App() {
  useEffect(() => {
    const handleFirstInteraction = () => {
      unlockAudio();
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
    };

    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("touchstart", handleFirstInteraction);
    document.addEventListener("keydown", handleFirstInteraction);

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/songs" element={<Songs />} />
        <Route path="/songs/:id" element={<SongPlayer />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/:type" element={<GameLevels />} />
        <Route path="/games/:type/:levelId" element={<GamePlay />} />
        <Route path="/speaking" element={<Speaking />} />
        <Route path="/pet" element={<Pet />} />
        <Route path="/parent" element={<Parent />} />
      </Routes>
    </Router>
  );
}
