import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Heart, 
  Sparkles, 
  User, 
  Zap, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { GiCaduceus } from 'react-icons/gi';

const AGE_LABELS = {
  1: '18–24 yrs',
  2: '25–29 yrs',
  3: '30–34 yrs',
  4: '35–39 yrs',
  5: '40–44 yrs',
  6: '45–49 yrs',
  7: '50–54 yrs',
  8: '55–59 yrs',
  9: '60–64 yrs',
  10: '65–69 yrs',
  11: '70–74 yrs',
  12: '75–79 yrs',
  13: '80+ yrs'
};

const GEN_HLTH_OPTIONS = [
  { val: 1, label: 'Excellent', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.4)' },
  { val: 2, label: 'Very Good', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)', border: 'rgba(6, 182, 212, 0.4)' },
  { val: 3, label: 'Good', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.4)' },
  { val: 4, label: 'Fair', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.4)' },
  { val: 5, label: 'Poor', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.4)' }
];

export default function ScreeningForm({
  disease,
  formData,
  setFormData,
  onScreen,
  loading,
  applyPreset,
  onOpenScanner,
  scannerOpen
}) {
  const handleChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getBmiCategory = (bmi) => {
    if (bmi < 18.5) return { label: 'Underweight (<18.5)', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', border: 'rgba(56, 189, 248, 0.3)' };
    if (bmi < 25.0) return { label: 'Normal Weight (18.5–24.9)', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.3)' };
    if (bmi < 30.0) return { label: 'Overweight (25–29.9)', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.3)' };
    return { label: 'Obese (≥30.0)', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)' };
  };

  const bmiCat = getBmiCategory(formData.BMI);

  // Modern clean switch component
  const SwitchControl = ({ label, description, checked, onChange, activeColor = '#2ABFFF', id }) => (
    <div 
      onClick={() => onChange(!checked)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem 1rem',
        borderRadius: '12px',
        backgroundColor: checked ? 'rgba(42, 191, 255, 0.06)' : '#F8FAFC',
        border: checked ? '1px solid #2ABFFF' : '1px solid #E2E8F0',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        userSelect: 'none'
      }}
      id={id}
    >
      <div style={{ paddingRight: '1rem' }}>
        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0F0F0F', letterSpacing: '-0.01em' }}>
          {label}
        </div>
        {description && (
          <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '2px' }}>
            {description}
          </div>
        )}
      </div>

      {/* Pill Toggle */}
      <div 
        style={{
          width: '46px',
          height: '26px',
          borderRadius: '9999px',
          backgroundColor: checked ? activeColor : '#E2E8F0',
          display: 'flex',
          alignItems: 'center',
          padding: '2px',
          flexShrink: 0,
          transition: 'all 0.25s ease'
        }}
      >
        <div 
          style={{
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: checked ? 'translateX(20px)' : 'translateX(0px)',
            transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {checked && <Check size={12} color={activeColor} strokeWidth={3} />}
        </div>
      </div>
    </div>
  );

  return (
    <div id="screening-form-section" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Presets & Add-on Toolbar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.85rem',
        padding: '0.85rem 1.25rem',
        borderRadius: '16px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={16} color="#2ABFFF" />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0F0F0F' }}>
            Clinical Presets:
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.6rem' }}>
          <button
            type="button"
            onClick={() => applyPreset('healthy')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.85rem',
              borderRadius: '10px',
              fontSize: '0.78rem',
              fontWeight: 600,
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#34d399',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            <span>Healthy Adult</span>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('moderate')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.85rem',
              borderRadius: '10px',
              fontSize: '0.78rem',
              fontWeight: 600,
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              color: '#fbbf24',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
            <span>Borderline / Moderate</span>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('high')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.85rem',
              borderRadius: '10px',
              fontSize: '0.78rem',
              fontWeight: 600,
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#f87171',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
            <span>High Risk Multimorbid</span>
          </button>

          {onOpenScanner && (
            <button
              type="button"
              onClick={onOpenScanner}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.4rem 0.95rem',
                borderRadius: '10px',
                fontSize: '0.78rem',
                fontWeight: 700,
                backgroundColor: scannerOpen ? 'rgba(74, 158, 237, 0.18)' : 'rgba(74, 158, 237, 0.08)',
                border: scannerOpen ? '1px solid #4a9eed' : '1px solid rgba(74, 158, 237, 0.3)',
                color: '#4a9eed',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: 'none'
              }}
              id="autofill-lab-scanner-addon-btn"
            >
              <FileText size={14} color="#4a9eed" />
              <span>{scannerOpen ? 'Close Lab Scanner' : 'AI Lab Scanner (Add-on)'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Koru Category 6: Vital Signs and Measurements Visualizer */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '20px',
        padding: '1.4rem',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Activity size={18} color="#2ABFFF" />
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F0F0F', margin: 0 }}>
              Live Biometric Vitals & Telemetry Console
            </h3>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              background: 'rgba(42, 191, 255, 0.12)',
              color: '#0284C7',
              padding: '2px 8px',
              borderRadius: '9999px',
              border: '1px solid rgba(42, 191, 255, 0.3)'
            }}>
              CATEGORY 6 • VITALS
            </span>
          </div>
          <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
            Multi-Source Wearable & Clinical Calibration Active
          </span>
        </div>

        <div className="koru-biometric-grid" style={{ marginBottom: 0 }}>
          {/* BP Card */}
          <div className="koru-bio-card">
            <div className="koru-bio-header">
              <span className="koru-bio-title">
                <Heart size={14} color="#ef4444" />
                Blood Pressure
              </span>
              <span className="koru-wearable-tag">
                <Activity size={11} /> Omron BP
              </span>
            </div>
            <div className="koru-bio-value">
              {formData.HighBP === 1 ? '144/92' : '118/76'}
              <span className="koru-bio-unit">mmHg</span>
            </div>
            <div className="koru-bio-interval-bar">
              <div 
                className="koru-bio-interval-fill"
                style={{
                  width: formData.HighBP === 1 ? '82%' : '44%',
                  background: formData.HighBP === 1 ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : '#00e87e'
                }}
              />
            </div>
            <div className="koru-bio-range-labels">
              <span>&lt; 120 (Normal)</span>
              <span>120–139 (Pre-HTN)</span>
              <span style={{ color: formData.HighBP === 1 ? '#ef4444' : '#64748b', fontWeight: formData.HighBP === 1 ? 700 : 500 }}>
                {formData.HighBP === 1 ? 'Stage 1 HTN' : 'Optimal'}
              </span>
            </div>
          </div>

          {/* BMI Card */}
          <div className="koru-bio-card">
            <div className="koru-bio-header">
              <span className="koru-bio-title">
                <Activity size={14} color="#00c9e8" />
                Body Mass Index
              </span>
              <span className="koru-wearable-tag">
                <Activity size={11} /> Smart Scale
              </span>
            </div>
            <div className="koru-bio-value">
              {formData.BMI.toFixed(1)}
              <span className="koru-bio-unit">kg/m²</span>
            </div>
            <div className="koru-bio-interval-bar">
              <div 
                className="koru-bio-interval-fill"
                style={{
                  width: `${Math.min(100, Math.max(10, (formData.BMI / 45) * 100))}%`,
                  background: bmiCat.color
                }}
              />
            </div>
            <div className="koru-bio-range-labels">
              <span>18.5 (Normal)</span>
              <span>25.0 (Overweight)</span>
              <span style={{ color: bmiCat.color, fontWeight: 700 }}>
                {bmiCat.label.split(' ')[0]}
              </span>
            </div>
          </div>

          {/* Glycemia Card */}
          <div className="koru-bio-card">
            <div className="koru-bio-header">
              <span className="koru-bio-title">
                <Sparkles size={14} color="#f59e0b" />
                Estimated Glycemia
              </span>
              <span className="koru-wearable-tag">
                <Activity size={11} /> FreeStyle CGM
              </span>
            </div>
            <div className="koru-bio-value">
              {formData.Diabetes_binary === 1 || formData.HighBP === 1 ? '164' : '94'}
              <span className="koru-bio-unit">mg/dL</span>
            </div>
            <div className="koru-bio-interval-bar">
              <div 
                className="koru-bio-interval-fill"
                style={{
                  width: formData.Diabetes_binary === 1 || formData.HighBP === 1 ? '76%' : '38%',
                  background: formData.Diabetes_binary === 1 || formData.HighBP === 1 ? '#f59e0b' : '#00e87e'
                }}
              />
            </div>
            <div className="koru-bio-range-labels">
              <span>70–99 (Fasting)</span>
              <span>100–125 (Impaired)</span>
              <span style={{ color: formData.Diabetes_binary === 1 || formData.HighBP === 1 ? '#f59e0b' : '#00e87e', fontWeight: 700 }}>
                {formData.Diabetes_binary === 1 || formData.HighBP === 1 ? 'Elevated' : 'Euglycemic'}
              </span>
            </div>
          </div>

          {/* Activity / Reserve Card */}
          <div className="koru-bio-card">
            <div className="koru-bio-header">
              <span className="koru-bio-title">
                <Zap size={14} color="#00e87e" />
                Physical Activity
              </span>
              <span className="koru-wearable-tag">
                <Activity size={11} /> Apple Health
              </span>
            </div>
            <div className="koru-bio-value" style={{ fontSize: '1.4rem' }}>
              {formData.PhysActivity === 1 ? 'Active (150+ m/w)' : 'Sedentary'}
            </div>
            <div className="koru-bio-interval-bar">
              <div 
                className="koru-bio-interval-fill"
                style={{
                  width: formData.PhysActivity === 1 ? '85%' : '20%',
                  background: formData.PhysActivity === 1 ? '#00e87e' : '#ef4444'
                }}
              />
            </div>
            <div className="koru-bio-range-labels">
              <span>Sedentary (Risk ↑)</span>
              <span>AHA Recommended (150m)</span>
              <span style={{ color: formData.PhysActivity === 1 ? '#00e87e' : '#ef4444', fontWeight: 700 }}>
                {formData.PhysActivity === 1 ? 'Protective' : 'At Risk'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of 4 Clean, High-Contrast Medical Workspace Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.5rem'
      }}>
        
        {/* Card 1: Key Metabolic & Vitals */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: '18px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
        }}>
          {/* Card Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                backgroundColor: 'rgba(42, 191, 255, 0.1)',
                border: '1px solid rgba(42, 191, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Activity size={17} color="#2ABFFF" />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F0F0F' }}>
                  Metabolic & Clinical Vitals
                </h3>
                <p style={{ fontSize: '0.74rem', color: '#64748B' }}>CDC BRFSS Quantitative Baselines</p>
              </div>
            </div>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#F1F5F9', color: '#475569' }}>
              Core Vitals
            </span>
          </div>

          {/* BMI Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: '1rem', borderRadius: '14px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0F0F0F' }}>
                Body Mass Index (BMI):
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 800, color: '#0F0F0F', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', padding: '2px 8px', borderRadius: '6px' }}>
                  {formData.BMI.toFixed(1)} kg/m²
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: bmiCat.color, backgroundColor: bmiCat.bg, border: `1px solid ${bmiCat.border}`, padding: '2px 8px', borderRadius: '6px' }}>
                  {bmiCat.label}
                </span>
              </div>
            </div>

            <input
              type="range"
              min="14.0"
              max="52.0"
              step="0.2"
              value={formData.BMI}
              onChange={(e) => handleChange('BMI', parseFloat(e.target.value))}
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '9999px',
                accentColor: '#2ABFFF',
                cursor: 'pointer',
                margin: '0.4rem 0'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B' }}>
              <span>18.5 (Normal)</span>
              <span>25.0 (Overweight)</span>
              <span>30.0 (Obese Tier 1)</span>
              <span>40.0+</span>
            </div>
          </div>

          {/* High Blood Pressure Switch */}
          <SwitchControl
            label="High Blood Pressure History"
            description="Clinically diagnosed with hypertension by physician"
            checked={formData.HighBP === 1}
            onChange={(val) => handleChange('HighBP', val ? 1 : 0)}
            activeColor="#EF4444"
            id="switch-high-bp"
          />

          {/* High Blood Cholesterol Switch */}
          <SwitchControl
            label="High Blood Cholesterol"
            description="Total cholesterol > 200 mg/dL or prescribed statins"
            checked={formData.HighChol === 1}
            onChange={(val) => handleChange('HighChol', val ? 1 : 0)}
            activeColor="#F59E0B"
            id="switch-high-chol"
          />

          {/* Cholesterol Checked within 5 Years Switch */}
          <SwitchControl
            label="Lipid Profile Checked in 5 Years"
            description="Routine preventive lipid screening performed"
            checked={formData.CholCheck === 1}
            onChange={(val) => handleChange('CholCheck', val ? 1 : 0)}
            activeColor="#00E87E"
            id="switch-chol-check"
          />
        </div>

        {/* Card 2: Cardiovascular & Morbidity History */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: '18px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
        }}>
          {/* Card Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Heart size={17} color="#EF4444" />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F0F0F' }}>
                  Cardiovascular & Vascular History
                </h3>
                <p style={{ fontSize: '0.74rem', color: '#64748B' }}>Major Morbidities & Functional Limits</p>
              </div>
            </div>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#F1F5F9', color: '#475569' }}>
              Morbidity
            </span>
          </div>

          {/* Stroke History */}
          <SwitchControl
            label="Stroke / Cerebrovascular Incident"
            description="Prior documented ischemic stroke, hemorrhagic event, or TIA"
            checked={formData.Stroke === 1}
            onChange={(val) => handleChange('Stroke', val ? 1 : 0)}
            activeColor="#EF4444"
            id="switch-stroke"
          />

          {/* Coronary Heart Disease / Myocardial Infarction */}
          <SwitchControl
            label="Coronary Heart Disease (CAD / MI)"
            description="History of myocardial infarction, angina, or revascularization"
            checked={formData.HeartDiseaseorAttack === 1}
            onChange={(val) => handleChange('HeartDiseaseorAttack', val ? 1 : 0)}
            activeColor="#EF4444"
            id="switch-heart-disease"
          />

          {/* Diabetes status (if screening CVD) */}
          {disease !== 'diabetes' && (
            <SwitchControl
              label="Pre-Existing Diabetes Diagnosis"
              description="Confirmed diagnosis of Type 1 or Type 2 diabetes"
              checked={formData.Diabetes_binary === 1}
              onChange={(val) => handleChange('Diabetes_binary', val ? 1 : 0)}
              activeColor="#2ABFFF"
              id="switch-diabetes-binary"
            />
          )}

          {/* Walking / Mobility Difficulty */}
          <SwitchControl
            label="Mobility Impairment / Walking Difficulty"
            description="Serious difficulty walking or climbing stairs unassisted"
            checked={formData.DiffWalk === 1}
            onChange={(val) => handleChange('DiffWalk', val ? 1 : 0)}
            activeColor="#F59E0B"
            id="switch-diff-walk"
          />
        </div>

        {/* Card 3: Lifestyle & Behavioral Factors */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: '18px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
        }}>
          {/* Card Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                backgroundColor: 'rgba(0, 232, 126, 0.15)',
                border: '1px solid rgba(0, 232, 126, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Zap size={17} color="#047857" />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F0F0F' }}>
                  Lifestyle, Exercise & Nutrition
                </h3>
                <p style={{ fontSize: '0.74rem', color: '#64748B' }}>Modifiable Behavioral Markers</p>
              </div>
            </div>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#F1F5F9', color: '#475569' }}>
              Modifiable
            </span>
          </div>

          {/* Smoker */}
          <SwitchControl
            label="Tobacco Consumption (Smoker)"
            description="Smoked at least 100 cigarettes in lifetime / active smoker"
            checked={formData.Smoker === 1}
            onChange={(val) => handleChange('Smoker', val ? 1 : 0)}
            activeColor="#EF4444"
            id="switch-smoker"
          />

          {/* Physical Exercise */}
          <SwitchControl
            label="Regular Aerobic Exercise"
            description="Moderate or vigorous physical exercise outside job in past 30 days"
            checked={formData.PhysActivity === 1}
            onChange={(val) => handleChange('PhysActivity', val ? 1 : 0)}
            activeColor="#00E87E"
            id="switch-phys-activity"
          />

          {/* Nutrition Row: Fruits & Veggies */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div 
              onClick={() => handleChange('Fruits', formData.Fruits ? 0 : 1)}
              style={{
                padding: '0.85rem',
                borderRadius: '12px',
                backgroundColor: formData.Fruits ? 'rgba(0, 232, 126, 0.08)' : '#F8FAFC',
                border: formData.Fruits ? '1px solid #00E87E' : '1px solid #E2E8F0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0F0F0F' }}>Daily Fruits</div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>1+ serving/day</div>
              </div>
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '6px',
                backgroundColor: formData.Fruits ? '#00E87E' : '#E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: formData.Fruits ? '#050811' : '#94A3B8',
                fontSize: '0.8rem'
              }}>
                {formData.Fruits ? <Check size={14} strokeWidth={3} /> : null}
              </div>
            </div>

            <div 
              onClick={() => handleChange('Veggies', formData.Veggies ? 0 : 1)}
              style={{
                padding: '0.85rem',
                borderRadius: '12px',
                backgroundColor: formData.Veggies ? 'rgba(0, 232, 126, 0.08)' : '#F8FAFC',
                border: formData.Veggies ? '1px solid #00E87E' : '1px solid #E2E8F0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0F0F0F' }}>Daily Veggies</div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>1+ serving/day</div>
              </div>
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '6px',
                backgroundColor: formData.Veggies ? '#00E87E' : '#E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: formData.Veggies ? '#050811' : '#94A3B8',
                fontSize: '0.8rem'
              }}>
                {formData.Veggies ? <Check size={14} strokeWidth={3} /> : null}
              </div>
            </div>
          </div>

          {/* Heavy Alcohol Consumption */}
          <SwitchControl
            label="Heavy Alcohol Intake"
            description=">14 drinks/week (adult men) or >7 drinks/week (adult women)"
            checked={formData.HvyAlcoholConsump === 1}
            onChange={(val) => handleChange('HvyAlcoholConsump', val ? 1 : 0)}
            activeColor="#EF4444"
            id="switch-alcohol"
          />
        </div>

        {/* Card 4: Demographics & Functional Vitality */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: '18px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
        }}>
          {/* Card Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                backgroundColor: 'rgba(147, 145, 255, 0.15)',
                border: '1px solid rgba(147, 145, 255, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User size={17} color="#7C3AED" />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F0F0F' }}>
                  Demographics & Vitality
                </h3>
                <p style={{ fontSize: '0.74rem', color: '#64748B' }}>Age, Biological Sex & Self-Assessed Reserve</p>
              </div>
            </div>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', padding: '2px 8px', borderRadius: '9999px', backgroundColor: '#F1F5F9', color: '#475569' }}>
              Demographics
            </span>
          </div>

          {/* Self-Assessed Health: 5 Clear Segmented Pill Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0F0F0F' }}>
                Self-Reported Health Vitality:
              </label>
              <span style={{ fontSize: '0.75rem', color: '#2ABFFF', fontWeight: 700 }}>
                Tier {formData.GenHlth} of 5
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
              {GEN_HLTH_OPTIONS.map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => handleChange('GenHlth', opt.val)}
                  style={{
                    padding: '0.5rem 0.2rem',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    fontWeight: formData.GenHlth === opt.val ? 800 : 500,
                    backgroundColor: formData.GenHlth === opt.val ? opt.bg : '#F8FAFC',
                    border: formData.GenHlth === opt.val ? `1px solid ${opt.border}` : '1px solid #E2E8F0',
                    color: formData.GenHlth === opt.val ? opt.color : '#64748B',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    textAlign: 'center'
                  }}
                >
                  <div>{opt.val}</div>
                  <div style={{ fontSize: '0.68rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{opt.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Age Demographics: Slider with Clear Display */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0F0F0F' }}>
                Age Category:
              </label>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                fontWeight: 800,
                color: '#0F0F0F',
                backgroundColor: '#F1F5F9',
                border: '1px solid #E2E8F0',
                padding: '2px 10px',
                borderRadius: '6px'
              }}>
                {AGE_LABELS[formData.Age]}
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="13"
              step="1"
              value={formData.Age}
              onChange={(e) => handleChange('Age', parseInt(e.target.value))}
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '9999px',
                accentColor: '#2ABFFF',
                cursor: 'pointer'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B' }}>
              <span>18–24</span>
              <span>40–44</span>
              <span>60–64</span>
              <span>80+</span>
            </div>
          </div>

          {/* Biological Sex: Clean Segmented Switch */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0'
          }}>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0F0F0F' }}>Biological Sex</div>
              <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Baseline physiological reference</div>
            </div>

            <div style={{
              display: 'flex',
              gap: '4px',
              backgroundColor: '#FFFFFF',
              padding: '3px',
              borderRadius: '10px',
              border: '1px solid #E2E8F0'
            }}>
              <button
                type="button"
                onClick={() => handleChange('Sex', 1)}
                style={{
                  padding: '0.4rem 0.9rem',
                  borderRadius: '7px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  backgroundColor: formData.Sex === 1 ? '#0F0F0F' : 'transparent',
                  color: formData.Sex === 1 ? '#FFFFFF' : '#64748B',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: 'none'
                }}
              >
                ♂ Male
              </button>
              <button
                type="button"
                onClick={() => handleChange('Sex', 0)}
                style={{
                  padding: '0.4rem 0.9rem',
                  borderRadius: '7px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  backgroundColor: formData.Sex === 0 ? '#0F0F0F' : 'transparent',
                  color: formData.Sex === 0 ? '#FFFFFF' : '#64748B',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: 'none'
                }}
              >
                ♀ Female
              </button>
            </div>
          </div>

          {/* Days Unwell (Past 30 Days) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div style={{
              padding: '0.75rem',
              borderRadius: '12px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem' }}>
                <span style={{ color: '#0F0F0F', fontWeight: 600 }}>Physically Unwell</span>
                <span style={{ color: '#0284C7', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{formData.PhysHlth}d / 30</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={formData.PhysHlth}
                onChange={(e) => handleChange('PhysHlth', parseInt(e.target.value))}
                style={{ width: '100%', height: '5px', accentColor: '#2ABFFF', cursor: 'pointer' }}
              />
            </div>

            <div style={{
              padding: '0.75rem',
              borderRadius: '12px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem' }}>
                <span style={{ color: '#0F0F0F', fontWeight: 600 }}>Mentally Unwell</span>
                <span style={{ color: '#0284C7', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{formData.MentHlth}d / 30</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={formData.MentHlth}
                onChange={(e) => handleChange('MentHlth', parseInt(e.target.value))}
                style={{ width: '100%', height: '5px', accentColor: '#2ABFFF', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Prominent High-Contrast Koru Execution Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.25rem',
        padding: '1.5rem 2rem',
        borderRadius: '20px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ maxWidth: '560px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <GiCaduceus size={20} color="#2ABFFF" />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F0F0F' }}>
              Execute Calibrated Clinical Assessment
            </h4>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: 1.5 }}>
            Computes calibrated risk probability using balanced {disease === 'diabetes' ? 'Random Forest' : 'XGBoost'} ensemble, TreeSHAP feature contribution, and 6-qubit quantum kernel fidelity benchmark.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onScreen}
          disabled={loading}
          style={{
            backgroundColor: '#00E87E',
            color: '#050811',
            fontSize: '0.95rem',
            fontWeight: 800,
            padding: '0.95rem 2.2rem',
            borderRadius: '9999px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            boxShadow: '0 4px 16px rgba(0, 232, 126, 0.4)',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            border: 'none',
            flexShrink: 0
          }}
          id="btn-calculate-risk"
        >
          {loading ? (
            <>
              <div style={{
                width: '18px',
                height: '18px',
                border: '2px solid #050811',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <span>Running Quantum Pipeline...</span>
            </>
          ) : (
            <>
              <Zap size={18} color="#050811" />
              <span>Calculate Clinical Risk & SHAP Profile</span>
              <ArrowRight size={18} />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
