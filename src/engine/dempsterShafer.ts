/**
 * Dempster-Shafer Evidence Fusion Engine
 * 
 * Implements mathematical fusion of uncertain evidence from multi-modal sources
 * (Spill Detection, Origin Hindcast, AIS Tracks, Forward Simulation, Defense Alibis, Data Quality).
 * 
 * Calculates:
 * - Basic Belief Assignment (BBA) mass functions m(A)
 * - Conflict Mass K (measuring contradictory evidence)
 * - Dempster's Rule of Combination m_1,2(A) = 1/(1-K) * sum(m1(B) * m2(C))
 * - Belief Bel(A) and Plausibility Pl(A)
 * - Decision Rule with explicit Abstention ("Insufficient Evidence")
 */

export interface EvidenceInput {
  id: string;
  source: 'Spill Detection' | 'Origin Hindcast' | 'AIS/SAR Tracking' | 'Forward Simulation' | 'Defense Agent' | 'Data Quality';
  hypothesis: string; // e.g. "Vessel A (IMO 9412345)"
  belief: number;     // 0 to 1
  plausibility: number; // 0 to 1
  uncertainty: number;  // 0 to 1
  weight: number;      // Sensor reliability weight
  notes?: string;
}

export interface FusionResult {
  vesselId: string;
  vesselName: string;
  fusedScore: number;       // 0 to 1
  belief: number;           // Bel(A)
  plausibility: number;     // Pl(A)
  uncertaintyInterval: [number, number]; // [Bel, Pl]
  conflictMass: number;     // K (0 to 1)
  isAttributed: boolean;    // true if score >= threshold AND K <= limit
  abstentionReason?: string;
}

export class DempsterShaferEngine {
  private scoreThreshold: number;
  private maxConflictLimit: number;

  constructor(scoreThreshold = 0.65, maxConflictLimit = 0.35) {
    this.scoreThreshold = scoreThreshold;
    this.maxConflictLimit = maxConflictLimit;
  }

  /**
   * Fuse evidence using Dempster's Combination Rule for a specific candidate vessel hypothesis
   */
  public fuseEvidence(inputs: EvidenceInput[], candidateId: string, candidateName: string): FusionResult {
    if (inputs.length === 0) {
      return {
        vesselId: candidateId,
        vesselName: candidateName,
        fusedScore: 0,
        belief: 0,
        plausibility: 0,
        uncertaintyInterval: [0, 0],
        conflictMass: 1,
        isAttributed: false,
        abstentionReason: 'No evidence inputs provided for fusion.'
      };
    }

    // Step 1: Normalize and weight initial mass assignments
    let massHypothesis = 0;
    let massNotHypothesis = 0;
    let massIgnorance = 0;
    let conflictAccumulator = 0;

    inputs.forEach(input => {
      const w = input.weight;
      const b = input.belief * w;
      const u = (1 - input.plausibility) * w;
      const ign = 1 - b - u;

      // Iterative Dempster Combination
      if (massHypothesis === 0 && massNotHypothesis === 0 && massIgnorance === 0) {
        massHypothesis = b;
        massNotHypothesis = u;
        massIgnorance = Math.max(0, ign);
      } else {
        // Combination matrix
        const k = (massHypothesis * u) + (massNotHypothesis * b); // Conflict
        conflictAccumulator += k;

        const norm = Math.max(0.0001, 1 - k);
        const newH = ((massHypothesis * b) + (massHypothesis * ign) + (massIgnorance * b)) / norm;
        const newNotH = ((massNotHypothesis * u) + (massNotHypothesis * ign) + (massIgnorance * u)) / norm;
        const newIgn = (massIgnorance * ign) / norm;

        massHypothesis = Math.min(1, Math.max(0, newH));
        massNotHypothesis = Math.min(1, Math.max(0, newNotH));
        massIgnorance = Math.min(1, Math.max(0, newIgn));
      }
    });

    const belief = Math.round(massHypothesis * 100) / 100;
    const plausibility = Math.round((1 - massNotHypothesis) * 100) / 100;
    const conflictMass = Math.round(conflictAccumulator * 100) / 100;

    // Fused confidence score combining belief and plausibility
    const fusedScore = Math.round(((belief * 0.7) + (plausibility * 0.3)) * 100) / 100;

    // Decision Rule with explicit Abstention
    let isAttributed = false;
    let abstentionReason: string | undefined = undefined;

    if (conflictMass > this.maxConflictLimit) {
      isAttributed = false;
      abstentionReason = `High Evidence Conflict (K = ${conflictMass} > limit ${this.maxConflictLimit}). Conflicting exonerating vs incriminating evidence requires human audit.`;
    } else if (fusedScore < this.scoreThreshold) {
      isAttributed = false;
      abstentionReason = `Fused Score (${fusedScore} < threshold ${this.scoreThreshold}). Insufficient evidence confidence for legal attribution.`;
    } else {
      isAttributed = true;
    }

    return {
      vesselId: candidateId,
      vesselName: candidateName,
      fusedScore,
      belief,
      plausibility,
      uncertaintyInterval: [belief, plausibility],
      conflictMass,
      isAttributed,
      abstentionReason
    };
  }

  /**
   * Fuse evidence across all candidate vessels and rank them
   */
  public evaluateCandidates(
    candidates: { id: string; name: string; inputs: EvidenceInput[] }[]
  ): FusionResult[] {
    return candidates.map(c => this.fuseEvidence(c.inputs, c.id, c.name))
      .sort((a, b) => b.fusedScore - a.fusedScore);
  }
}

export const defaultDempsterEngine = new DempsterShaferEngine();
