export const INDIA_FACTORS = {
  transport: {
    petrol_bike: 0.089, auto_rickshaw: 0.104, car_petrol: 0.171,
    car_cng: 0.096, metro: 0.012, bus_local: 0.027,
    train_intercity: 0.008, domestic_flight: 0.255, walk_cycle: 0
  },
  food: {
    pure_veg: 0.5, veg_with_egg: 0.8, nonveg_light: 1.2,
    nonveg_heavy: 2.5, eating_out_daily: 1.8
  },
  energy: {
    lpg_cylinder: 11.7,
    electricity_kwh: 0.82,  // India grid factor 2024 (CEA data)
    ac_hour: 0.82, inverter_kwh: 0.82
  },
  shopping: {
    clothing_item: 15.0, electronics_item: 70.0,
    online_order: 3.5, local_market: 1.2
  },
  waste: { landfill_kg: 0.5, compost_kg: 0.1 }
};

export const INDIA_BENCHMARKS = {
  national_avg_monthly: 216,  // kg CO2/month (2.6t/year)
  global_avg_monthly: 525,    // kg CO2/month (6.3t/year)
  paris_target_monthly: 167,  // kg CO2/month (2.0t/year)
};
