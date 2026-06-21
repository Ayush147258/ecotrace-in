import { INDIA_FACTORS, INDIA_BENCHMARKS } from '../utils/emissionFactors';
import {
  mapTransportMode, mapDiet, mapWaste,
  parseFlights, parseEatingOut, parseLpg, parseAcHours,
  parseOrders, parseClothes, parseFoodWaste
} from '../utils/quizMapping';

export const useEmissions = () => {
  const calculateEmissions = (quizAnswers) => {
    if (!quizAnswers) {
      return { transport: 0, food: 0, energy: 0, shopping: 0, waste: 0, total: 0, money_saved_vs_avg: 0 };
    }

    let transport = 0;
    let food = 0;
    let energy = 0;
    let shopping = 0;
    let waste = 0;

    // Transport: km_per_day * 30 * emission_factor
    const tMode = mapTransportMode(quizAnswers.transportMode);
    const tFactor = INDIA_FACTORS.transport[tMode] ?? INDIA_FACTORS.transport.petrol_bike;
    const km = Number(quizAnswers.dailyKm) || 0;
    transport += km * 30 * tFactor;

    // EV modes emit ~40% of petrol equivalent
    if (quizAnswers.transportMode === 'ev_2w') transport *= 0.4;
    if (quizAnswers.transportMode === 'ev_car') transport *= 0.35;

    // Flights
    const flights = parseFlights(quizAnswers.flightsPerYear);
    transport += (flights * 1000 * INDIA_FACTORS.transport.domestic_flight) / 12;

    // Food: daily_factor * 30
    const diet = mapDiet(quizAnswers.diet);
    const dietFactor = INDIA_FACTORS.food[diet] ?? 0.5;
    food += dietFactor * 30;

    // Vegan bonus over pure veg
    if (quizAnswers.diet === 'vegan') food *= 0.85;

    // Eating out
    const eatingOutFreq = parseEatingOut(quizAnswers.eatingOut);
    food += eatingOutFreq * 4 * INDIA_FACTORS.food.eating_out_daily;

    // Food waste impact
    const foodWasteFactor = parseFoodWaste(quizAnswers.foodWaste);
    food += foodWasteFactor * 30;

    // Energy: LPG cylinders per year → monthly
    const lpgYearly = parseLpg(quizAnswers.lpgCylinders);
    energy += (lpgYearly / 12) * INDIA_FACTORS.energy.lpg_cylinder;

    const kwh = Number(quizAnswers.electricityUnits) || 0;
    energy += kwh * INDIA_FACTORS.energy.electricity_kwh;

    // AC usage adds to energy bill
    const acHours = parseAcHours(quizAnswers.acHours);
    energy += acHours * 30 * INDIA_FACTORS.energy.ac_hour;

    // Inverter adds ~50 kWh/month when in use
    if (quizAnswers.inverter === 'yes') {
      energy += 50 * INDIA_FACTORS.energy.inverter_kwh;
    }

    // Shopping
    const clothes = parseClothes(quizAnswers.newClothes);
    shopping += clothes * INDIA_FACTORS.shopping.clothing_item;

    const orders = parseOrders(quizAnswers.onlineOrders);
    shopping += orders * INDIA_FACTORS.shopping.online_order;

    // Waste
    const wasteType = mapWaste(quizAnswers.wasteManagement);
    const wasteFactor = INDIA_FACTORS.waste[wasteType] ?? 0.5;
    waste += 30 * wasteFactor;
    if (quizAnswers.wasteManagement === 'segregated') waste *= 0.75;

    const total = transport + food + energy + shopping + waste;

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
