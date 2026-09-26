const fs = require('fs');
const pages = [
  'OriginReconstructionPage',
  'VesselAnalysisPage',
  'HypothesesPage',
  'SimulationPage',
  'MultiAgentPage',
  'EvidenceGraphPage',
  'FutureSpreadPage',
  'ReportPage'
];

pages.forEach(p => {
  const content = `import React from 'react';\nexport const ${p}: React.FC = () => { return <div className="p-6 text-white"><h1>${p}</h1></div>; };\n`;
  fs.writeFileSync(`src/pages/${p}.tsx`, content, 'utf8');
});
