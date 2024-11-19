import React, { useState, useEffect } from 'react';
import { Exercise, WeeklyRoutine } from '../types';
import { db } from '../lib/firebase';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { exercisesList, calculateCalories } from '../data/exercises';
import { Plus, Save, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface DailyRoutineEditorProps {
  userId: string;
  weeklyRoutine: WeeklyRoutine | null;
}

export default function DailyRoutineEditor({ userId, weeklyRoutine }: DailyRoutineEditorProps) {
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [weight, setWeight] = useState<number>(70);
  const [isEditing, setIsEditing] = useState(false);

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    if (selectedDay && weeklyRoutine?.routines[selectedDay.toLowerCase()]) {
      const dayRoutine = weeklyRoutine.routines[selectedDay.toLowerCase()];
      setExercises(dayRoutine.exercises);
      if (dayRoutine.exercises[0]?.weight) {
        setWeight(dayRoutine.exercises[0].weight);
      }
    } else {
      setExercises([]);
    }
  }, [selectedDay, weeklyRoutine]);

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: exercisesList[0].name,
      met: exercisesList[0].met,
      duration: 30,
      weight,
      calories: calculateCalories(weight, exercisesList[0].met, 30)
    };
    setExercises([...exercises, newExercise]);
    setIsEditing(true);
  };

  const updateExercise = (id: string, field: keyof Exercise, value: any) => {
    setExercises(exercises.map(ex => {
      if (ex.id === id) {
        const updated = { ...ex, [field]: value };
        if (field === 'name') {
          const exercise = exercisesList.find(e => e.name === value);
          if (exercise) {
            updated.met = exercise.met;
          }
        }
        updated.calories = calculateCalories(updated.weight, updated.met, updated.duration);
        return updated;
      }
      return ex;
    }));
    setIsEditing(true);
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id));
    setIsEditing(true);
  };

  const saveRoutine = async () => {
    if (!selectedDay) {
      toast.error('Please select a day');
      return;
    }

    try {
      const weekStart = new Date();
      weekStart.setHours(0, 0, 0, 0);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());

      const routineId = weeklyRoutine?.id || `${userId}-${weekStart.getTime()}`;
      const routineRef = doc(db, 'weeklyRoutines', routineId);

      const totalCalories = exercises.reduce((sum, ex) => sum + ex.calories, 0);
      const updatedRoutines = {
        ...(weeklyRoutine?.routines || {}),
        [selectedDay.toLowerCase()]: {
          id: `${routineId}-${selectedDay.toLowerCase()}`,
          date: new Date().toISOString(),
          exercises,
          totalCalories
        }
      };

      if (weeklyRoutine) {
        await updateDoc(routineRef, {
          routines: updatedRoutines
        });
      } else {
        await setDoc(routineRef, {
          id: routineId,
          userId,
          startDate: weekStart.toISOString(),
          routines: updatedRoutines
        });
      }

      setIsEditing(false);
      toast.success('Routine saved successfully');
    } catch (error) {
      console.error('Error saving routine:', error);
      toast.error('Failed to save routine');
    }
  };

  return (
    <div className="cyber-card">
      <h2 className="text-xl font-bold text-cyber-primary mb-6">Daily Routine Editor</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <select
          className="cyber-input"
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
        >
          <option value="">Select Day</option>
          {days.map(day => (
            <option key={day} value={day.toLowerCase()}>{day}</option>
          ))}
        </select>

        <input
          type="number"
          className="cyber-input"
          placeholder="Your weight (kg)"
          value={weight}
          onChange={(e) => {
            setWeight(Number(e.target.value));
            setIsEditing(true);
          }}
        />
      </div>

      {selectedDay && (
        <div className="space-y-4 mb-6">
          {exercises.map((exercise) => (
            <div key={exercise.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-2 border-cyber-primary/30 rounded-lg hover:border-cyber-primary transition-all duration-300">
              <select
                className="cyber-input"
                value={exercise.name}
                onChange={(e) => updateExercise(exercise.id, 'name', e.target.value)}
              >
                {exercisesList.map(ex => (
                  <option key={ex.name} value={ex.name}>{ex.name}</option>
                ))}
              </select>

              <input
                type="number"
                className="cyber-input"
                placeholder="Duration (minutes)"
                value={exercise.duration}
                onChange={(e) => updateExercise(exercise.id, 'duration', Number(e.target.value))}
              />

              <div className="flex items-center gap-2">
                <span className="text-cyber-secondary font-bold">{exercise.calories.toFixed(0)} kcal</span>
                <span className="text-cyber-light/50">MET: {exercise.met}</span>
              </div>

              <button
                onClick={() => removeExercise(exercise.id)}
                className="cyber-button bg-red-500/20 border-red-500 text-red-500 hover:bg-red-500/30"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {exercises.length === 0 && (
            <div className="text-center p-8 border-2 border-dashed border-cyber-primary/30 rounded-lg">
              <p className="text-cyber-light/50">No exercises added for {selectedDay}</p>
              <button onClick={addExercise} className="cyber-button mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add First Exercise
              </button>
            </div>
          )}
        </div>
      )}

      {selectedDay && (
        <div className="flex justify-between">
          {exercises.length > 0 && (
            <button onClick={addExercise} className="cyber-button flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Exercise
            </button>
          )}

          {isEditing && (
            <button 
              onClick={saveRoutine} 
              className="cyber-button flex items-center gap-2 bg-cyber-primary/10 hover:bg-cyber-primary/20"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          )}
        </div>
      )}
    </div>
  );
}