import React, { useEffect, useState, useMemo } from 'react';
import { Vessel } from '../../types';
import { Target } from 'lucide-react';
import Map, { Source, Layer, Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

interface Props {
  vessel: Vessel;
}

export const VesselRadarTracker: React.FC<Props> = ({ vessel }) => {
  const [progress, setProgress] = useState(0);

  // Animate a ship moving along the path
  useEffect(() => {
    let animationFrame: number;
    let start: number | null = null;
    const duration = 10000; // 10 seconds per loop

    const animate = (time: number) => {
      if (start === null) start = time;
      let p = ((time - start) % duration) / duration;
      if (p < 0) p = 0; // Safeguard against negative progress
      
      setProgress(p);
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [vessel.id]);

  if (!vessel || vessel.coordinates.length < 2) {
    return <div className="flex-1 bg-slate-900 rounded-lg flex items-center justify-center text-slate-500 font-mono text-xs">No trajectory data</div>;
  }

  // Interpolate current position based on progress
  const numSegments = vessel.coordinates.length - 1;
  const currentSegment = Math.min(Math.floor(progress * numSegments), numSegments - 1);
  const segmentProgress = (progress * numSegments) - currentSegment;

  const startPoint = vessel.coordinates[currentSegment];
  const endPoint = vessel.coordinates[currentSegment + 1];

  const currentLat = startPoint[0] + (endPoint[0] - startPoint[0]) * segmentProgress;
  const currentLng = startPoint[1] + (endPoint[1] - startPoint[1]) * segmentProgress;

  // Calculate heading for the ship icon rotation
  const dx = endPoint[1] - startPoint[1];
  const dy = endPoint[0] - startPoint[0];
  const heading = Math.atan2(dx, dy) * (180 / Math.PI); // Degrees from North

  // Flip coordinates for MapLibre ([lng, lat])
  const flipCoords = (coords: [number, number][]) => coords.map(c => [c[1], c[0]]);

  const pathGeoJSON = useMemo(() => ({
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
  }), [vessel]);

  // Center the map on the current vessel roughly
  const lats = vessel.coordinates.map(c => c[0]);
  const lngs = vessel.coordinates.map(c => c[1]);
  const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
  const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

  return (
    <div className="flex-1 bg-slate-900 rounded-lg border border-slate-200 relative overflow-hidden flex flex-col">
      {/* Radar Overlay Styling */}
      <style>
        {`
          @keyframes radar-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .radar-sweep {
            background: conic-gradient(from 0deg, transparent 70%, rgba(16, 185, 129, 0.1) 90%, rgba(16, 185, 129, 0.4) 100%);
            animation: radar-spin 4s linear infinite;
            border-radius: 50%;
            pointer-events: none;
          }
          @keyframes pulse-ring {
            0% { transform: scale(0.5); opacity: 0.8; }
            100% { transform: scale(3.5); opacity: 0; }
          }
          .ping-ring {
            animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
          }
        `}
      </style>

      {/* Real MapLibre Map */}
      <div className="absolute inset-0">
        <Map
          initialViewState={{ longitude: centerLng, latitude: centerLat, zoom: 10.5 }}
          mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
          interactive={true}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Static Trajectory Line */}
          <Source id="vessel-path-source" type="geojson" data={pathGeoJSON as any}>
            <Layer
              id="vessel-path-line"
              type="line"
              paint={{
                'line-color': '#10b981',
                'line-width': 2,
                'line-dasharray': [4, 4],
                'line-opacity': 0.6
              }}
            />
          </Source>

          {/* Animated Vessel Marker */}
          <Marker longitude={currentLng} latitude={currentLat} anchor="center">
            <div className="relative flex items-center justify-center">
              {/* Pulsing ring */}
              <div className="absolute w-6 h-6 rounded-full border-2 border-emerald-500 ping-ring pointer-events-none"></div>
              {/* Core dot */}
              <div className="w-2 h-2 bg-emerald-500 rounded-full z-10 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
              {/* Ship heading vector */}
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                className="absolute z-20 pointer-events-none drop-shadow-md"
                style={{ transform: `rotate(${heading}deg)` }}
              >
                <path d="M 12 4 L 16 16 L 12 13 L 8 16 Z" fill="#10b981" />
              </svg>
            </div>
          </Marker>

          {/* Start Point Marker */}
          <Marker longitude={vessel.coordinates[0][1]} latitude={vessel.coordinates[0][0]} anchor="center">
            <div className="w-3 h-3 rounded-full border-2 border-emerald-500/50 flex items-center justify-center">
              <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
            </div>
            <div className="text-emerald-500/80 font-mono text-[10px] mt-1 text-center whitespace-nowrap -ml-4">START</div>
          </Marker>
        </Map>
      </div>
      
      {/* Radar Sweep Overlay on top of the Map */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] radar-sweep z-[100] mix-blend-screen pointer-events-none"></div>

      <div className="absolute top-4 left-4 z-[200] flex items-center space-x-2 text-emerald-500 font-mono text-[10px] bg-slate-900/90 px-2 py-1 rounded border border-emerald-500/30 shadow-md backdrop-blur-sm pointer-events-none">
        <Target className="w-3 h-3 animate-pulse" />
        <span>TACTICAL AIS TRACKING // {vessel.id.toUpperCase()}</span>
      </div>

      <div className="absolute bottom-4 right-4 z-[200] text-emerald-400 font-mono text-[10px] text-right bg-slate-900/80 px-2 py-1 rounded border border-emerald-500/20 backdrop-blur-sm pointer-events-none">
        COORD: {currentLat.toFixed(4)}N, {currentLng.toFixed(4)}E <br/>
        HDG: {Math.round(heading)}° | SPD: {vessel.speed} KTS
      </div>

    </div>
  );
};
