import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { GameState } from '../game/state/gameState';
import { getCharacterByIdOrDefault } from '../game/characters/characters';

interface HudProps {
  gameState: GameState;
  chapterTitle: string;
}

export default function Hud({ gameState, chapterTitle }: HudProps) {
  const character = getCharacterByIdOrDefault(gameState.selectedCharacterId);

  return (
    <Card className="p-4 bg-card/95 backdrop-blur-sm border-2 steel-border">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <img 
            src={character.portraitPath}
            alt={character.name}
            className="w-12 h-12 rounded-sm border border-border object-cover"
          />
          <div>
            <div className="text-xs text-muted-foreground font-semibold">
              {character.name} • Round {gameState.currentChapter + 1}
            </div>
            <div className="font-bold text-lg font-display uppercase tracking-tight">{chapterTitle}</div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Badge variant="outline" className="px-3 py-1 steel-border">
            <span className="text-xs text-muted-foreground mr-1 font-semibold">POWER</span>
            <span className="font-bold">{gameState.stateVariables.virtue}</span>
          </Badge>
          <Badge variant="outline" className="px-3 py-1 steel-border">
            <span className="text-xs text-muted-foreground mr-1 font-semibold">SKILL</span>
            <span className="font-bold">{gameState.stateVariables.wisdom}</span>
          </Badge>
          <Badge variant="outline" className="px-3 py-1 steel-border">
            <span className="text-xs text-muted-foreground mr-1 font-semibold">GUTS</span>
            <span className="font-bold">{gameState.stateVariables.courage}</span>
          </Badge>
        </div>
      </div>
    </Card>
  );
}
