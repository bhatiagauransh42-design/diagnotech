import React, { useRef, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Sparkles, Activity, Compass, ArrowDownRight, ArrowUpRight } from 'lucide-react';

/**
 * RiskGauge - Gate Flow Telemetry Component
 * Displays the predicted clinical risk inside an animated converging Gate Flow
 * focal portal with non-overlapping concentric telemetry rings and a dedicated
 * Clinical Decision Cutoff Gate Bar.
 */
export default function RiskGauge({ 
  probability = 0.46, 
  riskCategory = 'Moderate', 
  riskColor = '#f59e0b', 
  disease = 'diabetes',
  modelName = '',
  modelVersion = ''
}) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const percentage = Math.round(probability * 100);
  const marginFromCutoff = ((probability - 0.50) * 100).toFixed(1);
  const isAboveCutoff = probability >= 0.50;

  const diseaseTitle = disease === 'diabetes' ? 'Type 2 Diabetes' : 'Cardiovascular Disease';
  const defaultModelName = disease === 'diabetes' 
    ? 'Balanced Random Forest Ensemble (17 CDC Indicators)' 
    : 'Gradient Boosted XGBoost Classifier (17 CDC Indicators)';

  // SVG Geometry for Gate Portal Aperture
  const size = 280;
  const center = size / 2; // 140
  const radius = 96;
  const stroke = 10;
  const circumference = 2 * Math.PI * radius; // ≈ 603.18
  // Start from top (-90 deg)
  const strokeDashoffset = circumference - (Math.min(1, Math.max(0, probability)) * circumference);

  // Angle in radians for the tip of the progress arc
  const endAngleRad = (-Math.PI / 2) + (probability * 2 * Math.PI);
  const tipX = center + radius * Math.cos(endAngleRad);
  const tipY = center + radius * Math.sin(endAngleRad);

  // Cutoff 50% marker position (bottom: angle = PI / 2)
  const cutoffAngleRad = Math.PI / 2;
  const cutoffX = center + radius * Math.cos(cutoffAngleRad);
  const cutoffY = center + radius * Math.sin(cutoffAngleRad);

  // Generate 60 Outer Telemetry Ticks around the gate aperture
  const ticks = [];
  const tickCount = 60;
  const tickInnerR = 118;
  const tickOuterR = 124;
  for (let i = 0; i < tickCount; i++) {
    const angle = (i / tickCount) * 2 * Math.PI - Math.PI / 2;
    const isMajor = i % 15 === 0; // 0%, 25%, 50%, 75%
    const isCutoff = i === 30; // 50% cutoff
    const rIn = isMajor ? tickInnerR - 4 : tickInnerR;
    const rOut = isMajor ? tickOuterR + 2 : tickOuterR;
    ticks.push({
      x1: center + rIn * Math.cos(angle),
      y1: center + rIn * Math.sin(angle),
      x2: center + rOut * Math.cos(angle),
      y2: center + rOut * Math.sin(angle),
      isMajor,
      isCutoff,
      active: (i / tickCount) <= probability
    });
  }

  // Converging Gate Flow Particles Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = size);
    let height = (canvas.height = size);
    const cx = width / 2;
    const cy = height / 2;

    // Parse riskColor to rgb
    let r = 245, g = 158, b = 11;
    if (riskColor.startsWith('#')) {
      const hex = riskColor.replace('#', '');
      if (hex.length === 6) {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      }
    }

    const particleCount = 28;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        dist: 100 + Math.random() * 38,
        speed: 0.4 + Math.random() * 0.6,
        size: 0.8 + Math.random() * 1.6,
        spiralBend: (Math.random() - 0.5) * 0.9,
        alpha: 0.2 + Math.random() * 0.6
      });
    }

    let lastTime = performance.now();

    const render = (time) => {
      const dt = Math.min(0.1, (time - lastTime) / 1000);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Subtle converging flow vectors
      const streamCount = 8;
      ctx.lineWidth = 0.75;
      for (let s = 0; s < streamCount; s++) {
        const angle = (s / streamCount) * Math.PI * 2 + (time * 0.0001);
        const startX = cx + Math.cos(angle) * 132;
        const startY = cy + Math.sin(angle) * 132;
        const cpAngle = angle + 0.35;
        const cpX = cx + Math.cos(cpAngle) * 105;
        const cpY = cy + Math.sin(cpAngle) * 105;
        const endX = cx + Math.cos(angle) * 85;
        const endY = cy + Math.sin(angle) * 85;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(cpX, cpY, endX, endY);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.12)`;
        ctx.stroke();
      }

      // Draw & update streaming particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.dist -= dt * 24 * p.speed;
        p.angle += dt * 0.3 * p.spiralBend;

        // Reset particle when it reaches inner gate sanctum
        if (p.dist <= 82) {
          p.dist = 135 + Math.random() * 5;
          p.angle = Math.random() * Math.PI * 2;
        }

        const px = cx + Math.cos(p.angle) * p.dist;
        const py = cy + Math.sin(p.angle) * p.dist;

        // Fade in from edge, fade out as it enters the sanctum
        const edgeFade = Math.min(1, (138 - p.dist) / 20);
        const innerFade = Math.min(1, (p.dist - 80) / 15);
        const currentAlpha = Math.max(0, p.alpha * edgeFade * innerFade);

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${currentAlpha})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${currentAlpha * 0.8})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [riskColor, size]);

  const getRiskIcon = () => {
    if (riskCategory === 'High') return <ShieldAlert size={18} color={riskColor} />;
    if (riskCategory === 'Moderate') return <AlertTriangle size={18} color={riskColor} />;
    return <ShieldCheck size={18} color={riskColor} />;
  };

  return (
    <div className="glass-panel risk-gauge-card gate-flow-gauge-card" id="risk-gauge-container" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '18px', padding: '1.5rem', color: '#0F0F0F' }}>
      {/* Header Telemetry Pill */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: '0.75rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid #E5E7EB'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: riskColor,
            boxShadow: `0 0 10px ${riskColor}`,
            display: 'inline-block'
          }} />
          <span style={{
            fontSize: '0.72rem',
            color: '#64748B',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)'
          }}>
            GATE FLOW TELEMETRY
          </span>
        </div>

        <span style={{
          fontSize: '0.7rem',
          padding: '0.2rem 0.55rem',
          borderRadius: '9999px',
          backgroundColor: `${riskColor}18`,
          border: `1px solid ${riskColor}40`,
          color: riskColor,
          fontWeight: 700,
          fontFamily: 'var(--font-mono)'
        }}>
          PREDICTED RISK
        </span>
      </div>

      {/* Disease Target Title */}
      <h3 style={{
        fontSize: '1.35rem',
        fontWeight: 800,
        color: '#0F0F0F',
        marginTop: '0.1rem',
        marginBottom: '0.25rem',
        letterSpacing: '-0.02em'
      }}>
        {diseaseTitle}
      </h3>
      <div style={{ fontSize: '0.72rem', color: '#64748B', marginBottom: '1.25rem' }}>
        {modelName || defaultModelName}
      </div>

      {/* Central Gate Flow Aperture Portal */}
      <div 
        className="gauge-gate-aperture" 
        style={{
          position: 'relative',
          width: `${size}px`,
          height: `${size}px`,
          margin: '0.5rem auto 1.25rem auto'
        }}
      >
        {/* Ambient Converging Flow Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

        {/* Concentric SVG Telemetry Rings & Calibrated Arc */}
        <svg
          height={size}
          width={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 2
          }}
        >
          <defs>
            {/* Linear gradient for smooth plasma arc */}
            <linearGradient id="gateArcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="60%" stopColor={riskColor} />
              <stop offset="100%" stopColor={riskColor} />
            </linearGradient>

            {/* Inset glow filter */}
            <filter id="gateGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={riskColor} floodOpacity="0.75" />
            </filter>
          </defs>

          {/* 1. Outer Radial Telemetry Ticks */}
          <g opacity="0.6">
            {ticks.map((t, idx) => (
              <line
                key={idx}
                x1={t.x1}
                y1={t.y1}
                x2={t.x2}
                y2={t.y2}
                stroke={t.isCutoff ? '#0284C7' : t.active ? riskColor : 'rgba(0, 0, 0, 0.12)'}
                strokeWidth={t.isCutoff ? 2.5 : t.isMajor ? 1.75 : 0.8}
                strokeLinecap="round"
              />
            ))}
          </g>

          {/* 2. Slow Orbit Dashed Guide Ring */}
          <circle
            cx={center}
            cy={center}
            r={110}
            fill="none"
            stroke="rgba(0, 0, 0, 0.06)"
            strokeWidth="1"
            strokeDasharray="4 8"
            style={{ animation: 'spinGate 30s linear infinite', transformOrigin: `${center}px ${center}px` }}
          />

          {/* 3. Outer Background Arc Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth={stroke}
          />

          {/* 4. Active Probability Progress Arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="url(#gateArcGrad)"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{
              strokeDashoffset,
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              filter: 'url(#gateGlow)'
            }}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
          />

          {/* 5. Plasma Leading Comet Dot at Current Probability Point */}
          {probability > 0.02 && (
            <circle
              cx={tipX}
              cy={tipY}
              r={stroke / 2 + 2}
              fill="#ffffff"
              filter="url(#gateGlow)"
            />
          )}

          {/* 6. Standard 50% Cutoff Gate Reference Notch (At Bottom) */}
          <g>
            <circle
              cx={cutoffX}
              cy={cutoffY}
              r={4}
              fill="#0284C7"
              style={{ filter: 'drop-shadow(0 0 4px #0284C7)' }}
            />
            <line
              x1={cutoffX}
              y1={cutoffY - 8}
              x2={cutoffX}
              y2={cutoffY + 8}
              stroke="#0284C7"
              strokeWidth="2"
            />
          </g>
        </svg>

        {/* 7. Central Protected Gate Sanctum (160px diameter, zero overlap) */}
        <div
          className="gauge-sanctum-core"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #FFFFFF 0%, #F8FAFC 100%)',
            border: `2px solid ${riskColor}`,
            boxShadow: `0 4px 16px rgba(0, 0, 0, 0.06), 0 0 16px ${riskColor}18`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3,
            userSelect: 'none'
          }}
        >
          {/* Top Label */}
          <div style={{
            fontSize: '0.68rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: '#64748B',
            fontFamily: 'var(--font-mono)',
            marginBottom: '0.15rem'
          }}>
            CALCULATED RISK
          </div>

          {/* Main Percentage Display */}
          <div style={{
            fontSize: '3.1rem',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            lineHeight: 1,
            color: riskColor,
            letterSpacing: '-0.03em'
          }}>
            {percentage}%
          </div>

          {/* Posterior Margin Pill */}
          <div style={{
            fontSize: '0.64rem',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            color: isAboveCutoff ? '#DC2626' : '#0284C7',
            backgroundColor: isAboveCutoff ? 'rgba(239, 68, 68, 0.1)' : 'rgba(2, 132, 199, 0.1)',
            border: isAboveCutoff ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid rgba(2, 132, 199, 0.25)',
            borderRadius: '9999px',
            padding: '0.15rem 0.55rem',
            marginTop: '0.3rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.2rem'
          }}>
            {isAboveCutoff ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            <span>{isAboveCutoff ? `+${marginFromCutoff}%` : `${marginFromCutoff}%`} CUTOFF</span>
          </div>
        </div>
      </div>

      {/* Risk Tier Classification Badge */}
      <div 
        className="risk-badge-large"
        style={{ 
          backgroundColor: `${riskColor}18`, 
          border: `1px solid ${riskColor}50`, 
          color: riskColor,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.55rem',
          padding: '0.55rem 1.4rem',
          borderRadius: '9999px',
          boxShadow: `0 4px 18px ${riskColor}20`,
          marginBottom: '1.25rem'
        }}
        id="risk-tier-badge"
      >
        {getRiskIcon()}
        <span style={{ fontSize: '0.95rem', fontWeight: 800, letterSpacing: '0.04em' }}>
          {riskCategory.toUpperCase()} RISK
        </span>
      </div>

      {/* Clinical Decision Cutoff Gate Bar (Interactive Visual Analysis) */}
      <div 
        className="clinical-cutoff-gate-panel"
        style={{
          width: '100%',
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '14px',
          padding: '1rem 1.2rem',
          marginTop: '0.25rem',
          textAlign: 'left'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#64748B'
          }}>
            Standard Clinical Decision Cutoff
          </span>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            color: '#0284C7'
          }}>
            50.0%
          </span>
        </div>

        {/* Multi-Zone Flow Meter Bar */}
        <div style={{ position: 'relative', height: '10px', width: '100%', marginBottom: '0.85rem' }}>
          {/* Gradient Track: Low (0-35%), Moderate (35-65%), High (65-100%) */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '9999px',
            background: 'linear-gradient(to right, #10b981 0%, #10b981 35%, #f59e0b 35%, #f59e0b 65%, #ef4444 65%, #ef4444 100%)',
            opacity: 0.35
          }} />

          {/* Active Fill up to current percentage */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${Math.min(100, Math.max(0, percentage))}%`,
            borderRadius: '9999px',
            backgroundColor: riskColor,
            boxShadow: `0 0 10px ${riskColor}`,
            transition: 'width 1s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }} />

          {/* 50% Standard Cutoff Milestone Line */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '-4px',
            bottom: '-4px',
            width: '2px',
            backgroundColor: '#0F0F0F',
            zIndex: 3
          }} />

          {/* Patient Current Pointer Pin */}
          <div style={{
            position: 'absolute',
            left: `${Math.min(98, Math.max(2, percentage))}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            border: `3px solid ${riskColor}`,
            boxShadow: `0 0 8px ${riskColor}`,
            zIndex: 4,
            transition: 'left 1s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }} />
        </div>

        {/* Legend & Interpretation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748B' }}>
          <span>0% (Low)</span>
          <span style={{ color: '#0F0F0F', fontWeight: 700 }}>▲ 50% Clinical Action Threshold</span>
          <span>100% (High)</span>
        </div>

        <div style={{
          marginTop: '0.75rem',
          padding: '0.6rem 0.85rem',
          borderRadius: '8px',
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          fontSize: '0.76rem',
          lineHeight: 1.45,
          color: '#334155'
        }}>
          {isAboveCutoff ? (
            <span>
              <strong style={{ color: '#DC2626' }}>Exceeds Clinical Decision Cutoff (+{marginFromCutoff}%):</strong> Diagnostic panel and structured clinical intervention recommended.
            </span>
          ) : (
            <span>
              <strong style={{ color: '#059669' }}>Below Clinical Decision Cutoff ({marginFromCutoff}%):</strong> Sub-threshold presentation. Continuous preventive monitoring protocol advised.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
