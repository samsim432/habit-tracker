import { useState } from 'react';
import { Plus, Flame } from 'lucide-react';
import type { Habit } from './types/habit';
import { INITIAL_HABITS } from './data/mockData';
import { HabitCard } from './components/HabitCard';
import { ProgressCard } from './components/ProgressCard';

const getTodayDateString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export default function App() {
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const todayStr = getTodayDateString();

  const handleToggleHabit = (habitId: string) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if (habit.id !== habitId) return habit;

        const isCompletedToday = habit.completedDates.includes(todayStr);

        if (isCompletedToday) {
          return {
            ...habit,
            completedDates: habit.completedDates.filter((d) => d !== todayStr),
            currentStreak: Math.max(0, habit.currentStreak - 1),
          };
        } else {
          const newStreak = habit.currentStreak + 1;
          return {
            ...habit,
            completedDates: [...habit.completedDates, todayStr],
            currentStreak: newStreak,
            longestStreak: Math.max(habit.longestStreak, newStreak),
          };
        }
      })
    );
  };

  const completedTodayCount = habits.filter((h) =>
    h.completedDates.includes(todayStr)
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-amber-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">HabitFlow</span>
          </div>

          <button
            onClick={() => alert('Modal coming in the next step!')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Habit</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <ProgressCard
          total={habits.length}
          completed={completedTodayCount}
        />

        <div className="flex items-center justify-between pt-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Today's Habits
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        <div className="grid gap-3">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              isCompletedToday={habit.completedDates.includes(todayStr)}
              onToggle={handleToggleHabit}
            />
          ))}
        </div>
      </main>
    </div>
  );
}