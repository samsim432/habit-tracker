import { useState, useMemo } from 'react';
import { Plus, Flame } from 'lucide-react';
import type { Habit } from './types/habit';
import { INITIAL_HABITS } from './data/mockData';
import { HabitCard } from './components/HabitCard';
import { ProgressCard } from './components/ProgressCard';
import { AddHabitModal } from './components/AddHabitModal';
import { HabitDetailModal } from './components/HabitDetailModal';
import { WeekCalendar } from './components/WeekCalendar';
import { useLocalStorage } from './hooks/useLocalStorage';
import { formatDateKey, calculateCurrentStreak, calculateLongestStreak } from './utils/streak';

type FilterOption = 'all' | 'pending' | 'completed';

export default function App() {
  const [habits, setHabits] = useLocalStorage<Habit[]>('habitflow_habits', INITIAL_HABITS);
  const [selectedDate, setSelectedDate] = useState<string>(() => formatDateKey(new Date()));
  const [filter, setFilter] = useState<FilterOption>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHabitForDetail, setSelectedHabitForDetail] = useState<Habit | null>(null);

  const todayStr = formatDateKey(new Date());
  const isViewingToday = selectedDate === todayStr;

  const handleToggleHabit = (habitId: string) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if (habit.id !== habitId) return habit;

        const isCompletedOnDate = habit.completedDates.includes(selectedDate);
        const nextCompletedDates = isCompletedOnDate
          ? habit.completedDates.filter((d) => d !== selectedDate)
          : [...habit.completedDates, selectedDate];

        const updatedCurrentStreak = calculateCurrentStreak(nextCompletedDates);
        const updatedLongestStreak = calculateLongestStreak(
          nextCompletedDates,
          updatedCurrentStreak,
          habit.longestStreak
        );

        return {
          ...habit,
          completedDates: nextCompletedDates,
          currentStreak: updatedCurrentStreak,
          longestStreak: updatedLongestStreak,
        };
      })
    );
  };

  const handleAddHabit = (
    newHabitData: Omit<Habit, 'id' | 'createdAt' | 'completedDates' | 'currentStreak' | 'longestStreak'>
  ) => {
    const newHabit: Habit = {
      ...newHabitData,
      id: crypto.randomUUID(),
      createdAt: todayStr,
      completedDates: [],
      currentStreak: 0,
      longestStreak: 0,
    };

    setHabits((prev) => [newHabit, ...prev]);
  };

  const handleDeleteHabit = (habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    if (selectedHabitForDetail?.id === habitId) {
      setSelectedHabitForDetail(null);
    }
  };

  const completionRateByDate = useMemo(() => {
    const rates: Record<string, number> = {};
    if (habits.length === 0) return rates;

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = formatDateKey(d);
      const doneCount = habits.filter((h) => h.completedDates.includes(key)).length;
      rates[key] = Math.round((doneCount / habits.length) * 100);
    }
    return rates;
  }, [habits]);

  const completedOnSelectedDateCount = habits.filter((h) =>
    h.completedDates.includes(selectedDate)
  ).length;

  const filteredHabits = habits.filter((habit) => {
    const isCompleted = habit.completedDates.includes(selectedDate);
    if (filter === 'pending') return !isCompleted;
    if (filter === 'completed') return isCompleted;
    return true;
  });

  const selectedDateLabel = useMemo(() => {
    const [year, month, day] = selectedDate.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);

    if (isViewingToday) return "Today's Habits";
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }, [selectedDate, isViewingToday]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white pb-16">
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
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all duration-200 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Habit</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Calendar Strip */}
        <WeekCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          completionRateByDate={completionRateByDate}
        />

        {/* Progress Card */}
        <ProgressCard total={habits.length} completed={completedOnSelectedDateCount} />

        {/* Header & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              {selectedDateLabel}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isViewingToday ? 'Keep up your daily flow' : `Viewing history for ${selectedDate}`}
            </p>
          </div>

          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl self-start sm:self-auto">
            {(['all', 'pending', 'completed'] as FilterOption[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                  filter === tab
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700/50'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Habit Card List */}
        {filteredHabits.length > 0 ? (
          <div className="grid gap-3">
            {filteredHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                isCompletedToday={habit.completedDates.includes(selectedDate)}
                onToggle={handleToggleHabit}
                onDelete={handleDeleteHabit}
                onClick={setSelectedHabitForDetail}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
            <p className="text-sm text-slate-400">No habits found for this filter or date.</p>
          </div>
        )}
      </main>

      {/* Creation Modal */}
      <AddHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddHabit={handleAddHabit}
      />

      {/* Detail & Analytics Modal */}
      <HabitDetailModal
        habit={selectedHabitForDetail}
        onClose={() => setSelectedHabitForDetail(null)}
      />
    </div>
  );
}