import { useState, useEffect } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import StartScreen from './screens/StartScreen';
import ChapterScreen from './screens/ChapterScreen';
import ProfileSetupModal from './components/Auth/ProfileSetupModal';
import { GameState, createNewGame, loadGameFromProgress } from './game/state/gameState';
import { decodeCharacterId, validateCharacterId } from './game/characters/characterPersistence';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import type { ObjectiveProgress } from './backend';

export default function App() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);

  // Determine if we should show profile setup
  useEffect(() => {
    if (isAuthenticated && !profileLoading && isFetched) {
      if (!userProfile) {
        setShowProfileSetup(true);
      } else {
        setShowProfileSetup(false);
        // Initialize selected character from profile
        const characterId = decodeCharacterId(userProfile.characterId);
        setSelectedCharacterId(validateCharacterId(characterId));
      }
    } else if (!isAuthenticated) {
      setShowProfileSetup(false);
    }
  }, [isAuthenticated, profileLoading, isFetched, userProfile]);

  const handleStartNewGame = (characterId: string) => {
    setGameState(createNewGame(characterId));
  };

  const handleLoadGame = (
    chapter: number,
    stateVariables: Record<string, string>,
    characterId?: string,
    completedObjectives?: Array<ObjectiveProgress>
  ) => {
    // If characterId is missing from saved progress, prompt user
    if (!characterId) {
      toast.error('This save is missing character data. Please choose a fighter and save again.');
      return;
    }
    setGameState(loadGameFromProgress(chapter, stateVariables, completedObjectives, characterId));
  };

  const handleReturnToMenu = () => {
    setGameState(null);
  };

  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacterId(characterId);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen">
        {showProfileSetup && <ProfileSetupModal />}

        {!gameState ? (
          <StartScreen 
            onStartNewGame={handleStartNewGame} 
            onLoadGame={handleLoadGame}
            selectedCharacterId={selectedCharacterId}
            onCharacterSelect={handleCharacterSelect}
          />
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
