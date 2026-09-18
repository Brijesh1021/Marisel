import {
  CaseData,
  Vessel,
  DriftParticle,
  ForecastZone,
  GeometricTrendPoint,
  FalsePositiveFactor
} from '../types';

export const mockCase: CaseData = {
  id: "OS-2026-001",
  name: "Chennai Offshore Slick Alpha",
  status: "Suspected Oil Slick",
  confidence: 94,
  area: 23.7,
  estimatedAge: "7–11 hours",
  estimatedReleaseWindow: "09:00–11:30 UTC",
  probableOrigin: {
    latRange: [13.37, 13.44],
    lngRange: [80.10, 80.18],
    centroid: [13.405, 80.14],
    confidence: 82
  },
  centroid: [13.405, 80.145],
  perimeter: 31.4,
  length: 8.6,
  maxWidth: 3.9,
  orientation: 72,
  aspectRatio: 2.21,
  compactness: 0.61,
  potentialVesselsCount: 5,
  acquisitionDate: "18 Sep 2026 14:20 UTC",
  satellite: "Sentinel-1 SAR",
  model: "U-Net Segmentation v4.2"
};

// Spill Polygon Coordinates (Bay of Bengal / Offshore Chennai)
export const spillPolygonCoordinates: [number, number][] = [
  [13.428, 80.125],
  [13.435, 80.142],
  [13.418, 80.168],
  [13.395, 80.175],
  [13.382, 80.155],
  [13.388, 80.132],
  [13.408, 80.120],
];

// Probable Origin Region Polygon
export const originPolygonCoordinates: [number, number][] = [
  [13.44, 80.10],
  [13.44, 80.18],
  [13.37, 80.18],
  [13.37, 80.10],
];

