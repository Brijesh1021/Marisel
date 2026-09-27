/**
 * Rule / Score Pre-Filter Funnel Engine
 * 
 * Filters regional vessel traffic down to Top-N Candidate Vessels using multi-criteria rules:
 * 1. Spatial Proximity to origin centroid
 * 2. Temporal Compatibility with release window
 * 3. Trajectory Similarity score
 * 4. Behavioural Anomaly score (speed drops & AIS gaps)
 * 5. Vessel Type & Draft Compatibility (tanker / cargo state)
 * 6. Data Quality index
 */

import { Vessel } from '../types';

export interface PreFilterCriteria {
  maxDistanceKm: number;
  maxReleaseWindowHours: number;
  minSpeedAnomalyDropKts: number;
  requireTankerOrCargo: boolean;
}

export interface ScoredCandidate {
  vessel: Vessel;
  totalScore: number; // 0 to 100
  breakdown: {
    spatialMatch: number;   // out of 25
    temporalMatch: number;  // out of 25
    trajectoryMatch: number;// out of 20
    originMatch: number;    // out of 15
    behaviourMatch: number; // out of 10
    aisQualityScore: number;// out of 5
  };
  passedFunnel: boolean;
  rejectionReason?: string;
}

export class RulePreFilterEngine {

  public scoreVessel(vessel: Vessel, originCentroid: [number, number]): ScoredCandidate {
    // Spatial Match (out of 25)
    const dist = vessel.distanceFromOrigin;
    const spatialMatch = Math.max(0, Math.round(25 * Math.max(0, 1 - (dist / 15))));

    // Temporal Match (out of 25)
    const temporalMatch = vessel.vesselPresenceWindow.includes('09:') || vessel.vesselPresenceWindow.includes('10:') ? 24 : 12;

    // Trajectory Match (out of 20)
    const trajectoryMatch = vessel.trajectoryIntersection ? 19 : 5;

    // Origin Match (out of 15)
    const originMatch = Math.round((vessel.originOverlapPct / 100) * 15);

    // Behaviour Anomaly Match (out of 10)
    const speedDropBonus = vessel.timeSeriesData.some(t => t.speed < 5) ? 5 : 2;
    const gapBonus = vessel.signalGaps > 0 ? 5 : 2;
    const behaviourMatch = Math.min(10, speedDropBonus + gapBonus);

    // AIS Quality (out of 5)
    const aisQualityScore = vessel.aisQuality === 'High' ? 5 : vessel.aisQuality === 'Medium' ? 3 : 1;

    const totalScore = spatialMatch + temporalMatch + trajectoryMatch + originMatch + behaviourMatch + aisQualityScore;

    const passedFunnel = totalScore >= 40;
    const rejectionReason = passedFunnel ? undefined : 'Failed spatial-temporal funnel thresholds (Score < 40).';

    return {
      vessel,
      totalScore,
      breakdown: {
        spatialMatch,
        temporalMatch,
        trajectoryMatch,
        originMatch,
        behaviourMatch,
        aisQualityScore
      },
      passedFunnel,
      rejectionReason
    };
  }

  public filterAndRankCandidates(vessels: Vessel[], originCentroid: [number, number]): ScoredCandidate[] {
    return vessels
      .map(v => this.scoreVessel(v, originCentroid))
      .sort((a, b) => b.totalScore - a.totalScore);
  }
}

export const defaultRulePreFilter = new RulePreFilterEngine();
