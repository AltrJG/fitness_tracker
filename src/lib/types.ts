export interface Exercise {
  id: string;
  name: string;
  duration: number;
  weight: number;
  met: number;
  caloriesBurned: number;
}

export interface DailyRoutine {
  id: string;
  userId: string;
  date: string;
  exercises: Exercise[];
  totalCalories: number;
}

export interface WeeklyStats {
  totalCalories: number;
  exerciseDistribution: {
    exerciseName: string;
    calories: number;
  }[];
}