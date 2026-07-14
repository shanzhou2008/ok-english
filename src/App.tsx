import { useEffect } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import Songs from "@/pages/Songs";
import SongPlayer from "@/pages/SongPlayer";
import Games from "@/pages/Games";
import GameLevels from "@/pages/GameLevels";
import GamePlay from "@/pages/GamePlay";
import Speaking from "@/pages/Speaking";
import Pet from "@/pages/Pet";
import Parent from "@/pages/Parent";
import Alphabet from "@/pages/Alphabet";
import Numbers from "@/pages/Numbers";
import ColorsShapes from "@/pages/ColorsShapes";
import Animals from "@/pages/Animals";
import AuthPage from "@/pages/AuthPage";
import { unlockAudio } from "@/lib/sound";
import { useAuthStore } from "@/stores/useAuthStore";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const currentUser = useAuthStore((s) => s.currentUser);
  return currentUser ? <>{children}</> : <Navigate to="/auth" />;
}

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
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/songs"
          element={
            <ProtectedRoute>
              <Songs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/songs/:id"
          element={
            <ProtectedRoute>
              <SongPlayer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/games"
          element={
            <ProtectedRoute>
              <Games />
            </ProtectedRoute>
          }
        />
        <Route
          path="/games/:type"
          element={
            <ProtectedRoute>
              <GameLevels />
            </ProtectedRoute>
          }
        />
        <Route
          path="/games/:type/:levelId"
          element={
            <ProtectedRoute>
              <GamePlay />
            </ProtectedRoute>
          }
        />
        <Route
          path="/speaking"
          element={
            <ProtectedRoute>
              <Speaking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pet"
          element={
            <ProtectedRoute>
              <Pet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent"
          element={
            <ProtectedRoute>
              <Parent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alphabet"
          element={
            <ProtectedRoute>
              <Alphabet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/numbers"
          element={
            <ProtectedRoute>
              <Numbers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/colors-shapes"
          element={
            <ProtectedRoute>
              <ColorsShapes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/animals"
          element={
            <ProtectedRoute>
              <Animals />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
