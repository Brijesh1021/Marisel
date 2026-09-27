import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as maplibregl from 'maplibre-gl';
// @ts-ignore
import MapboxWorker from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker';

(maplibregl as any).workerClass = MapboxWorker;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
