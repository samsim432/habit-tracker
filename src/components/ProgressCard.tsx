import { Sparkles, Trophy } from 'lucide-react';

interface ProgressCardProps {
  total: number;
  completed: number;
}

export function ProgressCard({ total, completed }: ProgressCardProps) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  const getMessage = () => {
    if (total === 0) return 'Add your first habit to get started!';
    if (percentage === 100) return 'All habits finished! Outstanding work! 🎉';
    if (percentage >= 50) return "You're over halfway there! Keep it going!";
    if (percentage > 0) return 'Good start! Build that momentum.';
    return 'Ready to crush your goals today?';
  };

  return (
    <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-indigo-900/60 via-slate-800/80 to-slate-900/90 border border-indigo-500/20 shadow-xl backdrop-blur-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            {percentage === 100 ? (
              <Trophy className="w-4 h-4 text-amber-400 animate-bounce" />
            ) : (
              <Sparkles className="w-4 h-4 text-indigo-400" />
            )}
            <span>Today's Focus</span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">
            {completed} of {total} completed
          </h2>
          <p className="text-xs text-slate-300 mt-1">{getMessage()}</p>
        </div>

        {/* Big Percentage Badge */}
        <div className="text-right">
          <span className="text-3xl font-extrabold text-white tracking-tight">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="mt-5">
        <div className="w-full h-2.5 bg-slate-950/60 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}