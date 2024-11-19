export interface Exercise {
  id: string;
  name: string;
  met: number;
  duration: number;
  weight: number;
  calories: number;
}

export interface DailyRoutine {
  id: string;
  date: string;
  exercises: Exercise[];
  totalCalories: number;
}

export interface WeeklyRoutine {
  id: string;
  userId: string;
  startDate: string;
  routines: {
    [key: string]: DailyRoutine;
  };
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
}