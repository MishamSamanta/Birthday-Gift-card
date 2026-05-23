import React, { useEffect, useRef } from 'react';

interface ConfettiProps {
  active: boolean;
}

interface Piece {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: 'circle' | 'square' | 'triangle' | 'star';
}

export default function Confetti({ active }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Handle resizing
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Birthday surprise aesthetic color palette: blush, gold, hot pink, pastel purple
    const colors = [
      '#FFB7C5', // Blush pink
      '#FFD700', // Gold
      '#D8BFD8', // Lavender
      '#FF69B4', // Hot pink
      '#BA55D3', // Medium orchid
      '#FFE4E1', // Misty Rose
      '#87CEFA', // Light sky blue
    ];

    const pieces: Piece[] = [];
    const maxPieces = 150;

    const createPiece = (x?: number, y?: number, burst = false): Piece => {
      const size = Math.random() * 8 + 6;
      const angle = burst ? Math.random() * Math.PI * 2 : Math.random() * Math.PI + Math.PI; // Upwards if not burst
      const velocity = burst ? Math.random() * 15 + 5 : Math.random() * 3 + 2;

      return {
        x: x ?? Math.random() * width,
        y: y ?? (burst ? height / 2 : -10),
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: Math.cos(angle) * velocity,
        speedY: Math.sin(angle) * velocity,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 4 - 2,
        opacity: 1,
        shape: ['circle', 'square', 'triangle', 'star'][Math.floor(Math.random() * 4)] as any,
      };
    };

    // Instantiate initial explosion burst from center-bottom or button position
    for (let i = 0; i < maxPieces; i++) {
      pieces.push(createPiece(width / 2, height * 0.6, true));
    }

    // Standard draw helpers
    const drawStar = (c: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number, color: string) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      c.beginPath();
      c.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        c.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        c.lineTo(x, y);
        rot += step;
      }
      c.lineTo(cx, cy - outerRadius);
      c.closePath();
      c.fillStyle = color;
      c.fill();
    };

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Periodically spawn a few floating pieces from top
      if (pieces.length < maxPieces && Math.random() < 0.4) {
        pieces.push(createPiece(Math.random() * width, -20, false));
      }

      for (let i = pieces.length - 1; i >= 0; i--) {
        const p = pieces[i];

        // Apply physics
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += 0.15; // Gravity
        p.speedX *= 0.98; // Friction
        p.rotation += p.rotationSpeed;

        // Fading out as they go lower or wait
        if (p.y > height - 100) {
          p.opacity -= 0.01;
        }

        if (p.opacity <= 0 || p.x < -20 || p.x > width + 20 || p.y > height + 20) {
          pieces.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'square') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else if (p.shape === 'triangle') {
          ctx.beginPath();
          ctx.moveTo(0, -p.size / 2);
          ctx.lineTo(p.size / 2, p.size / 2);
          ctx.lineTo(-p.size / 2, p.size / 2);
          ctx.closePath();
          ctx.fill();
        } else if (p.shape === 'star') {
          drawStar(ctx, 0, 0, 5, p.size, p.size / 2, p.color);
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Trigger multiple random bursts of confetti over time to keep page exciting
    const burstInterval = setInterval(() => {
      const burstX = Math.random() * width;
      const burstY = Math.random() * (height * 0.4) + height * 0.3;
      for (let i = 0; i < 25; i++) {
        pieces.push(createPiece(burstX, burstY, true));
      }
    }, 4500);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      clearInterval(burstInterval);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      id="confetti-canvas"
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
}
