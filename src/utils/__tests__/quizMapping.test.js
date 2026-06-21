import { describe, it, expect } from 'vitest';
import {
  parseFlights, parseEatingOut, parseLpg, parseAcHours,
  parseOrders, parseClothes, parseFoodWaste,
  mapTransportMode, mapDiet, mapWaste,
} from '../quizMapping';

describe('quizMapping', () => {
  it('maps transport modes to emission factor keys', () => {
    expect(mapTransportMode('walking')).toBe('walk_cycle');
    expect(mapTransportMode('bus')).toBe('bus_local');
    expect(mapTransportMode('petrol_2w')).toBe('petrol_bike');
    expect(mapTransportMode('unknown')).toBe('petrol_bike');
  });

  it('parses flight frequency strings without NaN', () => {
    expect(parseFlights('0')).toBe(0);
    expect(parseFlights('1-2')).toBe(1.5);
    expect(parseFlights('6+')).toBe(8);
    expect(parseFlights(undefined)).toBe(0);
  });

  it('parses eating out labels to numeric frequency', () => {
    expect(parseEatingOut('Rarely')).toBe(0.5);
    expect(parseEatingOut('Almost Daily')).toBe(6);
  });

  it('parses LPG cylinder ranges', () => {
    expect(parseLpg('PNG Piped Gas')).toBe(1.5);
    expect(parseLpg('4-6')).toBe(5);
  });

  it('parses shopping and waste quiz values', () => {
    expect(parseOrders('2-5')).toBe(3.5);
    expect(parseClothes('3-5 items')).toBe(4);
    expect(mapWaste('composted')).toBe('compost_kg');
    expect(mapDiet('veg_egg')).toBe('veg_with_egg');
    expect(parseAcHours('No AC')).toBe(0);
    expect(parseFoodWaste('High (Often throw away meals)')).toBe(1.0);
  });
});
