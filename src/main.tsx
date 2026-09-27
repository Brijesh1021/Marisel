import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import MapboxWorker from 'maplibre-gl/dist/maplibre-gl-csp-worker.js?worker';

maplibregl.workerClass = MapboxWorker;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
