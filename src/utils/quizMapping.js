/** Maps quiz answer strings to numeric values and emission-factor keys. */

export const TRANSPORT_MODE_MAP = {
  walking: 'walk_cycle',
  metro: 'metro',
  bus: 'bus_local',
  ev_2w: 'petrol_bike',
  petrol_2w: 'petrol_bike',
  auto: 'auto_rickshaw',
  ev_car: 'car_cng',
  petrol_car: 'car_petrol',
};

export const DIET_MAP = {
  vegan: 'pure_veg',
  pure_veg: 'pure_veg',
  veg_egg: 'veg_with_egg',
  nonveg_light: 'nonveg_light',
  nonveg_heavy: 'nonveg_heavy',
};

export const WASTE_MAP = {
  mixed: 'landfill_kg',
  segregated: 'landfill_kg',
  composted: 'compost_kg',
};

const FLIGHTS_MAP = { '0': 0, '1-2': 1.5, '3-5': 4, '6+': 8 };
const EATING_OUT_MAP = { 'Rarely': 0.5, '1-2x a week': 1.5, '3-5x a week': 4, 'Almost Daily': 6 };
const LPG_MAP = { 'PNG Piped Gas': 1.5, '1-3': 2, '4-6': 5, '7-9': 8, '10+': 12 };
const AC_MAP = { 'No AC': 0, '1-3 hours': 2, '4-8 hours': 5, '8+ hours': 8 };
const ORDERS_MAP = { '0-1': 0.5, '2-5': 3.5, '6-10': 8, '10+': 12 };
const CLOTHES_MAP = { '0': 0, '1-2 items': 1.5, '3-5 items': 4, '6+ items': 8 };
const FOOD_WASTE_MAP = { 'Minimal (We repurpose leftovers)': 0.2, 'Average (Some scraps thrown)': 0.5, 'High (Often throw away meals)': 1.0 };

export function parseNumeric(value, map, fallback = 0) {
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  if (map && map[value] !== undefined) return map[value];
  const parsed = parseFloat(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export function mapTransportMode(mode) {
  return TRANSPORT_MODE_MAP[mode] || 'petrol_bike';
}

export function mapDiet(diet) {
  return DIET_MAP[diet] || 'pure_veg';
}

export function mapWaste(waste) {
  return WASTE_MAP[waste] || 'landfill_kg';
}

export function parseFlights(v) { return parseNumeric(v, FLIGHTS_MAP); }
export function parseEatingOut(v) { return parseNumeric(v, EATING_OUT_MAP); }
export function parseLpg(v) { return parseNumeric(v, LPG_MAP); }
export function parseAcHours(v) { return parseNumeric(v, AC_MAP); }
export function parseOrders(v) { return parseNumeric(v, ORDERS_MAP); }
export function parseClothes(v) { return parseNumeric(v, CLOTHES_MAP); }
export function parseFoodWaste(v) { return parseNumeric(v, FOOD_WASTE_MAP); }
