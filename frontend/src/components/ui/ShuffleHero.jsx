import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  HeartHandshake, 
  Building2, 
  ShieldCheck, 
  Award, 
  Pause, 
  Play, 
  ExternalLink,
  Stethoscope
} from 'lucide-react';

const AIIMS_DATA = [
  { id: 1, name: "AIIMS New Delhi", location: "Ansari Nagar, New Delhi", est: "1956", src: "/images/aiims/aiims-delhi.jpg", badge: "Apex Pioneer" },
  { id: 2, name: "AIIMS Rishikesh", location: "Uttarakhand", est: "2012", src: "/images/aiims/aiims-rishikesh.jpg", badge: "Himalayan Vanguard" },
  { id: 3, name: "AIIMS Bhopal", location: "Madhya Pradesh", est: "2012", src: "/images/aiims/aiims-bhopal.jpg", badge: "Central Excellence" },
  { id: 4, name: "AIIMS Jodhpur", location: "Rajasthan", est: "2012", src: "/images/aiims/aiims-jodhpur.png", badge: "Desert Citadel" },
  { id: 5, name: "AIIMS Bhubaneswar", location: "Odisha", est: "2012", src: "/images/aiims/aiims-bhubaneswar.jpg", badge: "Eastern Pillar" },
  { id: 6, name: "AIIMS Patna", location: "Bihar", est: "2012", src: "/images/aiims/aiims-patna.png", badge: "Gangetic Lifeline" },
  { id: 7, name: "AIIMS Raipur", location: "Chhattisgarh", est: "2012", src: "/images/aiims/aiims-raipur.jpg", badge: "Tribal & Tertiary Care" },
  { id: 8, name: "AIIMS Nagpur", location: "Maharashtra", est: "2018", src: "/images/aiims/aiims-nagpur.jpg", badge: "Vidarbha Beacon" },
  { id: 9, name: "AIIMS Kalyani", location: "West Bengal", est: "2019", src: "/images/aiims/aiims-kalyani.jpg", badge: "Bengal Citadel" },
  { id: 10, name: "AIIMS Mangalagiri", location: "Andhra Pradesh", est: "2018", src: "/images/aiims/aiims-mangalagiri.jpg", badge: "Coastal Center" },
  { id: 11, name: "AIIMS Gorakhpur", location: "Uttar Pradesh", est: "2019", src: "/images/aiims/aiims-gorakhpur.jpg", badge: "Purvanchal Pride" },
  { id: 12, name: "AIIMS Bibinagar", location: "Telangana", est: "2019", src: "/images/aiims/aiims-bibinagar.jpg", badge: "Deccan Milestone" },
  { id: 13, name: "AIIMS Deoghar", location: "Jharkhand", est: "2019", src: "/images/aiims/aiims-deoghar.jpg", badge: "Santhal Sanctuary" },
  { id: 14, name: "AIIMS Rajkot", location: "Gujarat", est: "2020", src: "/images/aiims/aiims-rajkot.jpg", badge: "Saurashtra Hub" },
  { id: 15, name: "AIIMS Bilaspur", location: "Himachal Pradesh", est: "2020", src: "/images/aiims/aiims-bilaspur.jpg", badge: "Northern Haven" },
  { id: 16, name: "AIIMS Bathinda", location: "Punjab", est: "2019", src: "/images/aiims/aiims-bathinda.jpg", badge: "Malwa Healer" },
];

// Fisher-Yates array shuffler
const shuffleArray = (array) => {
  const arr = [...array];
  let currentIndex = arr.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
  }
  return arr;
};

