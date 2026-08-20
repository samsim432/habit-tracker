export type HabitFrequency = 'daily' | 'weekdays' | 'weekends';

export type HabitColor = 'emerald' | 'blue' | 'indigo' | 'violet' | 'amber' | 'rose';

export type Habit = {
  id: string;
  title: string;
  description?: string;
  icon: string;
  color: HabitColor;
  frequency: HabitFrequency;
  createdAt: string;
  completedDates: string[];
  currentStreak: number;
  longestStreak: number;
};