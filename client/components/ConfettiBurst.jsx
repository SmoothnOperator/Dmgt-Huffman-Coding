import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

const ConfettiBurst = forwardRef((props, ref) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);

  const colors = [
    '#00F2FE', // Neon Cyan
    '#38BDF8', // Glacial Blue
    '#10B981', // Mint Emerald
    '#8B5CF6', // Ultra Violet
    '#F59E0B', // Amber Gold
    '#F43F5E'  // Rose Neon
  ];

  const burst = (originX, originY, count = 65) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ox = originX ?? window.innerWidth / 2;
    const oy = originY ?? Math.min(window.innerHeight * 0.35, 300);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 4;
      particlesRef.current.push({
        x: ox,
        y: oy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        size: Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 14,
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
        decay: Math.random() * 0.018 + 0.014
      });
    }

    if (!animFrameRef.current) {
      loop();
    }
  };

  useImperativeHandle(ref, () => ({
    burst
  }));

  const loop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const particles = particlesRef.current;
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22; // subtle gravity
      p.vx *= 0.985; // air drag
      p.rotation += p.rotSpeed;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    if (particles.length > 0) {
      animFrameRef.current = requestAnimationFrame(loop);
    } else {
      animFrameRef.current = null;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999
      }}
    />
  );
});

export default ConfettiBurst;
