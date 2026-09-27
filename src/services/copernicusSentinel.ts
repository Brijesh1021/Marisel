/**
 * Copernicus Sentinel SAR & EO API Service
 * 
 * Client service interface for Sentinel-1 (C-band SAR IW GRD) and Sentinel-2 (MSI L2A) satellite data.
 * Fetches satellite imagery metadata, orbit directions (Ascending/Descending), polarization (VV/VH),
 * and spatial coverage tiles.
 */

export interface SatellitePass {
  id: string;
  satellite: 'Sentinel-1A' | 'Sentinel-1B' | 'Sentinel-2A' | 'Sentinel-2B';
  sensorMode: 'IW GRDH' | 'MSI L2A';
  acquisitionTime: string;
  orbitDirection: 'ASCENDING' | 'DESCENDING';
  polarization: 'VV + VH' | 'Multi-spectral';
  relativeOrbit: number;
  tileId: string;
  cloudCoverPct?: number;
  downloadUrl: string;
}

export class CopernicusSentinelService {
  /**
   * Fetch recent satellite passes for a target bounding box
   */
  public async getRecentPasses(lat: number, lng: number): Promise<SatellitePass[]> {
    // Simulated Copernicus OData API query response
    return [
      {
        id: 'S1A_IW_GRDH_1SDV_20260924T081522_20260924T081547_049123_05E41A_E102',
        satellite: 'Sentinel-1A',
        sensorMode: 'IW GRDH',
        acquisitionTime: '2026-09-24 08:15:22 UTC',
        orbitDirection: 'DESCENDING',
        polarization: 'VV + VH',
        relativeOrbit: 147,
        tileId: 'T44QND',
        downloadUrl: 'https://dataspace.copernicus.eu/api/v1/odata/v1/Products(S1A_IW_GRDH)'
      },
      {
        id: 'S2B_MSIL2A_20260924T051015_N0500_R048_T44QND_20260924T072010',
        satellite: 'Sentinel-2B',
        sensorMode: 'MSI L2A',
        acquisitionTime: '2026-09-24 05:10:15 UTC',
        orbitDirection: 'DESCENDING',
        polarization: 'Multi-spectral',
        relativeOrbit: 48,
        tileId: 'T44QND',
        cloudCoverPct: 4.2,
        downloadUrl: 'https://dataspace.copernicus.eu/api/v1/odata/v1/Products(S2B_MSIL2A)'
      }
    ];
  }
}

export const copernicusService = new CopernicusSentinelService();
