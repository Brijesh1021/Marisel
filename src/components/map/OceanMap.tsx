import React, { useState } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Polygon, 
  Polyline, 
  CircleMarker, 
  Popup, 
  Tooltip, 
  LayerGroup 
} from 'react-leaflet';
import { 
  spillPolygonCoordinates, 
  originPolygonCoordinates, 
  mockVessels, 
  mockDriftParticles, 
  mockForecastZones 
} from '../../data/mockData';
import { Vessel } from '../../types';
import { Layers, Eye, ShieldAlert, ArrowUpRight } from 'lucide-react';

interface OceanMapProps {
  onSelectVessel?: (vessel: Vessel) => void;
  showBackwardParticles?: boolean;
  showForecastLayers?: boolean;
  activeTab?: 'hindcast' | 'forecast';
}

export const OceanMap: React.FC<OceanMapProps> = ({
  onSelectVessel,
  showBackwardParticles = false,
  showForecastLayers = false,
  activeTab
}) => {
  const [layers, setLayers] = useState({
    spill: true,
    origin: true,
    vessels: true,
    forecast: showForecastLayers,
    particles: showBackwardParticles
  });

  const mapCenter: [number, number] = [13.405, 80.155];

  const toggleLayer = (layerKey: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  return (
    <div className="relative w-full h-full min-h-[460px] rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Leaflet Container */}
      <MapContainer
        center={mapCenter}
        zoom={11}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 1. Spill Polygon Layer */}
        {layers.spill && (
          <Polygon
            positions={spillPolygonCoordinates}
            pathOptions={{
              color: '#06b6d4',
              fillColor: '#0891b2',
              fillOpacity: 0.45,
              weight: 2,
              dashArray: '4, 4'
            }}
          >
            <Tooltip permanent direction="center" className="bg-[#0b1329]/90 text-cyan-300 font-mono text-[10px] px-2 py-0.5 rounded border border-cyan-500/30">
              Suspected Oil Slick (23.7 km²)
            </Tooltip>
          </Polygon>
        )}

        {/* 2. Probable Origin Region Layer */}
        {layers.origin && (
          <Polygon
            positions={originPolygonCoordinates}
            pathOptions={{
              color: '#f59e0b',
              fillColor: '#d97706',
              fillOpacity: 0.25,
              weight: 2,
              dashArray: '6, 6'
            }}
          >
            <Tooltip direction="top" className="bg-[#0b1329]/90 text-amber-300 font-mono text-[10px] px-2 py-0.5 rounded border border-amber-500/30">
              Probable Origin Zone (82% Conf.)
            </Tooltip>
          </Polygon>
        )}

        {/* 3. Backward Drift Simulation Particles */}
        {(layers.particles || showBackwardParticles) && (
          <LayerGroup>
            {mockDriftParticles.map(p => (
              <CircleMarker
                key={p.id}
                center={[p.lat, p.lng]}
                radius={3}
                pathOptions={{
                  color: '#38bdf8',
                  fillColor: '#0284c7',
                  fillOpacity: p.intensity,
                  weight: 1
                }}
              />
            ))}
          </LayerGroup>
        )}

        {/* 4. Forward Forecast Layers (6h, 12h, 24h) */}
        {(layers.forecast || showForecastLayers) && (
          <LayerGroup>
            {mockForecastZones.map((zone) => {
              const colors = {
                6: '#06b6d4',
                12: '#f59e0b',
                24: '#f43f5e'
              };
              const zoneColor = colors[zone.hours as keyof typeof colors] || '#06b6d4';

              return (
                <Polygon
                  key={`forecast-${zone.hours}`}
                  positions={zone.polygon}
                  pathOptions={{
                    color: zoneColor,
                    fillColor: zoneColor,
                    fillOpacity: 0.15,
                    weight: 2,
                    dashArray: '8, 8'
                  }}
                >
                  <Tooltip permanent direction="center" className="bg-[#0b1329]/90 text-slate-100 font-mono text-[10px] px-2 py-0.5 rounded border border-slate-700">
                    +{zone.hours}h Forecast Zone
                  </Tooltip>
                </Polygon>
              );
            })}
          </LayerGroup>
        )}

        {/* 5. Vessels and AIS Trajectory Tracks */}
        {layers.vessels && (
          <LayerGroup>
            {mockVessels.map((vessel) => {
              const isTopVessel = vessel.id === 'vessel-a';
              const markerColor = isTopVessel ? '#f43f5e' : vessel.score > 80 ? '#f59e0b' : '#38bdf8';

              return (
                <React.Fragment key={vessel.id}>
                  {/* Vessel Track Polyline */}
                  {vessel.coordinates.length > 0 && (
                    <Polyline
                      positions={vessel.coordinates}
                      pathOptions={{
                        color: markerColor,
                        weight: isTopVessel ? 2.5 : 1.5,
                        opacity: 0.7,
                        dashArray: isTopVessel ? 'none' : '3, 4'
                      }}
                    />
                  )}

                  {/* Current Position Marker */}
                  <CircleMarker
                    center={vessel.currentPos}
                    radius={isTopVessel ? 8 : 6}
                    pathOptions={{
                      color: markerColor,
                      fillColor: markerColor,
                      fillOpacity: 0.9,
                      weight: 2
                    }}
                  >
                    <Popup>
                      <div className="p-1 min-w-[200px]">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700">
                          <span className="font-bold text-sm text-slate-100">{vessel.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 font-mono rounded font-semibold ${
                            vessel.score > 80 ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300'
                          }`}>
                            Score {vessel.score}
                          </span>
                        </div>

                        <div className="space-y-1 text-xs text-slate-300 font-mono mb-3">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Speed:</span>
                            <span>{vessel.speed} knots</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Heading:</span>
                            <span>{vessel.heading}°</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Dist to Origin:</span>
                            <span className="text-cyan-400 font-semibold">{vessel.distanceFromOrigin} km</span>
                          </div>
                        </div>

                        {onSelectVessel && (
                          <button
                            onClick={() => onSelectVessel(vessel)}
                            className="w-full flex items-center justify-center space-x-1.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold transition"
                          >
                            <span>View Evidence</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </Popup>
                  </CircleMarker>
                </React.Fragment>
              );
            })}
          </LayerGroup>
        )}
      </MapContainer>

      {/* Layer Selector Floating Control */}
      <div className="absolute top-4 right-4 z-10 glass-panel p-2.5 rounded-lg border border-slate-700/80 text-xs">
        <div className="flex items-center space-x-2 text-slate-300 font-semibold pb-2 mb-2 border-b border-slate-800">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Map Layers</span>
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={layers.spill}
              onChange={() => toggleLayer('spill')}
              className="accent-cyan-500 rounded"
            />
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span>Spill</span>
          </label>

          <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={layers.origin}
              onChange={() => toggleLayer('origin')}
              className="accent-amber-500 rounded"
            />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>Origin Zone</span>
          </label>

          <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={layers.vessels}
              onChange={() => toggleLayer('vessels')}
              className="accent-rose-500 rounded"
            />
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
            <span>Vessels</span>
          </label>

          <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={layers.forecast}
              onChange={() => toggleLayer('forecast')}
              className="accent-blue-500 rounded"
            />
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
            <span>Forecast</span>
          </label>
        </div>
      </div>
    </div>
  );
};
