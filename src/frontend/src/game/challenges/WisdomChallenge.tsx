import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChallengeProps, ChallengeResult } from './types';

interface WisdomQuestion {
  question: string;
  options: Array<{ text: string; isWise: boolean }>;
}

const wisdomQuestions: WisdomQuestion[] = [
  {
    question: 'A promise made to your father conflicts with your personal happiness. What guides your choice?',
    options: [
      { text: 'Honor the promise, for a word given is sacred', isWise: true },
      { text: 'Seek a compromise that serves both duties', isWise: true },
      { text: 'Follow your heart, promises can be renegotiated', isWise: false },
    ]
  }
];

export default function WisdomChallenge({ onComplete }: ChallengeProps) {
  const [answered, setAnswered] = useState(false);
  const [selectedWise, setSelectedWise] = useState(false);

  const question = wisdomQuestions[0];

  const handleAnswer = (isWise: boolean) => {
    setAnswered(true);
    setSelectedWise(isWise);
    
    const result: ChallengeResult = {
      success: isWise,
      score: isWise ? 10 : 5,
      reward: isWise 
        ? { wisdom: 10, virtue: 5 }
        : { wisdom: 3 }
    };
    
    setTimeout(() => {
      onComplete(result);
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-ornate">
      <CardHeader>
        <CardTitle className="text-2xl">Test of Wisdom</CardTitle>
        <CardDescription>
          Reflect on the path of dharma. Your choice reveals your understanding.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-base leading-relaxed mb-4">
          {question.question}
        </div>
        
        {!answered && (
          <div className="space-y-2">
            {question.options.map((option, idx) => (
              <Button
                key={idx}
                onClick={() => handleAnswer(option.isWise)}
                variant="outline"
                className="w-full h-auto py-3 px-4 text-left"
              >
                {option.text}
              </Button>
            ))}
          </div>
        )}
        
        {answered && (
          <div className="text-center space-y-2 py-4">
            <div className={`text-xl font-semibold ${
              selectedWise ? 'text-accent' : 'text-muted-foreground'
            }`}>
              {selectedWise ? '✓ Wisdom Demonstrated' : 'A Choice Made'}
            </div>
            <div className="text-sm text-muted-foreground">
              {selectedWise 
                ? 'Your understanding of dharma deepens.'
                : 'Every choice teaches us something.'}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
