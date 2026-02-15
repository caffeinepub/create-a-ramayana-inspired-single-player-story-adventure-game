import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import GameLayout from '../components/GameLayout';
import SaveLoadPanel from '../components/SaveLoadPanel';
import LoginButton from '../components/Auth/LoginButton';
import CharacterSelectModal from '../components/CharacterSelectModal';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { getCharacterByIdOrDefault } from '../game/characters/characters';
import { AlertCircle } from 'lucide-react';
import type { ObjectiveProgress } from '../backend';

interface StartScreenProps {
  onStartNewGame: (characterId: string) => void;
  onLoadGame: (chapter: number, stateVariables: Record<string, string>, characterId?: string, completedObjectives?: Array<ObjectiveProgress>) => void;
  selectedCharacterId: string | null;
  onCharacterSelect: (characterId: string) => void;
}

export default function StartScreen({ 
  onStartNewGame, 
  onLoadGame,
  selectedCharacterId,
  onCharacterSelect,
}: StartScreenProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [showCharacterSelect, setShowCharacterSelect] = useState(false);

  const selectedCharacter = selectedCharacterId 
    ? getCharacterByIdOrDefault(selectedCharacterId) 
    : null;

  const handleStartGame = () => {
    if (!selectedCharacterId) {
      return; // Button should be disabled
    }
    onStartNewGame(selectedCharacterId);
  };

  const handleCharacterConfirm = (characterId: string) => {
    onCharacterSelect(characterId);
  };

  return (
    <GameLayout backgroundImage="/assets/generated/streetfight-title-bg.dim_1920x1080.png">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-4 flex justify-end">
          <LoginButton />
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6">
            {/* Title Card */}
            <Card className="bg-card/95 backdrop-blur-sm shadow-steel border-2 steel-border">
              <CardHeader className="text-center space-y-4">
                <div className="space-y-2">
                  <CardTitle className="text-4xl md:text-5xl font-display tracking-tighter uppercase">
                    Street Kings
                  </CardTitle>
                  <CardDescription className="text-base font-semibold">
                    Fight Your Way to the Top
                  </CardDescription>
                </div>
                
                {/* City Map Illustration */}
                <div className="py-4">
                  <img 
                    src="/assets/generated/streetfight-city-map.dim_1600x900.png" 
                    alt="City Territory Map"
                    className="w-full rounded-sm opacity-90 border border-border"
                  />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The streets are brutal. Only the strongest survive. Build your reputation through underground fights, 
                  make tough choices, and prove you have what it takes to become a legend in the concrete jungle.
                </p>

                {/* Character Selection */}
                <div className="space-y-3">
                  <Button 
                    onClick={() => setShowCharacterSelect(true)}
                    variant="outline"
                    className="w-full"
                  >
                    {selectedCharacter ? 'Change Fighter' : 'Choose Fighter'}
                  </Button>

                  {selectedCharacter && (
                    <Card className="border-primary/50 bg-primary/5">
                      <CardContent className="p-3 flex items-center gap-3">
                        <img 
                          src={selectedCharacter.portraitPath}
                          alt={selectedCharacter.name}
                          className="w-16 h-16 rounded-sm border border-border object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold font-display uppercase text-sm">
                            {selectedCharacter.name}
                          </div>
                          <div className="text-xs text-muted-foreground line-clamp-2">
                            {selectedCharacter.bio}
                          </div>
                        </div>
                        <Badge variant="outline" className="shrink-0">Selected</Badge>
                      </CardContent>
                    </Card>
                  )}

                  {!selectedCharacter && (
                    <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-sm border border-border">
                      <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground">
                        Choose and confirm a fighter before starting your journey.
                      </p>
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={handleStartGame}
                  disabled={!selectedCharacter}
                  size="lg" 
                  className="w-full text-lg font-bold tracking-wide"
                >
                  START FIGHTING
                </Button>
              </CardContent>
            </Card>

            {/* Save/Load Panel */}
            <div className="space-y-4">
              <SaveLoadPanel 
                gameState={null}
                onLoadGame={onLoadGame}
              />
              
              {/* Character Portraits */}
              <Card className="bg-card/95 backdrop-blur-sm steel-border">
                <CardHeader>
                  <CardTitle className="text-lg font-display">The Fighters</CardTitle>
                </CardHeader>
                <CardContent>
                  <img 
                    src="/assets/generated/streetfight-portraits-set.dim_1024x1024.png" 
                    alt="Street Fighters"
                    className="w-full rounded-sm border border-border"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2">
            <span>© {new Date().getFullYear()}</span>
            <span>•</span>
            <span>Built with ❤️ using</span>
            <a 
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors underline"
            >
              caffeine.ai
            </a>
          </div>
        </footer>
      </div>

      <CharacterSelectModal
        open={showCharacterSelect}
        onClose={() => setShowCharacterSelect(false)}
        onConfirm={handleCharacterConfirm}
        initialSelection={selectedCharacterId || undefined}
      />
    </GameLayout>
  );
}
