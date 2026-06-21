import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../hooks/useStorage';
import { useEmissions } from '../hooks/useEmissions';
import { useEcoScore } from '../hooks/useEcoScore';
import Dashboard from '../components/Dashboard';
import AICoach from '../components/AICoach';
import Challenges from '../components/Challenges';
import Progress from '../components/Progress';
import DailyLog from '../components/DailyLog';
import ProfileSettings from '../components/ProfileSettings';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { getQuizData } = useStorage();
  const { calculateEmissions } = useEmissions();
  const { calculateEcoScore } = useEcoScore();
  
  const [data, setData] = useState(null);

  const refreshData = () => {
    const answers = getQuizData();
    if (!answers) {
      navigate('/quiz');
      return;
    }
    
    const emissions = calculateEmissions(answers);
    const ecoScore = calculateEcoScore(emissions);
    
    setData({ answers, emissions, ecoScore });
  };

  useEffect(() => {
    refreshData();
  }, [navigate]);

  if (!data) return null;

  return (
    <div className="shell">
      <ProfileSettings onUpdate={refreshData} />
      
      <Dashboard 
        emissions={data.emissions} 
        ecoScore={data.ecoScore} 
        userName={data.answers.name} 
        city={data.answers.city} 
        state={data.answers.state} 
      />
      
      <div className="two-col">
        <AICoach 
          emissions={data.emissions} 
          ecoScore={data.ecoScore} 
          userName={data.answers.name} 
          city={data.answers.city} 
          state={data.answers.state} 
        />
        <Challenges />
      </div>

      <Progress />
      <DailyLog />

    </div>
  );
}
