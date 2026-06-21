import { INDIA_BENCHMARKS } from '../utils/emissionFactors';

export const useEcoScore = () => {
  const calculateEcoScore = (emissions) => {
    if (!emissions) return null;

    let score = 1000;
    
    // Deduct: (total_monthly_kg / INDIA_BENCHMARKS.national_avg_monthly) * 500
    const deduct = (emissions.total / INDIA_BENCHMARKS.national_avg_monthly) * 500;
    score -= deduct;

    // Bonus: for each category below India avg (approximated categories to 20% each of national avg for now)
    const catAvg = INDIA_BENCHMARKS.national_avg_monthly / 5;
    if (emissions.transport < catAvg) score += 50;
    if (emissions.food < catAvg) score += 50;
    if (emissions.energy < catAvg) score += 50;
    if (emissions.shopping < catAvg) score += 50;
    if (emissions.waste < catAvg) score += 50;

    score = Math.max(0, Math.min(1000, Math.round(score)));

    let grade = 'F';
    let level = 'Needs Work';
    let color = 'text-red-500';

    if (score >= 900) { grade = 'A+'; level = 'Eco Champion'; color = 'text-emerald-500'; }
    else if (score >= 800) { grade = 'A'; level = 'Green Hero'; color = 'text-emerald-400'; }
    else if (score >= 650) { grade = 'B'; level = 'Climate Aware'; color = 'text-green-400'; }
    else if (score >= 500) { grade = 'C'; level = 'Average'; color = 'text-yellow-400'; }
    else if (score >= 350) { grade = 'D'; level = 'Needs Work'; color = 'text-orange-400'; }

    let percentile = 0;
    if (score >= 800) percentile = 90;
    else if (score >= 600) percentile = 70;
    else if (score >= 400) percentile = 50;
    else percentile = 30;

    const diffToAvg = emissions.total - INDIA_BENCHMARKS.national_avg_monthly;
    const vs_india_avg = Math.round((diffToAvg / INDIA_BENCHMARKS.national_avg_monthly) * 100);

    const diffToParis = emissions.total - INDIA_BENCHMARKS.paris_target_monthly;
    const vs_paris_target = Math.round((diffToParis / INDIA_BENCHMARKS.paris_target_monthly) * 100);

    return {
      score,
      grade,
      percentile,
      vs_india_avg,
      vs_paris_target,
      level,
      color
    };
  };

  return { calculateEcoScore };
};
