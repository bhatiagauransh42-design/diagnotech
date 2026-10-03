import React, { useState } from 'react';
import { 
  Activity, 
  Sparkles, 
  BarChart3, 
  Atom, 
  Stethoscope, 
  ArrowRight, 
  Globe, 
  Users, 
  Video, 
  ClipboardList,
  Search,
  BookOpen
} from 'lucide-react';
import { ScrambleLinkButton } from './ui/scramble-link-button';

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'HI' },
  { code: 'es', label: 'ES' },
  { code: 'fr', label: 'FR' },
  { code: 'de', label: 'DE' }
];

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  language = 'en', 
  setLanguage,
  onOpenRegistry,
  onOpenTelehealth
}) {
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const scrollToScreening = () => {
    setActiveTab('screening');
    setTimeout(() => {
      const el = document.getElementById('screening-form-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <header className="header-nav-floating-wrapper" style={{ position: 'sticky', top: 0, zIndex: 1000, width: '100%', padding: '0.75rem 1rem' }}>
      <div 
        className="floating-pill-nav" 
        style={{ 
          maxWidth: '1320px', 
          width: '100%',
          padding: '0.6rem 1.25rem', 
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '9999px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        {/* Left: Brand + Clinical Status Pill */}
        <div 
          className="pill-brand" 
          onClick={() => setActiveTab('screening')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.65rem' }}
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: '#0f0f0f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0L14.2 9.8L24 12L14.2 14.2L12 24L9.8 14.2L0 12L9.8 9.8L12 0Z" fill="#00e87e" />
            </svg>
          </div>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#0f0f0f', fontFamily: 'var(--font-main)' }}>
            DIAGNOTECH
          </span>
          <span style={{
            fontSize: '0.68rem',
            fontWeight: 800,
            background: 'rgba(0, 232, 126, 0.15)',
            color: '#047857',
            padding: '3px 8px',
            borderRadius: '9999px',
            border: '1px solid rgba(0, 232, 126, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00e87e', display: 'inline-block' }} />
            QKSVM-v1.0
          </span>
        </div>

        {/* Center: Segmented Navigation Items */}
        <nav className="pill-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <button
            className={`pill-nav-link ${activeTab === 'screening' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('screening')}
            id="nav-screening-btn"
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.84rem',
              fontWeight: activeTab === 'screening' ? 700 : 500,
              color: activeTab === 'screening' ? '#0f0f0f' : '#4b5563',
              backgroundColor: activeTab === 'screening' ? '#f1f5f9' : 'transparent',
              border: activeTab === 'screening' ? '1px solid #e2e8f0' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Screening
          </button>

          <button
            className={`pill-nav-link ${activeTab === 'careplan' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('careplan')}
            id="nav-careplan-btn"
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.84rem',
              fontWeight: activeTab === 'careplan' ? 700 : 500,
              color: activeTab === 'careplan' ? '#0f0f0f' : '#4b5563',
              backgroundColor: activeTab === 'careplan' ? '#f1f5f9' : 'transparent',
              border: activeTab === 'careplan' ? '1px solid #e2e8f0' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Care Plan
          </button>

          <button
            className={`pill-nav-link ${activeTab === 'analytics' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('analytics')}
            id="nav-analytics-btn"
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.84rem',
              fontWeight: activeTab === 'analytics' ? 700 : 500,
              color: activeTab === 'analytics' ? '#0f0f0f' : '#4b5563',
              backgroundColor: activeTab === 'analytics' ? '#f1f5f9' : 'transparent',
              border: activeTab === 'analytics' ? '1px solid #e2e8f0' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Analytics
          </button>

          <button
            className={`pill-nav-link ${activeTab === 'quantum' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('quantum')}
            id="nav-quantum-btn"
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.84rem',
              fontWeight: activeTab === 'quantum' ? 700 : 500,
              color: activeTab === 'quantum' ? '#0f0f0f' : '#4b5563',
              backgroundColor: activeTab === 'quantum' ? '#f1f5f9' : 'transparent',
              border: activeTab === 'quantum' ? '1px solid #e2e8f0' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Quantum ML
          </button>

          <button
            className={`pill-nav-link ${activeTab === 'docs' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('docs')}
            id="nav-docs-btn"
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.84rem',
              fontWeight: activeTab === 'docs' ? 700 : 500,
              color: activeTab === 'docs' ? '#0f0f0f' : '#4b5563',
              backgroundColor: activeTab === 'docs' ? '#f1f5f9' : 'transparent',
              border: activeTab === 'docs' ? '1px solid #e2e8f0' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Docs
          </button>
        </nav>

        {/* Right: Quick Clinical Actions & Language Switcher */}
        <div className="pill-right-group" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {onOpenRegistry && (
            <button
              onClick={onOpenRegistry}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                backgroundColor: '#eff6ff',
                border: '1px solid #dbeafe',
                color: '#1d4ed8',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title="Open Patient Registry (Category 1)"
              id="nav-open-registry-btn"
            >
              <Users size={14} />
              <span>Patients</span>
            </button>
          )}

          {onOpenTelehealth && (
            <button
              onClick={() => onOpenTelehealth('call')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                backgroundColor: '#f0fdf4',
                border: '1px solid #dcfce7',
                color: '#15803d',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title="Launch Telemedicine Virtual Room (Category 4)"
              id="nav-open-telehealth-btn"
            >
              <Video size={14} />
              <span>Telehealth</span>
            </button>
          )}

          {/* Language Selector Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.45rem 0.75rem',
                borderRadius: '9999px',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                color: '#374151',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              id="nav-lang-btn"
            >
              <Globe size={13} color="#6b7280" />
              <span>{language.toUpperCase()}</span>
            </button>

            {langMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '120%',
                right: 0,
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '0.4rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem',
                zIndex: 1100,
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
              }}>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangMenuOpen(false);
                    }}
                    style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: '8px',
                      backgroundColor: language === lang.code ? '#eff6ff' : 'transparent',
                      color: language === lang.code ? '#1d4ed8' : '#1f2937',
                      border: 'none',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    {lang.label} ({lang.code.toUpperCase()})
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Signature Koru UX Bright Green Button */}
          <button
            onClick={scrollToScreening}
            style={{
              backgroundColor: '#00e87e',
              color: '#050811',
              borderRadius: '9999px',
              padding: '0.52rem 1.3rem',
              fontSize: '0.82rem',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0, 232, 126, 0.35)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s ease'
            }}
            id="pill-cta-screening-btn"
          >
            <span>Start Screening</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}
