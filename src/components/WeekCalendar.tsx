import { formatDateKey } from '../utils/streak';

interface WeekCalendarProps {
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  completionRateByDate?: Record<string, number>; // dateStr -> 0 to 100%
}

export function WeekCalendar({ selectedDate, onSelectDate, completionRateByDate = {} }: WeekCalendarProps) {
  // Generate the last 7 days (ending today)
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const todayKey = formatDateKey(new Date());

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 backdrop-blur-sm">
      <div className="grid grid-cols-7 gap-2">
        {days.map((date) => {
          const dateKey = formatDateKey(date);
          const isSelected = dateKey === selectedDate;
          const isToday = dateKey === todayKey;
          const completionPct = completionRateByDate[dateKey] ?? 0;

          const dayLetter = date.toLocaleDateString('en-US', { weekday: 'narrow' });
          const dayNumber = date.getDate();

          return (
            <button
              key={dateKey}
              onClick={() => onSelectDate(dateKey)}
              className={`flex flex-col items-center justify-between py-2.5 px-1 rounded-xl transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400'
                  : 'bg-slate-950/40 hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-800/60'
              }`}
            >
              {/* Day Name (M, T, W...) */}
              <span className={`text-[11px] font-semibold uppercase ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                {dayLetter}
              </span>

              {/* Day Number */}
              <span className={`text-base font-bold my-1 ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                {dayNumber}
              </span>

              {/* Status Dot / Indicator */}
              <div className="flex items-center justify-center h-2">
                {isToday && !isSelected ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                ) : completionPct === 100 ? (
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-400'}`} />
                ) : completionPct > 0 ? (
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-indigo-200' : 'bg-amber-400'}`} />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}