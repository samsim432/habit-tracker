import { Check, Flame, Trash2 } from 'lucide-react';
import type { Habit } from '../types/habit';
import { HabitIcon } from './Icon';

interface HabitCardProps {
  habit: Habit;
  isCompletedToday: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: (habit: Habit) => void;
}

const colorStyles: Record<string, { bg: string; text: string; ring: string }> = {
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', ring: 'border-emerald-500/20' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', ring: 'border-blue-500/20' },
  indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', ring: 'border-indigo-500/20' },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', ring: 'border-violet-500/20' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', ring: 'border-amber-500/20' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', ring: 'border-rose-500/20' },
};

export function HabitCard({ habit, isCompletedToday, onToggle, onDelete, onClick }: HabitCardProps) {
  const theme = colorStyles[habit.color] || colorStyles.indigo;

  return (
    <div
      onClick={() => onClick(habit)}
      className={`group relative flex items-center justify-between p-4.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
        isCompletedToday
          ? 'bg-slate-800/40 border-slate-800/60 opacity-80'
          : 'bg-slate-800/90 border-slate-700/80 hover:border-slate-600 hover:shadow-lg hover:shadow-slate-950/20'
      }`}
    >
      <div className="flex items-center gap-4 min-w-0">
        {/* Habit Icon */}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 ${theme.bg} ${theme.text} ${theme.ring}`}>
          <HabitIcon name={habit.icon} className="w-5 h-5" />
        </div>

        {/* Details */}
        <div className="min-w-0">
          <h3 className={`text-base font-semibold truncate transition-colors ${
            isCompletedToday ? 'line-through text-slate-400' : 'text-slate-100'
          }`}>
            {habit.title}
          </h3>
          {habit.description && (
            <p className="text-xs text-slate-400 truncate mt-0.5 max-w-xs">
              {habit.description}
            </p>
          )}

          {/* Streak Indicator */}
          <div className="flex items-center gap-1 mt-1.5 text-xs text-amber-400 font-medium">
            <Flame className="w-3.5 h-3.5 fill-amber-400/20" />
            <span>{habit.currentStreak} day streak</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Delete Action */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm(`Delete "${habit.title}"?`)) {
              onDelete(habit.id);
            }
          }}
          title="Delete habit"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Complete Toggle Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(habit.id);
          }}
          aria-label={isCompletedToday ? 'Mark incomplete' : 'Mark complete'}
          className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-200 cursor-pointer ${
            isCompletedToday
              ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'border-slate-600 hover:border-slate-400 hover:bg-slate-700/50 text-transparent'
          }`}
        >
          <Check className={`w-5 h-5 stroke-[3] transition-transform duration-200 ${isCompletedToday ? 'scale-100' : 'scale-0'}`} />
        </button>
      </div>
    </div>
  );
}