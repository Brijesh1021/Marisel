import {
  CaseData,
  Vessel,
  DriftParticle,
  ForecastZone,
  GeometricTrendPoint,
  FalsePositiveFactor
} from '../types';

export const mockCase: CaseData = {
  id: "INC-2017-ENNORE",
  name: "Ennore Port Collision Spill",
  status: "Confirmed Heavy Fuel Oil Spill",
  confidence: 99,
  area: 63.4,
  estimatedAge: "8-12 hours",
  estimatedReleaseWindow: "27 Jan 2017, 22:00–22:45 UTC",
  probableOrigin: {
    latRange: [13.20, 13.25],
    lngRange: [80.34, 80.39],
    centroid: [13.228, 80.363],
    confidence: 96
  },
  centroid: [13.185, 80.335],
  perimeter: 48.2,
  length: 12.4,
  maxWidth: 5.1,
  orientation: 45,
  aspectRatio: 2.43,
  compactness: 0.54,
  potentialVesselsCount: 6,
  acquisitionDate: "28 Jan 2017 10:15 UTC",
  satellite: "Sentinel-1 SAR",
  model: "U-Net Semantic Segmentation"
};

// Spill Polygon Coordinates (Approximating spread south of Ennore towards Marina Beach)
export const spillPolygonCoordinates: [number, number][] = [
  [13.228, 80.363], // Origin near Kamarajar Port
  [13.205, 80.355],
  [13.155, 80.330],
  [13.110, 80.310],
  [13.060, 80.295], // Towards Marina Beach
  [13.080, 80.315],
  [13.130, 80.340],
  [13.180, 80.365],
  [13.210, 80.375],
];

// Probable Origin Region Polygon (Kamarajar Port Anchorage area)
export const originPolygonCoordinates: [number, number][] = [
  [13.25, 80.34],
  [13.25, 80.39],
  [13.20, 80.39],
  [13.20, 80.34],
];

