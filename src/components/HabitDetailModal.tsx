import { X, Flame, Trophy, CalendarCheck, Clock } from 'lucide-react';
import type { Habit } from '../types/habit';
import { HabitIcon } from './Icon';
import { formatDateKey } from '../utils/streak';

interface HabitDetailModalProps {
  habit: Habit | null;
  onClose: () => void;
}

export function HabitDetailModal({ habit, onClose }: HabitDetailModalProps) {
  if (!habit) return null;

  // Generate last 28 days for mini completion grid (4 weeks x 7 days)
  const past28Days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - i));
    return formatDateKey(d);
  });

  const totalCompletions = habit.completedDates.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <HabitIcon name={habit.icon} className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">{habit.title}</h2>
              {habit.description && (
                <p className="text-xs text-slate-400 mt-0.5">{habit.description}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {/* Current Streak */}
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl text-center">
            <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-semibold mb-1">
              <Flame className="w-3.5 h-3.5" />
              <span>Current</span>
            </div>
            <p className="text-xl font-extrabold text-white">{habit.currentStreak}d</p>
          </div>

          {/* Longest Streak */}
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-semibold mb-1">
              <Trophy className="w-3.5 h-3.5" />
              <span>Best</span>
            </div>
            <p className="text-xl font-extrabold text-white">{habit.longestStreak}d</p>
          </div>

          {/* Total Done */}
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl text-center">
            <div className="flex items-center justify-center gap-1 text-indigo-400 text-xs font-semibold mb-1">
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Total</span>
            </div>
            <p className="text-xl font-extrabold text-white">{totalCompletions}</p>
          </div>
        </div>

        {/* 28-Day Consistency Mini-Heatmap */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              4-Week History
            </span>
            <span className="text-xs text-slate-500 font-medium">Last 28 Days</span>
          </div>
          <div className="grid grid-cols-7 gap-1.5 p-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
            {past28Days.map((dateStr) => {
              const isDone = habit.completedDates.includes(dateStr);
              return (
                <div
                  key={dateStr}
                  title={`${dateStr}: ${isDone ? 'Completed' : 'Not completed'}`}
                  className={`h-4 rounded-md transition-all ${
                    isDone
                      ? 'bg-emerald-500 shadow-sm shadow-emerald-500/30 ring-1 ring-emerald-400/50'
                      : 'bg-slate-800/60'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Frequency & Details */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>Frequency:</span>
            <span className="font-semibold text-slate-200 capitalize">{habit.frequency}</span>
          </div>
          <span>Created {habit.createdAt}</span>
        </div>
      </div>
    </div>
  );
}