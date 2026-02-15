import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChallengeProps, ChallengeResult } from './types';

export default function FocusChallenge({ onComplete }: ChallengeProps) {
  const [timeLeft, setTimeLeft] = useState(10);
  const [clicks, setClicks] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isActive && timeLeft === 0) {
      handleComplete();
    }
  }, [isActive, timeLeft]);

  const handleStart = () => {
    setIsActive(true);
    setClicks(0);
    setTimeLeft(10);
  };

  const handleClick = () => {
    if (isActive && timeLeft > 0) {
      setClicks(clicks + 1);
    }
  };

  const handleComplete = () => {
    setIsActive(false);
    setCompleted(true);
    
    const score = clicks;
    const success = clicks >= 15;
    
    const result: ChallengeResult = {
      success,
      score,
      reward: success ? { virtue: 5, wisdom: 5 } : { virtue: 2 }
    };
    
    onComplete(result);
  };

  const progress = ((10 - timeLeft) / 10) * 100;

  return (
    <Card className="w-full max-w-md mx-auto shadow-ornate">
      <CardHeader>
        <CardTitle className="text-2xl">Test of Focus</CardTitle>
        <CardDescription>
          Maintain your concentration. Click as many times as you can in 10 seconds.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isActive && !completed && (
          <Button onClick={handleStart} className="w-full" size="lg">
            Begin Challenge
          </Button>
        )}
        
        {isActive && (
          <>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold">{timeLeft}s</div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <Button 
              onClick={handleClick} 
              className="w-full h-32 text-2xl"
              size="lg"
            >
              Click! ({clicks})
            </Button>
          </>
        )}
        
        {completed && (
          <div className="text-center space-y-2">
            <div className="text-xl font-semibold">
              {clicks >= 15 ? '✓ Challenge Completed!' : 'Challenge Attempted'}
            </div>
            <div className="text-muted-foreground">
              You clicked {clicks} times
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
