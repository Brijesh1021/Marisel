import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { SpillDetectionPage } from './pages/SpillDetectionPage';
import { OriginReconstructionPage } from './pages/OriginReconstructionPage';
import { VesselAnalysisPage } from './pages/VesselAnalysisPage';
import { HypothesesPage } from './pages/HypothesesPage';
import { SimulationPage } from './pages/SimulationPage';
import { MultiAgentPage } from './pages/MultiAgentPage';
import { EvidenceGraphPage } from './pages/EvidenceGraphPage';
import { ReportPage } from './pages/ReportPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<SpillDetectionPage />} />
          <Route path="origin-reconstruction" element={<OriginReconstructionPage />} />
          <Route path="vessel-analysis" element={<VesselAnalysisPage />} />
          <Route path="rule-prefilter" element={<HypothesesPage />} />
          <Route path="simulation" element={<SimulationPage />} />
          <Route path="multi-agent" element={<MultiAgentPage />} />
          <Route path="evidence-graph" element={<EvidenceGraphPage />} />
          <Route path="attribution-decision" element={<DashboardPage />} />
          <Route path="outputs" element={<ReportPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
