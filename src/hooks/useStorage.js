import { getCurrentUser } from '../utils/auth';

// ------------------------------------------------------------------
// Core Storage Functions (User-Namespaced)
// ------------------------------------------------------------------

const getNamespacedKey = (userId, baseKey) => `${baseKey}_${userId}`;

export const saveQuizData = (userId, answers) => {
  try {
    localStorage.setItem(getNamespacedKey(userId, 'ecotrace_quiz'), JSON.stringify(answers));
    localStorage.setItem(getNamespacedKey(userId, 'ecotrace_quiz_completed'), 'true');
  } catch (e) {
    console.error('Storage quota exceeded or disabled.', e);
  }
};

export const getQuizData = (userId) => {
  try {
    const data = localStorage.getItem(getNamespacedKey(userId, 'ecotrace_quiz'));
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const updateQuizLocation = (userId, city, state) => {
  try {
    const data = getQuizData(userId);
    if (data) {
      data.city = city;
      data.state = state;
      localStorage.setItem(getNamespacedKey(userId, 'ecotrace_quiz'), JSON.stringify(data));
      return data;
    }
  } catch (e) {}
  return null;
};

export const isQuizCompleted = (userId) => {
  try {
    const completed = localStorage.getItem(getNamespacedKey(userId, 'ecotrace_quiz_completed'));
    return completed === 'true';
  } catch (e) {
    return false;
  }
};

export const saveMonthlyLog = (userId, monthKey, emissions, score) => {
  try {
    const history = getHistory(userId);
    history.push({ month: monthKey, emissions, score, date: new Date().toISOString() });
    
    // Keep it sorted oldest to newest just in case
    history.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    localStorage.setItem(getNamespacedKey(userId, 'ecotrace_history'), JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save monthly log', e);
  }
};

export const getHistory = (userId) => {
  try {
    const data = localStorage.getItem(getNamespacedKey(userId, 'ecotrace_history'));
    const parsed = data ? JSON.parse(data) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
};

export const saveDailyLog = (userId, dateKey, logData) => {
  try {
    localStorage.setItem(getNamespacedKey(userId, `ecotrace_daily_${dateKey}`), JSON.stringify(logData));
  } catch (e) {
    console.error('Failed to save daily log', e);
  }
};

export const getDailyLog = (userId, dateKey) => {
  try {
    const data = localStorage.getItem(getNamespacedKey(userId, `ecotrace_daily_${dateKey}`));
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const hasLoggedToday = (userId) => {
  const todayDateKey = new Date().toISOString().split('T')[0];
  return getDailyLog(userId, todayDateKey) !== null;
};

export const getCurrentWeekKey = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = (now - start + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60000)) / 86400000;
  const week = Math.ceil((diff + start.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${week}`;
};

export const saveChallengeCompletion = (userId, weekKey, challengeId) => {
  try {
    const completed = getCompletedChallenges(userId, weekKey);
    if (!completed.includes(challengeId)) {
      completed.push(challengeId);
      localStorage.setItem(getNamespacedKey(userId, `ecotrace_challenges_${weekKey}`), JSON.stringify(completed));
    }
  } catch (e) {
    console.error('Failed to save challenge', e);
  }
};

export const getCompletedChallenges = (userId, weekKey) => {
  try {
    const data = localStorage.getItem(getNamespacedKey(userId, `ecotrace_challenges_${weekKey}`));
    const parsed = data ? JSON.parse(data) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
};

export const saveStreak = (userId, streakData) => {
  try {
    localStorage.setItem(getNamespacedKey(userId, 'ecotrace_streak'), JSON.stringify(streakData));
  } catch (e) {
    console.error('Failed to save streak', e);
  }
};

export const getStreak = (userId) => {
  const defaultStreak = { current: 0, longest: 0, lastLogDate: null };
  try {
    const data = localStorage.getItem(getNamespacedKey(userId, 'ecotrace_streak'));
    if (!data) return defaultStreak;
    
    const parsed = JSON.parse(data);
    return {
      current: typeof parsed.current === 'number' ? parsed.current : 0,
      longest: typeof parsed.longest === 'number' ? parsed.longest : 0,
      lastLogDate: parsed.lastLogDate || null
    };
  } catch (e) {
    return defaultStreak;
  }
};

export const updateStreakOnLog = (userId) => {
  const streak = getStreak(userId);
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  if (!streak.lastLogDate) {
    // First time logging ever
    streak.current = 1;
    streak.longest = 1;
    streak.lastLogDate = todayStr;
  } else {
    // Check time diff
    const lastDate = new Date(streak.lastLogDate);
    // Reset hours to compare pure calendar days
    today.setHours(0, 0, 0, 0);
    lastDate.setHours(0, 0, 0, 0);
    
    const diffTime = Math.abs(today - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Already logged today, do nothing
    } else if (diffDays === 1) {
      // Logged yesterday, increment
      streak.current += 1;
      if (streak.current > streak.longest) {
        streak.longest = streak.current;
      }
      streak.lastLogDate = todayStr;
    } else {
      // Skipped a day or more, reset
      streak.current = 1;
      streak.lastLogDate = todayStr;
    }
  }
  
  saveStreak(userId, streak);
  return streak;
};

export const logout = () => {
  // Retained for backward compatibility with older components
  localStorage.removeItem('ecotrace_current_user');
};

// ------------------------------------------------------------------
// React Hook Wrapper (for easy imports in components)
// ------------------------------------------------------------------

export const useStorage = () => {
  const user = getCurrentUser();
  const userId = user ? user.id : 'guest';

  return {
    userId,
    saveQuizData: (answers) => saveQuizData(userId, answers),
    getQuizData: () => getQuizData(userId),
    updateQuizLocation: (city, state) => updateQuizLocation(userId, city, state),
    isQuizCompleted: () => isQuizCompleted(userId),
    saveMonthlyLog: (monthKey, emissions, score) => saveMonthlyLog(userId, monthKey, emissions, score),
    getHistory: () => getHistory(userId),
    saveDailyLog: (dateKey, logData) => saveDailyLog(userId, dateKey, logData),
    getDailyLog: (dateKey) => getDailyLog(userId, dateKey),
    hasLoggedToday: () => hasLoggedToday(userId),
    getCurrentWeekKey,
    saveChallengeCompletion: (weekKey, challengeId) => saveChallengeCompletion(userId, weekKey, challengeId),
    getCompletedChallenges: (weekKey) => getCompletedChallenges(userId, weekKey),
    saveStreak: (streakData) => saveStreak(userId, streakData),
    getStreak: () => getStreak(userId),
    updateStreakOnLog: () => updateStreakOnLog(userId),
    logout
  };
};
