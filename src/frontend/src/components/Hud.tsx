import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { GameState } from '../game/state/gameState';

interface HudProps {
  gameState: GameState;
  chapterTitle: string;
}

export default function Hud({ gameState, chapterTitle }: HudProps) {
  return (
    <Card className="p-4 bg-card/95 backdrop-blur-sm border-2 steel-border">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="text-sm text-muted-foreground font-semibold">Round {gameState.currentChapter + 1}</div>
          <div className="font-bold text-lg font-display uppercase tracking-tight">{chapterTitle}</div>
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
