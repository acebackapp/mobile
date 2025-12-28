/**
 * Flight path calculator for disc golf discs
 * Generates SVG bezier curve paths based on flight numbers
 */

export interface FlightNumbers {
  speed: number;
  glide: number;
  turn: number;
  fade: number;
}

export type ThrowType = 'rhbh' | 'rhfh' | 'lhbh' | 'lhfh';
export type ReleaseAngle = 'hyzer' | 'flat' | 'anhyzer';

export interface FlightPaths {
  hyzer: string;
  flat: string;
  anhyzer: string;
}

export interface CanvasConfig {
  width: number;
  height: number;
  startX: number;
  startY: number;
  maxDistance: number; // Scale of the graph in feet
}

// Default canvas dimensions
const DEFAULT_CONFIG: CanvasConfig = {
  width: 200,
  height: 300,
  startX: 100,
  startY: 280,
  maxDistance: 400,
};

/**
 * Calculate flight paths for all three release angles
 *
 * Throw equivalencies:
 * - RHBH = LHFH (standard path)
 * - RHFH = LHBH (mirrored path)
 */
export function calculateFlightPath(
  flightNumbers: FlightNumbers,
  throwType: ThrowType,
  config: CanvasConfig = DEFAULT_CONFIG
): FlightPaths {
  // Normalize throw type to determine if we need to mirror
  // RHBH and LHFH produce same paths
  // RHFH and LHBH produce same paths (mirrored from RHBH)
  const shouldMirror = throwType === 'rhfh' || throwType === 'lhbh';

  return {
    hyzer: generatePath(flightNumbers, 'hyzer', shouldMirror, config),
    flat: generatePath(flightNumbers, 'flat', shouldMirror, config),
    anhyzer: generatePath(flightNumbers, 'anhyzer', shouldMirror, config),
  };
}

/**
 * Generate an SVG path string for a specific release angle
 * Flight length is proportional to realistic distance based on speed
 */
function generatePath(
  flightNumbers: FlightNumbers,
  releaseAngle: ReleaseAngle,
  mirror: boolean,
  config: CanvasConfig
): string {
  const { speed, glide, turn, fade } = flightNumbers;
  const { startX, startY, maxDistance } = config;

  // Canvas scale is set by component based on disc type
  const availableHeight = startY - 20;
  const pixelsPerFoot = availableHeight / maxDistance;

  // Realistic distance based on speed (in feet)
  const baseDistance = 30 + speed * 28; // Speed 2 = ~86ft, Speed 12 = ~366ft
  const glideBonus = glide * 5; // Glide adds distance
  const estimatedDistance = Math.min(baseDistance + glideBonus, maxDistance);

  // Convert feet to pixels - flight fills most of the graph
  const flightLength = estimatedDistance * pixelsPerFoot;

  // Scale turn/fade effects relative to flight length
  const effectScale = flightLength / 250;

  // Calculate turn effect (negative turn = curves right for RHBH)
  let turnEffect = turn * 10 * effectScale;

  // Calculate fade effect (positive fade = hooks left for RHBH)
  let fadeEffect = fade * 15 * effectScale;

  // Adjust based on release angle
  switch (releaseAngle) {
    case 'hyzer':
      turnEffect *= 0.5;
      fadeEffect *= 1.4;
      break;
    case 'anhyzer':
      turnEffect *= 1.6;
      fadeEffect *= 0.6;
      break;
    case 'flat':
    default:
      break;
  }

  // Mirror for forehand throws
  if (mirror) {
    turnEffect = -turnEffect;
    fadeEffect = -fadeEffect;
  }

  // Glide affects the arc curvature
  const arcHeight = glide * 6 * effectScale;

  // End point (top of flight)
  const endY = startY - flightLength;
  const endX = startX - fadeEffect;

  // First control point - initial trajectory influenced by turn
  const cp1X = startX + turnEffect;
  const cp1Y = startY - flightLength * 0.4;

  // Second control point - apex of flight
  const cp2X = startX + turnEffect * 0.5 - fadeEffect * 0.3;
  const cp2Y = endY + arcHeight;

  // Build SVG path
  return `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
}
