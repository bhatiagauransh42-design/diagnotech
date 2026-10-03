import React, { useState } from 'react';
import { 
  Users, 
  FileText, 
  Calendar, 
  Video, 
  ClipboardList, 
  Activity, 
  BarChart3, 
  MessageSquare, 
  BellRing, 
  FileCheck,
  ChevronRight
} from 'lucide-react';

export const HEALTHCARE_CATEGORIES = [
  { id: 1, key: 'lookup', name: 'Patient Look-up List', icon: Users, badge: 'Registry', desc: 'Multi-criteria search & acuity filters' },
  { id: 2, key: 'records', name: 'Patient Records', icon: FileText, badge: 'EHR', desc: 'Clinical context & biometric history' },
  { id: 3, key: 'scheduling', name: 'Appointment Scheduling', icon: Calendar, badge: 'Calendar', desc: 'Provider slots & calendar sync' },
  { id: 4, key: 'telemedicine', name: 'Telemedicine', icon: Video, badge: 'Live HUD', desc: 'Virtual room with telemetry stream' },
  { id: 5, key: 'careplan', name: 'Care Plan', icon: ClipboardList, badge: 'POGI', desc: 'Problem-Objective-Goal-Intervention' },
  { id: 6, key: 'vitals', name: 'Vital Signs and Measurements', icon: Activity, badge: 'Telemetry', desc: 'BP, BMI, Glucose & Wearables' },
  { id: 7, key: 'dashboard', name: 'Healthcare Dashboard', icon: BarChart3, badge: 'Analytics', desc: 'Epidemiological trends & metrics' },
  { id: 8, key: 'communication', name: 'Patient Communication', icon: MessageSquare, badge: 'AI Chat', desc: 'Clinical NLP assistant & alerts' },
  { id: 9, key: 'outreach', name: 'Patient Outreach', icon: BellRing, badge: 'Preventive', desc: 'Risk stratification & recalls' },
  { id: 10, key: 'portals', name: 'Patient Portals', icon: FileCheck, badge: 'Lab OCR', desc: 'AI medical report scanner & docs' },
];

export default function HealthcareTableOfContents({
  activeCategory,
  onSelectCategory,
  onOpenRegistry,
  onOpenTelehealth,
  onOpenCarePlan,
  onOpenScanner,
  onOpenAiAssistant
}) {
  const [hoveredId, setHoveredId] = useState(null);

  const handleClick = (item) => {
    if (onSelectCategory) {
      onSelectCategory(item.key);
    }

    switch (item.key) {
      case 'lookup':
        if (onOpenRegistry) onOpenRegistry();
        break;
      case 'records':
        const ehrBar = document.getElementById('ehr-patient-context-bar');
        if (ehrBar) ehrBar.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'scheduling':
      case 'telemedicine':
        if (onOpenTelehealth) onOpenTelehealth(item.key === 'telemedicine' ? 'call' : 'schedule');
        break;
      case 'careplan':
        if (onOpenCarePlan) onOpenCarePlan();
        break;
      case 'vitals':
        const vitalsSection = document.getElementById('screening-form-section');
        if (vitalsSection) vitalsSection.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'dashboard':
        if (onSelectCategory) onSelectCategory('analytics');
        break;
      case 'communication':
        if (onOpenAiAssistant) onOpenAiAssistant();
        break;
      case 'outreach':
        const recsCard = document.getElementById('clinical-guidance-card');
        if (recsCard) recsCard.scrollIntoView({ behavior: 'smooth' });
        else {
          const form = document.getElementById('screening-form-section');
          if (form) form.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      case 'portals':
        const scanner = document.getElementById('scanner-addon-panel');
        if (scanner) scanner.scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        break;
    }
  };

  return (
    <aside 
      className="koru-toc-card"
      id="koru-healthcare-toc-container"
      style={{
        backgroundColor: '#ffffff',
        border: '3px solid #000000', // Solid black boundary as explicitly requested
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4), 0 0 0 1px #000000',
        borderRadius: '16px',
        padding: '2rem 1.8rem',
        width: '100%',
        maxWidth: '360px',
        color: '#000000',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        userSelect: 'none',
        position: 'relative'
      }}
    >
      {/* Header matching Koru UX screenshot */}
      <div style={{
        paddingBottom: '1.25rem',
        borderBottom: '1px solid #E5E7EB',
        marginBottom: '1.4rem'
      }}>
        <h3 style={{
          fontSize: '1.45rem',
          fontWeight: 800,
          color: '#000000',
          letterSpacing: '-0.02em',
          margin: 0
        }}>
          Table of Content
        </h3>
      </div>

      {/* List of 10 Koru UX Healthcare Categories */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {HEALTHCARE_CATEGORIES.map((item) => {
          const isHovered = hoveredId === item.id;
          const isActive = activeCategory === item.key;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '0.45rem 0.6rem',
                borderRadius: '8px',
                textAlign: 'left',
                border: 'none',
                background: isActive 
                  ? '#F3F4F6' 
                  : isHovered 
                  ? 'rgba(0, 232, 126, 0.08)' 
                  : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                position: 'relative'
              }}
              title={item.desc}
              id={`toc-item-${item.key}`}
            >
              {/* Koru signature vertical green indicator bar */}
              <span
                style={{
                  width: '3.5px',
                  height: '24px',
                  borderRadius: '9999px',
                  backgroundColor: isActive || isHovered ? '#00E87E' : 'transparent',
                  marginRight: '0.75rem',
                  transition: 'background-color 0.2s ease',
                  flexShrink: 0
                }}
              />

              {/* Number Index */}
              <span style={{
                fontSize: '1.15rem',
                fontWeight: 400,
                color: '#111827',
                width: '30px',
                flexShrink: 0
              }}>
                {item.id}
              </span>

              {/* Category Label */}
              <span style={{
                fontSize: '1.1rem',
                fontWeight: isHovered || isActive ? 600 : 400,
                color: '#111827',
                flex: 1,
                lineHeight: 1.35
              }}>
                {item.name}
              </span>

              {/* Mini Icon indicator on hover */}
              {isHovered && (
                <ChevronRight size={16} color="#00E87E" style={{ flexShrink: 0, marginLeft: '6px' }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info Pill */}
      <div style={{
        marginTop: '1.5rem',
        paddingTop: '0.9rem',
        borderTop: '1px solid #F3F4F6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.78rem',
        color: '#6B7280'
      }}>
        <span>Koru UX Navigation</span>
        <span style={{ color: '#000000', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00E87E' }} />
          10 Categories Active
        </span>
      </div>
    </aside>
  );
}
