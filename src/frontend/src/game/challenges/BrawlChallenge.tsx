import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChallengeProps, ChallengeResult } from './types';

type ComboMove = 'punch' | 'kick' | 'block';

export default function BrawlChallenge({ onComplete }: ChallengeProps) {
  const [gameState, setGameState] = useState<'ready' | 'active' | 'complete'>('ready');
  const [playerHealth, setPlayerHealth] = useState(100);
  const [opponentHealth, setOpponentHealth] = useState(100);
  const [currentMove, setCurrentMove] = useState<ComboMove | null>(null);
  const [combo, setCombo] = useState(0);
  const [message, setMessage] = useState('');
  const [round, setRound] = useState(1);
  const [totalDamageDealt, setTotalDamageDealt] = useState(0);

  const opponentAttack = useCallback(() => {
    if (gameState !== 'active') return;
    
    const moves: ComboMove[] = ['punch', 'kick', 'punch'];
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    
    // If player is blocking, reduce damage
    if (currentMove === 'block') {
      const damage = Math.floor(Math.random() * 5) + 3;
      setPlayerHealth(prev => Math.max(0, prev - damage));
      setMessage(`Blocked! Only ${damage} damage taken`);
    } else {
      const damage = Math.floor(Math.random() * 10) + 8;
      setPlayerHealth(prev => Math.max(0, prev - damage));
      setMessage(`Hit! ${damage} damage taken`);
      setCombo(0);
    }
    
    setCurrentMove(null);
  }, [currentMove, gameState]);

  useEffect(() => {
    if (gameState === 'active') {
      const attackInterval = setInterval(() => {
        opponentAttack();
      }, 2000);
      
      return () => clearInterval(attackInterval);
    }
  }, [gameState, opponentAttack]);

  useEffect(() => {
    if (gameState === 'active') {
      if (opponentHealth <= 0) {
        handleComplete(true);
      } else if (playerHealth <= 0) {
        handleComplete(false);
      }
    }
  }, [playerHealth, opponentHealth, gameState]);

  const handleStart = () => {
    setGameState('active');
    setPlayerHealth(100);
    setOpponentHealth(100);
    setCombo(0);
    setMessage('Fight!');
    setTotalDamageDealt(0);
  };

  const handleMove = (move: ComboMove) => {
    if (gameState !== 'active' || currentMove !== null) return;
    
    setCurrentMove(move);
    
    if (move === 'block') {
      setMessage('Blocking...');
      setTimeout(() => setCurrentMove(null), 1500);
      return;
    }
    
    // Calculate damage
    let damage = 0;
    if (move === 'punch') {
      damage = Math.floor(Math.random() * 8) + 10;
    } else if (move === 'kick') {
      damage = Math.floor(Math.random() * 12) + 12;
    }
    
    // Combo multiplier
    const comboMultiplier = 1 + (combo * 0.2);
    damage = Math.floor(damage * comboMultiplier);
    
    setOpponentHealth(prev => Math.max(0, prev - damage));
    setTotalDamageDealt(prev => prev + damage);
    setCombo(prev => prev + 1);
    setMessage(`${move.toUpperCase()}! ${damage} damage! ${combo > 0 ? `${combo}x COMBO!` : ''}`);
    
    setTimeout(() => setCurrentMove(null), 800);
  };

  const handleComplete = (won: boolean) => {
    setGameState('complete');
    
    const score = totalDamageDealt;
    const result: ChallengeResult = {
      success: won,
      score,
      reward: won 
        ? { courage: 15, virtue: 10, wisdom: 5 } 
        : { courage: 5, virtue: 3 }
    };
    
    setTimeout(() => onComplete(result), 1500);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-steel border-2">
      <CardHeader className="bg-gradient-to-r from-destructive/20 to-primary/20">
        <CardTitle className="text-3xl font-display tracking-tight">Street Brawl</CardTitle>
        <CardDescription className="text-base">
          Time your attacks and blocks. Build combos for massive damage!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {gameState === 'ready' && (
          <div className="text-center space-y-4">
            <p className="text-lg text-muted-foreground">
              Use quick reflexes to land hits and block incoming attacks. Chain your moves for combo damage!
            </p>
            <Button onClick={handleStart} className="w-full" size="lg">
              Start Fight
            </Button>
          </div>
        )}
        
        {gameState === 'active' && (
          <>
            {/* Health Bars */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span>YOU</span>
                  <span>{playerHealth}%</span>
                </div>
                <Progress value={playerHealth} className="h-4 bg-secondary" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span>OPPONENT</span>
                  <span>{opponentHealth}%</span>
                </div>
                <Progress value={opponentHealth} className="h-4 bg-destructive/30" />
              </div>
            </div>
            
            {/* Message Display */}
            <div className="text-center py-4">
              <p className={`text-xl font-bold ${combo > 2 ? 'text-primary animate-pulse' : ''}`}>
                {message}
              </p>
              {combo > 0 && (
                <p className="text-sm text-accent mt-1">
                  Combo: {combo}x (Damage +{combo * 20}%)
                </p>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <Button 
                onClick={() => handleMove('punch')} 
                disabled={currentMove !== null}
                className="h-20 text-lg font-bold"
                variant="default"
              >
                PUNCH
              </Button>
              <Button 
                onClick={() => handleMove('kick')} 
                disabled={currentMove !== null}
                className="h-20 text-lg font-bold"
                variant="default"
              >
                KICK
              </Button>
              <Button 
                onClick={() => handleMove('block')} 
                disabled={currentMove !== null}
                className="h-20 text-lg font-bold"
                variant="secondary"
              >
                BLOCK
              </Button>
            </div>
          </>
        )}
        
        {gameState === 'complete' && (
          <div className="text-center space-y-4 py-8">
            <div className="text-3xl font-bold">
              {opponentHealth <= 0 ? '🏆 VICTORY!' : '💥 DEFEATED'}
            </div>
            <div className="text-muted-foreground space-y-1">
              <p>Total Damage Dealt: {totalDamageDealt}</p>
              <p>Final Health: {playerHealth}%</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
