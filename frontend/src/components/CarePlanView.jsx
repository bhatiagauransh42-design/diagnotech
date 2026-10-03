import React, { useState } from 'react';
import { 
  ClipboardList, 
  CheckCircle, 
  Calendar, 
  Activity, 
  Printer
} from 'lucide-react';

export default function CarePlanView({
  patient,
  screeningResult,
  onOpenTelehealth
}) {
  const currentRisk = screeningResult ? screeningResult.risk_category : (patient ? patient.acuity : 'Moderate');
  const diseaseTitle = screeningResult ? (screeningResult.disease === 'diabetes' ? 'Type 2 Diabetes' : 'Cardiovascular Disease') : 'Metabolic & Cardiovascular Risk';

  // Problem-Objective-Goal-Intervention (POGI) system state
  const [goals, setGoals] = useState([
    {
      id: 'goal-1',
      title: 'HbA1c & Fasting Glycemic Control',
      problem: 'Elevated Adiposity & Insulin Resistance',
      objective: 'Reduce HbA1c to < 6.5% and Fasting Blood Glucose to < 110 mg/dL',
      progress: 68,
      startDate: '2026-08-15',
      targetDate: '2026-11-15',
      status: 'On Track',
      interventions: [
        { id: 'i1', text: '150 min/week structured aerobic exercise (Zone 2 cardio)', completed: true },
        { id: 'i2', text: 'Low-glycemic Mediterranean nutrition protocol', completed: true },
        { id: 'i3', text: 'Fasting glucose self-monitoring 3x weekly via continuous sensor', completed: false }
      ]
    },
    {
      id: 'goal-2',
      title: 'Blood Pressure Stabilization & Arterial Shear Reduction',
      problem: 'Stage 1 Essential Hypertension (Resting BP > 140/90 mmHg)',
      objective: 'Achieve consistent resting seated BP < 125/80 mmHg',
      progress: 82,
      startDate: '2026-09-01',
      targetDate: '2026-10-30',
      status: 'High Adherence',
      interventions: [
        { id: 'i4', text: 'Dietary sodium reduction to < 2,000 mg/day (DASH Protocol)', completed: true },
        { id: 'i5', text: 'Daily morning & evening Omron Smart BP cuff logging', completed: true },
        { id: 'i6', text: 'Cardiology telehealth check-in for ACE-inhibitor review', completed: false }
      ]
    },
    {
      id: 'goal-3',
      title: 'Atherogenic Lipid Profile Optimization',
      problem: 'Elevated Total Cholesterol (> 218 mg/dL) & Low HDL',
      objective: 'Target non-HDL cholesterol < 100 mg/dL and ApoB normalization',
      progress: 45,
      startDate: '2026-09-10',
      targetDate: '2026-12-15',
      status: 'Attention Required',
      interventions: [
        { id: 'i7', text: 'Statin pharmacotherapy titration consultation', completed: false },
        { id: 'i8', text: 'High-fiber dietary supplementation (35g/day minimum)', completed: true }
      ]
    }
  ]);

  const toggleIntervention = (goalId, interventionId) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== goalId) return g;
      return {
        ...g,
        interventions: g.interventions.map(item => {
          if (item.id === interventionId) return { ...item, completed: !item.completed };
          return item;
        })
      };
    }));
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }} id="care-plan-view">
      {/* Top Banner: POGI Header */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '20px',
        padding: '1.75rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #00c9e8, #4469ee)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 14px rgba(68, 105, 238, 0.25)'
          }}>
            <ClipboardList size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F0F0F', margin: 0 }}>
                Problem-Objective-Goal-Intervention (POGI) Care Plan
              </h2>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                background: '#EFF6FF',
                color: '#2563EB',
                padding: '2px 8px',
                borderRadius: '9999px',
                border: '1px solid #DBEAFE'
              }}>
                CATEGORY 5 • CARE PLAN
              </span>
            </div>
            <p style={{ color: '#64748B', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Personalized evidence-based trajectory for <strong>{patient ? patient.name : 'Ramesh Chandra Kumar'}</strong> ({patient ? patient.mrn : 'MRN-89410'}) • Disease Target: {diseaseTitle}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => window.print()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.55rem 1.15rem',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              fontWeight: 700,
              backgroundColor: '#FFFFFF',
              color: '#1E293B',
              border: '1px solid #E5E7EB',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
            }}
          >
            <Printer size={15} />
            <span>Print Care Plan</span>
          </button>

          <button
            onClick={() => onOpenTelehealth && onOpenTelehealth('call')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.55rem 1.25rem',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              fontWeight: 800,
              backgroundColor: '#00E87E',
              color: '#050811',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0, 232, 126, 0.35)'
            }}
          >
            <Activity size={15} />
            <span>Review with Care Team</span>
          </button>
        </div>
      </div>

      {/* Goal Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {goals.map((g, index) => (
          <div key={g.id} className="koru-pogi-card">
            {/* Header: Problem & Objective */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '8px',
                    background: '#EFF6FF',
                    color: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    border: '1px solid #DBEAFE'
                  }}>
                    {index + 1}
                  </span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F0F0F', margin: 0 }}>
                    {g.title}
                  </h3>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: g.status === 'On Track' || g.status === 'High Adherence' ? '#F0FDF4' : '#FFFBEB',
                    color: g.status === 'On Track' || g.status === 'High Adherence' ? '#166534' : '#B45309',
                    border: `1px solid ${g.status === 'On Track' || g.status === 'High Adherence' ? '#BBF7D0' : '#FDE68A'}`
                  }}>
                    {g.status}
                  </span>
                </div>

                <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ fontSize: '0.86rem', color: '#4B5563' }}>
                    <strong style={{ color: '#DC2626' }}>Problem:</strong> {g.problem}
                  </div>
                  <div style={{ fontSize: '0.86rem', color: '#4B5563' }}>
                    <strong style={{ color: '#0284C7' }}>Clinical Objective:</strong> {g.objective}
                  </div>
                </div>
              </div>

              {/* Timeline Dates */}
              <div style={{ textAlign: 'right', fontSize: '0.78rem', color: '#64748B' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end' }}>
                  <Calendar size={13} color="#0284C7" />
                  <span>Timeline: {g.startDate} → <strong>{g.targetDate}</strong></span>
                </div>
                <div style={{ marginTop: '0.25rem', color: '#059669', fontWeight: 700 }}>
                  Target Completion Window: 60 Days
                </div>
              </div>
            </div>

            {/* Progress Bar (Koru Category 5 Consideration) */}
            <div className="koru-goal-progress">
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F0F0F', minWidth: '70px' }}>
                {g.progress}% Achieved
              </span>
              <div className="koru-progress-bar-bg">
                <div className="koru-progress-bar-fill" style={{ width: `${g.progress}%` }} />
              </div>
            </div>

            {/* Interventions Checklist */}
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 800, letterSpacing: '0.06em', marginBottom: '0.65rem' }}>
                Prescribed Interventions & Action Items
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {g.interventions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleIntervention(g.id, item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.6rem 0.95rem',
                      borderRadius: '10px',
                      background: item.completed ? '#F0FDF4' : '#F8FAFC',
                      border: item.completed ? '1px solid #BBF7D0' : '1px solid #E5E7EB',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '6px',
                      border: item.completed ? 'none' : '1.5px solid #CBD5E1',
                      background: item.completed ? '#00E87E' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#000000',
                      flexShrink: 0
                    }}>
                      {item.completed && <CheckCircle size={14} color="#000000" />}
                    </div>
                    <span style={{
                      fontSize: '0.88rem',
                      color: item.completed ? '#059669' : '#1E293B',
                      fontWeight: item.completed ? 600 : 500,
                      textDecoration: item.completed ? 'line-through' : 'none',
                      transition: 'color 0.15s'
                    }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
