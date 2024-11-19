import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './lib/firebase';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import { Dumbbell } from 'lucide-react';

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">
          <Dumbbell className="w-8 h-8 text-cyber-primary" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      {user ? <Dashboard user={user} /> : <AuthPage />}
    </>
  );
}

export default App;