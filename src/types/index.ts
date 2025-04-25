
export interface Subject {
  name: string;
  icon: string;
  color: string;
  units: {
    [key: string]: {
      name: string;
      topics: string[];
    };
  };
}

export interface Subjects {
  [key: string]: Subject;
}

export interface CharacterStats {
  wisdom: number;
  focus: number;
  memory: number;
  discipline: number;
}

export interface LevelingSystem {
  baseXP: number;
  multiplier: number;
  maxLevel: number;
}

export interface Character {
  stats: CharacterStats;
  xp: number;
  level: number;
  nextLevelXP: number;
}

export type QuestType = "learning" | "practice" | "revision" | "assessment";
export type QuestDifficulty = "beginner" | "intermediate" | "advanced" | "expert";

export interface Quest {
  id: string;
  title: string;
  description: string;
  subject: string;
  unit: string;
  topic: string;
  type: QuestType;
  difficulty: QuestDifficulty;
  completed: boolean;
  xpReward: number;
}

export interface ExamInfo {
  date: string;
  time: string;
  paper: string;
  code: string;
}

export interface ExamSchedule {
  physics: ExamInfo[];
  mathematics: ExamInfo[];
  computerScience: ExamInfo[];
}

export interface TimerPreset {
  name: string;
  duration: number;
}

export interface StudyTools {
  timer: {
    presets: TimerPreset[];
    breakDurations: {
      short: number;
      long: number;
    };
  };
  flashcards: {
    maxCardsPerDeck: number;
    reviewIntervals: number[];
  };
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  deckId: string;
  lastReviewed: string | null;
  nextReviewDate: string | null;
  reviewCount: number;
}

export interface FlashcardDeck {
  id: string;
  name: string;
  subject: string;
  unit: string;
  topic: string;
  cards: Flashcard[];
}

export interface AppData {
  app: {
    name: string;
    description: string;
  };
  subjects: Subjects;
  character: {
    defaultStats: CharacterStats;
    levelingSystem: LevelingSystem;
  };
  quests: {
    types: QuestType[];
    difficulties: QuestDifficulty[];
    defaultXPRewards: {
      [key in QuestDifficulty]: number;
    };
  };
  examSchedule: ExamSchedule;
  studyTools: StudyTools;
  storage: {
    localStorageKeys: {
      character: string;
      quests: string;
      flashcards: string;
      errorLog: string;
      timerSessions: string;
      authentication: string;
      theme: string;
    };
  };
}
