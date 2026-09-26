import React, { useState } from 'react';
import Map, { Source, Layer, Marker, Popup } from 'react-map-gl/maplibre';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { 
  spillPolygonCoordinates, 
  originPolygonCoordinates, 
  mockVessels, 
  mockDriftParticles, 
  mockForecastZones 
} from '../../data/mockData';
import { Vessel } from '../../types';
import { Layers, ArrowUpRight } from 'lucide-react';

interface OceanMapProps {
  onSelectVessel?: (vessel: Vessel) => void;
  showBackwardParticles?: boolean;
  showForecastLayers?: boolean;
  activeTab?: 'hindcast' | 'forecast';
  simulationProgress?: number; // 0 to 100
}

// Helper to flip [lat, lng] to [lng, lat] for GeoJSON/MapLibre
const flipCoords = (coords: [number, number][]) => coords.map(c => [c[1], c[0]]);

export const OceanMap: React.FC<OceanMapProps> = ({
  onSelectVessel,
  showBackwardParticles = false,
  showForecastLayers = false,
  simulationProgress = 100,
}) => {
  const [layers, setLayers] = useState({
    spill: true,
    origin: true,
    vessels: true,
    forecast: showForecastLayers,
    particles: showBackwardParticles
  });

  const [selectedVesselPopup, setSelectedVesselPopup] = useState<Vessel | null>(null);

  const initialViewState = {
    longitude: 80.355,
    latitude: 13.205,
    zoom: 10
  };

  // GeoJSON Features
  const spillGeoJSON = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[...flipCoords(spillPolygonCoordinates), flipCoords(spillPolygonCoordinates)[0]]]
        },
        properties: {}
      }
    ]
  };

  const originGeoJSON = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[...flipCoords(originPolygonCoordinates), flipCoords(originPolygonCoordinates)[0]]]
        },
        properties: {}
      }
    ]
  };

  const particlesGeoJSON = {
    type: 'FeatureCollection',
    features: mockDriftParticles.map(p => {
      // Interpolate from start location (Spill) to backward drift end location (Origin)
      const startLat = 13.155;
      const startLng = 80.330;
      const progress = simulationProgress / 100;
      
      const currentLat = startLat + (p.lat - startLat) * progress;
      const currentLng = startLng + (p.lng - startLng) * progress;
      
      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [currentLng, currentLat] },
        properties: { intensity: p.intensity }
      };
    })
  };

  const toggleLayer = (layerKey: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  return (
    <div className="relative w-full h-full min-h-[460px] rounded-xl overflow-hidden border border-slate-200 shadow-md bg-slate-900">
      <Map
        initialViewState={initialViewState}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        mapLib={maplibregl}
        interactive={true}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Spill Polygon */}
        {layers.spill && (
          <Source id="spill-source" type="geojson" data={spillGeoJSON as any}>
            <Layer
              id="spill-fill"
              type="fill"
              paint={{
                'fill-color': '#3b82f6',
                'fill-opacity': 0.45
              }}
            />
            <Layer
              id="spill-line"
              type="line"
              paint={{
                'line-color': '#2563eb',
                'line-width': 2,
                'line-dasharray': [4, 4]
              }}
            />
          </Source>
        )}

        {/* Origin Polygon */}
        {layers.origin && (
          <Source id="origin-source" type="geojson" data={originGeoJSON as any}>
            <Layer
              id="origin-fill"
              type="fill"
              paint={{
                'fill-color': '#f59e0b',
                'fill-opacity': 0.25
              }}
            />
            <Layer
              id="origin-line"
              type="line"
              paint={{
                'line-color': '#d97706',
                'line-width': 2,
                'line-dasharray': [6, 6]
              }}
            />
          </Source>
        )}

        {/* Backward Drift Particles Heatmap */}
        {(layers.particles || showBackwardParticles) && (
          <Source id="particles-source" type="geojson" data={particlesGeoJSON as any}>
            <Layer
              id="particles-heatmap"
              type="heatmap"
              paint={{
                'heatmap-weight': ['get', 'intensity'],
                'heatmap-intensity': 1,
                'heatmap-color': [
                  'interpolate',
                  ['linear'],
                  ['heatmap-density'],
                  0, 'rgba(2,132,199,0)',
                  0.2, 'rgba(56,189,248,0.5)',
                  1, 'rgba(125,211,252,1)'
                ],
                'heatmap-radius': 15,
                'heatmap-opacity': 0.8
              }}
            />
            <Layer
              id="particles-point"
              type="circle"
              paint={{
                'circle-radius': 2,
                'circle-color': '#38bdf8',
                'circle-opacity': 0.8
              }}
            />
          </Source>
        )}

        {/* Forecast Zones */}
        {(layers.forecast || showForecastLayers) && mockForecastZones.map(zone => {
          const colors = { 6: '#06b6d4', 12: '#f59e0b', 24: '#f43f5e' };
          const zoneColor = colors[zone.hours as keyof typeof colors] || '#06b6d4';
          
          const zoneGeoJSON = {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: [[...flipCoords(zone.polygon), flipCoords(zone.polygon)[0]]]
                },
                properties: {}
              }
            ]
          };

          return (
            <Source key={`forecast-${zone.hours}`} id={`forecast-source-${zone.hours}`} type="geojson" data={zoneGeoJSON as any}>
              <Layer
                id={`forecast-fill-${zone.hours}`}
                type="fill"
                paint={{
                  'fill-color': zoneColor,
                  'fill-opacity': 0.15
                }}
              />
              <Layer
                id={`forecast-line-${zone.hours}`}
                type="line"
                paint={{
                  'line-color': zoneColor,
                  'line-width': 2,
                  'line-dasharray': [8, 8]
                }}
              />
            </Source>
          );
        })}

        {/* Vessel Trajectories */}
        {layers.vessels && mockVessels.map(vessel => {
          if (vessel.coordinates.length === 0) return null;
          const isTopVessel = vessel.id === 'vessel-a';
          const markerColor = isTopVessel ? '#f43f5e' : vessel.score > 80 ? '#f59e0b' : '#38bdf8';
          
          const lineGeoJSON = {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: flipCoords(vessel.coordinates)
                },
                properties: {}
              }
            ]
          };

          return (
            <Source key={`track-${vessel.id}`} id={`track-source-${vessel.id}`} type="geojson" data={lineGeoJSON as any}>
              <Layer
                id={`track-line-${vessel.id}`}
                type="line"
                paint={{
                  'line-color': markerColor,
                  'line-width': isTopVessel ? 3 : 2,
                  'line-dasharray': isTopVessel ? [1] : [3, 4],
                  'line-opacity': 0.7
                }}
              />
            </Source>
          );
        })}

        {/* Vessel Markers */}
        {layers.vessels && mockVessels.map(vessel => {
          const isTopVessel = vessel.id === 'vessel-a';
          const markerColor = isTopVessel ? '#f43f5e' : vessel.score > 80 ? '#f59e0b' : '#38bdf8';
          
          return (
            <Marker 
              key={`marker-${vessel.id}`} 
              longitude={vessel.currentPos[1]} 
              latitude={vessel.currentPos[0]} 
              anchor="center"
              onClick={e => {
                e.originalEvent.stopPropagation();
                setSelectedVesselPopup(vessel);
              }}
            >
              <div 
                className="rounded-full cursor-pointer shadow-[0_0_10px_rgba(0,0,0,0.5)] border-2 border-white/20"
                style={{
                  width: isTopVessel ? '16px' : '12px',
                  height: isTopVessel ? '16px' : '12px',
                  backgroundColor: markerColor
                }}
              />
            </Marker>
          );
        })}

        {/* Selected Vessel Popup */}
        {selectedVesselPopup && (
          <Popup
            longitude={selectedVesselPopup.currentPos[1]}
            latitude={selectedVesselPopup.currentPos[0]}
            anchor="bottom"
            onClose={() => setSelectedVesselPopup(null)}
            closeOnClick={false}
            className="z-50"
          >
            <div className="p-2 min-w-[200px] text-slate-900">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                <span className="font-bold text-sm">{selectedVesselPopup.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 font-mono rounded font-semibold ${
                  selectedVesselPopup.score > 80 ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  Score {selectedVesselPopup.score}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-600 font-mono mb-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Speed:</span>
                  <span>{selectedVesselPopup.speed} knots</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Heading:</span>
                  <span>{selectedVesselPopup.heading}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Dist to Origin:</span>
                  <span className="text-blue-600 font-semibold">{selectedVesselPopup.distanceFromOrigin} km</span>
                </div>
              </div>

              {onSelectVessel && (
                <button
                  onClick={() => onSelectVessel(selectedVesselPopup)}
                  className="w-full flex items-center justify-center space-x-1.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition shadow-sm"
                >
                  <span>View Evidence</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </Popup>
        )}
      </Map>

      {/* Layer Selector Floating Control */}
      <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-md p-3 rounded-lg border border-slate-200 text-xs shadow-lg">
        <div className="flex items-center space-x-2 text-slate-800 font-bold pb-2 mb-2 border-b border-slate-200">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Map Layers (MapLibre)</span>
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-slate-700 cursor-pointer font-medium hover:text-blue-600 transition">
            <input
              type="checkbox"
              checked={layers.spill}
              onChange={() => toggleLayer('spill')}
              className="accent-blue-500 rounded"
            />
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span>Spill Detect</span>
          </label>

          <label className="flex items-center space-x-2 text-slate-700 cursor-pointer font-medium hover:text-amber-600 transition">
            <input
              type="checkbox"
              checked={layers.origin}
              onChange={() => toggleLayer('origin')}
              className="accent-amber-500 rounded"
            />
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span>Origin Zone</span>
          </label>

          <label className="flex items-center space-x-2 text-slate-700 cursor-pointer font-medium hover:text-rose-600 transition">
            <input
              type="checkbox"
              checked={layers.vessels}
              onChange={() => toggleLayer('vessels')}
              className="accent-rose-500 rounded"
            />
            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
            <span>Vessels (AIS)</span>
          </label>

          <label className="flex items-center space-x-2 text-slate-700 cursor-pointer font-medium hover:text-purple-600 transition">
            <input
              type="checkbox"
              checked={layers.forecast}
              onChange={() => toggleLayer('forecast')}
              className="accent-purple-500 rounded"
            />
            <span className="w-3 h-3 rounded-full bg-purple-500"></span>
            <span>Forecast</span>
          </label>
        </div>
      </div>
    </div>
  );
};
