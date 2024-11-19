import React from 'react';
import { WeeklyRoutine } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Activity, Flame } from 'lucide-react';

interface WeeklyStatsProps {
  routine: WeeklyRoutine | null;
}

export default function WeeklyStats({ routine }: WeeklyStatsProps) {
  const getExerciseStats = () => {
    if (!routine) return [];

    const stats = new Map<string, number>();
    Object.values(routine.routines).forEach(day => {
      day.exercises.forEach(exercise => {
        const current = stats.get(exercise.name) || 0;
        stats.set(exercise.name, current + exercise.calories);
      });
    });

    return Array.from(stats.entries()).map(([name, calories]) => ({
      name,
      calories,
    }));
  };

  const getTotalCalories = () => {
    if (!routine) return 0;
    return Object.values(routine.routines).reduce((total, day) => total + day.totalCalories, 0);
  };

  const data = getExerciseStats();
  const COLORS = ['#00fff5', '#ff00ff', '#7928ca', '#f72585', '#4cc9f0', '#7209b7', '#3a0ca3'];

  return (
    <div className="cyber-card">
      <h2 className="text-xl font-bold text-cyber-primary mb-6">Weekly Statistics</h2>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-cyber-secondary" />
          <span className="text-lg font-bold">{getTotalCalories().toFixed(0)} kcal</span>
        </div>
        <Activity className="w-5 h-5 text-cyber-primary" />
      </div>

      <div className="h-[300px] mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="calories"
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex justify-between items-center">
            <span className="text-sm" style={{ color: COLORS[index % COLORS.length] }}>
              {item.name}
            </span>
            <span className="font-bold">{item.calories.toFixed(0)} kcal</span>
          </div>
        ))}
      </div>
    </div>
  );
}