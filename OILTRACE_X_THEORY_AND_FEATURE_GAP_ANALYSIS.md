# OILTRACE-X: System Theory & Feature Gap Analysis

---

## Executive Summary

**OILTRACE-X** is an advanced, AI-driven decision-support platform designed for **Autonomous Oil Spill Detection, 4D Probabilistic Origin Reconstruction, Counterfactual Drift Simulation, and Evidence-Based Vessel Attribution**. 

By coupling remote sensing imagery (Synthetic Aperture Radar / Electro-Optical), AIS vessel trajectory tracking, metocean numerical forcing models (ocean currents, surface winds, waves), multi-agent AI adversarial analysis, and Dempster-Shafer evidence fusion, OILTRACE-X closes the legal enforcement gap in illegal marine oil discharge ("marpol annex I violations").

This document provides:
1. **Full Theoretical & Mathematical Foundation** of the OILTRACE-X system architecture.
2. **Comprehensive Feature Gap Analysis** comparing the target architecture diagram against the current project implementation codebase.

---

# PART 1: Full Theoretical Explanation of OILTRACE-X

```
                      OILTRACE-X HIGH-LEVEL SYSTEM PIPELINE
                      
 [ Data Sources ] ──► [ 1. Detection ] ──► [ 2. 4D Origin Hindcast ] ──► [ 3. AIS/SAR Tracking ]
                                                                                   │
 [ 7. Evidence Fusion ] ◄── [ 6. AI Agent Layer ] ◄── [ 5. Core Attribution ] ◄─── [ 4. Pre-Filter ]
          │
          ▼
 [ 8. Attribution Decision ] ──► [ 9. Immutable Audit Ledger & 48h Forecast ]
```

---

### Module 1: Spill Detection & Characterization

#### 1. Remote Sensing Physics (SAR vs. EO)
* **Synthetic Aperture Radar (SAR)** (Sentinel-1 C-band): Oil films dampen capillary and short gravity ocean waves, reducing Bragg scattering backscatter to the radar receiver. Slicks appear as distinct **dark spots** on SAR intensity images, independent of daylight or cloud cover.
* **Electro-Optical (EO)** (Sentinel-2 MSI): Optical bands exploit sunglint geometry and spectral absorption/reflectance indices (e.g., Near-Infrared NIR and Short-Wave Infrared SWIR) to verify slick presence and estimate film thickness (sheen vs. metallic vs. true oil emulsion).

#### 2. Deep Learning Segmentation
* **U-Net / SegFormer Architecture**: Convolutional encoder-decoder networks with skip connections perform pixel-wise binary/multiclass semantic segmentation, producing a binary **Spill Mask**:
  $$\hat{Y}_{i,j} = f_{\theta}(I_{\text{SAR}}, I_{\text{EO}})$$

#### 3. Physics-Consistency & Look-Alike Filter
False positives ("look-alikes") frequently arise from low-wind areas ($< 3\text{ m/s}$), biogenic algal films, internal ocean waves, rain cells, and wind shadows.
* **Wind Alignment Check**: Evaluates if the slick orientation aligns with the local wind direction vector $\vec{V}_{\text{wind}}$.
* **Morphology & Shape Analysis**: Computes shape metrics:
  * **Aspect Ratio**: $\text{AR} = \frac{\text{Length}}{\text{Width}}$
  * **Compactness / Circularity**: $C = \frac{4 \pi \cdot \text{Area}}{\text{Perimeter}^2}$
  * Slicks resulting from moving vessels exhibit high aspect ratios (elongated streaks) and low compactness values.

#### 4. Feature Extraction & Fingerprinting
* Quantifies key geometry and metadata: Area ($A$), Perimeter ($P$), Orientation ($\theta$), Release Time Range ($t_{\text{rel}}$), Detection Confidence Score, and Spatial Uncertainty Bounds.

---

### Module 2: 4D Probabilistic Origin Reconstruction

#### 1. Environmental Forcing Data Integration
Driven by 4D spatiotemporal metocean fields ($x, y, z, t$):
* **Surface Currents**: $\vec{U}_{\text{curr}}$ (HYCOM, Copernicus Marine Service - CMEMS)
* **Surface Winds**: $\vec{U}_{\text{wind}}$ (ECMWF ERA5 / NCEP GFS)
* **Wave Dynamics & Stokes Drift**: $\vec{U}_{\text{stokes}}$ (WaveWatch III)

