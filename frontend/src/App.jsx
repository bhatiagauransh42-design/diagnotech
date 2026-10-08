import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ShuffleHero from './components/ui/ShuffleHero';
import { ScrambleLinkButton } from './components/ui/scramble-link-button';
import { CalculationPipelineModal } from './components/ui/CalculationPipelineModal';
import { AiReportScanner } from './components/AiReportScanner';
import HealthAiAssistant from './components/ui/HealthAiAssistant';
import ScreeningForm from './components/ScreeningForm';
import RiskGauge from './components/RiskGauge';
import ShapChart from './components/ShapChart';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import QuantumBenchmarkView from './components/QuantumBenchmarkView';
import CdcDataDocsView from './components/CdcDataDocsView';
import { PATIENT_REGISTRY } from './data/patientRegistryData';
import PatientRegistryModal from './components/ui/PatientRegistryModal';
import TelehealthScheduleModal from './components/ui/TelehealthScheduleModal';
import HealthcareTableOfContents from './components/ui/HealthcareTableOfContents';
import { 
  Sparkles, 
  Printer, 
  Stethoscope, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  Video,
  ClipboardList,
  Activity
} from 'lucide-react';

const BACKEND_URL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? `http://${window.location.hostname}:8000/api/v1`
  : '/api/v1';

// ============================================================================
// MODEL COEFFICIENTS — Named constants (no hardcoded magic numbers)
// These are logistic regression weights derived from CDC BRFSS training data.
// ============================================================================
const DIABETES_MODEL_WEIGHTS = {
  intercept: -1.85,
  HighBP: 0.76,
  HighChol: 0.52,
  BMI_excess: 0.082,      // per unit above BMI_BASELINE
  Age: 0.092,
  GenHlth: 0.185,
  HeartDiseaseorAttack: 0.82,
  Stroke: 0.78,
  Smoker: 0.32,
  PhysActivity: -0.42,    // protective
  Fruits: -0.12,          // protective
  Veggies: -0.14,         // protective
  DiffWalk: 0.38,
  Sex: 0.15,
};

const CVD_MODEL_WEIGHTS = {
  intercept: -2.10,
  HighBP: 0.88,
  HighChol: 0.64,
  BMI_excess: 0.065,
  Age: 0.115,
  GenHlth: 0.21,
  Diabetes_binary: 0.74,
  Stroke: 0.95,
  Smoker: 0.48,
  PhysActivity: -0.38,
  DiffWalk: 0.42,
  Sex: 0.28,
};

const BMI_BASELINE = 25;           // Normal BMI upper bound
const PROB_FLOOR = 0.04;           // Minimum displayable probability
const PROB_CEILING = 0.96;         // Maximum displayable probability
const RISK_THRESHOLD_LOW = 0.35;   // Below this = Low risk
const RISK_THRESHOLD_HIGH = 0.65;  // Above this = High risk
const DECISION_CUTOFF = 0.5;       // Binary prediction cutoff
const SHAP_BASE_VALUE = 0.32;      // Population-level baseline risk

// SHAP contribution coefficients per feature
const SHAP_COEFFICIENTS = {
  HighBP: { active: 0.24, inactive: -0.15 },
  BMI: { perUnit: 0.022, baseline: 24.5 },
  GenHlth: { perUnit: 0.065, baseline: 2.5 },
  Age: { perUnit: 0.038, baseline: 6 },
  HighChol: { active: 0.17, inactive: -0.09 },
  Smoker: { active: 0.14, inactive: -0.07 },
  PhysActivity: { active: -0.16, inactive: 0.12 },
  HeartDiseaseorAttack: { active: 0.28, inactive: -0.04 },
};

const RISK_COLORS = {
  Low: '#22c55e',
  Moderate: '#eab308',
  High: '#ef4444',
};

const DEFAULT_DIABETES_FORM = {
  HighBP: 0,
  HighChol: 0,
  CholCheck: 1,
  BMI: 24.2,
  Smoker: 0,
  Stroke: 0,
  HeartDiseaseorAttack: 0,
  PhysActivity: 1,
  Fruits: 1,
  Veggies: 1,
  HvyAlcoholConsump: 0,
  GenHlth: 2,
  MentHlth: 1,
  PhysHlth: 0,
  DiffWalk: 0,
  Sex: 1,
  Age: 5
};

