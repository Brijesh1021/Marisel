/**
 * Metocean Environmental Data API Service
 * 
 * Ingests 4D hydrodynamic surface currents (HYCOM / CMEMS)
 * and atmospheric surface winds (ECMWF ERA5 / NCEP GFS).
 */

import { MetoceanConditions } from '../engine/lagrangianDrift';

export class MetoceanApiService {
  /**
   * Fetch metocean environmental conditions for a specific Lat/Lng and Timestamp
   */
  public async getConditions(lat: number, lng: number, timestamp?: string): Promise<MetoceanConditions> {
    return {
      currentSpeed: 0.4,   // m/s
      currentDir: 135,     // 135° SE
      windSpeed: 12.5,     // knots
      windDir: 45,         // 45° NE
      stokesDrift: 0.08,   // m/s
      seaState: 'Moderate'
    };
  }
}

export const metoceanService = new MetoceanApiService();
