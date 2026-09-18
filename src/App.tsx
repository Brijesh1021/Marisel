import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { SpillDetectionPage } from './pages/SpillDetectionPage';
import { SpillAnalysisPage } from './pages/SpillAnalysisPage';
import { DriftOriginPage } from './pages/DriftOriginPage';
import { AISInvestigationPage } from './pages/AISInvestigationPage';
import { VesselRankingPage } from './pages/VesselRankingPage';
import { InvestigationReportPage } from './pages/InvestigationReportPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="detection" element={<SpillDetectionPage />} />
          <Route path="analysis" element={<SpillAnalysisPage />} />
          <Route path="drift-origin" element={<DriftOriginPage />} />
          <Route path="ais-investigation" element={<AISInvestigationPage />} />
          <Route path="vessel-ranking" element={<VesselRankingPage />} />
          <Route path="report" element={<InvestigationReportPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