#### 2. Ensemble Hindcasting (Backward Drift Modeling)
* Powered by Lagrangian oil spill trajectory dynamics (e.g., **OpenDrift / OpenOil** framework).
* Evaluates the inverse transport equation from time of satellite acquisition $T_{\text{det}}$ backward to hypothetical discharge time $T_{\text{rel}}$:
  $$\vec{x}(t - \Delta t) = \vec{x}(t) - \int_{t-\Delta t}^{t} \left( \vec{U}_{\text{curr}} + \gamma \vec{U}_{\text{wind}} + \vec{U}_{\text{stokes}} \right) dt + \vec{\varepsilon}_{\text{turbulent}}$$
  where $\gamma \approx 0.035$ is the wind drift factor (windage coefficient), and $\vec{\varepsilon}_{\text{turbulent}}$ represents stochastic Monte Carlo turbulent diffusion ($N = 5,000 - 10,000$ particles).

#### 3. 4D Origin Probability Density Function (PDF)
* Produces a spatiotemporal heatmap of origin probability $P(x, y, t)$, outputting:
  1. Probable geographic centroid $(\lambda_0, \phi_0)$
  2. Spatial uncertainty radius $R_{\text{uncert}}$ (e.g., 95% confidence ellipse)
  3. Release time window $[t_{\text{start}}, t_{\text{end}}]$.

---

### Module 3: AIS + SAR Vessel Tracking & Behaviour Analysis

#### 1. AIS Trajectory Gap Reconstruction
* Automatic Identification System (AIS) messages transmit vessel position, SOG (Speed Over Ground), and COG (Course Over Ground).
* **Gap Reconstruction**: Applies spline interpolation and dead reckoning over signal loss gaps to reconstruct continuous vessel tracks $\mathbf{X}_v(t)$.

#### 2. SAR Dark Vessel Detection
* Detects non-reporting vessels (transponders disabled) by extracting bright point-source radar backscatter targets from SAR imagery and cross-referencing them against active AIS broadcasts at image acquisition time $T_{\text{SAR}}$.

#### 3. Vessel Kinematics & Behavioural Anomaly Scoring
Evaluates anomaly metrics:
* **Speed Anomalies**: Detects sudden speed reductions (e.g., dropping from cruising speed $14\text{ kts}$ to $3-5\text{ kts}$ suitable for illegal tank washing / bilge dumping).
* **Loitering & Course Deviations**: Unplanned turns or looping tracks in non-anchorage zones.
* **AIS Gap Correlation**: Temporal overlap between intentional transponder outages ("dark voyages") and the estimated spill release window.

---

### Module 4: Rule / Score Pre-filter (Candidate Funnel)

To prevent computational overload in the core simulation engine, regional vessel traffic is filtered through a multi-stage funnel to select the **Top-$N$ Candidate Vessels**:

1. **Spatial Proximity**: Distance of vessel track $\mathbf{X}_v(t)$ to origin centroid $\le R_{\text{max}}$.
2. **Temporal Compatibility**: Presence during estimated release window $[t_{\text{start}}, t_{\text{end}}]$.
3. **Trajectory Similarity**: Alignment between vessel track vector and hindcasted drift vector.
4. **Vessel Type & Draft Compatibility**: Tankers, cargo vessels, vs. non-oil-bearing vessels; draft/ballast state analysis.
5. **Data Quality Score**: Reliability of vessel AIS feed.

---

### Module 5: Vessel Simulation & Comparison (Core Attribution Engine)

For each filtered candidate vessel $V_i$, the system runs **counterfactual forward drift simulations**:

#### 1. Counterfactual Hypothesis Initialization
* Seeds $M$ hypothetical spill particles along candidate vessel track $\mathbf{X}_{V_i}(t)$ across discrete release timestamps $t_{\text{rel}} \in [t_{\text{start}}, t_{\text{end}}]$.

#### 2. Forward Drift & Weathering Simulation
* Simulates forward transport from $t_{\text{rel}} \to T_{\text{det}}$ considering physical oil weathering processes:
  * Evaporation (Mackay evaporative exposure model)
  * Emulsification (water-in-oil viscosity changes)
  * Natural dispersion and dissipation

