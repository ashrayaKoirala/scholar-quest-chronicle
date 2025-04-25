
import { format, parse, isToday } from "date-fns";
import { QuestDifficulty, ExamInfo } from "../types";

// Format a date string (YYYY-MM-DD) to a more readable format
export const formatDate = (dateString: string): string => {
  try {
    const date = parse(dateString, "yyyy-MM-dd", new Date());
    return format(date, "MMM d, yyyy");
  } catch (error) {
    console.error("Failed to format date:", error);
    return dateString;
  }
};

// Check if a date is today
export const isExamToday = (dateString: string): boolean => {
  try {
    const date = parse(dateString, "yyyy-MM-dd", new Date());
    return isToday(date);
  } catch (error) {
    console.error("Failed to check if exam is today:", error);
    return false;
  }
};

// Calculate days until a date
export const daysUntil = (dateString: string): number => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const targetDate = parse(dateString, "yyyy-MM-dd", new Date());
    targetDate.setHours(0, 0, 0, 0);
    
    const diffTime = targetDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch (error) {
    console.error("Failed to calculate days until:", error);
    return 0;
  }
};

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

// Get upcoming exams (limit to next N days)
export const getUpcomingExams = (exams: ExamInfo[], days: number = 14): ExamInfo[] => {
  return exams.filter(exam => {
    const daysToExam = daysUntil(exam.date);
    return daysToExam >= 0 && daysToExam <= days;
  }).sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
};

// Get color for difficulty
export const getDifficultyColor = (difficulty: QuestDifficulty): string => {
  switch (difficulty) {
    case "beginner":
      return "bg-green-500";
    case "intermediate":
      return "bg-blue-500";
    case "advanced":
      return "bg-purple-500";
    case "expert":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

// Calculate level progress percentage
export const calculateLevelProgress = (currentXP: number, nextLevelXP: number, previousLevelXP: number): number => {
  const progress = ((currentXP - previousLevelXP) / (nextLevelXP - previousLevelXP)) * 100;
  return Math.min(Math.max(progress, 0), 100);
};

// Format minutes to MM:SS
export const formatTime = (minutes: number): string => {
  const mins = Math.floor(minutes);
  const secs = Math.floor((minutes - mins) * 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
