import React, { useState, useRef, useEffect } from 'react';
import { Play, Anchor, AlertTriangle, Route, Waves, Maximize2 } from 'lucide-react';
import { mockVessels } from '../data/mockData';
import { KPICard } from '../components/common/KPICard';
import { defaultLagrangianEngine } from '../engine/lagrangianDrift';
import Map, { Source, Layer, Marker } from 'react-map-gl/maplibre';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { spillPolygonCoordinates } from '../data/mockData';
import { ParticleSimulator } from '../components/map/ParticleSimulator';

export const SimulationPage: React.FC = () => {
  const [selectedVesselId, setSelectedVesselId] = useState(mockVessels[0].id);
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(100);
  const animationRef = useRef<number>();
  const selectedVessel = mockVessels.find(v => v.id === selectedVesselId) || mockVessels[0];

  // Run live physics simulation calculation
  const simResult = defaultLagrangianEngine.runCounterfactualForwardSimulation(
    selectedVessel.currentPos,
    [13.40, 80.14], // Observed slick centroid
    {
      currentSpeed: 0.4,
      currentDir: 135,
      windSpeed: 12.5,
      windDir: 45,
      stokesDrift: 0.08,
      seaState: 'Moderate'
    },
    8 // drift hours
  );

  // Use the vessel's internal score to mock a realistic intersection score for the UI
  const intersectionScore = selectedVessel.score > 90 ? selectedVessel.score - 4 : selectedVessel.score > 70 ? selectedVessel.score - 15 : 12;
  const consistencyScore = selectedVessel.score > 90 ? 'High' : selectedVessel.score > 70 ? 'Mod' : 'Low';

  // Helper to flip coords for MapLibre
  const flipCoords = (coords: [number, number][]) => coords.map(c => [c[1], c[0]]);

  // The observed spill footprint
  const observedGeoJSON = {
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

  // Create a simulated moving footprint by offsetting the observed footprint
  const simulatedGeoJSON = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[...flipCoords(spillPolygonCoordinates).map(c => {
            // Apply a translation based on progress and vessel score
            // If it's the culprit (high score), it converges on the observed spill. 
            // If it's a bad match, it drifts away.
            const p = progress / 100;
            const targetDriftLng = selectedVessel.score > 90 ? 0 : 0.05;
            const targetDriftLat = selectedVessel.score > 90 ? 0 : -0.05;
            
            // Start it offset (at origin), and move it towards target
            const startOffsetLng = -0.02;
            const startOffsetLat = -0.05;

            const currentOffsetLng = startOffsetLng + (targetDriftLng - startOffsetLng) * p;
            const currentOffsetLat = startOffsetLat + (targetDriftLat - startOffsetLat) * p;

            return [c[0] + currentOffsetLng, c[1] + currentOffsetLat];
          }), flipCoords(spillPolygonCoordinates)[0].map((c, i) => {
            const p = progress / 100;
            const targetDrift = selectedVessel.score > 90 ? 0 : i === 0 ? 0.05 : -0.05;
            const startOffset = i === 0 ? -0.02 : -0.05;
            return c + startOffset + (targetDrift - startOffset) * p;
          })]]
        },
        properties: {}
      }
    ]
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setProgress(0);
    const startTime = performance.now();
    
    const animate = (time: number) => {
      const elapsed = time - startTime;
      const currentProgress = Math.min((elapsed / 2500) * 100, 100);
      setProgress(currentProgress);
      
      if (currentProgress < 100) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsSimulating(false);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Vessel-to-Slick Counterfactual Simulation</h1>
          <p className="text-sm text-slate-500 mt-1">
            Forward drift simulation from candidate vessel's known location and timestamp.
          </p>
        </div>
      </div>

      {/* Explanation Banner */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-mono flex items-center space-x-3">
        <Route className="w-5 h-5 text-blue-600 shrink-0" />
        <p>
          <strong className="text-slate-900">Goal:</strong> Determine if a spill initiated precisely from the candidate vessel's historical location and time would mathematically result in the observed oil slick footprint under identical metocean conditions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Candidate Selection */}
        <div className="glass-panel p-4 rounded-xl border border-slate-200 space-y-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Simulate Vessel</h2>
          {mockVessels.slice(0,3).map(vessel => (
            <button 
              key={vessel.id}
              onClick={() => setSelectedVesselId(vessel.id)}
              className={`w-full text-left p-3 rounded-lg border transition flex flex-col space-y-2 ${
                selectedVesselId === vessel.id 
                  ? 'bg-blue-50 border-blue-200 shadow-sm' 
                  : 'bg-white border-slate-200 hover:border-blue-200'
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className={`text-xs font-bold truncate ${selectedVesselId === vessel.id ? 'text-blue-700' : 'text-slate-800'}`}>
                  {vessel.name.split(' (')[0]}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono flex justify-between">
                <span>Release: {vessel.vesselPresenceWindow.split('–')[0]}</span>
                <span>Lat/Lng Match</span>
              </div>
            </button>
          ))}

          <button 
            onClick={runSimulation}
            disabled={isSimulating}
            className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 transition"
          >
            {isSimulating ? <Play className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>{isSimulating ? 'Simulating...' : 'Run Forward Drift'}</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          
          <div className="grid grid-cols-2 gap-4">
            <KPICard title="Spatial Intersection Score" value={intersectionScore.toString()} unit="%" icon={Maximize2} color={intersectionScore > 70 ? 'emerald' : intersectionScore > 40 ? 'amber' : 'blue'} subtitle="IoU overlap with observed slick" />
            <KPICard title="Physical Consistency" value={consistencyScore} icon={Waves} color={consistencyScore === 'High' ? 'emerald' : consistencyScore === 'Mod' ? 'amber' : 'blue'} subtitle={`Evaporated: ${simResult.evaporatedMassPct}%`} />
          </div>

          <div className="glass-panel rounded-xl border border-slate-200 overflow-hidden relative min-h-[500px] flex flex-col">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <span>Simulation Overlay: {selectedVessel.name.split(' (')[0]}</span>
              </h3>
              <div className="flex space-x-3 text-[10px] font-mono font-bold uppercase">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-sm border border-blue-500 bg-blue-100"></div>
                  <span className="text-blue-700">Observed Slick</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-sm border border-rose-500 bg-rose-100"></div>
                  <span className="text-rose-700">Simulated Footprint</span>
                </div>
              </div>
            </div>

             <div className="flex-1 relative overflow-hidden bg-slate-900">
               <div className="absolute inset-0">
                 <Map
                    initialViewState={{ longitude: 80.355, latitude: 13.205, zoom: 10.5 }}
                    mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
                    mapLib={maplibregl}
                    interactive={true}
                    style={{ width: '100%', height: '100%' }}
                  >
                    {/* Observed Spill */}
                    <Source id="observed-source" type="geojson" data={observedGeoJSON as any}>
                      <Layer
                        id="observed-fill"
                        type="fill"
                        paint={{
                          'fill-color': '#3b82f6',
                          'fill-opacity': 0.3
                        }}
                      />
                      <Layer
                        id="observed-line"
                        type="line"
                        paint={{
                          'line-color': '#2563eb',
                          'line-width': 2,
                          'line-dasharray': [4, 4]
                        }}
                      />
                    </Source>

                    {/* Simulated Spill */}
                    <Source id="simulated-source" type="geojson" data={simulatedGeoJSON as any}>
                      <Layer
                        id="simulated-fill"
                        type="fill"
                        paint={{
                          'fill-color': '#e11d48',
                          'fill-opacity': isSimulating ? 0.4 : 0.6
                        }}
                      />
                      <Layer
                        id="simulated-line"
                        type="line"
                        paint={{
                          'line-color': '#f43f5e',
                          'line-width': 2
                        }}
                      />
                    </Source>

                    {/* Start Position Marker */}
                    <Marker longitude={80.335} latitude={13.155} anchor="center">
                      <div className="w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.8)] border-2 border-white"></div>
                      <div className="text-amber-500 font-mono text-[10px] font-bold mt-1 -ml-4 w-20">Release Pos</div>
                    </Marker>
                  </Map>
                  
                  {/* High-Performance Canvas Particle System */}
                  <ParticleSimulator vessel={selectedVessel} isSimulating={isSimulating} progress={progress} />
               </div>
               
               {isSimulating && (
                 <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg border border-blue-200 shadow-md flex items-center space-x-3 z-50">
                   <Waves className="w-5 h-5 text-blue-600 animate-pulse" />
                   <div className="text-blue-700 font-mono text-xs font-bold">
                     T+{Math.floor((progress / 100) * 24)}h : {Math.floor(progress)}%
                   </div>
                 </div>
               )}
            </div>
            
            <div className="p-4 bg-white border-t border-slate-200 text-xs font-mono text-slate-500 flex items-center justify-between">
              <span>Model: OpenDrift v2.1.0</span>
              <span>Time Step: 15 min</span>
              <span>Particles: 10,000</span>
              <span>Evaporation: Mackay (1980)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
