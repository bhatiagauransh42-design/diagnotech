import React from 'react';
import { 
  Search, 
  Video, 
  Activity
} from 'lucide-react';

export default function PatientHeaderBar({
  patient,
  onOpenRegistry,
  onOpenTelehealth
}) {
  if (!patient) return null;

  const initials = patient.name
    .split(' ')
    .filter(n => !n.startsWith('Dr.'))
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const getAcuityClass = (acuity) => {
    if (acuity === 'High') return 'koru-acuity-high';
    if (acuity === 'Moderate') return 'koru-acuity-moderate';
    return 'koru-acuity-low';
  };

  return (
    <div className="koru-patient-bar" id="ehr-patient-context-bar">
      {/* Left: Patient Identity & Demographics */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '280px' }}>
        <div 
          className="koru-avatar-badge"
          style={{ background: patient.avatarBg || 'linear-gradient(135deg, #00c9e8, #4469ee)' }}
        >
          {initials}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F0F0F', letterSpacing: '-0.01em' }}>
              {patient.name}
            </span>
            <span className={`koru-acuity-pill ${getAcuityClass(patient.acuity)}`}>
              <span 
                className="koru-acuity-dot" 
                style={{ 
                  background: patient.acuity === 'High' ? '#ef4444' : patient.acuity === 'Moderate' ? '#f59e0b' : '#00e87e' 
                }} 
              />
              {patient.acuity} Acuity
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.2rem', fontSize: '0.8rem', color: '#64748B' }}>
            <span style={{ fontFamily: 'var(--font-mono)', color: '#0284C7', fontWeight: 600 }}>
              {patient.mrn}
            </span>
            <span>•</span>
            <span>{patient.age} yrs, {patient.gender}</span>
            <span>•</span>
            <span style={{ color: '#4B5563' }}>Blood: <strong>{patient.bloodGroup}</strong></span>
          </div>
        </div>
      </div>

      {/* Center: Live Vitals Snapshot & Wearable Telemetry */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em' }}>
            Last Vitals ({patient.lastVisit})
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '2px' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F0F0F' }}>
              BP: {patient.vitalsSummary.bp}
            </span>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0284C7' }}>
              BMI: {patient.vitalsSummary.bmi}
            </span>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#D97706' }}>
              Glu: {patient.vitalsSummary.glucose}
            </span>
          </div>
        </div>

        <div className="koru-wearable-tag">
          <Activity size={12} />
          <span>{patient.wearableSync}</span>
        </div>
      </div>

      {/* Right: Quick Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
        <button
          onClick={onOpenRegistry}
          className="koru-btn-secondary"
          title="Search or select other patients"
          id="btn-switch-patient"
        >
          <Search size={14} />
          <span>Look Up (MRN)</span>
        </button>

        <button
          onClick={onOpenTelehealth}
          className="koru-btn-primary"
          title="Schedule or launch virtual consultation"
          id="btn-quick-telehealth"
        >
          <Video size={15} />
          <span>Telehealth Call</span>
        </button>

      </div>
    </div>
  );
}
