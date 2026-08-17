import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface WeaveLoaderProps {
  onComplete: () => void;
}

/* Mini canvas that draws interweaving thread lines */
function WeaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = 220;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    let frame: number;
    let startTime = Date.now();

    const hThreads = 7;
    const vThreads = 7;
    const spacing = size / (hThreads + 1);
    const colors = ['#31572C', '#4F772D', '#90A955', '#81AE71', '#223F1E'];

    function draw() {
      if (!ctx) return;
      const elapsed = (Date.now() - startTime) / 1000;
      ctx.clearRect(0, 0, size, size);

      // Draw horizontal threads
      for (let i = 0; i < hThreads; i++) {
        const y = spacing * (i + 1);
        const progress = Math.min(1, Math.max(0, (elapsed - i * 0.12) / 1.0));
        const eased = progress * (2 - progress); // easeOutQuad
        const drawWidth = size * eased;

        ctx.beginPath();
        ctx.strokeStyle = colors[i % colors.length];
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.globalAlpha = 0.5 + eased * 0.4;

        // Slight wave
        ctx.moveTo(0, y);
        for (let x = 0; x <= drawWidth; x += 4) {
          const wave = Math.sin((x / size) * Math.PI * 3 + elapsed * 2) * 2;
          ctx.lineTo(x, y + wave);
        }
        ctx.stroke();
      }

      // Draw vertical threads (with slight delay)
      for (let j = 0; j < vThreads; j++) {
        const x = spacing * (j + 1);
        const progress = Math.min(1, Math.max(0, (elapsed - 0.5 - j * 0.12) / 1.0));
        const eased = progress * (2 - progress);
        const drawHeight = size * eased;

        ctx.beginPath();
        ctx.strokeStyle = colors[(j + 2) % colors.length];
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.globalAlpha = 0.5 + eased * 0.4;

        ctx.moveTo(x, 0);
        for (let y = 0; y <= drawHeight; y += 4) {
          const wave = Math.sin((y / size) * Math.PI * 3 + elapsed * 1.5 + j) * 2;
          ctx.lineTo(x + wave, y);
        }
        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      // Intersections glow
      if (elapsed > 1.2) {
        const glowAlpha = Math.min(1, (elapsed - 1.2) / 0.8);
        for (let i = 0; i < hThreads; i++) {
          for (let j = 0; j < vThreads; j++) {
            const x = spacing * (j + 1);
            const y = spacing * (i + 1);
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(144, 169, 85, ${glowAlpha * 0.6})`;
            ctx.fill();
          }
        }
      }

      frame = requestAnimationFrame(draw);
    }

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="rounded-2xl"
      style={{ width: 220, height: 220 }}
    />
  );
}

export default function WeaveLoader({ onComplete }: WeaveLoaderProps) {
  const [stage, setStage] = useState<'weaving' | 'completed'>('weaving');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 25);

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const stageTimeout = setTimeout(() => {
        setStage('completed');
      }, 600);

      const completeTimeout = setTimeout(() => {
        onComplete();
      }, 1600);

      return () => {
        clearTimeout(stageTimeout);
        clearTimeout(completeTimeout);
      };
    }
  }, [progress, onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FDFCF8]"
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ 
            x: [0, 50, 0], 
            y: [0, -30, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-emerald-100/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -40, 0], 
            y: [0, 40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-green-100/15 rounded-full blur-3xl"
        />
      </div>

      {/* Subtle weaving grid background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={`h-${i}`} className="weaving-line-h absolute left-0 right-0" style={{ top: `${(i + 1) * 8}%`, animationDelay: `${i * 0.4}s` }} />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={`v-${i}`} className="weaving-line-v absolute top-0 bottom-0" style={{ left: `${(i + 1) * 8}%`, animationDelay: `${i * 0.3}s` }} />
        ))}
      </div>

      {/* Floating micro particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-emerald-500/20"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -60, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="max-w-md w-full px-6 text-center z-10 space-y-8">
        {/* Canvas Weaving Animation */}
        <div className="relative w-56 h-56 mx-auto flex items-center justify-center">
          <AnimatePresence mode="wait">
            {stage === 'weaving' ? (
              <motion.div
                key="weaving-canvas"
                initial={{ opacity: 0, scale: 0.85, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <WeaveCanvas />
                {/* Shuttling Loom Ring */}
                <motion.div
                  className="absolute w-10 h-10 rounded-full border border-emerald-500/30 flex items-center justify-center bg-white/50 backdrop-blur-sm shadow-lg"
                  style={{ top: '50%', left: '50%', marginTop: -20, marginLeft: -20 }}
                  animate={{
                    x: [-80, 80, -80],
                    y: [-80, 80, -80],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-3 h-3 rounded-full bg-emerald-600"
                  />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="fabric-complete"
                initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                }}
                className="relative w-40 h-40 bg-gradient-to-br from-emerald-600 via-emerald-500 to-green-600 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-4 border border-emerald-400/30"
              >
                {/* Micro woven texture */}
                <div className="absolute inset-0 opacity-15 grid grid-cols-8 grid-rows-8 rounded-3xl overflow-hidden">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className="border-[0.5px] border-white/30" />
                  ))}
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-transparent via-transparent to-white/10" />
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                  className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-emerald-700 shadow-lg mb-2 font-bold text-xl relative z-10"
                >
                  S
                </motion.div>
                <motion.span
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-[10px] font-extrabold tracking-widest text-emerald-100 uppercase relative z-10"
                >
                  WEFT COMPLETE
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Text & Loader Status */}
        <div className="space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display font-extrabold text-stone-900 tracking-tight text-2xl"
          >
            KapadaSETU • कपड़ासेतु
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xs text-stone-500 uppercase tracking-[0.2em] font-medium"
          >
            {stage === 'weaving' 
              ? `WEAVING RECYCLED TEXTILE FIBERS... ${progress}%` 
              : 'FABRIC COMPLETED • शुभ आरंभ'}
          </motion.p>

          {/* Premium Progress Bar */}
          <div className="w-56 h-2 bg-stone-200/40 rounded-full mx-auto overflow-hidden relative">
            <motion.div 
              className="h-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 rounded-full relative"
              style={{ width: `${progress}%` }}
              layoutId="progress-bar-loading"
            >
              {/* Shimmer overlay */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', repeatDelay: 0.5 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            </motion.div>
            {/* Glow at the tip */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-400/60 blur-sm pointer-events-none"
              style={{ left: `${progress}%`, transform: `translateX(-50%) translateY(-50%)` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