export default function ShuffleHero({ onEnterMainSite }) {
  const [squares, setSquares] = useState(AIIMS_DATA);
  const [selectedAiims, setSelectedAiims] = useState(null);

  const runShuffle = () => setSquares(prev => shuffleArray(prev));

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '2.5rem 1.5rem',
      backgroundColor: '#060911',
      backgroundImage: `
        radial-gradient(ellipse 70% 50% at 50% -10%, rgba(6, 182, 212, 0.18), transparent),
        radial-gradient(ellipse 50% 50% at 85% 85%, rgba(139, 92, 246, 0.14), transparent),
        radial-gradient(circle 500px at 10% 50%, rgba(16, 185, 129, 0.08), transparent)
      `
    }}>
      {/* Decorative subtle grid line background */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Top Banner: Direct Entry & Redirect Status Bar */}
      <header style={{
        maxWidth: '1240px',
        width: '100%',
        margin: '0 auto 2rem auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)'
          }}>
            <Stethoscope size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
                DIAGNOTECH
              </span>
              <span style={{
                fontSize: '0.68rem',
                textTransform: 'uppercase',
                fontWeight: 700,
                letterSpacing: '0.08em',
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(6, 182, 212, 0.15)',
                color: '#38bdf8',
                border: '1px solid rgba(6, 182, 212, 0.3)'
              }}>
                🇮🇳 AIIMS TRIBUTE EDITION
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Saluting India's Premier Medical Research & Healthcare Institutions
            </p>
          </div>
        </div>


      </header>

      {/* Main Shuffle Hero Container (Hover.dev structure) */}
      <div style={{
        maxWidth: '1240px',
        width: '100%',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
        flex: 1,
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'center',
          gap: '3rem',
          width: '100%',
          padding: '1rem 0'
        }}>
          {/* Left Column: Tribute & Appreciation Typography */}
          <div style={{ maxWidth: '580px' }}>
            {/* Appreciation Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 0.95rem',
                borderRadius: '9999px',
                background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.16), rgba(139, 92, 246, 0.14))',
                border: '1px solid rgba(6, 182, 212, 0.35)',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#38bdf8',
                letterSpacing: '0.06em',
                marginBottom: '1.25rem',
                boxShadow: '0 0 20px rgba(6, 182, 212, 0.15)'
              }}
            >
              <Sparkles size={14} color="#38bdf8" />
              <span>✦ DEDICATED TO BHARAT'S APEX MEDICAL INSTITUTES</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                fontSize: 'clamp(2.1rem, 4vw, 3.4rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '1.25rem',
                color: '#ffffff'
              }}
            >
              Honoring AIIMS & India's{' '}
              <span style={{
                background: 'linear-gradient(135deg, #38bdf8 0%, #a855f7 60%, #34d399 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}>
                Healthcare Champions
              </span>
            </motion.h1>

            {/* Eloquent Text of Appreciation */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                fontSize: '1rem',
                lineHeight: 1.65,
                color: '#94a3b8',
                marginBottom: '1.5rem'
              }}
            >
              From complex multi-organ transplants to round-the-clock emergency care and landmark indigenous biomedical research, the faculty, surgeons, doctors, and nurses of the <strong style={{ color: '#f1f5f9' }}>All India Institutes of Medical Sciences (AIIMS)</strong> represent the pinnacle of selfless devotion and scientific rigor.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              style={{
                fontSize: '0.92rem',
                lineHeight: 1.6,
                color: '#64748b',
                marginBottom: '1.8rem',
                borderLeft: '2px solid rgba(6, 182, 212, 0.4)',
                paddingLeft: '1rem'
              }}
            >
              <em>Diagnotech</em> stands humbly inspired by their tireless service — engineering explainable AI and quantum kernel intelligence to bring early cardiovascular and metabolic risk screening to every clinic across India.
            </motion.p>

            {/* Impact Highlights Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '0.85rem',
                marginBottom: '2rem'
              }}
            >
              <div style={{
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}>
                <Building2 size={20} color="#38bdf8" />
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>24+</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>AIIMS Campuses</div>
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}>
                <HeartHandshake size={20} color="#10b981" />
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>Millions</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Lives Healed</div>
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}>
                <Award size={20} color="#a855f7" />
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>Apex</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Global Benchmarks</div>
                </div>
              </div>
            </motion.div>

            {/* Interactive Call To Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <button
                onClick={onEnterMainSite}
                id="cta-enter-main-site-btn"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#05070e',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  padding: '0.85rem 1.85rem',
                  borderRadius: '9999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  boxShadow: '0 8px 30px rgba(255, 255, 255, 0.25)',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(56, 189, 248, 0.4)';
                  e.currentTarget.style.backgroundColor = '#38bdf8';
                  e.currentTarget.style.color = '#04101e';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.color = '#05070e';
                }}
              >
                <span>Enter Diagnotech Platform</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => {
                  setSquares(prev => shuffleArray(prev));
                }}
                id="shuffle-again-btn"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#e2e8f0',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  padding: '0.8rem 1.4rem',
                  borderRadius: '9999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.4)';
                  e.currentTarget.style.color = '#38bdf8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.color = '#e2e8f0';
                }}
              >
                <span>Shuffle AIIMS Grid ✦</span>
              </button>
            </motion.div>
          </div>

          {/* Right Column: Hover.dev 4x4 Shuffling AIIMS Image Grid */}
          <div style={{ position: 'relative' }}>
            {/* Ambient Backlight Glow behind Grid */}
            <div style={{
              position: 'absolute',
              inset: '-20px',
              background: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.18), rgba(139, 92, 246, 0.12), transparent 70%)',
              filter: 'blur(35px)',
              pointerEvents: 'none',
              zIndex: 0
            }} />

            {/* 4x4 Grid Container */}
            <div 
              id="aiims-shuffle-grid"
              onMouseEnter={runShuffle}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gridTemplateRows: 'repeat(4, 1fr)',
                height: '470px',
                width: '100%',
                maxWidth: '520px',
                margin: '0 auto',
                gap: '8px',
                position: 'relative',
                zIndex: 1,
                padding: '8px',
                borderRadius: '24px',
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(6, 182, 212, 0.05)'
              }}
            >
              {squares.map((aiims) => (
                <motion.div
                  key={aiims.id}
                  layout
                  transition={{ 
                    type: "spring", 
                    damping: 20, 
                    stiffness: 140,
                    mass: 0.8
                  }}
                  whileHover={{ 
                    scale: 1.08, 
                    zIndex: 20,
                    transition: { duration: 0.18 }
                  }}
                  onClick={() => setSelectedAiims(aiims)}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    backgroundImage: `url(${aiims.src})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: selectedAiims?.id === aiims.id 
                      ? '2px solid #38bdf8' 
                      : '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)'
                  }}
                >
                  {/* Subtle dark gradient overlay */}
                  <div 
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(4, 10, 24, 0.92) 0%, rgba(4, 10, 24, 0.2) 60%, transparent 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      padding: '6px',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    <span style={{
                      fontSize: '8px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: '#38bdf8',
                      letterSpacing: '0.05em',
                      lineHeight: 1
                    }}>
                      {aiims.location.split(',')[0]}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: '#ffffff',
                      lineHeight: 1.15,
                      marginTop: '2px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {aiims.name.replace('AIIMS ', '')}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Selected AIIMS Detail Popover */}
            <AnimatePresence>
              {selectedAiims && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  style={{
                    position: 'absolute',
                    bottom: '-25px',
                    left: '5%',
                    right: '5%',
                    zIndex: 30,
                    backgroundColor: 'rgba(11, 17, 32, 0.95)',
                    border: '1px solid rgba(6, 182, 212, 0.4)',
                    borderRadius: '16px',
                    padding: '1rem 1.25rem',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(6, 182, 212, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      backgroundImage: `url(${selectedAiims.src})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }} />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>
                          {selectedAiims.name}
                        </h4>
                        <span style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          backgroundColor: 'rgba(6, 182, 212, 0.18)',
                          color: '#38bdf8'
                        }}>
                          {selectedAiims.badge}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        {selectedAiims.location} • Established {selectedAiims.est} • Autonomous Institute of National Importance
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedAiims(null)}
                    style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
                  >
                    Close
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Citation */}
      <footer style={{
        maxWidth: '1240px',
        width: '100%',
        margin: '2rem auto 0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        fontSize: '0.75rem',
        color: '#64748b',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        paddingTop: '1rem',
        position: 'relative',
        zIndex: 5
      }}>
        <div>
          Dedicated to the Doctors, Medical Officers, Faculty & Healthcare Staff of All India Institutes of Medical Sciences (AIIMS)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <span>Ministry of Health & Family Welfare, Govt. of India</span>
          <button
            onClick={onEnterMainSite}
            style={{ color: '#38bdf8', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <span>Skip to Clinical App</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </footer>
    </div>
  );
}