#### 3. Quantitative Slick Comparison & Physical Consistency Score
Compares simulated slick footprint $S_{\text{sim}}(V_i)$ against satellite-observed slick mask $S_{\text{obs}}$:
* **Spatial Overlap (Intersection over Union, IoU)**:
  $$\text{IoU}(V_i) = \frac{|S_{\text{sim}}(V_i) \cap S_{\text{obs}}|}{|S_{\text{sim}}(V_i) \cup S_{\text{obs}}|}$$
* **Shape Similarity**: Hausdorff distance and boundary Fourier descriptor correlation.
* **Temporal Consistency Score**: Alignment of spill aging/weathering state with release duration.
* Output: Physical Consistency Score $S_{\text{phys}}(V_i) \in [0, 1]$.

---

### Module 6: AI Agent Layer (Investigation + Defense)

An autonomous multi-agent framework orchestrates adversarial hypothesis testing:

```
┌────────────────────────────────┐         Iterative        ┌────────────────────────────────┐
│      Investigation Agent       │ ─── Adversarial Loop ──► │         Defense Agent          │
│ (Builds Prosecution Evidence)  │ ◄─────────────────────── │  (Audits & Tests Alibis)       │
└────────────────────────────────┘                          └────────────────────────────────┘
```

#### 1. Investigation Agent (Prosecution)
* Synthesizes multi-source evidence, triggers counterfactual simulations, generates chronological timelines, and constructs the primary attribution hypothesis against high-scoring candidates.

#### 2. Defense Agent (Adversarial Alibi Checker)
* Systematically audits hypotheses to eliminate false accusations and identify reasonable doubt:
  * **AIS-Gap Alibi**: Determines if transponder loss was due to satellite constellation gaps or coastal terrain masking rather than intentional disabling.
  * **Trajectory Alibi**: Checks if vessel was upwind/down-current from slick origin during release window.
  * **Cargo & Draft Alibi**: Cross-checks port inspection logs and ballast records to verify vessel discharge capacity.
  * **Traffic Density Alibi**: Evaluates if unidentified background vessels ("dark targets") passed through the origin zone simultaneously.

---

### Module 7: Evidence Fusion with Uncertainty

Combines heterogeneous, uncertain, and potentially conflicting evidence sources using **Dempster-Shafer Theory of Evidence (DST)** / Evidential Reasoning.

#### 1. Mass Functions (Basic Belief Assignments - BBA)
Assigns belief masses $m_k(\cdot)$ over frame of discernment $\Omega = \{V_1, V_2, \dots, V_N, \text{Unidentified}\}$ from 6 calibrated inputs:
1. Spill Detection Belief $m_{\text{det}}$
2. Origin Reconstruction Belief $m_{\text{orig}}$
3. AIS / SAR Track Correlation $m_{\text{track}}$
4. Simulation Physical Consistency $m_{\text{sim}}$
5. Defense Agent Exoneration/Alibi Weight $m_{\text{def}}$
6. Data Quality & Coverage Index $m_{\text{qual}}$

#### 2. Dempster's Rule of Combination
Combines two independent mass sets $m_1$ and $m_2$:
$$m_{1,2}(A) = \frac{1}{1 - K} \sum_{B \cap C = A} m_1(B) m_2(C) \quad (A \neq \emptyset)$$
where $K$ represents the **Conflict Mass**:
$$K = \sum_{B \cap C = \emptyset} m_1(B) m_2(C)$$

#### 3. Output Measures
* **Belief $\text{Bel}(A)$**: Minimum degree of belief supported by evidence.
* **Plausibility $\text{Pl}(A)$**: Maximum potential belief allowed by evidence.
* **Conflict Mass $K$**: High values flag contradictory evidence requiring human review.

---

### Module 8: Attribution Decision (with Abstention)

To ensure judicial reliability and eliminate false accusations, the system applies a strict threshold decision rule with explicit **Abstention**:

$$\text{Decision} = \begin{cases} 
\text{Attribute to } V^* & \text{if } \text{Score}(V^*) \ge \tau_{\text{score}} \quad \text{AND} \quad K \le \tau_{\text{conflict}} \\
\text{\textbf{Insufficient Evidence — No Attribution}} & \text{otherwise}
\end{cases}$$

---

### Module 9: Outputs, Immutable Audit Ledger & Forecasting

#### 1. Cryptographic Immutable Audit Ledger
* Generates a tamper-evident **Hash-Chain Provenance Ledger** (SHA-256 block chain) linking:
  $$\text{Block}_n = \text{Hash}\left( \text{Block}_{n-1} \,||\, \text{Timestamp} \,||\, \text{EvidenceData}_n \right)$$
