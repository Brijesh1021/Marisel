export interface CaseData {
  id: string;
  name: string;
  status: string;
  confidence: number;
  area: number; // km²
  estimatedAge: string;
  estimatedReleaseWindow: string;
  probableOrigin: {
    latRange: [number, number];
    lngRange: [number, number];
    centroid: [number, number];
    confidence: number;
  };
  centroid: [number, number];
  perimeter: number; // km
  length: number; // km
  maxWidth: number; // km
  orientation: number; // degrees
  aspectRatio: number;
  compactness: number;
  potentialVesselsCount: number;
  acquisitionDate: string;
  satellite: string;
  model: string;
}

export interface Vessel {
  id: string;
  name: string;
  imo: string;
  type: string;
  flag: string;
  length: number;
  speed: number; // knots
  heading: number; // degrees
  distanceFromOrigin: number; // km
  timeNearOrigin: string; // e.g., "42 min"
  aisQuality: 'High' | 'Medium' | 'Low';
  score: number; // 0 - 100
  priority: 'High Investigation Priority' | 'Medium Investigation Priority' | 'Lower Correlation';
  spatialMatch: number; // out of 25
  temporalMatch: number; // out of 25
  trajectoryMatch: number; // out of 20
  originMatch: number; // out of 15
  behaviourMatch: number; // out of 10
  aisQualityScore: number; // out of 5
  evidenceSummary: string;
  minDistance: number; // km
  originOverlapPct: number;
  vesselPresenceWindow: string;
  trajectoryIntersection: boolean;
  routeDeviationKm: number;
  positionCoveragePct: number;
  signalGaps: number;
  coordinates: [number, number][]; // Track path [lat, lng]
  currentPos: [number, number];
  timeSeriesData: { time: string; speed: number; gap?: boolean }[];
}

export interface DriftParticle {
  id: number;
  lat: number;
  lng: number;
  age: number; // hours
  intensity: number;
}

export interface ForecastZone {
  hours: number;
  center: [number, number];
  radiusKm: number;
  polygon: [number, number][];
  uncertaintyKm: number;
}

export interface GeometricTrendPoint {
  time: string;
  area: number;
  width: number;
  driftDistance: number;
}

export interface FalsePositiveFactor {
  category: string;
  percentage: number;
  color: string;
}
