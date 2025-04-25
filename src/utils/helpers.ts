
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric'
  });
};

export const daysUntil = (dateStr: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(dateStr);
  targetDate.setHours(0, 0, 0, 0);
  
  const differenceMs = targetDate.getTime() - today.getTime();
  return Math.floor(differenceMs / (1000 * 60 * 60 * 24));
};

export const getDifficultyColor = (difficulty: string): string => {
  switch(difficulty) {
    case 'beginner':
      return 'bg-green-500';
    case 'intermediate':
      return 'bg-blue-500';
    case 'advanced':
      return 'bg-purple-500';
    case 'expert':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

// Helper for formatting the subject name consistently
export const formatSubjectName = (id: string): string => {
  switch(id.toLowerCase()) {
    case "computerscience":
      return "Computer Science";
    default:
      return id.charAt(0).toUpperCase() + id.slice(1);
  }
};

// Format timezone for displaying dates correctly for local time
export const getLocalTimeString = (date: Date) => {
  // Use the browser's timezone
  return date.toLocaleString();
};
