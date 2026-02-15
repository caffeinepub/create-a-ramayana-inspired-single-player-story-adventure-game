import { useReducer, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import GameLayout from '../components/GameLayout';
import Hud from '../components/Hud';
import SaveLoadPanel from '../components/SaveLoadPanel';
import FocusChallenge from '../game/challenges/FocusChallenge';
import TacticsChallenge from '../game/challenges/TacticsChallenge';
import WisdomChallenge from '../game/challenges/WisdomChallenge';
import BrawlChallenge from '../game/challenges/BrawlChallenge';
import {
  GameState,
  getCurrentChapter,
  canAdvanceChapter,
  advanceToNextChapter,
  isMissionComplete,
  getObjectiveLabels,
} from '../game/state/gameState';
import { gameReducer } from '../game/state/reducer';
import { ChallengeResult } from '../game/challenges/types';
import { chapters } from '../game/story/chapters';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, CheckCircle2, Circle } from 'lucide-react';

interface ChapterScreenProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  onReturnToMenu: () => void;
}

export default function ChapterScreen({ gameState, setGameState, onReturnToMenu }: ChapterScreenProps) {
  const [localState, dispatch] = useReducer(gameReducer, gameState);
  const [showChallenge, setShowChallenge] = useState(false);
  const [showSavePanel, setShowSavePanel] = useState(false);

  const chapter = getCurrentChapter(localState);
  const currentNarrative =
    chapter.narratives[localState.currentNarrative] ||
    chapter.narratives[chapter.narratives.length - 1];
  const isLastNarrative = localState.currentNarrative >= chapter.narratives.length - 1;
  const canContinue = canAdvanceChapter(localState);
  const isLastChapter = localState.currentChapter >= chapters.length - 1;
  const missionComplete = isMissionComplete(localState);
  const objectiveLabels = getObjectiveLabels(chapter);

  // Mark story as read when reaching last narrative
  useEffect(() => {
    if (isLastNarrative && !localState.chapterObjectives.readStory) {
      dispatch({ type: 'MARK_STORY_READ' });
    }
  }, [isLastNarrative, localState.chapterObjectives.readStory]);

  const handleChoice = (choiceId: string) => {
    const choice = chapter.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    // Check if already made a choice
    if (localState.chapterObjectives.madeChoice) {
      toast.info('You already made your choice for this fight');
      return;
    }

    dispatch({ type: 'MAKE_CHOICE', choiceId, effects: choice.effects });
    toast.success('Choice locked in');
  };

  const handleChallengeComplete = (result: ChallengeResult) => {
    dispatch({ type: 'COMPLETE_CHALLENGE', reward: result.reward });
    setShowChallenge(false);

    if (result.success) {
      toast.success('Fight won!');
    } else {
      toast.info('You fought hard');
    }
  };

  const handleAdvanceNarrative = () => {
    if (!isLastNarrative) {
      dispatch({ type: 'ADVANCE_NARRATIVE' });
    }
  };

  const handleNextChapter = () => {
    if (canContinue) {
      const nextState = advanceToNextChapter(localState);
      setGameState(nextState);
      dispatch({ type: 'RESET_NARRATIVE' });
      setShowChallenge(false);

      if (isLastChapter) {
        toast.success('You are the King of the Streets! Game Complete.');
      }
    }
  };

  // Sync local state to parent
  const syncState = () => {
    setGameState(localState);
  };

  const renderChallenge = () => {
    switch (chapter.challengeType) {
      case 'brawl':
        return <BrawlChallenge onComplete={handleChallengeComplete} />;
      case 'focus':
        return <FocusChallenge onComplete={handleChallengeComplete} />;
      case 'tactics':
        return <TacticsChallenge onComplete={handleChallengeComplete} />;
      case 'wisdom':
        return <WisdomChallenge onComplete={handleChallengeComplete} />;
      default:
        return null;
    }
  };

  return (
    <GameLayout backgroundImage={chapter.background}>
      <div className="min-h-screen flex flex-col p-4 gap-4">
        {/* HUD */}
        <Hud gameState={localState} chapterTitle={chapter.title} />

        {/* Main Content */}
        <div className="flex-1 grid lg:grid-cols-[1fr_320px] gap-4">
          {/* Story & Challenge Area */}
          <div className="space-y-4">
            {!showChallenge ? (
              <Card className="bg-card/95 backdrop-blur-sm shadow-steel border-2 steel-border">
                <CardHeader>
                  <CardTitle className="text-2xl font-display uppercase tracking-tight">
                    {chapter.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    Round {localState.currentChapter + 1}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Narrative */}
                  <div className="prose prose-sm max-w-none">
                    <p className="text-foreground leading-relaxed whitespace-pre-line">
                      {currentNarrative}
                    </p>
                  </div>

                  {/* Navigation */}
                  {!isLastNarrative && (
                    <Button onClick={handleAdvanceNarrative} className="w-full" size="lg">
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}

                  {/* Choices */}
                  {isLastNarrative && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <h3 className="font-semibold text-lg">Your Move</h3>
                        {chapter.choices.map((choice) => (
                          <Button
                            key={choice.id}
                            onClick={() => handleChoice(choice.id)}
                            disabled={localState.chapterObjectives.madeChoice}
                            variant="outline"
                            className="w-full h-auto py-4 px-4 text-left justify-start steel-border"
                          >
                            <span className="text-sm leading-relaxed">{choice.text}</span>
                          </Button>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Challenge Button */}
                  {isLastNarrative && !localState.chapterObjectives.completedChallenge && (
                    <>
                      <Separator />
                      <Button
                        onClick={() => setShowChallenge(true)}
                        className="w-full"
                        size="lg"
                        variant="default"
                      >
                        Enter the Fight
                      </Button>
                    </>
                  )}

                  {/* Mission Complete */}
                  {missionComplete && (
                    <>
                      <Separator />
                      <div className="space-y-4 p-4 bg-primary/10 rounded-sm border border-primary/30">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span className="font-bold text-lg">ROUND COMPLETE</span>
                        </div>
                        <Button
                          onClick={handleNextChapter}
                          className="w-full"
                          size="lg"
                        >
                          {isLastChapter ? 'Claim Victory' : 'Next Round'} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {renderChallenge()}
                <Button
                  onClick={() => setShowChallenge(false)}
                  variant="outline"
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Story
                </Button>
              </div>
            )}
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            {/* Fighter Portrait */}
            <Card className="bg-card/95 backdrop-blur-sm steel-border">
              <CardContent className="p-4">
                <img
                  src="/assets/generated/streetfight-portraits-set.dim_1024x1024.png"
                  alt="Fighter"
                  className="w-full rounded-sm border border-border"
                />
              </CardContent>
            </Card>

            {/* Mission Objectives */}
            <Card className="bg-card/95 backdrop-blur-sm steel-border">
              <CardHeader>
                <CardTitle className="text-lg font-display">Round Objectives</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(objectiveLabels).map(([key, label]) => {
                  const completed = localState.chapterObjectives[key as keyof typeof localState.chapterObjectives];
                  return (
                    <div key={key} className="flex items-center gap-2">
                      {completed ? (
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className={completed ? 'text-foreground' : 'text-muted-foreground'}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Save/Load */}
            <div>
              <Button
                onClick={() => setShowSavePanel(!showSavePanel)}
                variant="outline"
                className="w-full mb-2"
              >
                {showSavePanel ? 'Hide' : 'Show'} Save/Load
              </Button>
              {showSavePanel && (
                <SaveLoadPanel gameState={localState} onLoadGame={(chapter, vars, objs) => {
                  // This will be handled by parent App component
                  toast.info('Load from main menu');
                }} />
              )}
            </div>

            {/* Return to Menu */}
            <Button onClick={onReturnToMenu} variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" /> Main Menu
            </Button>
          </div>
        </div>
      </div>
    </GameLayout>
  );
}
