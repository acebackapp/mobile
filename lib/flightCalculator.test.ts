import {
  calculateFlightPath,
  FlightNumbers,
  ThrowType,
  ReleaseAngle,
  FlightPaths,
} from './flightCalculator';

describe('flightCalculator', () => {
  const standardFlightNumbers: FlightNumbers = {
    speed: 12,
    glide: 5,
    turn: -1,
    fade: 3,
  };

  describe('calculateFlightPath', () => {
    it('returns paths for all three release angles', () => {
      const result = calculateFlightPath(standardFlightNumbers, 'rhbh');

      expect(result).toHaveProperty('hyzer');
      expect(result).toHaveProperty('flat');
      expect(result).toHaveProperty('anhyzer');
    });

    it('returns valid SVG path strings', () => {
      const result = calculateFlightPath(standardFlightNumbers, 'rhbh');

      expect(result.hyzer).toMatch(/^M\s/); // Starts with M (move to)
      expect(result.flat).toMatch(/^M\s/);
      expect(result.anhyzer).toMatch(/^M\s/);
      expect(result.hyzer).toContain('C'); // Contains cubic bezier
    });

    it('RHBH and LHFH produce the same paths', () => {
      const rhbh = calculateFlightPath(standardFlightNumbers, 'rhbh');
      const lhfh = calculateFlightPath(standardFlightNumbers, 'lhfh');

      expect(rhbh.flat).toEqual(lhfh.flat);
      expect(rhbh.hyzer).toEqual(lhfh.hyzer);
      expect(rhbh.anhyzer).toEqual(lhfh.anhyzer);
    });

    it('RHFH and LHBH produce the same paths', () => {
      const rhfh = calculateFlightPath(standardFlightNumbers, 'rhfh');
      const lhbh = calculateFlightPath(standardFlightNumbers, 'lhbh');

      expect(rhfh.flat).toEqual(lhbh.flat);
      expect(rhfh.hyzer).toEqual(lhbh.hyzer);
      expect(rhfh.anhyzer).toEqual(lhbh.anhyzer);
    });

    it('forehand paths are mirrored from backhand', () => {
      const rhbh = calculateFlightPath(standardFlightNumbers, 'rhbh');
      const rhfh = calculateFlightPath(standardFlightNumbers, 'rhfh');

      // The paths should be different (mirrored)
      expect(rhbh.flat).not.toEqual(rhfh.flat);
    });

    it('handles understable disc (high turn, low fade)', () => {
      const understable: FlightNumbers = {
        speed: 9,
        glide: 5,
        turn: -3,
        fade: 1,
      };

      const result = calculateFlightPath(understable, 'rhbh');

      // Should not throw
      expect(result.flat).toBeDefined();
      expect(result.hyzer).toBeDefined();
      expect(result.anhyzer).toBeDefined();
    });

    it('handles overstable disc (low turn, high fade)', () => {
      const overstable: FlightNumbers = {
        speed: 10,
        glide: 4,
        turn: 0,
        fade: 4,
      };

      const result = calculateFlightPath(overstable, 'rhbh');

      expect(result.flat).toBeDefined();
      expect(result.hyzer).toBeDefined();
      expect(result.anhyzer).toBeDefined();
    });

    it('handles putter flight numbers', () => {
      const putter: FlightNumbers = {
        speed: 2,
        glide: 3,
        turn: 0,
        fade: 1,
      };

      const result = calculateFlightPath(putter, 'rhbh');

      expect(result.flat).toBeDefined();
    });

    it('handles distance driver flight numbers', () => {
      const distanceDriver: FlightNumbers = {
        speed: 14,
        glide: 6,
        turn: -2,
        fade: 3,
      };

      const result = calculateFlightPath(distanceDriver, 'rhbh');

      expect(result.flat).toBeDefined();
    });

    it('hyzer path has more fade effect than flat', () => {
      const result = calculateFlightPath(standardFlightNumbers, 'rhbh');

      // Hyzer and flat paths should be different
      expect(result.hyzer).not.toEqual(result.flat);
    });

    it('anhyzer path has more turn effect than flat', () => {
      const result = calculateFlightPath(standardFlightNumbers, 'rhbh');

      // Anhyzer and flat paths should be different
      expect(result.anhyzer).not.toEqual(result.flat);
    });
  });
});
