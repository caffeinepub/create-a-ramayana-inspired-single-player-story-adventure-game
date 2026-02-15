import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useSaveProgress, useLoadProgress } from '../hooks/useQueries';
import { GameState } from '../game/state/gameState';
import { toast } from 'sonner';
import LoginButton from './Auth/LoginButton';
import type { Progress, ObjectiveProgress } from '../backend';

interface SaveLoadPanelProps {
  gameState: GameState | null;
  onLoadGame?: (
    chapter: number,
    stateVariables: Record<string, string>,
    completedObjectives?: Array<ObjectiveProgress>
  ) => void;
}

export default function SaveLoadPanel({ gameState, onLoadGame }: SaveLoadPanelProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const saveProgressMutation = useSaveProgress();
  const { data: savedProgress, refetch: refetchProgress } = useLoadProgress();

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error('Sign in to save your progress');
      return;
    }

    if (!gameState) {
      toast.error('No active game to save');
      return;
    }

    setIsSaving(true);

    try {
      const objectiveProgress: ObjectiveProgress = {
        missionId: BigInt(gameState.currentChapter),
        objectives: [
          ['readStory', gameState.chapterObjectives.readStory],
          ['madeChoice', gameState.chapterObjectives.madeChoice],
          ['completedChallenge', gameState.chapterObjectives.completedChallenge],
        ],
      };

      const progress: Progress = {
        chapter: BigInt(gameState.currentChapter),
        stateVariables: [
          ['virtue', gameState.stateVariables.virtue.toString()],
          ['wisdom', gameState.stateVariables.wisdom.toString()],
          ['courage', gameState.stateVariables.courage.toString()],
        ],
        completedObjectives: [objectiveProgress],
      };

      await saveProgressMutation.mutateAsync(progress);
      toast.success('Progress saved!');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save progress');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoad = async () => {
    if (!isAuthenticated) {
      toast.error('Sign in to load your progress');
      return;
    }

    setIsLoading(true);

    try {
      const { data: progress } = await refetchProgress();

      if (!progress) {
        toast.error('No saved progress found');
        return;
      }

      const stateVars: Record<string, string> = {};
      progress.stateVariables.forEach(([key, value]) => {
        stateVars[key] = value;
      });

      if (onLoadGame) {
        onLoadGame(Number(progress.chapter), stateVars, progress.completedObjectives);
        toast.success('Progress loaded!');
      }
    } catch (error) {
      console.error('Load error:', error);
      toast.error('Failed to load progress');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="bg-card/95 backdrop-blur-sm steel-border">
        <CardHeader>
          <CardTitle className="font-display">Save & Load</CardTitle>
          <CardDescription>
            Sign in to save and load your progress on the blockchain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginButton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/95 backdrop-blur-sm steel-border">
      <CardHeader>
        <CardTitle className="font-display">Save & Load</CardTitle>
        <CardDescription>
          Your progress is stored on the Internet Computer.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={handleSave} disabled={!gameState || isSaving} className="w-full">
          {isSaving ? 'Saving...' : 'Save Progress'}
        </Button>

        <Button onClick={handleLoad} disabled={isLoading} variant="outline" className="w-full">
          {isLoading ? 'Loading...' : 'Load Progress'}
        </Button>

        {savedProgress && (
          <div className="text-sm text-muted-foreground text-center pt-2">
            Saved at Round {Number(savedProgress.chapter) + 1}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
