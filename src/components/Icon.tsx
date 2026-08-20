import {
  Code2,
  BookOpen,
  Droplets,
  Dumbbell,
  Moon,
  Sparkles,
  Flame,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Trophy,
  Calendar,
  BarChart3,
  type LucideProps,
} from 'lucide-react';
import React from 'react';

export const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  Code2,
  BookOpen,
  Droplets,
  Dumbbell,
  Moon,
  Sparkles,
  Flame,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Trophy,
  Calendar,
  BarChart3,
};

interface IconProps extends LucideProps {
  name: string;
}

export function HabitIcon({ name, ...props }: IconProps) {
  const Component = iconMap[name] || Sparkles;
  return <Component {...props} />;
}