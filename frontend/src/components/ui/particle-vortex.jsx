import React, { useEffect, useRef } from 'react';

export function ParticleVortex({
  titleTop = "Beyond",
  titleBottom = "all limits",
  description = "Diagnotech is an explainable clinical engine that turns patient biometrics into calibrated prognostic risk — anticipating disease trajectory before symptoms manifest. One engine, dual validated pathways: metabolic, cardiovascular, and quantum kernel benchmarking. No ceilings, no limits — just intelligence that keeps pace with patient care."
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Generate 1,200 vortex particles
    const particleCount = 1200;
    const particles = [];
    const colors = [
      'rgba(192, 132, 252, ', // purple/violet
      'rgba(244, 114, 182, ', // pink/magenta
      'rgba(56, 189, 248, ',  // cyan/blue
      'rgba(255, 255, 255, '  // pure white sparkle
    ];

    for (let i = 0; i < particleCount; i++) {
      const r = 50 + Math.pow(Math.random(), 1.6) * (Math.min(width, height) * 0.46);
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.003 + (1 / (r + 20)) * 0.45;
      const size = Math.random() * 2 + 0.6;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const baseAlpha = Math.random() * 0.75 + 0.25;

      particles.push({
        r,
        angle,
        speed,
        size,
        color,
        baseAlpha,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.02 + Math.random() * 0.03
      });
    }

    const render = () => {
      ctx.fillStyle = 'rgba(5, 7, 14, 0.22)';
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Soft ambient radial glow at center
      const radialGradient = ctx.createRadialGradient(
        centerX, centerY, 10,
        centerX, centerY, Math.min(width, height) * 0.5
      );
      radialGradient.addColorStop(0, 'rgba(139, 92, 246, 0.12)');
      radialGradient.addColorStop(0.5, 'rgba(236, 72, 153, 0.05)');
      radialGradient.addColorStop(1, 'transparent');

      ctx.fillStyle = radialGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, Math.min(width, height) * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Render swirling particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.angle += p.speed;
        p.wobble += p.wobbleSpeed;

        const effectiveR = p.r + Math.sin(p.wobble) * 4;
        const x = centerX + Math.cos(p.angle) * effectiveR;
        const y = centerY + Math.sin(p.angle) * (effectiveR * 0.78);

        const alpha = Math.max(0.1, p.baseAlpha + Math.sin(p.wobble) * 0.2);

        ctx.fillStyle = p.color + alpha + ')';
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="particle-vortex-section" style={{
      position: 'relative',
      minHeight: '600px',
      borderRadius: '28px',
      overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backgroundColor: '#05070e',
      boxShadow: '0 30px 80px -20px rgba(0, 0, 0, 0.8), 0 0 50px -10px rgba(124, 58, 237, 0.25)',
      marginBottom: '3rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '3rem 2.5rem'
    }}>
      {/* Background Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Top Title: "Beyond" */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <h2 style={{
          fontSize: 'clamp(3.5rem, 8vw, 6.5rem)',
          fontWeight: 300,
          letterSpacing: '-0.04em',
          color: '#ffffff',
          lineHeight: 0.95,
          fontFamily: 'var(--font-main)',
          textShadow: '0 0 40px rgba(255, 255, 255, 0.3)'
        }}>
          {titleTop}
        </h2>
      </div>

      {/* Centered Glowing 4-Point Diamond Star */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 3,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          position: 'absolute',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(168, 85, 247, 0.6) 25%, rgba(139, 92, 246, 0.2) 55%, transparent 80%)',
          filter: 'blur(12px)',
          animation: 'pulseStarGlow 3s ease-in-out infinite alternate'
        }} />

        <svg
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: 'relative',
            filter: 'drop-shadow(0 0 16px rgba(255, 255, 255, 1)) drop-shadow(0 0 30px rgba(192, 132, 252, 0.9))'
          }}
        >
          <path
            d="M12 0L14.2 9.8L24 12L14.2 14.2L12 24L9.8 14.2L0 12L9.8 9.8L12 0Z"
            fill="#ffffff"
          />
        </svg>
      </div>

      {/* Bottom Row: Description Left + "all limits" Right */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '2rem'
      }}>
        <div style={{ maxWidth: '460px' }}>
          <p style={{
            fontSize: '0.92rem',
            lineHeight: 1.65,
            color: 'rgba(255, 255, 255, 0.78)',
            fontWeight: 400
          }}>
            {description}
          </p>
        </div>

        <div>
          <h2 style={{
            fontSize: 'clamp(3.5rem, 8vw, 6.5rem)',
            fontWeight: 400,
            letterSpacing: '-0.04em',
            color: '#ffffff',
            lineHeight: 0.95,
            fontFamily: 'var(--font-main)',
            textAlign: 'right',
            textShadow: '0 0 40px rgba(255, 255, 255, 0.3)'
          }}>
            {titleBottom}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default ParticleVortex;
