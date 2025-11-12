import React, { useRef, useEffect } from 'react';

type Theme = 'light' | 'dark';
type Mood = 'neutral' | 'positive' | 'complex';

interface InfiniteNexusBackgroundProps {
  theme: Theme;
  mood: Mood;
}

export const InfiniteNexusBackground: React.FC<InfiniteNexusBackgroundProps> = ({ theme, mood }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[];
    let mouse = { x: -1000, y: -1000, radius: 100 };
    
    const moodConfig = {
        neutral: {
            dark: { particleColor: 'rgba(129, 140, 248, 0.7)', lineColor: 'rgba(99, 102, 241, 0.2)', density: 1 },
            light: { particleColor: 'rgba(99, 102, 241, 0.7)', lineColor: 'rgba(129, 140, 248, 0.2)', density: 1 },
        },
        positive: {
            dark: { particleColor: 'rgba(251, 191, 36, 0.8)', lineColor: 'rgba(245, 158, 11, 0.3)', density: 1.2 },
            light: { particleColor: 'rgba(234, 179, 8, 0.8)', lineColor: 'rgba(217, 119, 6, 0.3)', density: 1.2 },
        },
        complex: {
            dark: { particleColor: 'rgba(192, 132, 252, 0.7)', lineColor: 'rgba(168, 85, 247, 0.25)', density: 1.5 },
            light: { particleColor: 'rgba(168, 85, 247, 0.7)', lineColor: 'rgba(192, 132, 252, 0.25)', density: 1.5 },
        }
    };
    
    let currentParticleColor = moodConfig[mood][theme].particleColor;
    let currentLineColor = moodConfig[mood][theme].lineColor;
    let currentDensity = moodConfig[mood][theme].density;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const colorLerp = (colorA: string, colorB: string, t: number): string => {
        const parse = (c: string) => c.match(/\d+/g)?.map(Number) || [0,0,0,0];
        const [r1, g1, b1, a1] = parse(colorA);
        const [r2, g2, b2, a2] = parse(colorB);
        const r = Math.round(lerp(r1, r2, t));
        const g = Math.round(lerp(g1, g2, t));
        const b = Math.round(lerp(b1, b2, t));
        const a = lerp(a1, a2, t);
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    };
    

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() * 0.5 - 0.25);
        this.speedY = (Math.random() * 0.5 - 0.25);
      }

      update() {
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse interaction
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            this.x += forceDirectionX * force * 1.5;
            this.y += forceDirectionY * force * 1.5;
        }
      }

      draw(color: string) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const particleCount = Math.floor((canvas.width * canvas.height) / 12000 * currentDensity);
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };
    
    const handleResize = () => {
        init();
    };
    
    const handleMouseMove = (e: MouseEvent) => {
        mouse.x = e.x;
        mouse.y = e.y;
    }

    const connect = (lineColor: string) => {
      let opacityValue = 1;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            opacityValue = 1 - (distance / 100);
            const originalAlpha = parseFloat(lineColor.split(',')[3] || '0.2)');
            const finalAlpha = opacityValue * originalAlpha;
            ctx.strokeStyle = lineColor.replace(/[\d\.]+\)$/, `${finalAlpha})`);
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
        const targetParticleColor = moodConfig[mood][theme].particleColor;
        const targetLineColor = moodConfig[mood][theme].lineColor;
        
        currentParticleColor = colorLerp(currentParticleColor, targetParticleColor, 0.05);
        currentLineColor = colorLerp(currentLineColor, targetLineColor, 0.05);
        
        const targetDensity = moodConfig[mood][theme].density;
        if (Math.abs(currentDensity - targetDensity) > 0.01) {
            currentDensity = lerp(currentDensity, targetDensity, 0.02);
            const particleCount = Math.floor((canvas.width * canvas.height) / 12000 * currentDensity);
            while (particles.length < particleCount) {
                particles.push(new Particle());
            }
            while (particles.length > particleCount) {
                particles.pop();
            }
        }


      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw(currentParticleColor);
      });
      connect(currentLineColor);
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, mood]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};
