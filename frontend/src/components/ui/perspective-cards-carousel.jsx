import React, { useState } from 'react';
import { Sparkles, ArrowRight, Heart, Activity, Cpu } from 'lucide-react';
import { ScrambleLinkButton } from './scramble-link-button';

export function PerspectiveCardsCarousel({
  activeDisease = 'diabetes',
  onSelectDisease,
  onExploreAction
}) {
  // Available cards in 3D carousel
  const cards = [
    {
      id: 'cardiovascular',
      tag: 'cvd_xgb_v1.0 (XGBoost)',
      domain: 'CDC Cohort N=45,000',
      title: 'Cardiovascular Risk',
      subtitle: 'XGBClassifier • 9,000 Test Cohort (CDC BRFSS)',
      metric: 'ROC-AUC: 0.842 • RECALL: 79.6% • ACC: 77.4%',
      color: '#f43f5e',
      gradient: 'linear-gradient(145deg, #1e1124 0%, #4c0519 50%, #881337 100%)',
      glow: 'rgba(244, 63, 94, 0.4)',
      icon: <Heart size={28} color="#fb7185" />
    },
    {
      id: 'neural-core',
      tag: 'QSVC ZZFeatureMap (6-Qubit)',
      domain: '2,048 Shots • Statevector',
      title: 'Quantum Kernel Classifier',
      subtitle: 'Hilbert space state fidelity inner product K(x, z)',
      metric: 'ROC-AUC: 0.846 • RECALL: 82.5% • ACC: 79.2%',
      color: '#8b5cf6',
      gradient: 'linear-gradient(145deg, #3730a3 0%, #6d28d9 45%, #7c3aed 100%)',
      glow: 'rgba(139, 92, 246, 0.65)',
      isHeroCore: true
    },
    {
      id: 'diabetes',
      tag: 'diabetes_rf_v1.0 (Random Forest)',
      domain: 'CDC Cohort N=45,000',
      title: 'Type 2 Diabetes Screening',
      subtitle: 'RandomForestClassifier • 9,000 Test Cohort (CDC BRFSS)',
      metric: 'ROC-AUC: 0.838 • RECALL: 79.2% • ACC: 76.8%',
      color: '#06b6d4',
      gradient: 'linear-gradient(145deg, #0c202d 0%, #0e3a47 50%, #0369a1 100%)',
      glow: 'rgba(6, 182, 212, 0.45)',
      icon: <Activity size={28} color="#38bdf8" />
    }
  ];

  // Map activeDisease to center index: 0 = cardio, 1 = neural-core, 2 = diabetes
  const [selectedIndex, setSelectedIndex] = useState(
    activeDisease === 'cardiovascular' ? 0 : activeDisease === 'quantum' ? 1 : 2
  );
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });

  // Currently focused card: strictly the selected card (do not rotate to front merely on hover to prevent mouse-slip)
  const activeFocusIndex = selectedIndex;

  const handleMouseMove = (e, idx) => {
    if (activeFocusIndex !== idx) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setMouseTilt({ x: x * 14, y: -y * 14 });
  };

  const handleCardClick = (index, cardId) => {
    setSelectedIndex(index);
    if (cardId === 'cardiovascular' && onSelectDisease) {
      onSelectDisease('cardiovascular');
    } else if (cardId === 'diabetes' && onSelectDisease) {
      onSelectDisease('diabetes');
    } else if (cardId === 'neural-core' && onSelectDisease) {
      onSelectDisease('quantum');
    }
  };

  return (
    <div className="perspective-showcase-container" style={{
      position: 'relative',
      padding: '4rem 1rem 3.5rem',
      overflow: 'hidden',
      marginBottom: '3rem'
    }}>
      {/* Giant Typography Watermark across background (Video Frame 2 & 3) */}
      <div className="perspective-watermark" style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        whiteSpace: 'nowrap',
        fontSize: 'clamp(2.8rem, 7.5vw, 6.8rem)',
        fontWeight: 800,
        letterSpacing: '-0.03em',
        color: 'rgba(255, 255, 255, 0.035)',
        userSelect: 'none',
        pointerEvents: 'none',
        zIndex: 0,
        textTransform: 'uppercase',
        fontFamily: 'var(--font-main)'
      }}>
        Design that heals, without compromise
      </div>

      {/* 3D Perspective Stage */}
      <div 
        style={{
          perspective: '1300px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '520px',
          position: 'relative',
          zIndex: 2
        }}
        onMouseLeave={() => {
          setHoveredIndex(null);
          setMouseTilt({ x: 0, y: 0 });
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transformStyle: 'preserve-3d',
          position: 'relative',
          width: '320px',
          height: '460px'
        }}>
          {cards.map((card, idx) => {
            // Modulo-3 relative positioning
            const diff = (idx - activeFocusIndex + 3) % 3;
            const isFocused = diff === 0;

            let transformStyle = '';
            let zIndex = 10;
            let opacity = 0.78;

            if (isFocused) {
              const tiltX = hoveredIndex === idx ? mouseTilt.y : 0;
              const tiltY = hoveredIndex === idx ? mouseTilt.x : 0;
              transformStyle = `translateX(0px) translateZ(125px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.08)`;
              zIndex = 40;
              opacity = 1;
            } else if (diff === 2) {
              // Left Card
              transformStyle = hoveredIndex === idx
                ? 'translateX(-290px) translateZ(-70px) rotateY(26deg) scale(0.94)'
                : 'translateX(-290px) translateZ(-70px) rotateY(26deg) scale(0.90)';
              zIndex = hoveredIndex === idx ? 30 : 20;
              opacity = hoveredIndex === idx ? 0.95 : 0.75;
            } else {
              // Right Card
              transformStyle = hoveredIndex === idx
                ? 'translateX(290px) translateZ(-70px) rotateY(-26deg) scale(0.94)'
                : 'translateX(290px) translateZ(-70px) rotateY(-26deg) scale(0.90)';
              zIndex = hoveredIndex === idx ? 30 : 20;
              opacity = hoveredIndex === idx ? 0.95 : 0.75;
            }

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(idx, card.id)}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseMove={(e) => handleMouseMove(e, idx)}
                onMouseLeave={() => setMouseTilt({ x: 0, y: 0 })}
                className={`perspective-card ${isFocused ? 'is-active' : ''}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '320px',
                  height: '460px',
                  borderRadius: '26px',
                  background: card.gradient,
                  border: isFocused ? `1.5px solid ${card.color}` : '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: isFocused
                    ? `0 30px 70px -15px rgba(0, 0, 0, 0.95), 0 0 55px -5px ${card.glow}`
                    : '0 15px 35px -10px rgba(0, 0, 0, 0.7)',
                  transform: transformStyle,
                  transition: hoveredIndex === idx && (mouseTilt.x !== 0 || mouseTilt.y !== 0)
                    ? 'transform 0.5s ease-out, box-shadow 0.6s ease, border-color 0.5s ease'
                    : 'transform 2.0s ease-in-out, box-shadow 2.0s ease-in-out, opacity 2.0s ease-in-out, border-color 1.0s ease',
                  cursor: 'pointer',
                  zIndex: zIndex,
                  opacity: opacity,
                  padding: '1.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  userSelect: 'none',
                  backdropFilter: 'blur(24px)',
                  willChange: 'transform, box-shadow',
                  overflow: 'hidden'
                }}
              >
                {/* Dynamic specular light reflection on 3D hover */}
                {isFocused && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '26px',
                    background: 'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.15), transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 1
                  }} />
                )}

                {/* Card Top: Pill Tag & Meta */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                  <span style={{
                    padding: '0.32rem 0.85rem',
                    borderRadius: '9999px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    {card.tag}
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'rgba(255, 255, 255, 0.65)'
                  }}>
                    {card.domain}
                  </span>
                </div>

                {/* Card Center: Glowing Diamond Star or Disease Symbol */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  position: 'relative',
                  zIndex: 2
                }}>
                  {card.isHeroCore ? (
                    <div style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {/* Radial light glow */}
                      <div style={{
                        position: 'absolute',
                        width: '130px',
                        height: '130px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(192, 132, 252, 0.7) 35%, transparent 75%)',
                        filter: 'blur(10px)',
                        animation: 'pulseStarGlow 2.5s ease-in-out infinite alternate'
                      }} />
                      {/* 4-Point Star */}
                      <svg
                        width="46"
                        height="46"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          filter: 'drop-shadow(0 0 16px rgba(255, 255, 255, 1))'
                        }}
                      >
                        <path
                          d="M12 0L14.2 9.8L24 12L14.2 14.2L12 24L9.8 14.2L0 12L9.8 9.8L12 0Z"
                          fill="#ffffff"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      border: `1.5px solid ${card.color}60`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 0 30px ${card.glow}`
                    }}>
                      {card.icon}
                    </div>
                  )}
                </div>

                {/* Card Bottom: Title & Metrics */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <h3 style={{
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    lineHeight: 1.25,
                    marginBottom: '0.45rem',
                    letterSpacing: '-0.02em'
                  }}>
                    {card.title}
                  </h3>
                  <p style={{
                    fontSize: '0.8rem',
                    color: 'rgba(255, 255, 255, 0.75)',
                    lineHeight: 1.45,
                    marginBottom: '0.85rem'
                  }}>
                    {card.subtitle}
                  </p>
                  <div style={{
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'rgba(255, 255, 255, 0.85)',
                    paddingTop: '0.5rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span>{card.metric}</span>
                    <span style={{ color: card.color, fontWeight: 700 }}>
                      {isFocused ? '● 3D ACTIVE' : 'HOVER TO FOCUS →'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Button below 3D Cards: "Explore the collection" (Video Frame 2 & 3) */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '2.5rem',
        position: 'relative',
        zIndex: 3
      }}>
        <ScrambleLinkButton
          as="button"
          btnText="Explore the collection"
          variant="primary"
          hoverColor="#8b5cf6"
          onClick={() => {
            if (onExploreAction) {
              onExploreAction();
            } else {
              const el = document.getElementById('screening-form-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          style={{
            backgroundColor: '#0a0d17',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '9999px',
            padding: '0.75rem 2rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.6)'
          }}
          id="explore-collection-btn"
        />
      </div>
    </div>
  );
}

export default PerspectiveCardsCarousel;
