export interface ChallengeResult {
  success: boolean;
  score: number;
  reward: Record<string, number>;
}

export interface ChallengeProps {
  onComplete: (result: ChallengeResult) => void;
}