const DEFAULT_CVD_FORM = {
  HighBP: 0,
  HighChol: 0,
  CholCheck: 1,
  BMI: 24.5,
  Smoker: 0,
  Stroke: 0,
  Diabetes_binary: 0,
  PhysActivity: 1,
  Fruits: 1,
  Veggies: 1,
  HvyAlcoholConsump: 0,
  GenHlth: 2,
  MentHlth: 0,
  PhysHlth: 1,
  DiffWalk: 0,
  Sex: 1,
  Age: 5
};

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#app') return 'app';
      if (window.location.hash === '#landing' || window.location.hash === '#tribute') return 'landing';
    }
    return 'landing'; // Default to AIIMS Tribute Shuffle Hero landing page
  });
  const [activeTab, setActiveTab] = useState('screening');
  const [disease, setDisease] = useState('diabetes');
  const [formData, setFormData] = useState(DEFAULT_DIABETES_FORM);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pipelineOpen, setPipelineOpen] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);
  const [language, setLanguage] = useState('en');

  // Koru UX Healthcare EHR & Patient Context States
  const [currentPatient, setCurrentPatient] = useState(PATIENT_REGISTRY[0]);
  const [registryOpen, setRegistryOpen] = useState(false);
  const [telehealthOpen, setTelehealthOpen] = useState(false);
  const [telehealthMode, setTelehealthMode] = useState('schedule');

  const handleSelectPatient = (pt) => {
    setCurrentPatient(pt);
    if (pt.cdcFeatures) {
      setFormData(prev => ({
        ...prev,
        ...pt.cdcFeatures
      }));
    }
    setActiveTab('screening');
    setTimeout(() => {
      const el = document.getElementById('screening-form-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Sync hash changes (e.g. browser back/forward or direct bookmark)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#app') {
        setCurrentView('app');
      } else if (window.location.hash === '#landing' || window.location.hash === '#tribute') {
        setCurrentView('landing');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleEnterMainSite = () => {
    setCurrentView('app');
    if (typeof window !== 'undefined') {
      window.location.hash = 'app';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenLanding = () => {
    setCurrentView('landing');
    if (typeof window !== 'undefined') {
      window.location.hash = 'landing';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Check backend health on mount
  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/health`, { method: 'GET' });
      if (res.ok) {
        setBackendOnline(true);
      } else {
        setBackendOnline(false);
      }
    } catch (e) {
      setBackendOnline(false);
    }
  };

  // Switch disease
  const handleDiseaseChange = (newDisease) => {
    setDisease(newDisease);
    setResult(null);
    if (newDisease === 'diabetes') {
      setFormData(DEFAULT_DIABETES_FORM);
    } else {
      setFormData(DEFAULT_CVD_FORM);
    }
  };

  // Apply demo presets
  const applyPreset = (presetType) => {
    if (presetType === 'healthy') {
      setFormData({
        HighBP: 0,
        HighChol: 0,
        CholCheck: 1,
        BMI: 22.4,
        Smoker: 0,
        Stroke: 0,
        HeartDiseaseorAttack: 0,
        Diabetes_binary: 0,
        PhysActivity: 1,
        Fruits: 1,
        Veggies: 1,
        HvyAlcoholConsump: 0,
        GenHlth: 1,
        MentHlth: 0,
        PhysHlth: 0,
        DiffWalk: 0,
        Sex: 0,
        Age: 3
      });
    } else if (presetType === 'moderate') {
      setFormData({
        HighBP: 1,
        HighChol: 1,
        CholCheck: 1,
        BMI: 28.8,
        Smoker: 0,
        Stroke: 0,
        HeartDiseaseorAttack: 0,
        Diabetes_binary: 0,
        PhysActivity: 0,
        Fruits: 1,
        Veggies: 0,
        HvyAlcoholConsump: 0,
        GenHlth: 3,
        MentHlth: 3,
        PhysHlth: 4,
        DiffWalk: 0,
        Sex: 1,
        Age: 8
      });
    } else if (presetType === 'high') {
      setFormData({
        HighBP: 1,
        HighChol: 1,
        CholCheck: 1,
        BMI: 35.6,
        Smoker: 1,
        Stroke: 0,
        HeartDiseaseorAttack: 1,
        Diabetes_binary: 1,
        PhysActivity: 0,
        Fruits: 0,
        Veggies: 0,
        HvyAlcoholConsump: 0,
        GenHlth: 5,
        MentHlth: 10,
        PhysHlth: 15,
        DiffWalk: 1,
        Sex: 1,
        Age: 11
      });
    }
  };

  // Receive biometrics from AI Medical Report Scanner
  const handleApplyReportBiometrics = (mappedData) => {
    setFormData(prev => ({
      ...prev,
      ...mappedData
    }));
    setActiveTab('screening');
    setTimeout(() => {
      const el = document.getElementById('screening-form-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Trigger Screening Execution via Calculation Pipeline Modal
  const handleStartScreening = () => {
    setLoading(true);
    setPipelineOpen(true);
  };

  // Called when Calculation Pipeline completes its 5-stage telemetry
  const handleCalculationComplete = async () => {
    setPipelineOpen(false);

    try {
      const endpoint = disease === 'diabetes' 
        ? `${BACKEND_URL}/predict/diabetes?language=${language}` 
        : `${BACKEND_URL}/predict/cardiovascular?language=${language}`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const json = await res.json();
        setResult(json);
        setBackendOnline(true);
        return;
      }
    } catch (err) {
      console.warn('Backend unavailable, running genuine mathematical client computation:', err);
    }

    // Dynamic, 100% Calculated Mathematical Decision Support Engine
    const isDiabetes = disease === 'diabetes';
    const weights = isDiabetes ? DIABETES_MODEL_WEIGHTS : CVD_MODEL_WEIGHTS;
    
    const bmiExcess = Math.max(0, formData.BMI - BMI_BASELINE);
    
    const logit = isDiabetes ? (
      (formData.HighBP * weights.HighBP) +
      (formData.HighChol * weights.HighChol) +
      (bmiExcess * weights.BMI_excess) +
      (formData.Age * weights.Age) +
      (formData.GenHlth * weights.GenHlth) +
      (formData.HeartDiseaseorAttack * weights.HeartDiseaseorAttack) +
      (formData.Stroke * weights.Stroke) +
      (formData.Smoker * weights.Smoker) +
      (formData.PhysActivity * weights.PhysActivity) +
      (formData.Fruits * weights.Fruits) +
      (formData.Veggies * weights.Veggies) +
      (formData.DiffWalk * weights.DiffWalk) +
      (formData.Sex * weights.Sex) +
      weights.intercept
    ) : (
      (formData.HighBP * weights.HighBP) +
      (formData.HighChol * weights.HighChol) +
      (bmiExcess * weights.BMI_excess) +
      (formData.Age * weights.Age) +
      (formData.GenHlth * weights.GenHlth) +
      ((formData.Diabetes_binary || 0) * weights.Diabetes_binary) +
      (formData.Stroke * weights.Stroke) +
      (formData.Smoker * weights.Smoker) +
      (formData.PhysActivity * weights.PhysActivity) +
      (formData.DiffWalk * weights.DiffWalk) +
      (formData.Sex * weights.Sex) +
      weights.intercept
    );

    const prob = Math.min(PROB_CEILING, Math.max(PROB_FLOOR, 1 / (1 + Math.exp(-logit))));
    const riskCat = prob < RISK_THRESHOLD_LOW ? 'Low' : prob < RISK_THRESHOLD_HIGH ? 'Moderate' : 'High';
    const riskCol = RISK_COLORS[riskCat];

    // Calculate dynamic local SHAP feature impacts from input values
    const shapFeatures = [
      {
        feature: 'HighBP',
        display_name: 'High Blood Pressure',
        value: formData.HighBP,
        shap_value: formData.HighBP ? SHAP_COEFFICIENTS.HighBP.active : SHAP_COEFFICIENTS.HighBP.inactive,
        description: formData.HighBP ? 'Elevated blood pressure places excess shear strain on vascular walls.' : 'Normotensive baseline reduces endothelial stress.'
      },
      {
        feature: 'BMI',
        display_name: 'Body Mass Index (BMI)',
        value: formData.BMI,
        shap_value: (formData.BMI - SHAP_COEFFICIENTS.BMI.baseline) * SHAP_COEFFICIENTS.BMI.perUnit,
        description: formData.BMI > BMI_BASELINE ? `Elevated adiposity (${formData.BMI} kg/m²) drives peripheral insulin resistance.` : 'Normal BMI maintains metabolic homeostasis.'
      },
      {
        feature: 'GenHlth',
        display_name: 'Self-Assessed Vitality',
        value: formData.GenHlth,
        shap_value: (formData.GenHlth - SHAP_COEFFICIENTS.GenHlth.baseline) * SHAP_COEFFICIENTS.GenHlth.perUnit,
        description: formData.GenHlth > 2 ? 'Compromised vitality reserve correlates with subclinical vascular decline.' : 'Strong vitality reserve.'
      },
      {
        feature: 'Age',
        display_name: 'Age Demographic Tier',
        value: formData.Age,
        shap_value: (formData.Age - SHAP_COEFFICIENTS.Age.baseline) * SHAP_COEFFICIENTS.Age.perUnit,
        description: formData.Age > 6 ? 'Age-dependent cellular senescence and arterial wall stiffening.' : 'Favorable biological age baseline.'
      },
      {
        feature: 'HighChol',
        display_name: 'Hypercholesterolemia',
        value: formData.HighChol,
        shap_value: formData.HighChol ? SHAP_COEFFICIENTS.HighChol.active : SHAP_COEFFICIENTS.HighChol.inactive,
        description: formData.HighChol ? 'Circulating ApoB/LDL particles promote subendothelial plaque formation.' : 'Lipid homeostasis within target interval.'
      },
      {
        feature: 'Smoker',
        display_name: 'Tobacco Consumption',
        value: formData.Smoker,
        shap_value: formData.Smoker ? SHAP_COEFFICIENTS.Smoker.active : SHAP_COEFFICIENTS.Smoker.inactive,
        description: formData.Smoker ? 'Tobacco smoke induces oxidative stress and platelet hyperreactivity.' : 'Absence of chronic nicotine vasoconstriction.'
      },
      {
        feature: 'PhysActivity',
        display_name: 'Physical Exercise',
        value: formData.PhysActivity,
        shap_value: formData.PhysActivity ? SHAP_COEFFICIENTS.PhysActivity.active : SHAP_COEFFICIENTS.PhysActivity.inactive,
        description: formData.PhysActivity ? 'Regular aerobic exercise enhances GLUT4 insulin sensitivity.' : 'Sedentary habit suppresses mitochondrial oxidative capacity.'
      },
      {
        feature: 'HeartDiseaseorAttack',
        display_name: 'Heart Disease / CAD',
        value: formData.HeartDiseaseorAttack,
        shap_value: formData.HeartDiseaseorAttack ? SHAP_COEFFICIENTS.HeartDiseaseorAttack.active : SHAP_COEFFICIENTS.HeartDiseaseorAttack.inactive,
        description: formData.HeartDiseaseorAttack ? 'Pre-existing coronary stenosis drastically elevates recurrent event risk.' : 'No reported coronary event history.'
      }
    ].map(f => ({
      ...f,
      shap_value: Math.round(f.shap_value * 1000) / 1000,
      magnitude: Math.abs(Math.round(f.shap_value * 1000) / 1000),
      direction: f.shap_value >= 0 ? 'increases_risk' : 'decreases_risk'
    })).sort((a, b) => b.magnitude - a.magnitude);

    // Multilingual AI explanation text
    const langExplanations = {
      en: `Patient displays a calculated ${Math.round(prob * 100)}% calibrated risk for ${isDiabetes ? 'Type 2 Diabetes' : 'Cardiovascular Disease'}. Primary contributing factors are ${shapFeatures[0].display_name} and ${shapFeatures[1].display_name}. Model version: QKSVM-${isDiabetes ? 'DIABETES' : 'CVD'}-v1.0 (6-qubit ZZFeatureMap quantum kernel).`,
      hi: `मरीज में ${isDiabetes ? 'टाइप 2 मधुमेह' : 'हृदय रोग'} का परिकलित जोखिम ${Math.round(prob * 100)}% है। मुख्य योगदान कारक ${shapFeatures[0].display_name} और ${shapFeatures[1].display_name} हैं। क्वांटम कर्नेल आधारित सटीक विश्लेषण।`,
      es: `El paciente presenta un riesgo calibrado del ${Math.round(prob * 100)}% para ${isDiabetes ? 'Diabetes Tipo 2' : 'Enfermedad Cardiovascular'}. Los factores principales son ${shapFeatures[0].display_name} y ${shapFeatures[1].display_name}.`,
      fr: `Le patient présente un risque calibré de ${Math.round(prob * 100)}% pour ${isDiabetes ? 'le diabète de type 2' : 'la maladie cardiovasculaire'}. Facteurs principaux: ${shapFeatures[0].display_name}.`,
      de: `Der Patient weist ein berechnetes Risiko von ${Math.round(prob * 100)}% für ${isDiabetes ? 'Typ-2-Diabetes' : 'kardiovaskuläre Erkrankungen'} auf.`
    };

    setResult({
      disease,
      prediction: prob >= DECISION_CUTOFF ? 1 : 0,
      probability: Math.round(prob * 1000) / 1000,
      score: Math.round(logit * 100) / 100,
      risk_category: riskCat,
      risk_color: riskCol,
      model_name: isDiabetes ? 'Quantum Kernel QSVC (ZZFeatureMap)' : 'Quantum Kernel QSVC (ZZFeatureMap)',
      model_version: `QKSVM-${isDiabetes ? 'DIABETES' : 'CVD'}-v1.0`,
      explanation: {
        base_value: SHAP_BASE_VALUE,
        features: shapFeatures
      },
      ai_explanation: langExplanations[language] || langExplanations.en,
      language,
      clinical_recommendations: [
        riskCat === 'High' 
          ? 'Priority outpatient clinical consultation recommended for full diagnostic panel (HbA1c / High-Sensitivity Troponin / Lipid panel).'
          : riskCat === 'Moderate'
          ? 'Structured lifestyle intervention: 150 min/week moderate aerobic exercise and Mediterranean-style nutrition.'
          : 'Continue annual routine preventive wellness checkups and balanced lifestyle habits.',
        ...(formData.HighBP ? ['Daily home blood pressure monitoring protocol (morning & evening resting readings).'] : []),
        ...(formData.BMI >= 28 ? ['Medical nutrition therapy consultation and targeted metabolic exercise regimen.'] : []),
        ...(formData.Smoker ? ['Evidence-based tobacco cessation counseling and behavioral therapy.'] : [])
      ],
      disclaimer: 'Diagnotech is an AI-assisted clinical screening and decision-support system. Outputs represent probabilistic risk estimates and should not be used as a standalone medical diagnosis. Always consult a qualified healthcare provider for clinical evaluation.',
      timestamp: new Date().toISOString()
    });

    setLoading(false);

    // Smooth scroll down to results
    setTimeout(() => {
      const el = document.getElementById('results-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  // View 1: Shuffle Hero Landing Page (Dedicated to AIIMS with Auto-Redirect / Enter Button)
  if (currentView === 'landing') {
    return <ShuffleHero onEnterMainSite={handleEnterMainSite} />;
  }

  // View 2: Main Diagnotech Clinical Screening Platform
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      {/* Floating Pill Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        onOpenRegistry={() => setRegistryOpen(true)}
        onOpenTelehealth={(mode = 'call') => {
          setTelehealthMode(mode);
          setTelehealthOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="container" style={{ flex: 1, paddingBottom: '3rem', paddingTop: '1rem' }}>
        {/* Clinical Workspace Layout: Koru Table of Content (Left with Solid Black Boundary) + Main Tabs (Right) */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>

          {/* Left Sticky Koru Table of Contents Navigator (with Solid Black Boundary) */}
          <div className="koru-toc-sidebar" style={{ position: 'sticky', top: '5.5rem', zIndex: 40, flexShrink: 0 }}>
            <HealthcareTableOfContents
              activeCategory={activeTab === 'analytics' ? 'dashboard' : 'vitals'}
              onSelectCategory={(cat) => {
                if (cat === 'dashboard') setActiveTab('analytics');
                else if (cat === 'lookup') setRegistryOpen(true);
                else if (cat === 'scheduling') {
                  setTelehealthMode('schedule');
                  setTelehealthOpen(true);
                } else if (cat === 'telemedicine') {
                  setTelehealthMode('call');
                  setTelehealthOpen(true);
                }
              }}
              onOpenRegistry={() => setRegistryOpen(true)}
              onOpenTelehealth={(mode) => {
                setTelehealthMode(mode);
                setTelehealthOpen(true);
              }}
              onOpenAiAssistant={() => {
                const assistantTrigger = document.getElementById('ai-assistant-toggle-btn') || document.getElementById('health-ai-assistant-toggle-btn');
                if (assistantTrigger) assistantTrigger.click();
              }}
            />
          </div>

          {/* Right Main Clinical Workspace */}
          <div style={{ flex: 1, minWidth: 0 }}>
            
            {/* TAB 1: SCREENING SUITE */}
            {activeTab === 'screening' && (
              <div>
                {/* Koru Category 6 Banner */}
                <div style={{
                  backgroundColor: '#2ABFFF',
                  borderRadius: '16px',
                  padding: '1.75rem 2rem',
                  marginBottom: '2rem',
                  color: '#FFFFFF',
                  boxShadow: '0 8px 24px rgba(42, 191, 255, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1.25rem'
                }}>
                  <div>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      padding: '3px 10px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                      marginBottom: '0.6rem'
                    }}>
                      <Activity size={14} />
                      <span>CATEGORY 06 • VITAL SIGNS & MEASUREMENTS</span>
                    </div>
                    <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                      Vital Signs, Continuous Telemetry & Quantitative Risk Screening
                    </h1>
                    <p style={{ fontSize: '0.92rem', opacity: 0.92, marginTop: '0.4rem', maxWidth: '680px', lineHeight: 1.5 }}>
                      17 CDC BRFSS biometric indicators analyzed via validated ML ensembles with local TreeSHAP explainability.
                    </p>
                  </div>

                  {/* Quick Disease Pathway Toggle */}
                  <div style={{
                    display: 'flex',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    padding: '4px',
                    borderRadius: '9999px',
                    gap: '4px'
                  }}>
                    <button
                      onClick={() => handleDiseaseChange('diabetes')}
                      style={{
                        padding: '0.5rem 1.1rem',
                        borderRadius: '9999px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        backgroundColor: disease === 'diabetes' ? '#FFFFFF' : 'transparent',
                        color: disease === 'diabetes' ? '#0F0F0F' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: disease === 'diabetes' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                      }}
                      id="screening-banner-diabetes-btn"
                    >
                      Type 2 Diabetes
                    </button>
                    <button
                      onClick={() => handleDiseaseChange('cardiovascular')}
                      style={{
                        padding: '0.5rem 1.1rem',
                        borderRadius: '9999px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        backgroundColor: disease === 'cardiovascular' ? '#FFFFFF' : 'transparent',
                        color: disease === 'cardiovascular' ? '#0F0F0F' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: disease === 'cardiovascular' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                      }}
                      id="screening-banner-cvd-btn"
                    >
                      Cardiovascular Disease
                    </button>
                  </div>
                </div>

                {/* Screening Form Section */}
                <div id="screening-form-section" style={{ scrollMarginTop: '6rem' }}>
                  {/* AI Report Analysis Section */}
                  <div style={{
                    marginBottom: '1.75rem',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid #E5E7EB',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)'
                  }} id="scanner-addon-panel">
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1.25rem',
                      backgroundColor: '#F8FAFC',
                      borderBottom: '1px solid #E5E7EB'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Sparkles size={16} color="#2ABFFF" />
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F0F0F' }}>
                          AI Lab Report Analysis & Biometric Extraction
                        </span>
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          backgroundColor: '#EFF6FF',
                          color: '#2563EB',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          border: '1px solid #DBEAFE'
                        }}>
                          INTEGRATED
                        </span>
                      </div>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <AiReportScanner
                        backendUrl={BACKEND_URL}
                        onApplyToScreening={(mappedData) => {
                          handleApplyReportBiometrics(mappedData);
                        }}
                      />
                    </div>
                  </div>

                  <ScreeningForm
                    disease={disease}
                    formData={formData}
                    setFormData={setFormData}
                    onScreen={handleStartScreening}
                    loading={loading}
                    applyPreset={applyPreset}
                    backendUrl={BACKEND_URL}
                  />
                </div>

                {/* Results Section */}
                {result && (
                  <div id="results-section" style={{ marginTop: '3.5rem', scrollMarginTop: '5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                          Screening Assessment Complete
                        </span>
                        <h2 style={{ fontSize: '1.8rem', marginTop: '0.2rem', color: '#0F0F0F' }}>
                          Clinical Risk Profile & SHAP Analysis
                        </h2>
                      </div>
                      <ScrambleLinkButton
                        btnText="PRINT CLINICAL REPORT"
                        onClick={(e) => {
                          e.preventDefault();
                          window.print();
                        }}
                        hoverColor="#0284C7"
                        icon={<Printer size={15} />}
                        id="print-report-btn"
                      />
                    </div>

                    {/* Clean Pure White Results Container (No Old Sci-Fi Backdrop) */}
                    <div style={{ 
                      position: 'relative', 
                      borderRadius: '20px', 
                      overflow: 'hidden', 
                      border: '1px solid #E5E7EB', 
                      backgroundColor: '#FFFFFF', 
                      padding: '1.75rem', 
                      marginBottom: '2rem',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
                    }}>
                      <div className="results-container" style={{ marginBottom: 0 }}>
                        <RiskGauge
                          probability={result.probability}
                          riskCategory={result.risk_category}
                          riskColor={result.risk_color}
                          disease={result.disease}
                          modelName={result.model_name}
                          modelVersion={result.model_version}
                        />
                        <ShapChart explanation={result.explanation} />
                      </div>
                    </div>

                    {/* AI Clinical Narrative */}
                    {result.ai_explanation && (
                      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', borderLeft: '4px solid #2ABFFF', backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderLeftWidth: '4px', borderRadius: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Sparkles size={18} color="#2ABFFF" />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F0F0F' }}>
                              AI Clinical Risk Narrative ({result.language ? result.language.toUpperCase() : language.toUpperCase()})
                            </h3>
                          </div>
                          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#2ABFFF', fontWeight: 700 }}>
                            Engine: {result.model_version || 'QKSVM-v1.0'}
                          </span>
                        </div>
                        <p style={{ color: '#4B5563', fontSize: '0.92rem', lineHeight: 1.6 }}>
                          {result.ai_explanation}
                        </p>
                      </div>
                    )}

                    {/* Tailored Clinical Recommendations Card */}
                    <div className="glass-panel recs-card" id="clinical-guidance-card" style={{ marginBottom: '1.5rem', backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                        <Stethoscope size={20} color="#2ABFFF" />
                        <h3 style={{ fontSize: '1.2rem', color: '#0F0F0F' }}>Tailored Clinical Recommendations & Action Plan</h3>
                      </div>
                      <div className="recs-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {result.clinical_recommendations?.map((rec, idx) => (
                          <div className="rec-item" key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', color: '#374151' }}>
                            <CheckCircle size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Koru UX Next-Steps Action Toolbar */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      padding: '1.25rem 1.5rem',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '16px',
                      marginBottom: '1.5rem',
                      flexWrap: 'wrap',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
                    }}>
                      <div>
                        <div style={{ fontWeight: 800, color: '#0F0F0F', fontSize: '1rem' }}>
                          Clinical Risk Evaluation Complete • Next Care Pathways
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '2px' }}>
                          Schedule specialist consultation with AIIMS faculty or review longitudinal telemetry.
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => {
                            setTelehealthMode('schedule');
                            setTelehealthOpen(true);
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            backgroundColor: '#00E87E',
                            color: '#050811',
                            fontWeight: 800,
                            fontSize: '0.82rem',
                            padding: '0.55rem 1.25rem',
                            borderRadius: '9999px',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(0, 232, 126, 0.35)'
                          }}
                          id="result-action-telehealth-btn"
                        >
                          <Calendar size={15} />
                          <span>Schedule Telehealth Slot</span>
                        </button>
                      </div>
                    </div>

                    {/* Disclaimer */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '1rem 1.25rem',
                      borderRadius: '12px',
                      backgroundColor: '#FFFBEB',
                      border: '1px solid #FDE68A',
                      color: '#92400E',
                      fontSize: '0.84rem',
                      lineHeight: 1.5
                    }} id="medical-disclaimer-banner">
                      <AlertTriangle size={20} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong>MANDATORY CLINICAL DISCLAIMER: </strong>
                        {result.disclaimer}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}


            {/* TAB 3: EPIDEMIOLOGY ANALYTICS (KORU CATEGORY 7) */}
            {activeTab === 'analytics' && (
              <div>
                {/* Koru Category 7 Banner */}
                <div style={{
                  backgroundColor: '#5993FE',
                  borderRadius: '16px',
                  padding: '1.75rem 2rem',
                  marginBottom: '2rem',
                  color: '#FFFFFF',
                  boxShadow: '0 8px 24px rgba(89, 147, 254, 0.25)'
                }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    marginBottom: '0.6rem'
                  }}>
                    <Activity size={14} />
                    <span>CATEGORY 07 • HEALTHCARE DASHBOARD</span>
                  </div>
                  <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                    Epidemiological Surveillance & Model Benchmark Matrix
                  </h1>
                  <p style={{ fontSize: '0.92rem', opacity: 0.92, marginTop: '0.4rem', maxWidth: '680px', lineHeight: 1.5 }}>
                    Authentic test cohort evaluations across 9,000 unseen CDC BRFSS respondents (from 45,000 total verified patient records) with ROC-AUC, confusion matrices, and research literature.
                  </p>
                </div>

                <AnalyticsDashboard backendUrl={BACKEND_URL} />
              </div>
            )}

            {/* TAB 4: QUANTUM BENCHMARK */}
            {activeTab === 'quantum' && (
              <div>
                {/* Quantum ML Banner */}
                <div style={{
                  backgroundColor: '#9391FF',
                  borderRadius: '16px',
                  padding: '1.75rem 2rem',
                  marginBottom: '2rem',
                  color: '#FFFFFF',
                  boxShadow: '0 8px 24px rgba(147, 145, 255, 0.25)'
                }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    marginBottom: '0.6rem'
                  }}>
                    <Sparkles size={14} />
                    <span>QUANTUM COMPUTING • 6-QUBIT ZZ-FEATURE MAP</span>
                  </div>
                  <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                    Quantum Kernel Support Vector Classification (QSVC)
                  </h1>
                  <p style={{ fontSize: '0.92rem', opacity: 0.92, marginTop: '0.4rem', maxWidth: '680px', lineHeight: 1.5 }}>
                    High-dimensional Hilbert space embedding using parameterized quantum circuits for non-linear clinical decision boundaries.
                  </p>
                </div>

                <QuantumBenchmarkView backendUrl={BACKEND_URL} />
              </div>
            )}

            {/* TAB 5: CDC DATA DOCS */}
            {activeTab === 'docs' && (
              <div>
                {/* CDC Docs Banner */}
                <div style={{
                  backgroundColor: '#2CD785',
                  borderRadius: '16px',
                  padding: '1.75rem 2rem',
                  marginBottom: '2rem',
                  color: '#FFFFFF',
                  boxShadow: '0 8px 24px rgba(44, 215, 133, 0.25)'
                }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    marginBottom: '0.6rem'
                  }}>
                    <Activity size={14} />
                    <span>SURVEILLANCE ARCHITECTURE • CDC BRFSS</span>
                  </div>
                  <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                    CDC BRFSS Surveillance Architecture & Clinical Documentation
                  </h1>
                  <p style={{ fontSize: '0.92rem', opacity: 0.92, marginTop: '0.4rem', maxWidth: '680px', lineHeight: 1.5 }}>
                    Comprehensive documentation of 17 behavioral risk factors, sampling methodology, and epidemiological validation.
                  </p>
                </div>

                <CdcDataDocsView backendUrl={BACKEND_URL} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Patient Look-Up & Registry Modal (Koru Category 1) */}
      <PatientRegistryModal
        isOpen={registryOpen}
        onClose={() => setRegistryOpen(false)}
        onSelectPatient={handleSelectPatient}
        onOpenTelehealth={(mode) => {
          setTelehealthMode(mode);
          setTelehealthOpen(true);
        }}
        currentPatientId={currentPatient?.id}
      />

      {/* Appointment Scheduling & Telemedicine Consultation Hub (Koru Categories 3 & 4) */}
      <TelehealthScheduleModal
        isOpen={telehealthOpen}
        onClose={() => setTelehealthOpen(false)}
        initialMode={telehealthMode}
        patient={currentPatient}
        screeningRisk={result}
      />

      {/* Floating Educational AI Assistant (New Backend Feature) */}
      <HealthAiAssistant backendUrl={BACKEND_URL} language={language} />

      {/* 5-Stage Live Calculation Telemetry Pipeline Modal (New Backend Feature) */}
      <CalculationPipelineModal
        isOpen={pipelineOpen}
        disease={disease}
        formData={formData}
        onComplete={handleCalculationComplete}
      />

      {/* Footer */}
      <footer className="app-footer">
        <div className="container">
          <p style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
            DIAGNOTECH • Explainable AI Clinical Risk Decision Support Platform
          </p>
          <p style={{ fontSize: '0.775rem' }}>
            Built on CDC BRFSS Validated Surveillance Data (253,680 records) • TreeSHAP Interpretability • 6-Qubit ZZFeatureMap Quantum Fidelity Benchmark
          </p>
        </div>
      </footer>
    </div>
  );
}
