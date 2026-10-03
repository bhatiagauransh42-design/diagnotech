// SVG Vector Artwork generators for offline, 100% resilient clinical visuals

const createDiabetesSvg = () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" width="1200" height="600">
    <defs>
      <radialGradient id="d_bg" cx="30%" cy="40%" r="80%">
        <stop offset="0%" stop-color="#0e2a3b"/>
        <stop offset="60%" stop-color="#081420"/>
        <stop offset="100%" stop-color="#040911"/>
      </radialGradient>
      <linearGradient id="d_cyan" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.2"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="600" fill="url(#d_bg)"/>
    <g opacity="0.18" stroke="#06b6d4" stroke-width="1">
      <line x1="0" y1="150" x2="1200" y2="150"/>
      <line x1="0" y1="300" x2="1200" y2="300"/>
      <line x1="0" y1="450" x2="1200" y2="450"/>
      <line x1="200" y1="0" x2="200" y2="600"/>
      <line x1="400" y1="0" x2="400" y2="600"/>
      <line x1="600" y1="0" x2="600" y2="600"/>
      <line x1="800" y1="0" x2="800" y2="600"/>
      <line x1="1000" y1="0" x2="1000" y2="600"/>
    </g>
    <!-- Glycemic metabolic wave -->
    <path d="M 0,350 Q 200,220 400,320 T 800,280 T 1200,340" fill="none" stroke="#06b6d4" stroke-width="4" opacity="0.6"/>
    <path d="M 0,350 Q 200,220 400,320 T 800,280 T 1200,340 L 1200,600 L 0,600 Z" fill="url(#d_cyan)" opacity="0.15"/>
    <!-- Cellular hex lattice -->
    <g transform="translate(750, 120)" stroke="#06b6d4" stroke-width="2" fill="none" opacity="0.4">
      <polygon points="100,20 160,55 160,125 100,160 40,125 40,55"/>
      <polygon points="160,125 220,160 220,230 160,265 100,230 100,160"/>
      <polygon points="40,125 100,160 100,230 40,265 -20,230 -20,160"/>
      <circle cx="100" cy="90" r="8" fill="#06b6d4" opacity="0.8"/>
      <circle cx="160" cy="195" r="8" fill="#3b82f6" opacity="0.8"/>
    </g>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const createCardioSvg = () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" width="1200" height="600">
    <defs>
      <radialGradient id="c_bg" cx="40%" cy="35%" r="85%">
        <stop offset="0%" stop-color="#2d1017"/>
        <stop offset="60%" stop-color="#18070b"/>
        <stop offset="100%" stop-color="#070204"/>
      </radialGradient>
      <linearGradient id="c_red" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ef4444" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#f43f5e" stop-opacity="0.2"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="600" fill="url(#c_bg)"/>
    <!-- ECG Sinus Rhythm Waveform -->
    <path d="M 0,320 L 250,320 L 280,300 L 310,340 L 340,320 L 370,320 L 390,140 L 420,460 L 445,300 L 470,335 L 500,320 L 700,320 L 730,300 L 760,340 L 790,320 L 820,140 L 850,460 L 875,300 L 900,335 L 930,320 L 1200,320" 
          fill="none" stroke="#ef4444" stroke-width="3.5" opacity="0.85"/>
    <!-- Glow pulse -->
    <circle cx="405" cy="200" r="12" fill="#ef4444" opacity="0.75"/>
    <circle cx="835" cy="200" r="12" fill="#ef4444" opacity="0.75"/>
    <!-- Vascular Network Arcs -->
    <g opacity="0.25" stroke="#f43f5e" stroke-width="1.5" fill="none">
      <circle cx="950" cy="250" r="80"/>
      <circle cx="950" cy="250" r="140"/>
      <circle cx="950" cy="250" r="200"/>
    </g>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const createQuantumSvg = () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" width="1200" height="600">
    <defs>
      <radialGradient id="q_bg" cx="50%" cy="50%" r="80%">
        <stop offset="0%" stop-color="#1e1136"/>
        <stop offset="60%" stop-color="#110720"/>
        <stop offset="100%" stop-color="#06020c"/>
      </radialGradient>
      <linearGradient id="q_purple" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#c084fc" stop-opacity="0.2"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="600" fill="url(#q_bg)"/>
    <!-- Bloch Sphere & Entanglement Wireframe -->
    <g transform="translate(600, 300)" stroke="#8b5cf6" fill="none" opacity="0.55">
      <!-- Outer sphere -->
      <circle cx="0" cy="0" r="180" stroke-width="2"/>
      <!-- Latitude ellipses -->
      <ellipse cx="0" cy="0" rx="180" ry="60" stroke-width="1.5" stroke-dasharray="6,4"/>
      <ellipse cx="0" cy="0" rx="180" ry="120" stroke-width="1.5"/>
      <!-- Vertical meridian -->
      <ellipse cx="0" cy="0" rx="60" ry="180" stroke-width="1.5" stroke-dasharray="6,4"/>
      <!-- Axes -->
      <line x1="-220" y1="0" x2="220" y2="0" stroke-width="1.5"/>
      <line x1="0" y1="-220" x2="0" y2="220" stroke-width="1.5"/>
      <!-- State Vector Arrow -->
      <line x1="0" y1="0" x2="90" y2="-120" stroke="#a855f7" stroke-width="4"/>
      <circle cx="90" cy="-120" r="8" fill="#c084fc"/>
    </g>
    <!-- Qubit wires -->
    <g opacity="0.3" stroke="#a855f7" stroke-width="1.5">
      <line x1="50" y1="180" x2="350" y2="180"/>
      <line x1="50" y1="240" x2="350" y2="240"/>
      <line x1="50" y1="300" x2="350" y2="300"/>
      <line x1="50" y1="360" x2="350" y2="360"/>
      <line x1="50" y1="420" x2="350" y2="420"/>
    </g>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const createShapSvg = () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" width="1200" height="600">
    <defs>
      <radialGradient id="s_bg" cx="45%" cy="40%" r="80%">
        <stop offset="0%" stop-color="#1a1c2e"/>
        <stop offset="60%" stop-color="#0c0e1a"/>
        <stop offset="100%" stop-color="#04060c"/>
      </radialGradient>
    </defs>
    <rect width="1200" height="600" fill="url(#s_bg)"/>
    <!-- Waterfall SHAP attribution bars -->
    <g transform="translate(180, 100)">
      <!-- Baseline line -->
      <line x1="400" y1="40" x2="400" y2="420" stroke="#64748b" stroke-width="2" stroke-dasharray="4,4"/>
      <!-- Positive risk drivers (red/amber) -->
      <rect x="400" y="60" width="220" height="32" rx="4" fill="#ef4444" opacity="0.85"/>
      <rect x="400" y="115" width="160" height="32" rx="4" fill="#f59e0b" opacity="0.85"/>
      <rect x="400" y="170" width="95" height="32" rx="4" fill="#f59e0b" opacity="0.75"/>
      <!-- Negative protective factors (emerald/cyan) -->
      <rect x="260" y="225" width="140" height="32" rx="4" fill="#10b981" opacity="0.85"/>
      <rect x="310" y="280" width="90" height="32" rx="4" fill="#06b6d4" opacity="0.85"/>
      <rect x="340" y="335" width="60" height="32" rx="4" fill="#06b6d4" opacity="0.75"/>
    </g>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const CAROUSEL_SLIDES = [
  {
    id: "diabetes-screening",
    title: "Type 2 Diabetes Screening & Glycemic Stratification",
    category: "ENDOCRINE ENSEMBLE",
    meta: "Random Forest Balanced • AUC 0.838",
    description: "Evaluates 17 CDC BRFSS epidemiological risk indicators to detect prediabetes and undiagnosed asymptomatic metabolic dysregulation with 79.2% sensitivity.",
    credit: "CDC BRFSS Epidemiological Cohort (N=15,000)",
    accent: "#06b6d4",
    image: createDiabetesSvg(),
    actionText: "Open Diabetes Screening",
    actionTab: "screening",
    disease: "diabetes"
  },
  {
    id: "cardiovascular-screening",
    title: "Cardiovascular Disease & Multimorbidity Risk",
    category: "CARDIOLOGY GRADIENT BOOST",
    meta: "XGBoost Classifier • AUC 0.842",
    description: "Multi-factor coronary and myocardial risk estimation integrating prior stroke, vascular hypertension, hypercholesterolemia, and lifestyle physical determinants.",
    credit: "CDC BRFSS Heart Disease Cohort (N=15,000)",
    accent: "#ef4444",
    image: createCardioSvg(),
    actionText: "Open CVD Screening",
    actionTab: "screening",
    disease: "cardiovascular"
  },
  {
    id: "quantum-benchmark",
    title: "6-Qubit QSVC ZZFeatureMap Quantum Kernel",
    category: "QUANTUM MACHINE LEARNING",
    meta: "Hilbert Space Embedding • AUC 0.846",
    description: "Simulates full two-qubit parity entanglement in $2^6$-dimensional Hilbert space, delivering +3.3% sensitivity enhancement for early borderline false-negative mitigation.",
    credit: "QSVC Statevector Density Matrix Simulation",
    accent: "#8b5cf6",
    image: createQuantumSvg(),
    actionText: "Inspect Quantum Benchmark",
    actionTab: "quantum"
  },
  {
    id: "model-governance",
    title: "Transparent Model Governance & TreeSHAP Interpretability",
    category: "CLINICAL DECISION SUPPORT",
    meta: "5-Model Matrix • Exact Game Theory SHAP",
    description: "Rigorous clinical governance featuring ROC/PR curves across 5 candidate models and exact analytical Shapley attributions explaining individual patient predictions.",
    credit: "Lundberg & Lee Shapley Attribution Protocol",
    accent: "#f59e0b",
    image: createShapSvg(),
    actionText: "View Model Governance",
    actionTab: "analytics"
  }
];
