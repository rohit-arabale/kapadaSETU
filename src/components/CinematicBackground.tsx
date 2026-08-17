import { useRef, useEffect, useCallback, useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface CinematicBackgroundProps {
  intensity?: number; // 0-1, controls particle count multiplier. Default 1
  className?: string;
}

interface FiberParticle {
  x: number;
  y: number;
  length: number;
  thickness: number;
  angle: number;
  rotationSpeed: number;
  color: string;
  opacity: number;
  // drift
  vx: number;
  vy: number;
  // sinusoidal
  amplitude: number;
  frequency: number;
  phase: number;
  baseX: number;
  baseY: number;
  // curvature for thread look
  curvature: number;
}

interface GradientOrb {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  color: [number, number, number]; // RGB
  opacity: number;
  // movement
  xAmp: number;
  yAmp: number;
  xFreq: number;
  yFreq: number;
  xPhase: number;
  yPhase: number;
  scaleAmp: number;
  scaleFreq: number;
  scalePhase: number;
}

interface DustParticle {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  vx: number;
  vy: number;
}

interface LightRay {
  x: number;
  angle: number; // radians
  width: number;
  length: number;
  speed: number; // px/frame
  opacity: number;
  color: [number, number, number];
}

// ─── Palette ─────────────────────────────────────────────────────────────────

const FIBER_COLORS = [
  '#4F772D', // emerald-500
  '#90A955', // accent
  '#81AE71', // green-400
  '#31572C', // primary / emerald-600
  '#ACCA9F', // emerald-300
];

const ORB_COLORS: [number, number, number][] = [
  [79, 119, 45],   // emerald-500
  [144, 169, 85],  // accent
  [49, 87, 44],    // primary
  [172, 160, 120], // warm amber-ish
];

const RAY_COLORS: [number, number, number][] = [
  [255, 255, 255],
  [144, 169, 85],
  [129, 174, 113],
];

// ─── Utilities ───────────────────────────────────────────────────────────────

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const isMobile = () =>
  typeof window !== 'undefined' &&
  (window.innerWidth < 768 || 'ontouchstart' in window);

// ─── Particle Factories ─────────────────────────────────────────────────────

function createFiber(w: number, h: number): FiberParticle {
  const x = rand(0, w);
  const y = rand(0, h);
  return {
    x,
    y,
    baseX: x,
    baseY: y,
    length: rand(18, 55),
    thickness: rand(0.8, 2.2),
    angle: rand(0, Math.PI * 2),
    rotationSpeed: rand(-0.003, 0.003),
    color: pick(FIBER_COLORS),
    opacity: rand(0.15, 0.45),
    vx: rand(-0.12, 0.12),
    vy: rand(-0.08, 0.08),
    amplitude: rand(15, 60),
    frequency: rand(0.0005, 0.002),
    phase: rand(0, Math.PI * 2),
    curvature: rand(-0.3, 0.3),
  };
}

function createOrb(w: number, h: number, index: number): GradientOrb {
  // Distribute orbs across the viewport
  const cols = 2;
  const col = index % cols;
  const row = Math.floor(index / cols);
  const cellW = w / cols;
  const cellH = h / Math.ceil(4 / cols);
  const cx = cellW * col + rand(cellW * 0.2, cellW * 0.8);
  const cy = cellH * row + rand(cellH * 0.2, cellH * 0.8);

  return {
    x: cx,
    y: cy,
    baseX: cx,
    baseY: cy,
    radius: rand(200, 400),
    color: ORB_COLORS[index % ORB_COLORS.length],
    opacity: rand(0.06, 0.12),
    xAmp: rand(30, 80),
    yAmp: rand(20, 60),
    xFreq: rand(0.0002, 0.0006),
    yFreq: rand(0.00015, 0.0005),
    xPhase: rand(0, Math.PI * 2),
    yPhase: rand(0, Math.PI * 2),
    scaleAmp: rand(0.05, 0.15),
    scaleFreq: rand(0.0003, 0.0008),
    scalePhase: rand(0, Math.PI * 2),
  };
}

function createDust(w: number, h: number): DustParticle {
  return {
    x: rand(0, w),
    y: rand(0, h),
    radius: rand(0.6, 1.8),
    opacity: rand(0.1, 0.25),
    vx: rand(-0.08, 0.08),
    vy: rand(-0.05, 0.05),
  };
}

function createRay(w: number, h: number, index: number): LightRay {
  return {
    x: rand(-w * 0.3, w * 1.3),
    angle: rand(Math.PI / 6, Math.PI / 3) * (index % 2 === 0 ? 1 : -1),
    width: rand(120, 280),
    length: Math.max(w, h) * 1.8,
    speed: rand(0.08, 0.2) * (index % 2 === 0 ? 1 : -1),
    opacity: rand(0.03, 0.06),
    color: pick(RAY_COLORS),
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

const CinematicBackground: React.FC<CinematicBackgroundProps> = ({
  intensity = 1,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Mouse tracking (throttled)
  const setupMouse = useCallback(() => {
    if (isMobile()) return () => {};

    let ticking = false;
    const onMove = (e: MouseEvent) => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          mouseRef.current.x = e.clientX;
          mouseRef.current.y = e.clientY;
          mouseRef.current.active = true;
          ticking = false;
        });
      }
    };
    const onLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  // Main canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mobile = isMobile();

    // Sizing
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w, h };
    };

    let { w, h } = resize();

    // ── Reduced motion: static gradient ──
    if (reducedMotion) {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, 'rgba(79,119,45,0.06)');
      grad.addColorStop(0.5, 'rgba(144,169,85,0.04)');
      grad.addColorStop(1, 'rgba(49,87,44,0.06)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      return;
    }

    // ── Populate particles ──
    const clampedIntensity = Math.max(0, Math.min(1, intensity));

    const fiberCount = Math.round((mobile ? 12 : 35) * clampedIntensity);
    const dustCount = Math.round((mobile ? 20 : 50) * clampedIntensity);
    const orbCount = mobile ? 2 : Math.round(rand(3, 4));
    const rayCount = mobile ? 1 : Math.round(rand(2, 3));

    const fibers: FiberParticle[] = Array.from({ length: fiberCount }, () =>
      createFiber(w, h)
    );
    const orbs: GradientOrb[] = Array.from({ length: orbCount }, (_, i) =>
      createOrb(w, h, i)
    );
    const dusts: DustParticle[] = Array.from({ length: dustCount }, () =>
      createDust(w, h)
    );
    const rays: LightRay[] = Array.from({ length: rayCount }, (_, i) =>
      createRay(w, h, i)
    );

    // Mouse
    const cleanupMouse = setupMouse();

    // ── Wrap helper ──
    const wrap = (val: number, min: number, max: number) => {
      const range = max - min;
      return ((((val - min) % range) + range) % range) + min;
    };

    // ── Draw Functions ──

    const drawFiber = (fiber: FiberParticle, time: number) => {
      const mouse = mouseRef.current;

      // Sinusoidal offset
      const sinOffset =
        Math.sin(time * fiber.frequency + fiber.phase) * fiber.amplitude;

      // Base position with drift
      fiber.baseX += fiber.vx;
      fiber.baseY += fiber.vy;

      // Wrap around
      fiber.baseX = wrap(fiber.baseX, -80, w + 80);
      fiber.baseY = wrap(fiber.baseY, -80, h + 80);

      let px = fiber.baseX + sinOffset * Math.cos(fiber.angle + Math.PI / 2);
      let py = fiber.baseY + sinOffset * Math.sin(fiber.angle + Math.PI / 2);

      // Mouse repulsion
      if (mouse.active && !mobile) {
        const dx = px - mouse.x;
        const dy = py - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && dist > 0) {
          const force = (1 - dist / 150) * 18;
          px += (dx / dist) * force;
          py += (dy / dist) * force;
        }
      }

      fiber.x = lerp(fiber.x, px, 0.08);
      fiber.y = lerp(fiber.y, py, 0.08);

      // Rotate
      fiber.angle += fiber.rotationSpeed;

      // Draw curved thread
      ctx.save();
      ctx.translate(fiber.x, fiber.y);
      ctx.rotate(fiber.angle);
      ctx.globalAlpha = fiber.opacity;
      ctx.strokeStyle = fiber.color;
      ctx.lineWidth = fiber.thickness;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const halfLen = fiber.length / 2;
      const cp = fiber.curvature * fiber.length; // control point offset

      ctx.beginPath();
      ctx.moveTo(-halfLen, 0);
      ctx.quadraticCurveTo(0, cp, halfLen, 0);
      ctx.stroke();

      ctx.restore();
    };

    const drawOrb = (orb: GradientOrb, time: number) => {
      const mouse = mouseRef.current;

      const ox = orb.baseX + Math.sin(time * orb.xFreq + orb.xPhase) * orb.xAmp;
      const oy = orb.baseY + Math.cos(time * orb.yFreq + orb.yPhase) * orb.yAmp;
      const scale =
        1 + Math.sin(time * orb.scaleFreq + orb.scalePhase) * orb.scaleAmp;

      let tx = ox;
      let ty = oy;

      // Mouse attraction (subtle)
      if (mouse.active && !mobile) {
        const dx = mouse.x - ox;
        const dy = mouse.y - oy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0) {
          const pull = Math.min(25, 3000 / (dist + 100));
          tx += (dx / dist) * pull;
          ty += (dy / dist) * pull;
        }
      }

      orb.x = lerp(orb.x, tx, 0.03);
      orb.y = lerp(orb.y, ty, 0.03);

      const r = orb.radius * scale;

      const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, r);
      grad.addColorStop(
        0,
        `rgba(${orb.color[0]},${orb.color[1]},${orb.color[2]},${orb.opacity})`
      );
      grad.addColorStop(
        0.5,
        `rgba(${orb.color[0]},${orb.color[1]},${orb.color[2]},${orb.opacity * 0.4})`
      );
      grad.addColorStop(
        1,
        `rgba(${orb.color[0]},${orb.color[1]},${orb.color[2]},0)`
      );

      ctx.save();
      ctx.globalAlpha = 1;
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawDust = (dust: DustParticle) => {
      dust.x += dust.vx;
      dust.y += dust.vy;
      dust.x = wrap(dust.x, -5, w + 5);
      dust.y = wrap(dust.y, -5, h + 5);

      ctx.save();
      ctx.globalAlpha = dust.opacity;
      ctx.fillStyle = '#D0C9B8'; // stone-300
      ctx.beginPath();
      ctx.arc(dust.x, dust.y, dust.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawRay = (ray: LightRay) => {
      ray.x += ray.speed;

      // Wrap with generous bounds
      if (ray.x > w + ray.width * 2) ray.x = -ray.width * 2;
      if (ray.x < -ray.width * 2) ray.x = w + ray.width * 2;

      ctx.save();
      ctx.translate(ray.x, 0);
      ctx.rotate(ray.angle);

      const grad = ctx.createLinearGradient(-ray.width / 2, 0, ray.width / 2, 0);
      grad.addColorStop(
        0,
        `rgba(${ray.color[0]},${ray.color[1]},${ray.color[2]},0)`
      );
      grad.addColorStop(
        0.5,
        `rgba(${ray.color[0]},${ray.color[1]},${ray.color[2]},${ray.opacity})`
      );
      grad.addColorStop(
        1,
        `rgba(${ray.color[0]},${ray.color[1]},${ray.color[2]},0)`
      );

      ctx.fillStyle = grad;
      ctx.fillRect(-ray.width / 2, -ray.length / 2, ray.width, ray.length);
      ctx.restore();
    };

    // ── Animation Loop ──
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const time = timestamp - startTime;

      ctx.clearRect(0, 0, w, h);

      // Layer 1: Light rays (behind everything)
      for (const ray of rays) drawRay(ray);

      // Layer 2: Gradient orbs
      for (const orb of orbs) drawOrb(orb, time);

      // Layer 3: Dust
      for (const dust of dusts) drawDust(dust);

      // Layer 4: Fiber particles (foreground)
      for (const fiber of fibers) drawFiber(fiber, time);

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    // Resize handler
    const onResize = () => {
      ({ w, h } = resize());
    };
    window.addEventListener('resize', onResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      cleanupMouse();
    };
  }, [reducedMotion, intensity, setupMouse]);

  return (
    <div
      className={`fixed inset-0 -z-10 pointer-events-none ${className}`}
      style={{ willChange: 'transform' }}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        aria-hidden="true"
      />
    </div>
  );
};

export default CinematicBackground;
