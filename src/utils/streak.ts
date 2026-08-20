// Helper to format Date to 'YYYY-MM-DD'
export const formatDateKey = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Calculate current streak (consecutive days leading up to today or yesterday)
export const calculateCurrentStreak = (completedDates: string[]): number => {
  if (!completedDates || completedDates.length === 0) return 0;

  const dateSet = new Set(completedDates);
  const now = new Date();
  
  let streak = 0;
  let checkDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const todayKey = formatDateKey(checkDate);
  const isCompletedToday = dateSet.has(todayKey);

  // If not completed today, start checking from yesterday
  if (!isCompletedToday) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Count backwards consecutively
  while (true) {
    const key = formatDateKey(checkDate);
    if (dateSet.has(key)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

// Calculate all-time longest streak
export const calculateLongestStreak = (currentStreak: number, existingLongest: number): number => {
  return Math.max(existingLongest, currentStreak);
};