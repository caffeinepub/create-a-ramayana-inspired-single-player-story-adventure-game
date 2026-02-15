import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChallengeProps, ChallengeResult } from './types';

interface TacticalChoice {
  id: string;
  text: string;
  risk: number;
  reward: number;
}

const tacticalChoices: TacticalChoice[] = [
  { id: 'flank', text: 'Flank the enemy forces', risk: 30, reward: 15 },
  { id: 'direct', text: 'Direct frontal assault', risk: 50, reward: 20 },
  { id: 'defensive', text: 'Defensive formation', risk: 10, reward: 8 },
];

export default function TacticsChallenge({ onComplete }: ChallengeProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<'success' | 'failure' | null>(null);

  const handleChoice = (choice: TacticalChoice) => {
    setSelected(choice.id);
    
    const roll = Math.random() * 100;
    const success = roll > choice.risk;
    
    setResult(success ? 'success' : 'failure');
    
    const challengeResult: ChallengeResult = {
      success,
      score: success ? choice.reward : 0,
      reward: success 
        ? { courage: choice.reward, virtue: 5 }
        : { courage: 3 }
    };
    
    setTimeout(() => {
      onComplete(challengeResult);
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-ornate">
      <CardHeader>
        <CardTitle className="text-2xl">Test of Tactics</CardTitle>
        <CardDescription>
          Choose your strategy wisely. Each approach carries different risks and rewards.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {!selected && tacticalChoices.map((choice) => (
          <Button
            key={choice.id}
            onClick={() => handleChoice(choice)}
            variant="outline"
            className="w-full h-auto py-4 px-6 text-left flex flex-col items-start"
          >
            <div className="font-semibold">{choice.text}</div>
            <div className="text-sm text-muted-foreground mt-1">
              Risk: {choice.risk}% • Reward: {choice.reward}
            </div>
          </Button>
        ))}
        
        {selected && result && (
          <div className="text-center space-y-2 py-4">
            <div className={`text-xl font-semibold ${
              result === 'success' ? 'text-accent' : 'text-destructive'
            }`}>
              {result === 'success' ? '✓ Tactical Success!' : '✗ Strategy Failed'}
            </div>
            <div className="text-muted-foreground">
              {result === 'success' 
                ? 'Your strategy proved effective in battle.'
                : 'The enemy anticipated your move.'}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
