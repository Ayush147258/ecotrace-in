import { INDIA_BENCHMARKS } from '../utils/emissionFactors';

export const useEcoScore = () => {
  const calculateEcoScore = (emissions) => {
    if (!emissions || Number.isNaN(emissions.total)) return null;

    // Start generously — tracking your footprint is already a win
    let score = 820;

    // Gentler deduction curve vs national average
    const ratio = emissions.total / INDIA_BENCHMARKS.national_avg_monthly;
    score -= ratio * 280;

    // Bonus for each category below the per-category average
    const catAvg = INDIA_BENCHMARKS.national_avg_monthly / 5;
    const categories = ['transport', 'food', 'energy', 'shopping', 'waste'];
    categories.forEach((cat) => {
      if (emissions[cat] < catAvg) score += 40;
    });

    // Bonus for taking the quiz and starting the journey
    score += 60;

    // Floor ensures nobody feels demotivated on day one
    score = Math.max(420, Math.min(1000, Math.round(score)));

    let grade = 'C';
    let level = 'Room to Grow';
    let color = 'text-yellow-400';

    if (score >= 850) {
      grade = 'A+'; level = 'Eco Champion'; color = 'text-emerald-500';
    } else if (score >= 750) {
      grade = 'A'; level = 'Green Hero'; color = 'text-emerald-400';
    } else if (score >= 650) {
      grade = 'B+'; level = 'Rising Star'; color = 'text-green-400';
    } else if (score >= 550) {
      grade = 'B'; level = 'Climate Aware'; color = 'text-green-400';
    } else if (score >= 450) {
      grade = 'C+'; level = 'On the Right Track'; color = 'text-yellow-400';
    } else {
      grade = 'C'; level = 'Every Step Counts'; color = 'text-yellow-400';
    }

    let percentile = 40;
    if (score >= 800) percentile = 88;
    else if (score >= 700) percentile = 72;
    else if (score >= 550) percentile = 58;
    else if (score >= 450) percentile = 45;

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
