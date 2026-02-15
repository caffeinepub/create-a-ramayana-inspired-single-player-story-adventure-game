import { useState, useEffect } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import StartScreen from './screens/StartScreen';
import ChapterScreen from './screens/ChapterScreen';
import ProfileSetupModal from './components/Auth/ProfileSetupModal';
import { GameState, createNewGame, loadGameFromProgress } from './game/state/gameState';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import type { ObjectiveProgress } from './backend';

export default function App() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  // Determine if we should show profile setup
  useEffect(() => {
    if (isAuthenticated && !profileLoading && isFetched && userProfile === null) {
      setShowProfileSetup(true);
    } else {
      setShowProfileSetup(false);
    }
  }, [isAuthenticated, profileLoading, isFetched, userProfile]);

  const handleStartNewGame = () => {
    setGameState(createNewGame());
  };

  const handleLoadGame = (
    chapter: number,
    stateVariables: Record<string, string>,
    completedObjectives?: Array<ObjectiveProgress>
  ) => {
    setGameState(loadGameFromProgress(chapter, stateVariables, completedObjectives));
  };

  const handleReturnToMenu = () => {
    setGameState(null);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen">
        {showProfileSetup && <ProfileSetupModal />}

        {!gameState ? (
          <StartScreen onStartNewGame={handleStartNewGame} onLoadGame={handleLoadGame} />
        ) : (
          <ChapterScreen
            gameState={gameState}
            setGameState={setGameState}
            onReturnToMenu={handleReturnToMenu}
          />
        )}

        <Toaster />
      </div>
    </ThemeProvider>
  );
}
