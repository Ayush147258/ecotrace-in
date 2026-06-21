import { useCallback } from 'react';
import { calculateEmissions } from '../utils/calculateEmissions';

export { calculateEmissions };

export const useEmissions = () => {
  const memoizedCalculateEmissions = useCallback((logs) => {
    return calculateEmissions(logs);
  }, []);

  return { calculateEmissions: memoizedCalculateEmissions };
};