// Detailed Vessels (Top 5 Ranked)
export const mockVessels: Vessel[] = [
  {
    id: "vessel-a",
    name: "Vessel A (MV Ocean Vanguard)",
    imo: "IMO 9384721",
    type: "Crude Oil Tanker",
    flag: "Liberia",
    length: 274,
    speed: 11.4,
    heading: 274,
    distanceFromOrigin: 3.2,
    timeNearOrigin: "42 min",
    aisQuality: "High",
    score: 91,
    priority: "High Investigation Priority",
    spatialMatch: 25,
    temporalMatch: 23,
    trajectoryMatch: 18,
    originMatch: 13,
    behaviourMatch: 8,
    aisQualityScore: 4,
    evidenceSummary: "Vessel A was within the probable origin region during much of the estimated release window and its reconstructed trajectory intersects the origin uncertainty zone.",
    minDistance: 3.2,
    originOverlapPct: 87,
    vesselPresenceWindow: "09:14–10:02 UTC",
    trajectoryIntersection: true,
    routeDeviationKm: 2.4,
    positionCoveragePct: 98,
    signalGaps: 2,
    currentPos: [13.390, 80.080],
    coordinates: [
      [13.480, 80.260],
      [13.445, 80.200],
      [13.415, 80.140], // Near origin at ~09:30
      [13.390, 80.080],
      [13.360, 80.020]
    ]
  },
  {
    id: "vessel-b",
    name: "Vessel B (MT Star Poseidon)",
    imo: "IMO 9410938",
    type: "Chemical Tanker",
    flag: "Panama",
    length: 182,
    speed: 13.8,
    heading: 195,
    distanceFromOrigin: 5.8,
    timeNearOrigin: "31 min",
    aisQuality: "High",
    score: 84,
    priority: "High Investigation Priority",
    spatialMatch: 22,
    temporalMatch: 22,
    trajectoryMatch: 17,
    originMatch: 12,
    behaviourMatch: 7,
    aisQualityScore: 4,
    evidenceSummary: "Vessel B crossed the peripheral boundaries of the estimated origin zone during the mid-window (09:45 UTC) with minor course variance.",
    minDistance: 5.8,
    originOverlapPct: 64,
    vesselPresenceWindow: "09:30–10:01 UTC",
    trajectoryIntersection: true,
    routeDeviationKm: 3.8,
    positionCoveragePct: 96,
    signalGaps: 1,
    currentPos: [13.310, 80.120],
    coordinates: [
      [13.520, 80.170],
      [13.460, 80.160],
      [13.400, 80.150],
      [13.310, 80.120],
      [13.240, 80.100]
    ]
  },
  {
    id: "vessel-c",
    name: "Vessel C (Container Carrier Orion)",
    imo: "IMO 9328472",
    type: "Container Ship",
    flag: "Marshall Islands",
    length: 334,
    speed: 18.2,
    heading: 45,
    distanceFromOrigin: 8.4,
    timeNearOrigin: "25 min",
    aisQuality: "Medium",
    score: 78,
    priority: "Medium Investigation Priority",
    spatialMatch: 19,
    temporalMatch: 20,
    trajectoryMatch: 16,
    originMatch: 11,
    behaviourMatch: 9,
    aisQualityScore: 3,
    evidenceSummary: "Vessel C passed within 8.4 km of the origin near the early release boundary. High speed reduces transit dwell time.",
    minDistance: 8.4,
    originOverlapPct: 41,
    vesselPresenceWindow: "09:05–09:30 UTC",
    trajectoryIntersection: false,
    routeDeviationKm: 1.1,
    positionCoveragePct: 88,
    signalGaps: 4,
    currentPos: [13.490, 80.240],
    coordinates: [
      [13.320, 80.050],
      [13.390, 80.120],
      [13.440, 80.180],
      [13.490, 80.240]
    ]
  },
  {
    id: "vessel-d",
    name: "Vessel D (Bulk Merchant Sentinel)",
    imo: "IMO 9291034",
    type: "Bulk Carrier",
    flag: "Singapore",
    length: 229,
    speed: 9.6,
    heading: 310,
    distanceFromOrigin: 11.2,
    timeNearOrigin: "18 min",
    aisQuality: "High",
    score: 71,
    priority: "Medium Investigation Priority",
    spatialMatch: 16,
    temporalMatch: 18,
    trajectoryMatch: 15,
    originMatch: 10,
    behaviourMatch: 8,
    aisQualityScore: 4,
    evidenceSummary: "Vessel D transited south-to-north outside the immediate 10km threshold. Moderate temporal overlap.",
    minDistance: 11.2,
    originOverlapPct: 22,
    vesselPresenceWindow: "10:10–10:28 UTC",
    trajectoryIntersection: false,
    routeDeviationKm: 0.8,
    positionCoveragePct: 99,
    signalGaps: 0,
    currentPos: [13.450, 80.040],
    coordinates: [
      [13.280, 80.190],
      [13.360, 80.120],
      [13.450, 80.040]
    ]
  },
  {
    id: "vessel-e",
    name: "Vessel E (Offshore Supply Triton)",
    imo: "IMO 9642819",
    type: "Offshore Supply",
    flag: "India",
    length: 88,
    speed: 8.1,
    heading: 120,
    distanceFromOrigin: 14.6,
    timeNearOrigin: "12 min",
    aisQuality: "Medium",
    score: 64,
    priority: "Lower Correlation",
    spatialMatch: 13,
    temporalMatch: 17,
    trajectoryMatch: 14,
    originMatch: 9,
    behaviourMatch: 8,
    aisQualityScore: 3,
    evidenceSummary: "Vessel E operated at low speed outside the primary origin cone. Low correlation score.",
    minDistance: 14.6,
    originOverlapPct: 12,
    vesselPresenceWindow: "11:00–11:12 UTC",
    trajectoryIntersection: false,
    routeDeviationKm: 5.2,
    positionCoveragePct: 84,
    signalGaps: 5,
    currentPos: [13.290, 80.280],
    coordinates: [
      [13.380, 80.180],
      [13.340, 80.230],
      [13.290, 80.280]
    ]
  }
];

// Additional mock candidate vessels (for table filtering demonstrations)
export const mockAllAISVessels = [
  ...mockVessels,
  { id: "v-06", name: "Coromandel Trader", imo: "IMO 9182741", type: "Cargo", flag: "India", length: 140, speed: 12.1, heading: 180, distanceFromOrigin: 16.2, timeNearOrigin: "0 min", aisQuality: "High", score: 45, priority: "Lower Correlation", spatialMatch: 8, temporalMatch: 12, trajectoryMatch: 10, originMatch: 5, behaviourMatch: 6, aisQualityScore: 4, evidenceSummary: "", minDistance: 16.2, originOverlapPct: 0, vesselPresenceWindow: "None", trajectoryIntersection: false, routeDeviationKm: 0, positionCoveragePct: 95, signalGaps: 1, currentPos: [13.20, 80.30], coordinates: [] },
  { id: "v-07", name: "Gulf Express II", imo: "IMO 9502914", type: "Tanker", flag: "Liberia", length: 250, speed: 14.2, heading: 10, distanceFromOrigin: 18.5, timeNearOrigin: "0 min", aisQuality: "High", score: 42, priority: "Lower Correlation", spatialMatch: 7, temporalMatch: 10, trajectoryMatch: 9, originMatch: 6, behaviourMatch: 6, aisQualityScore: 4, evidenceSummary: "", minDistance: 18.5, originOverlapPct: 0, vesselPresenceWindow: "None", trajectoryIntersection: false, routeDeviationKm: 0, positionCoveragePct: 97, signalGaps: 0, currentPos: [13.55, 80.35], coordinates: [] },
  { id: "v-08", name: "Bay Pride", imo: "IMO 9310827", type: "Tugboat", flag: "India", length: 45, speed: 7.0, heading: 260, distanceFromOrigin: 22.1, timeNearOrigin: "0 min", aisQuality: "Medium", score: 38, priority: "Lower Correlation", spatialMatch: 5, temporalMatch: 8, trajectoryMatch: 8, originMatch: 4, behaviourMatch: 5, aisQualityScore: 3, evidenceSummary: "", minDistance: 22.1, originOverlapPct: 0, vesselPresenceWindow: "None", trajectoryIntersection: false, routeDeviationKm: 0, positionCoveragePct: 82, signalGaps: 3, currentPos: [13.15, 80.20], coordinates: [] }
] as Vessel[];

