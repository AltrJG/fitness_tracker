import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { WeeklyRoutine } from '../types';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import WeeklyView from './WeeklyView';
import DailyRoutineEditor from './DailyRoutineEditor';
import WeeklyStats from './WeeklyStats';
import { LogOut } from 'lucide-react';
import { auth } from '../lib/firebase';
import { toast } from 'react-hot-toast';

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  const [currentWeek, setCurrentWeek] = useState<WeeklyRoutine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentWeek = async () => {
      try {
        const weekStart = new Date();
        weekStart.setHours(0, 0, 0, 0);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());

        const routinesRef = collection(db, 'weeklyRoutines');
        const q = query(
          routinesRef,
          where('userId', '==', user.uid),
          where('startDate', '<=', weekStart.toISOString()),
          orderBy('startDate', 'desc'),
          limit(1)
        );

        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setCurrentWeek(snapshot.docs[0].data() as WeeklyRoutine);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching routine:', error);
        toast.error('Failed to load your routines');
        setLoading(false);
      }
    };

    fetchCurrentWeek();
  }, [user.uid]);

  const handleSignOut = () => {
    auth.signOut();
    toast.success('Signed out successfully');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-cyber-dark p-4">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold cyber-gradient bg-clip-text text-transparent">
            Cyber Fitness Tracker
          </h1>
          <button onClick={handleSignOut} className="cyber-button flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WeeklyView routine={currentWeek} />
            <DailyRoutineEditor userId={user.uid} weeklyRoutine={currentWeek} />
          </div>
          <div>
            <WeeklyStats routine={currentWeek} />
          </div>
        </div>
      </div>
    </div>
  );
}