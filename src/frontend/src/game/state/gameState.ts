import { chapters, type Chapter } from '../story/chapters';

export interface ChapterObjectives {
  chapterId: number;
  readStory: boolean;
  madeChoice: boolean;
  completedChallenge: boolean;
}

export interface GameState {
  currentChapter: number;
  stateVariables: {
    virtue: number;
    wisdom: number;
    courage: number;
  };
  choiceHistory: Array<{
    chapterId: number;
    choiceId: string;
  }>;
  challengeCompleted: boolean;
  currentNarrative: number;
  chapterObjectives: ChapterObjectives;
}

export function createNewGame(): GameState {
  return {
    currentChapter: 0,
    stateVariables: {
      virtue: 50,
      wisdom: 50,
      courage: 50,
    },
    choiceHistory: [],
    challengeCompleted: false,
    currentNarrative: 0,
    chapterObjectives: {
      chapterId: 0,
      readStory: false,
      madeChoice: false,
      completedChallenge: false,
    },
  };
}

export function loadGameFromProgress(
  chapter: number,
  stateVars: Record<string, string>,
  completedObjectives?: Array<{ missionId: bigint; objectives: Array<[string, boolean]> }>
): GameState {
  // Find objectives for current chapter
  const currentChapterObjectives = completedObjectives?.find(
    (obj) => Number(obj.missionId) === chapter
  );

  let objectives: ChapterObjectives = {
    chapterId: chapter,
    readStory: false,
    madeChoice: false,
    completedChallenge: false,
  };

  if (currentChapterObjectives) {
    const objMap = new Map(currentChapterObjectives.objectives);
    objectives = {
      chapterId: chapter,
      readStory: objMap.get('readStory') || false,
      madeChoice: objMap.get('madeChoice') || false,
      completedChallenge: objMap.get('completedChallenge') || false,
    };
  }

  return {
    currentChapter: chapter,
    stateVariables: {
      virtue: parseInt(stateVars.virtue || '50'),
      wisdom: parseInt(stateVars.wisdom || '50'),
      courage: parseInt(stateVars.courage || '50'),
    },
    choiceHistory: [],
    challengeCompleted: objectives.completedChallenge,
    currentNarrative: objectives.readStory ? chapters[chapter]?.narratives.length - 1 || 0 : 0,
    chapterObjectives: objectives,
  };
}

export function getCurrentChapter(state: GameState): Chapter {
  return chapters[state.currentChapter] || chapters[0];
}

export function isMissionComplete(state: GameState): boolean {
  const { readStory, madeChoice, completedChallenge } = state.chapterObjectives;
  return readStory && madeChoice && completedChallenge;
}

export function canAdvanceChapter(state: GameState): boolean {
  return isMissionComplete(state);
}

export function advanceToNextChapter(state: GameState): GameState {
  const nextChapter = state.currentChapter + 1;
  if (nextChapter >= chapters.length) {
    return state;
  }

  return {
    ...state,
    currentChapter: nextChapter,
    challengeCompleted: false,
    currentNarrative: 0,
    chapterObjectives: {
      chapterId: nextChapter,
      readStory: false,
      madeChoice: false,
      completedChallenge: false,
    },
  };
}

export function getObjectiveLabels(chapter: Chapter) {
  return {
    readStory: 'Read the story',
    madeChoice: 'Make your choice',
    completedChallenge: 'Win the fight',
  };
}