* Ensures legal chain of custody and court admissibility under international maritime law (MARPOL Annex I).

#### 2. 48-Hour Future Spread Prediction
* Runs forward drift forecasts at $+6\text{h}, +12\text{h}, +24\text{h}, +48\text{h}$ horizons under forecasted wind/current models.

#### 3. Impact & Risk Assessment
* Intersects projected slick polygons with spatial layers: Shorelines, Exclusive Economic Zones (EEZ), Marine Protected Areas (MPAs), and calculate Estimated Time of Arrival (ETA).

---

# PART 2: Feature Gap Analysis (Architecture Diagram vs. Codebase)

The table below evaluates every component in the **OILTRACE-X Architecture Diagram** against the current codebase located in `/src`.

### Legend
* ✅ **Fully Implemented**: Real algorithms, backend integration, or complete dynamic execution present.
* 🟡 **Partially Implemented (UI Mock / Interactive Simulation)**: High-quality frontend interactive UI exists with mock state/animations, but missing live backend engines.
* ❌ **Missing / Not Added**: Architectural component is completely unbuilt or absent from the codebase.

---

## Component-by-Component Comparison Matrix

| Module # | Diagram Module Name | Diagram Sub-Features | Current Codebase Implementation Status | Detailed Gap / Missing Elements |
| :---: | :--- | :--- | :---: | :--- |
| **Data** | **Data Sources** | • SAR / EO Imagery (Sentinel-1/2)<br>• AIS Trajectories<br>• Oceanographic (HYCOM, ERA5)<br>• Auxiliary (Ports, MARPOL) | 🟡 **Partially Implemented** | Hardcoded static datasets in `mockData.ts`. **Missing**: Live Sentinel API connection, live AIS provider stream, Copernicus/HYCOM oceanographic API connectors. |
| **1** | **Spill Detection & Characterization** | • U-Net / SegFormer Segmentation<br>• Wind alignment & shape check<br>• Area, perimeter, length, orientation<br>• Release-time range & confidence | 🟡 **Partially Implemented** | UI page exists (`SpillDetectionPage.tsx`). **Missing**: Real PyTorch/TensorFlow deep learning inference engine, actual C-band SAR processing, real morphological OpenCV filters. |
| **2** | **4D Probabilistic Origin Reconstruction** | • Ocean currents, wind, waves, sea state<br>• Ensemble Hindcasting (OpenDrift/OpenOil)<br>• Time-latitude-longitude heatmaps<br>• Release-time window estimation | 🟡 **Partially Implemented** | Interactive canvas/Leaflet backward particle simulation (`OriginReconstructionPage.tsx`, `OceanMap.tsx`). **Missing**: Real OpenDrift/Python hindcasting backend, real netCDF ocean grid parser. |
| **3** | **AIS + SAR Vessel Tracking** | • AIS Track gap reconstruction<br>• Dark vessel detection (SAR non-AIS)<br>• Trajectory patterns & speed drop analysis<br>• Behaviour anomaly scoring | 🟡 **Partially Implemented** | Visual vessel tracks & speed timeline charts (`VesselAnalysisPage.tsx`, `AISInvestigationPage.tsx`). **Missing**: Real SAR CFAR target detector for dark ships, automated AIS interpolation algorithms. |
| **4** | **Rule / Score Pre-filter** | • Spatial proximity & release window<br>• Trajectory similarity & anomaly score<br>• Draft/vessel compatibility<br>• Top-N candidate ranking | 🟡 **Partially Implemented** | Candidate list filters in UI (`VesselRankingPage.tsx`). **Missing**: Automated pre-filtering query engine operating on live spatial databases (PostGIS/BigQuery). |
| **5** | **Vessel Simulation & Comparison (Core Engine)** | • Counterfactual spill release seeding<br>• Forward drift (OpenDrift / OpenOil)<br>• Simulated vs. Observed slick overlay<br>• Physical consistency score (IoU) | 🟡 **Partially Implemented** | Animated SVG simulation overlay (`SimulationPage.tsx`) calculating mock IoU scores. **Missing**: Real OpenOil physical weathering (evaporation/emulsification) engine execution. |
| **6** | **AI Agent Layer (Investigation + Defense)** | • Investigation Agent (timeline/prosecution)<br>• Defense Agent (Adversarial Alibi)<br>• AIS-gap, trajectory, draft, traffic alibis<br>• Iterative analysis loop | 🟡 **Partially Implemented** | Interactive typewriter multi-agent log view (`MultiAgentPage.tsx`). **Missing**: Real LLM/Multi-Agent orchestration framework (LangChain/CrewAI/AutoGen) with live agent reasoning. |
| **7** | **Evidence Fusion with Uncertainty** | • Belief inputs (Detection, Origin, Simulation)<br>• Dempster-Shafer Evidence Fusion engine<br>• Belief, Plausibility, Conflict Mass ($K$) | 🟡 **Partially Implemented** | ReactFlow graph rendering evidence links (`EvidenceGraphPage.tsx`) and hardcoded confidence scores. **Missing**: Real Dempster-Shafer mathematical solver script. |
| **8** | **Attribution Decision (with Abstention)** | • Threshold check ($\ge \tau_{\text{score}}$ & $K \le \text{limit}$)<br>• Ranked Candidates score list<br>• "Insufficient Evidence - No Attribution" | 🟡 **Partially Implemented** | Ranked bar charts and status cards (`VesselRankingPage.tsx`, `DashboardPage.tsx`). **Missing**: Automated threshold-based abstention engine with configurable legal confidence limits. |
| **9** | **Outputs & Validation** | • Immutable Audit Ledger (hash-chain)<br>• Future spread forecast (+6h to +48h)<br>• Coastal & MPA impact risk analysis<br>• Interactive Dashboard | 🟡 **Partially Implemented** | Complete dashboard layout (`FutureSpreadPage.tsx`, `ReportPage.tsx`, `InvestigationReportPage.tsx`). **Missing**: Real SHA-256 cryptographic hash-chain ledger creation & exportable PDF package generation. |

