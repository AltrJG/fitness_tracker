import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export const useRoutine = () => {
  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchRoutine = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const weekStart = new Date();
        weekStart.setHours(0, 0, 0, 0);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());

        const routinesRef = collection(db, 'weeklyRoutines');
        const q = query(
          routinesRef,
          where('userId', '==', currentUser.uid),
          where('startDate', '<=', weekStart.toISOString()),
          orderBy('startDate', 'desc'),
          limit(1)
        );

        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setRoutine(querySnapshot.docs[0].data());
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchRoutine();
  }, [currentUser]);

  return { routine, loading, error };
};