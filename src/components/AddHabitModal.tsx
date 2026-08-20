import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import type { Habit, HabitColor, HabitFrequency } from '../types/habit';
import { HabitIcon } from './Icon';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHabit: (newHabit: Omit<Habit, 'id' | 'createdAt' | 'completedDates' | 'currentStreak' | 'longestStreak'>) => void;
}

const AVAILABLE_ICONS = ['Sparkles', 'Code2', 'BookOpen', 'Droplets', 'Dumbbell', 'Moon'];

const AVAILABLE_COLORS: { label: HabitColor; bgClass: string; ringClass: string }[] = [
  { label: 'emerald', bgClass: 'bg-emerald-500', ringClass: 'ring-emerald-400' },
  { label: 'blue', bgClass: 'bg-blue-500', ringClass: 'ring-blue-400' },
  { label: 'indigo', bgClass: 'bg-indigo-500', ringClass: 'ring-indigo-400' },
  { label: 'violet', bgClass: 'bg-violet-500', ringClass: 'ring-violet-400' },
  { label: 'amber', bgClass: 'bg-amber-500', ringClass: 'ring-amber-400' },
  { label: 'rose', bgClass: 'bg-rose-500', ringClass: 'ring-rose-400' },
];

export function AddHabitModal({ isOpen, onClose, onAddHabit }: AddHabitModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Sparkles');
  const [color, setColor] = useState<HabitColor>('indigo');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a habit name');
      return;
    }

    onAddHabit({
      title: title.trim(),
      description: description.trim() || undefined,
      icon,
      color,
      frequency,
    });

    // Reset local state & close
    setTitle('');
    setDescription('');
    setIcon('Sparkles');
    setColor('indigo');
    setFrequency('daily');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white">Create New Habit</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Habit Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Read 20 Pages"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Description (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Before going to bed"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Icon
            </label>
            <div className="grid grid-cols-6 gap-2">
              {AVAILABLE_ICONS.map((iconName) => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setIcon(iconName)}
                  className={`h-11 flex items-center justify-center rounded-xl border transition-all ${
                    icon === iconName
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 ring-2 ring-indigo-500/20'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <HabitIcon name={iconName} className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Color Accent
            </label>
            <div className="flex items-center gap-3">
              {AVAILABLE_COLORS.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => setColor(c.label)}
                  className={`w-7 h-7 rounded-full ${c.bgClass} transition-all ${
                    color === c.label ? `ring-4 ring-offset-2 ring-offset-slate-900 ${c.ringClass} scale-110` : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Frequency Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Frequency
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['daily', 'weekdays', 'weekends'] as HabitFrequency[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFrequency(f)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition-all ${
                    frequency === f
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
            >
              Create Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}