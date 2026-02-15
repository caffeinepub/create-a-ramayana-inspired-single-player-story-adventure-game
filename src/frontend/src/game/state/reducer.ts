import { GameState } from './gameState';
import { getCurrentChapter } from './gameState';

export type GameAction =
  | { type: 'MAKE_CHOICE'; choiceId: string; effects: Record<string, number> }
  | { type: 'COMPLETE_CHALLENGE'; reward: Record<string, number> }
  | { type: 'ADVANCE_NARRATIVE' }
  | { type: 'RESET_NARRATIVE' }
  | { type: 'MARK_STORY_READ' };

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'MAKE_CHOICE': {
      // Prevent double-counting: check if choice already made for this chapter
      const alreadyMadeChoice = state.chapterObjectives.madeChoice;
      if (alreadyMadeChoice) {
        return state;
      }

      const newState = { ...state };

      // Apply effects to state variables
      Object.entries(action.effects).forEach(([key, value]) => {
        if (key in newState.stateVariables) {
          const currentValue = newState.stateVariables[key as keyof typeof newState.stateVariables];
          newState.stateVariables[key as keyof typeof newState.stateVariables] = Math.max(
            0,
            Math.min(100, currentValue + value)
          );
        }
      });

      // Record choice
      newState.choiceHistory.push({
        chapterId: state.currentChapter,
        choiceId: action.choiceId,
      });

      // Mark choice objective as complete
      newState.chapterObjectives = {
        ...newState.chapterObjectives,
        madeChoice: true,
      };

      return newState;
    }

    case 'COMPLETE_CHALLENGE': {
      const challengeState = { ...state, challengeCompleted: true };

      // Apply rewards
      Object.entries(action.reward).forEach(([key, value]) => {
        if (key in challengeState.stateVariables) {
          const currentValue =
            challengeState.stateVariables[key as keyof typeof challengeState.stateVariables];
          challengeState.stateVariables[key as keyof typeof challengeState.stateVariables] =
            Math.max(0, Math.min(100, currentValue + value));
        }
      });

      // Mark challenge objective as complete
      challengeState.chapterObjectives = {
        ...challengeState.chapterObjectives,
        completedChallenge: true,
      };

      return challengeState;
    }

    case 'ADVANCE_NARRATIVE': {
      const chapter = getCurrentChapter(state);
      const newNarrative = state.currentNarrative + 1;
      const isLastNarrative = newNarrative >= chapter.narratives.length - 1;

      return {
        ...state,
        currentNarrative: newNarrative,
        chapterObjectives: {
          ...state.chapterObjectives,
          readStory: isLastNarrative,
        },
      };
    }

    case 'RESET_NARRATIVE':
      return {
        ...state,
        currentNarrative: 0,
      };

    case 'MARK_STORY_READ': {
      return {
        ...state,
        chapterObjectives: {
          ...state.chapterObjectives,
          readStory: true,
        },
      };
    }

    default:
      return state;
  }
}
