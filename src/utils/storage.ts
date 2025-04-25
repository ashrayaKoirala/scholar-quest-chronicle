
import { Character, CharacterStats, Quest, FlashcardDeck } from "../types";
import { appData } from "../data/appData";

// Character related functions
export const getCharacter = (): Character | null => {
  try {
    const storedData = localStorage.getItem(appData.storage.localStorageKeys.character);
    
    if (storedData) {
      return JSON.parse(storedData);
    }
    
    // Initialize with default values
    const defaultStats = appData.character.defaultStats;
    const baseXP = appData.character.levelingSystem.baseXP;
    
    const character: Character = {
      stats: { ...defaultStats },
      xp: 0,
      level: 1,
      nextLevelXP: baseXP
    };
    
    saveCharacter(character);
    return character;
    
  } catch (error) {
    console.error("Failed to get character:", error);
    return null;
  }
};

export const saveCharacter = (character: Character): void => {
  try {
    localStorage.setItem(
      appData.storage.localStorageKeys.character,
      JSON.stringify(character)
    );
  } catch (error) {
    console.error("Failed to save character:", error);
  }
};

export const updateStats = (newStats: CharacterStats): void => {
  try {
    const character = getCharacter();
    if (character) {
      character.stats = { ...newStats };
      saveCharacter(character);
    }
  } catch (error) {
    console.error("Failed to update stats:", error);
  }
};

export const addXP = (amount: number): Character | null => {
  try {
    const character = getCharacter();
    if (!character) return null;
    
    character.xp += amount;
    
    // Check for level up
    if (character.xp >= character.nextLevelXP && character.level < appData.character.levelingSystem.maxLevel) {
      character.level += 1;
      character.nextLevelXP = Math.floor(
        appData.character.levelingSystem.baseXP * 
        Math.pow(appData.character.levelingSystem.multiplier, character.level - 1)
      );
    }
    
    saveCharacter(character);
    return character;
  } catch (error) {
    console.error("Failed to add XP:", error);
    return null;
  }
};

// Quest related functions
export const getQuests = (): Quest[] => {
  try {
    const storedData = localStorage.getItem(appData.storage.localStorageKeys.quests);
    if (storedData) {
      return JSON.parse(storedData);
    }
    return [];
  } catch (error) {
    console.error("Failed to get quests:", error);
    return [];
  }
};

export const saveQuest = (quest: Quest): void => {
  try {
    const quests = getQuests();
    // Check if quest already exists
    const existingIndex = quests.findIndex(q => q.id === quest.id);
    
    if (existingIndex >= 0) {
      quests[existingIndex] = quest;
    } else {
      quests.push(quest);
    }
    
    localStorage.setItem(
      appData.storage.localStorageKeys.quests,
      JSON.stringify(quests)
    );
  } catch (error) {
    console.error("Failed to save quest:", error);
  }
};

export const completeQuest = (questId: string): void => {
  try {
    const quests = getQuests();
    const questIndex = quests.findIndex(q => q.id === questId);
    
    if (questIndex >= 0) {
      const quest = quests[questIndex];
      quest.completed = true;
      quests[questIndex] = quest;
      
      localStorage.setItem(
        appData.storage.localStorageKeys.quests,
        JSON.stringify(quests)
      );
      
      // Add XP to character
      addXP(quest.xpReward);
    }
  } catch (error) {
    console.error("Failed to complete quest:", error);
  }
};

// Flashcard related functions
export const getFlashcardDecks = (): FlashcardDeck[] => {
  try {
    const storedData = localStorage.getItem(appData.storage.localStorageKeys.flashcards);
    if (storedData) {
      return JSON.parse(storedData);
    }
    return [];
  } catch (error) {
    console.error("Failed to get flashcard decks:", error);
    return [];
  }
};

export const saveFlashcardDeck = (deck: FlashcardDeck): void => {
  try {
    const decks = getFlashcardDecks();
    const existingIndex = decks.findIndex(d => d.id === deck.id);
    
    if (existingIndex >= 0) {
      decks[existingIndex] = deck;
    } else {
      decks.push(deck);
    }
    
    localStorage.setItem(
      appData.storage.localStorageKeys.flashcards,
      JSON.stringify(decks)
    );
  } catch (error) {
    console.error("Failed to save flashcard deck:", error);
  }
};
