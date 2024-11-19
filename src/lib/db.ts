import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc,
  deleteDoc,
  doc,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import type { DailyRoutine, Exercise } from './types';

export const saveRoutine = async (userId: string, routine: Omit<DailyRoutine, 'id'>) => {
  try {
    const routinesRef = collection(db, 'routines');
    const docRef = await addDoc(routinesRef, {
      ...routine,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving routine:', error);
    throw error;
  }
};

export const getWeeklyRoutines = async (userId: string) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const routinesRef = collection(db, 'routines');
    const q = query(
      routinesRef,
      where('userId', '==', userId),
      where('date', '>=', oneWeekAgo.toISOString())
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as DailyRoutine[];
  } catch (error) {
    console.error('Error fetching routines:', error);
    throw error;
  }
};

export const updateRoutine = async (routineId: string, updates: Partial<DailyRoutine>) => {
  try {
    const routineRef = doc(db, 'routines', routineId);
    await updateDoc(routineRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating routine:', error);
    throw error;
  }
};

export const deleteRoutine = async (routineId: string) => {
  try {
    const routineRef = doc(db, 'routines', routineId);
    await deleteDoc(routineRef);
  } catch (error) {
    console.error('Error deleting routine:', error);
    throw error;
  }
};