// Detailed Vessels (Top Ranked are the actual vessels involved)
export const mockVessels: Vessel[] = [
  {
    id: "vessel-dawn",
    name: "MT Dawn Kanchipuram",
    imo: "IMO 9170585",
    type: "Crude/Chemical Tanker",
    flag: "India",
    length: 183,
    speed: 4.2,
    heading: 260,
    distanceFromOrigin: 0.5,
    timeNearOrigin: "145 min",
    aisQuality: "High",
    score: 98,
    priority: "Confirmed Involved",
    spatialMatch: 25,
    temporalMatch: 25,
    trajectoryMatch: 24,
    originMatch: 14,
    behaviourMatch: 10,
    aisQualityScore: 4,
    evidenceSummary: "Inbound tanker. AIS tracks place it exactly at the spill origin coordinates at 22:15 UTC. Abrupt halt and erratic drifting observed post-22:15.",
    minDistance: 0.1,
    originOverlapPct: 100,
    vesselPresenceWindow: "21:30–23:55 UTC",
    trajectoryIntersection: true,
    routeDeviationKm: 0.2,
    positionCoveragePct: 99,
    signalGaps: 0,
    currentPos: [13.228, 80.363],
    coordinates: [
      [13.180, 80.450],
      [13.200, 80.410],
      [13.228, 80.363], // Collision point
      [13.225, 80.360],
      [13.226, 80.361]
    ],
    timeSeriesData: [
      { time: "21:40", speed: 11.2 },
      { time: "21:50", speed: 9.5 },
      { time: "22:00", speed: 8.1 },
      { time: "22:10", speed: 7.4 },
      { time: "22:15", speed: 0.5, gap: true }, // Impact
      { time: "22:20", speed: 0.2 },
      { time: "22:30", speed: 0.1 },
      { time: "22:40", speed: 0.1 },
      { time: "22:50", speed: 0.0 }
    ]
  },
  {
    id: "vessel-bw",
    name: "BW Maple",
    imo: "IMO 9336737",
    type: "LPG Tanker",
    flag: "Isle of Man",
    length: 226,
    speed: 8.8,
    heading: 95,
    distanceFromOrigin: 0.8,
    timeNearOrigin: "42 min",
    aisQuality: "High",
    score: 94,
    priority: "Confirmed Involved",
    spatialMatch: 25,
    temporalMatch: 24,
    trajectoryMatch: 22,
    originMatch: 13,
    behaviourMatch: 10,
    aisQualityScore: 4,
    evidenceSummary: "Outbound LPG carrier. Crossed paths with MT Dawn Kanchipuram at the origin at exactly 22:15 UTC. Rapid deceleration followed by maneuvering observed.",
    minDistance: 0.1,
    originOverlapPct: 100,
    vesselPresenceWindow: "22:00–22:45 UTC",
    trajectoryIntersection: true,
    routeDeviationKm: 0.4,
    positionCoveragePct: 98,
    signalGaps: 0,
    currentPos: [13.235, 80.380],
    coordinates: [
      [13.250, 80.330],
      [13.240, 80.345],
      [13.228, 80.363], // Collision point
      [13.230, 80.370],
      [13.235, 80.380]
    ],
    timeSeriesData: [
      { time: "21:40", speed: 1.5 },
      { time: "21:50", speed: 4.2 },
      { time: "22:00", speed: 8.5 },
      { time: "22:10", speed: 10.4 },
      { time: "22:15", speed: 2.1, gap: true }, // Impact
      { time: "22:20", speed: 3.4 },
      { time: "22:30", speed: 1.5 },
      { time: "22:40", speed: 1.0 },
      { time: "22:50", speed: 1.2 }
    ]
  },
  {
    id: "vessel-c",
    name: "MV Chennai Express",
    imo: "IMO 9432810",
    type: "Container Ship",
    flag: "Panama",
    length: 310,
    speed: 16.5,
    heading: 10,
    distanceFromOrigin: 4.2,
    timeNearOrigin: "18 min",
    aisQuality: "High",
    score: 45,
    priority: "Low Investigation Priority",
    spatialMatch: 12,
    temporalMatch: 14,
    trajectoryMatch: 8,
    originMatch: 6,
    behaviourMatch: 5,
    aisQualityScore: 4,
    evidenceSummary: "Bypassed the port anchorage zone to the east during the incident window. Consistent speed, no erratic maneuvers.",
    minDistance: 4.2,
    originOverlapPct: 12,
    vesselPresenceWindow: "21:50–22:10 UTC",
    trajectoryIntersection: false,
    routeDeviationKm: 0.1,
    positionCoveragePct: 99,
    signalGaps: 0,
    currentPos: [13.400, 80.450],
    coordinates: [
      [13.100, 80.380],
      [13.150, 80.395],
      [13.220, 80.410],
      [13.300, 80.425]
    ],
    timeSeriesData: [
      { time: "21:40", speed: 16.4 },
      { time: "21:50", speed: 16.5 },
      { time: "22:00", speed: 16.5 },
      { time: "22:10", speed: 16.6 },
      { time: "22:20", speed: 16.5 },
      { time: "22:30", speed: 16.4 },
      { time: "22:40", speed: 16.5 },
      { time: "22:50", speed: 16.6 }
    ]
  },
  {
    id: "vessel-d",
    name: "Oceanic Fisher",
    imo: "IMO 8934721",
    type: "Fishing Vessel",
    flag: "India",
    length: 45,
    speed: 3.2,
    heading: 210,
    distanceFromOrigin: 2.1,
    timeNearOrigin: "180 min",
    aisQuality: "Medium",
    score: 31,
    priority: "Low Correlation",
    spatialMatch: 15,
    temporalMatch: 10,
    trajectoryMatch: 3,
    originMatch: 3,
    behaviourMatch: 0,
    aisQualityScore: 2,
    evidenceSummary: "Operating in coastal waters. High temporal overlap but tracks do not align with the deep-water spill origin. Capacity too small for spill volume.",
    minDistance: 2.1,
    originOverlapPct: 4,
    vesselPresenceWindow: "18:00–00:00 UTC",
    trajectoryIntersection: false,
    routeDeviationKm: 1.5,
    positionCoveragePct: 72,
    signalGaps: 3,
    currentPos: [13.200, 80.330],
    coordinates: [
      [13.250, 80.310],
      [13.230, 80.320],
      [13.200, 80.330]
    ],
    timeSeriesData: [
      { time: "21:40", speed: 3.1 },
      { time: "21:50", speed: 3.2 },
      { time: "22:00", speed: 3.3 },
      { time: "22:10", speed: 3.0 },
      { time: "22:20", speed: 3.1 },
      { time: "22:30", speed: 2.8 },
      { time: "22:40", speed: 3.0 },
      { time: "22:50", speed: 3.2 }
    ]
  }
];

