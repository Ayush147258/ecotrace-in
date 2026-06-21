import { INDIA_FACTORS, INDIA_BENCHMARKS } from '../utils/emissionFactors';

export const useEmissions = () => {
  const calculateEmissions = (quizAnswers) => {
    let transport = 0;
    let food = 0;
    let energy = 0;
    let shopping = 0;
    let waste = 0;

    // Transport: km_per_day * 30 * emission_factor
    const tMode = quizAnswers.transportMode || 'petrol_bike';
    const tFactor = INDIA_FACTORS.transport[tMode] || 0;
    const km = quizAnswers.dailyKm || 0;
    transport += km * 30 * tFactor;

    // Flights
    const flights = quizAnswers.flightsPerYear || 0;
    // rough estimate 1 flight = 1000km
    transport += (flights * 1000 * INDIA_FACTORS.transport.domestic_flight) / 12;

    // Food: daily_factor * 30
    const diet = quizAnswers.diet || 'pure_veg';
    const dietFactor = INDIA_FACTORS.food[diet] || 0.5;
    food += dietFactor * 30;

    // Eating out
    const eatingOutFreq = quizAnswers.eatingOut || 0; // times per week
    food += (eatingOutFreq * 4 * INDIA_FACTORS.food.eating_out_daily);

    // Energy: lpg_cylinders_month * 11.7 + electricity_units_month * 0.82
    const lpg = quizAnswers.lpgCylinders || 0;
    energy += lpg * INDIA_FACTORS.energy.lpg_cylinder;

    const kwh = quizAnswers.electricityUnits || 0;
    energy += kwh * INDIA_FACTORS.energy.electricity_kwh;

    // Shopping: items_per_month * factor
    const clothes = quizAnswers.newClothes || 0;
    shopping += clothes * INDIA_FACTORS.shopping.clothing_item;

    const orders = quizAnswers.onlineOrders || 0;
    shopping += orders * INDIA_FACTORS.shopping.online_order;

    // Waste
    const wasteType = quizAnswers.wasteManagement || 'landfill_kg';
    waste += 30 * (INDIA_FACTORS.waste[wasteType] || 0.5);

    const total = transport + food + energy + shopping + waste;
    
    // Money saved assuming ₹15/kg CO2 proxy
    const diff = INDIA_BENCHMARKS.national_avg_monthly - total;
    const money_saved_vs_avg = diff > 0 ? diff * 15 : 0;

    return {
      transport,
      food,
      energy,
      shopping,
      waste,
      total,
      money_saved_vs_avg
    };
  };

  return { calculateEmissions };
};
