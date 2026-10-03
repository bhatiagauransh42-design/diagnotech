import React, { useRef, useEffect, useCallback } from "react";
import { cn } from "../../lib/utils";

/**
 * GatewayFlow - Atmospheric converging flow & particle backdrop
 * Creates a sophisticated canvas visualization representing converging
 * clinical/quantum data streams toward a focal gateway.
 */
export function GatewayFlow({
  mode = "dark",
  speed = 1.0,
  size = 2,
  gap = 24,
  length = 100,
  density = 35,
  strokeWidth = 1,
  opacity = 0.35,
  hue = 190, // Cyan default matching Diagnotech palette
  saturation = 85,
  brightness = 65,
  className = "",
  style = {},
}) {
  const canvasRef = useRef(null);
  const animFrameId = useRef(null);
  const particlesRef = useRef([]);
  const ripplesRef = useRef([]);
  const mousePosRef = useRef({ x: 0.5, y: 0.5 });
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
  }, []);

  const initParticles = useCallback((w, h) => {
    const count = Math.min(120, Math.floor((w * h) / (10000 / (density / 20))));
    const particles = [];

    for (let i = 0; i < count; i++) {
      // Angle around focal center
      const angle = Math.random() * Math.PI * 2;
      // Distance from center (distributed outwards)
      const dist = Math.random() * Math.max(w, h) * 0.7 + 60;
      // Random speed variation
      const vel = (0.5 + Math.random() * 0.8) * speed;
      // Life phase
      const progress = Math.random();

      particles.push({
        baseAngle: angle,
        angle,
        dist,
        maxDist: dist,
        vel,
        progress,
        pSize: (0.75 + Math.random() * 1.5) * size,
        curveBend: (Math.random() - 0.5) * 0.8,
        hueOffset: (Math.random() - 0.5) * 40,
      });
    }

    particlesRef.current = particles;
  }, [density, size, speed]);

  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ripplesRef.current.push({
      x,
      y,
      radius: 5,
      maxRadius: Math.min(canvas.width, canvas.height) * 0.4,
      alpha: 0.8,
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    initParticles(width, height);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight || 450;
      initParticles(width, height);
    };

    window.addEventListener("resize", handleResize);

    let lastTime = performance.now();

    const render = (time) => {
      const dt = Math.min(0.1, (time - lastTime) / 1000);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      const cx = width * mousePosRef.current.x;
      const cy = height * mousePosRef.current.y;

      // Draw subtle converging stream curves
      const streamCount = 12;
      ctx.lineWidth = strokeWidth;

      for (let s = 0; s < streamCount; s++) {
        const streamAngle = (s / streamCount) * Math.PI * 2;
        const outerR = Math.max(width, height) * 0.65;
        const startX = cx + Math.cos(streamAngle) * outerR;
        const startY = cy + Math.sin(streamAngle) * outerR;

        // Control point curved toward vortex
        const ctrlAngle = streamAngle + 0.5;
        const ctrlR = outerR * 0.45;
        const cpX = cx + Math.cos(ctrlAngle) * ctrlR;
        const cpY = cy + Math.sin(ctrlAngle) * ctrlR;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(cpX, cpY, cx, cy);

        const strokeAlpha = (opacity * 0.2).toFixed(3);
        ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${brightness}%, ${strokeAlpha})`;
        ctx.stroke();
      }

      // If reduced motion is requested, render static calm particles
      if (reducedMotionRef.current) {
        particlesRef.current.forEach((p) => {
          const px = cx + Math.cos(p.angle) * p.dist * 0.6;
          const py = cy + Math.sin(p.angle) * p.dist * 0.6;
          ctx.beginPath();
          ctx.arc(px, py, p.pSize, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hue + p.hueOffset}, ${saturation}%, ${brightness}%, ${opacity * 0.7})`;
          ctx.fill();
        });
        return;
      }

      // Draw ripples
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const r = ripplesRef.current[i];
        r.radius += dt * 240;
        r.alpha -= dt * 0.9;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripplesRef.current.splice(i, 1);
        } else {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(${hue + 30}, 90%, 75%, ${r.alpha * opacity * 1.5})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      // Draw & update streaming particles
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move inward along spiral
        p.progress += dt * (p.vel / 100);
        if (p.progress >= 1.0) {
          p.progress = 0;
          p.dist = p.maxDist;
          p.angle = p.baseAngle + (Math.random() - 0.5) * 0.2;
        }

        // Interpolate distance towards focal center
        const curDist = p.maxDist * (1.0 - Math.pow(p.progress, 1.2));
        // Rotate inward
        const curAngle = p.angle + p.curveBend * p.progress * 2.5;

        const px = cx + Math.cos(curAngle) * curDist;
        const py = cy + Math.sin(curAngle) * curDist;

        // Alpha fades at outer boundary and near focal singularity
        const fade = Math.sin(p.progress * Math.PI);
        const particleAlpha = Math.max(0, Math.min(1, fade * opacity * 1.4));

        ctx.beginPath();
        ctx.arc(px, py, p.pSize, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue + p.hueOffset}, ${saturation}%, ${brightness}%, ${particleAlpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsla(${hue + p.hueOffset}, 95%, 65%, ${particleAlpha * 0.8})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Focal Core Glow
      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 75);
      grad.addColorStop(0, `hsla(${hue}, 95%, 65%, ${opacity * 0.4})`);
      grad.addColorStop(0.5, `hsla(${hue + 40}, 85%, 55%, ${opacity * 0.15})`);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 75, 0, Math.PI * 2);
      ctx.fill();

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [hue, saturation, brightness, opacity, strokeWidth, initParticles]);

  return (
    <div
      className={cn("gateway-flow-container", className)}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
        ...style,
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="gateway-flow-canvas"
        onPointerDown={handlePointerDown}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          pointerEvents: "auto",
        }}
      />
      {/* Radial soft vignette overlay so text above remains crystal legible */}
      <div
        className="gateway-flow-overlay"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, rgba(6, 9, 17, 0.2) 0%, rgba(6, 9, 17, 0.75) 75%, rgba(6, 9, 17, 0.95) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default GatewayFlow;