export const mockAllAISVessels = [
  ...mockVessels,
  { id: "v-05", name: "Coromandel Trader", imo: "IMO 9182741", type: "Cargo", flag: "India", length: 140, speed: 12.1, heading: 180, distanceFromOrigin: 16.2, timeNearOrigin: "0 min", aisQuality: "High", score: 15, priority: "Lower Correlation", spatialMatch: 8, temporalMatch: 2, trajectoryMatch: 1, originMatch: 2, behaviourMatch: 2, aisQualityScore: 4, evidenceSummary: "", minDistance: 16.2, originOverlapPct: 0, vesselPresenceWindow: "None", trajectoryIntersection: false, routeDeviationKm: 0, positionCoveragePct: 95, signalGaps: 1, currentPos: [13.10, 80.50], coordinates: [], timeSeriesData: [] },
  { id: "v-06", name: "Gulf Express II", imo: "IMO 9502914", type: "Tanker", flag: "Liberia", length: 250, speed: 14.2, heading: 10, distanceFromOrigin: 18.5, timeNearOrigin: "0 min", aisQuality: "High", score: 12, priority: "Lower Correlation", spatialMatch: 7, temporalMatch: 1, trajectoryMatch: 1, originMatch: 1, behaviourMatch: 2, aisQualityScore: 4, evidenceSummary: "", minDistance: 18.5, originOverlapPct: 0, vesselPresenceWindow: "None", trajectoryIntersection: false, routeDeviationKm: 0, positionCoveragePct: 97, signalGaps: 0, currentPos: [13.45, 80.55], coordinates: [], timeSeriesData: [] }
] as Vessel[];

// Backward Drift Particles
export const mockDriftParticles: DriftParticle[] = Array.from({ length: 60 }, (_, i) => {
  const angle = (i / 60) * Math.PI * 2;
  const spread = (i % 5) * 0.008;
  return {
    id: i,
    lat: 13.185 + Math.sin(angle) * spread + (i / 60) * 0.04, // Drifting back north toward collision point
    lng: 80.335 + Math.cos(angle) * spread + (i / 60) * 0.02,
    age: Math.floor(i / 5),
    intensity: 0.4 + (i % 3) * 0.2
  };
});

// Forward Forecast Zones (Southward drift along Chennai coast)
export const mockForecastZones: ForecastZone[] = [
  {
    hours: 6,
    center: [13.140, 80.320],
    radiusKm: 5.2,
    uncertaintyKm: 2.1,
    polygon: [
      [13.160, 80.300],
      [13.165, 80.340],
      [13.120, 80.335],
      [13.115, 80.295]
    ]
  },
  {
    hours: 12,
    center: [13.090, 80.305],
    radiusKm: 8.8,
    uncertaintyKm: 3.4,
    polygon: [
      [13.120, 80.280],
      [13.125, 80.330],
      [13.060, 80.325],
      [13.055, 80.275]
    ]
  },
  {
    hours: 24,
    center: [13.020, 80.280],
    radiusKm: 15.5,
    uncertaintyKm: 5.2,
    polygon: [
      [13.060, 80.250],
      [13.070, 80.315],
      [12.970, 80.305],
      [12.960, 80.240]
    ]
  }
];

// Geometric Recharts Trend Data
export const mockGeometricTrends: GeometricTrendPoint[] = [
  { time: "22:15 (Impact)", area: 0.0, width: 0.0, driftDistance: 0.0 },
  { time: "00:00", area: 8.5, width: 1.4, driftDistance: 1.8 },
  { time: "03:00", area: 24.1, width: 2.8, driftDistance: 5.2 },
  { time: "06:00", area: 42.4, width: 4.1, driftDistance: 10.8 },
  { time: "09:00", area: 55.0, width: 4.8, driftDistance: 15.4 },
  { time: "10:15 (Acq)", area: 63.4, width: 5.1, driftDistance: 18.6 }
];

export const mockFalsePositives: FalsePositiveFactor[] = [
  { category: "Heavy Fuel Oil (HFO)", percentage: 99, color: "#06b6d4" },
  { category: "Ship Wake", percentage: 0, color: "#3b82f6" },
  { category: "Low Wind Area", percentage: 0, color: "#64748b" },
  { category: "Biogenic Look-alike", percentage: 1, color: "#475569" }
];

export const mockSpillTimeline = [
  { time: "27 Jan 2017, 22:15 UTC", label: "Confirmed Collision Time", detail: "MT Dawn Kanchipuram & BW Maple collide", status: "start" },
  { time: "28 Jan 2017, 02:00 UTC", label: "First Oil Slick Sighting", detail: "Daylight reveals heavy fuel oil leakage", status: "peak" },
  { time: "28 Jan 2017, 06:00 UTC", label: "Coastal Impact Begins", detail: "Slick approaches Ernavoor coastline", status: "end" },
  { time: "28 Jan 2017, 10:15 UTC", label: "Satellite Image Acquisition", detail: "Sentinel-1 SAR C-band radar image captured", status: "acq" }
];
