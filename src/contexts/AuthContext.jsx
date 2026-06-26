import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { DEMO_USER_ID, getDemoUser } from '../utils/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    const applyDemoSession = () => {
      const demoUser = getDemoUser();
      if (!demoUser) return false;

      setCurrentUser(demoUser);
      setQuizCompleted(localStorage.getItem(`ecotrace_quiz_completed_${DEMO_USER_ID}`) === 'true');
      setLoading(false);
      return true;
    };

    const handleDemoAuthChange = () => {
      if (!applyDemoSession()) {
        setCurrentUser(auth.currentUser);
        setQuizCompleted(false);
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (applyDemoSession()) return;

      if (user) {
        setCurrentUser(user);
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);
          setQuizCompleted(!!(docSnap.exists() && docSnap.data().quizCompleted));
        } catch (e) {
          console.error('Error fetching user data', e);
          setQuizCompleted(false);
        }
      } else {
        setCurrentUser(null);
        setQuizCompleted(false);
      }
      setLoading(false);
    });

    window.addEventListener('ecotrace-demo-auth-changed', handleDemoAuthChange);

    return () => {
      window.removeEventListener('ecotrace-demo-auth-changed', handleDemoAuthChange);
      unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    quizCompleted,
    setQuizCompleted,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
