import React, { useEffect, useRef } from 'react';
import { Vessel } from '../../types';

interface Props {
  vessel: Vessel;
  isSimulating: boolean;
  progress: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export const ParticleSimulator: React.FC<Props> = ({ vessel, isSimulating, progress }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle resize
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles when simulation starts
    if (isSimulating && progress === 0) {
      particlesRef.current = [];
    }

    // Origin point (approximate center of MapLibre view)
    const originX = canvas.width * 0.45;
    const originY = canvas.height * 0.65;

    // Simulation Vectors based on Vessel Score (determines if they hit the target)
    const isCulprit = vessel.score > 80;
    const windVx = isCulprit ? 2.5 : 3.5;
    const windVy = isCulprit ? -3.0 : 1.0;
    
    // Target slick centroid (approx)
    const targetX = canvas.width * 0.6;
    const targetY = canvas.height * 0.4;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isSimulating) {
        // Emit new particles
        for (let i = 0; i < 20; i++) {
          particlesRef.current.push({
            x: originX + (Math.random() - 0.5) * 10,
            y: originY + (Math.random() - 0.5) * 10,
            vx: windVx + (Math.random() - 0.5) * 2.0,
            vy: windVy + (Math.random() - 0.5) * 2.0,
            life: 0,
            maxLife: 200 + Math.random() * 100,
            size: Math.random() * 2 + 1,
            color: `hsla(${340 + Math.random() * 20}, 80%, ${50 + Math.random() * 20}%, ${0.5 + Math.random() * 0.5})`
          });
        }
      }

      // Update and draw particles
      particlesRef.current.forEach(p => {
        // Add some turbulent diffusion (random walk)
        p.vx += (Math.random() - 0.5) * 0.2;
        p.vy += (Math.random() - 0.5) * 0.2;

        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        // Fade out based on life
        const opacity = Math.max(0, 1 - (p.life / p.maxLife));
        ctx.fillStyle = p.color.replace(/[\d.]+\)$/g, `${opacity})`);
        ctx.fill();
      });

      // Remove dead particles
      particlesRef.current = particlesRef.current.filter(p => p.life < p.maxLife);

      // Draw static "Observed" footprint zone for visual comparison
      ctx.beginPath();
      ctx.ellipse(targetX, targetY, 150, 100, Math.PI / 4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)'; // Blue-500
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 10]);
      ctx.stroke();
      
      ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.fill();

      // Label
      ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
      ctx.font = '12px monospace';
      ctx.fillText('OBSERVED SLICK', targetX - 45, targetY);

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isSimulating, progress, vessel.score]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-[100] mix-blend-screen"
    />
  );
};
