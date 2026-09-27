/**
 * Legal Report Compiler Service
 * 
 * Compiles formal Port State Control inspection report documents for MARPOL Annex I violation enforcement.
 * Includes cryptographic ledger signatures, Dempster-Shafer fusion matrices, and multi-agent transcripts.
 */

import { defaultAuditLedger } from '../engine/auditLedger';
import { defaultDempsterEngine } from '../engine/dempsterShafer';
import { defaultAIAgentEngine } from '../engine/aiAgentEngine';
import { mockCase, mockVessels } from '../data/mockData';

export interface MARPOLViolationReport {
  caseId: string;
  generationTimestamp: string;
  incidentLocation: string;
  satelliteMetadata: string;
  slickGeometry: string;
  attributedVesselName: string;
  attributedVesselIMO: string;
  attributionScorePct: number;
  beliefInterval: string;
  conflictMassK: number;
  hashChainSignature: string;
  auditBlockCount: number;
  marpolAnnexIViolation: boolean;
  recommendedAction: string;
}

export class ReportCompilerService {
  /**
   * Compile full legal violation report
   */
  public compileMARPOLReport(targetVesselId = 'vessel-a'): MARPOLViolationReport {
    const vessel = mockVessels.find(v => v.id === targetVesselId) || mockVessels[0];
    const ledger = defaultAuditLedger.getLedger();
    const latestBlock = ledger[ledger.length - 1];

    const fusion = defaultDempsterEngine.fuseEvidence([
      { id: '1', source: 'Spill Detection', hypothesis: vessel.name, belief: 0.94, plausibility: 0.98, uncertainty: 0.04, weight: 1.0 },
      { id: '2', source: 'Origin Hindcast', hypothesis: vessel.name, belief: 0.88, plausibility: 0.94, uncertainty: 0.06, weight: 0.9 },
      { id: '3', source: 'AIS/SAR Tracking', hypothesis: vessel.name, belief: 0.91, plausibility: 0.95, uncertainty: 0.05, weight: 0.95 },
      { id: '4', source: 'Forward Simulation', hypothesis: vessel.name, belief: 0.92, plausibility: 0.96, uncertainty: 0.04, weight: 1.0 },
    ], vessel.id, vessel.name);

    return {
      caseId: mockCase.id,
      generationTimestamp: new Date().toISOString(),
      incidentLocation: `${mockCase.centroid[0]}°N, ${mockCase.centroid[1]}°E (Chennai EEZ / Special Area)`,
      satelliteMetadata: `${mockCase.satellite} (${mockCase.acquisitionDate})`,
      slickGeometry: `Area: ${mockCase.area} km², Length: ${mockCase.length} km, Orientation: ${mockCase.orientation}°`,
      attributedVesselName: vessel.name,
      attributedVesselIMO: vessel.imo,
      attributionScorePct: Math.round(fusion.fusedScore * 100),
      beliefInterval: `[${fusion.belief}, ${fusion.plausibility}]`,
      conflictMassK: fusion.conflictMass,
      hashChainSignature: latestBlock.hash,
      auditBlockCount: ledger.length,
      marpolAnnexIViolation: true,
      recommendedAction: 'Issue immediate Port State Control (PSC) detention order & request physical oil sampling upon berth entry.'
    };
  }
}

export const reportCompiler = new ReportCompilerService();