// Backward Drift Particles (5,000 particles simulated as representative clusters)
export const mockDriftParticles: DriftParticle[] = Array.from({ length: 60 }, (_, i) => {
  const angle = (i / 60) * Math.PI * 2;
  const spread = (i % 5) * 0.008;
  // Drift from present centroid [13.405, 80.145] back toward origin centroid [13.405, 80.140]
  return {
    id: i,
    lat: 13.405 + Math.sin(angle) * spread - (i / 60) * 0.01,
    lng: 80.145 + Math.cos(angle) * spread - (i / 60) * 0.012,
    age: Math.floor(i / 5),
    intensity: 0.4 + (i % 3) * 0.2
  };
});

// Forward Forecast Zones
export const mockForecastZones: ForecastZone[] = [
  {
    hours: 6,
    center: [13.418, 80.165],
    radiusKm: 4.2,
    uncertaintyKm: 2.1,
    polygon: [
      [13.440, 80.145],
      [13.448, 80.170],
      [13.425, 80.190],
      [13.400, 80.180],
      [13.395, 80.150]
    ]
  },
  {
    hours: 12,
    center: [13.435, 80.195],
    radiusKm: 7.8,
    uncertaintyKm: 3.4,
    polygon: [
      [13.470, 80.160],
      [13.485, 80.215],
      [13.440, 80.240],
      [13.390, 80.220],
      [13.385, 80.170]
    ]
  },
  {
    hours: 24,
    center: [13.470, 80.250],
    radiusKm: 13.5,
    uncertaintyKm: 5.2,
    polygon: [
      [13.520, 80.190],
      [13.545, 80.290],
      [13.470, 80.330],
      [13.380, 80.300],
      [13.370, 80.210]
    ]
  }
];

// Geometric Recharts Trend Data
export const mockGeometricTrends: GeometricTrendPoint[] = [
  { time: "09:00 (Est)", area: 4.2, width: 0.8, driftDistance: 0.0 },
  { time: "10:00", area: 8.5, width: 1.4, driftDistance: 1.8 },
  { time: "11:00", area: 13.1, width: 2.1, driftDistance: 3.9 },
  { time: "12:00", area: 17.4, width: 2.9, driftDistance: 5.8 },
  { time: "13:00", area: 21.0, width: 3.5, driftDistance: 7.4 },
  { time: "14:20 (Acq)", area: 23.7, width: 3.9, driftDistance: 8.6 }
];

// False Positive Factors
export const mockFalsePositives: FalsePositiveFactor[] = [
  { category: "Oil Slick (Suspected)", percentage: 94, color: "#06b6d4" },
  { category: "Ship Wake", percentage: 2, color: "#3b82f6" },
  { category: "Low Wind Area", percentage: 1, color: "#64748b" },
  { category: "Biogenic Look-alike / Other", percentage: 3, color: "#475569" }
];

// Timeline Events for Spill Age Section
export const mockSpillTimeline = [
  { time: "09:00 UTC", label: "Earliest Estimated Release Window", detail: "Atmospheric & hydrodynamic hindcast start", status: "start" },
  { time: "10:15 UTC", label: "Peak Probable Release", detail: "High spatial-temporal density of candidate vessel tracks", status: "peak" },
  { time: "11:30 UTC", label: "Latest Release Boundary", detail: "End of primary candidate intersection window", status: "end" },
  { time: "14:20 UTC", label: "Satellite Image Acquisition", detail: "Sentinel-1 SAR C-band radar image captured", status: "acq" }
];