---

# PART 3: Status of Built Feature Engine Suite

The feature gaps identified in the architectural audit have now been **built and integrated** directly into the project under `src/engine/` and `src/services/`:

### 1. Built Engines & Computational Modules
* [x] **`src/engine/dempsterShafer.ts`**: Dempster-Shafer Evidence Fusion engine implementing mass functions $m(A)$, conflict mass $K$, Belief $\text{Bel}(A)$, Plausibility $\text{Pl}(A)$, and decision rules with explicit abstention.
* [x] **`src/engine/lagrangianDrift.ts`**: 4D Particle Hindcasting & Counterfactual Forward Drift engine implementing Runge-Kutta advection, windage coefficients ($3.5\%$), Mackay oil weathering evaporation loss, and spatial Intersection over Union (IoU) calculations.
* [x] **`src/engine/spillClassifier.ts`**: Morphological classification engine computing Area, Perimeter, Orientation, Aspect Ratio, Compactness, Wind Alignment divergence, and False Positive look-alike breakdowns.
* [x] **`src/engine/auditLedger.ts`**: Cryptographic Hash-Chain Provenance Ledger engine creating SHA-256 block chains linking evidence items for court admissibility under MARPOL Annex I.
* [x] **`src/engine/aiAgentEngine.ts`**: Multi-Agent Adversarial Audit engine running automated alibi checks (AIS-gap, trajectory, draft, traffic density) and consensus resolution.
* [x] **`src/engine/rulePreFilter.ts`**: Candidate vessel funnel scoring engine evaluating spatial proximity, temporal window matching, trajectory correlation, and speed drop anomalies.

### 2. Built Services & Integration Connectors
* [x] **`src/services/copernicusSentinel.ts`**: Client interface for Sentinel-1 C-band SAR and Sentinel-2 MSI satellite data retrieval.
* [x] **`src/services/aisFeed.ts`**: Live AIS stream parser & Dark Vessel anomaly detector.
* [x] **`src/services/metoceanApi.ts`**: Ingestion interface for HYCOM 4D ocean current vectors and ECMWF ERA5 wind fields.
* [x] **`src/services/reportCompiler.ts`**: Legal report compiler producing Port State Control MARPOL Annex I violation packages with cryptographic SHA-256 signatures.

---

### Conclusion
With the implementation of the `src/engine/` and `src/services/` modules, OILTRACE-X now runs **real physics-based particle simulations, Dempster-Shafer evidential reasoning, cryptographic SHA-256 audit chaining, and morphological satellite classification** live across the interactive application.
