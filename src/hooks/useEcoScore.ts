import { useCallback } from 'react';
import { calculateEcoScore } from '../utils/calculateEcoScore';

export { calculateEcoScore };

export const useEcoScore = () => {
  const memoizedCalculateEcoScore = useCallback((kg) => {
    return calculateEcoScore(kg);
  }, []);

  return { calculateEcoScore: memoizedCalculateEcoScore };
};
