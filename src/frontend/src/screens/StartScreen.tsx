import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import GameLayout from '../components/GameLayout';
import SaveLoadPanel from '../components/SaveLoadPanel';
import LoginButton from '../components/Auth/LoginButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface StartScreenProps {
  onStartNewGame: () => void;
  onLoadGame: (chapter: number, stateVariables: Record<string, string>) => void;
}

export default function StartScreen({ onStartNewGame, onLoadGame }: StartScreenProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

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
                
                <Button 
                  onClick={onStartNewGame} 
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
    </GameLayout>
  );
}
