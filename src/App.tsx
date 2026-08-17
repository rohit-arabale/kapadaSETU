/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { I18nProvider, useI18n } from './i18n';
import { KapadaDB } from './db';
import { Profile, Role } from './types';
import Navbar from './components/Navbar';
import Onboarding from './components/Onboarding';
import SellerDashboard from './components/SellerDashboard';
import BuyerDashboard from './components/BuyerDashboard';
import ListingDetail from './components/ListingDetail';
import DealDetail from './components/DealDetail';
import AdminDashboard from './components/AdminDashboard';
import { Trash2, AlertCircle, Sparkles, Scale, Heart, ShieldCheck, Recycle, ArrowUp, Leaf, Factory, Globe2, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import AnimatedCounter from './components/AnimatedCounter';
import WeaveLoader from './components/WeaveLoader';
import RecyclingJourney from './components/RecyclingJourney';
import CinematicBackground from './components/CinematicBackground';

/* ─────────────────────────────────────────────
   Animated Word Reveal — stagger words with blur
   ───────────────────────────────────────────── */
function AnimatedTitle({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ');
  return (
    <motion.h1
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.3em]"
          variants={{
            hidden: { opacity: 0, y: 30, filter: 'blur(8px)', rotateX: 30 },
            visible: {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              rotateX: 0,
              transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
            },
          }}
          style={{ perspective: '600px' }}
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
}

/* ─────────────────────────────────────────────
   Animated Subtitle — character fade-in
   ───────────────────────────────────────────── */
function AnimatedSubtitle({ text, className }: { text: string; className?: string }) {
  return (
    <motion.p
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.008, delayChildren: 0.6 } },
      }}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 4 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.3, ease: 'easeOut' },
            },
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.p>
  );
}

/* ─────────────────────────────────────────────
   3D Tilt Card — mouse-reactive perspective
   ───────────────────────────────────────────── */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-y * 10);
    rotateY.set(x * 10);
  }, [rotateX, rotateY]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Floating Fiber Decoration — ambient SVG fibers
   ───────────────────────────────────────────── */
function FloatingFibers() {
  const fibers = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    rotation: Math.random() * 360,
    size: Math.random() * 40 + 20,
    duration: Math.random() * 8 + 12,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.06 + 0.02,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {fibers.map((fiber) => (
        <motion.div
          key={fiber.id}
          className="absolute"
          style={{
            left: `${fiber.x}%`,
            top: `${fiber.y}%`,
            opacity: fiber.opacity,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 15, -10, 0],
            rotate: [fiber.rotation, fiber.rotation + 45, fiber.rotation],
          }}
          transition={{
            duration: fiber.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: fiber.delay,
          }}
        >
          <svg width={fiber.size} height={fiber.size * 0.15} viewBox="0 0 60 8" fill="none">
            <path
              d="M2 4 C15 1, 25 7, 38 3 C45 1, 52 5, 58 4"
              stroke="#4F772D"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.6"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Scroll-to-Top Button
   ───────────────────────────────────────────── */
function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          whileHover={{ scale: 1.1, boxShadow: '0 10px 30px rgba(49, 87, 44, 0.3)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full bg-emerald-600 text-white shadow-xl flex items-center justify-center btn-premium cursor-pointer"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ═════════════════════════════════════════════
   MAIN APP CONTENT
   ═════════════════════════════════════════════ */
function AppContent() {
  const { t, language } = useI18n();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [currentTab, setCurrentTab] = useState('home');
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [onboardingActive, setOnboardingActive] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mouse position for parallax depth effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener('mousemove', handleMouse, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [mouseX, mouseY]);

  // Scroll-linked values for hero parallax
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 0.95]);
  const heroY = useTransform(scrollY, [0, 600], [0, 100]);
  const bgParallaxY = useTransform(scrollY, [0, 1000], [0, -150]);

  // Load active logged-in user simulation
  useEffect(() => {
    setCurrentUser(KapadaDB.getCurrentUser());
  }, []);

  const handleUserChanged = (newUser: Profile | null) => {
    setCurrentUser(newUser);
    setOnboardingActive(false);
  };

  const handleOnboardingComplete = (newUser: Profile) => {
    setCurrentUser(newUser);
    setOnboardingActive(false);
    setCurrentTab('dashboard');
  };

  const handleSelectListing = (id: string) => {
    setSelectedListingId(id);
    setCurrentTab('detail-listing');
  };

  const handleSelectDeal = (id: string) => {
    setSelectedDealId(id);
    setCurrentTab('detail-deal');
  };

  const handleResetSeed = () => {
    if (confirm('Are you sure you want to reset all simulated database tables to original seed listings?')) {
      KapadaDB.resetToSeed();
      setCurrentUser(KapadaDB.getCurrentUser());
      setCurrentTab('home');
      setOnboardingActive(false);
      window.location.reload();
    }
  };

  const metrics = KapadaDB.getPlatformMetrics();

  return (
    <>
      <AnimatePresence>
        {loading && (
          <WeaveLoader onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-stone-50 text-stone-850 flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900 font-sans">
        
        {/* Header Navigation */}
        <Navbar
          currentTab={currentTab}
          setCurrentTab={(tab) => {
            setCurrentTab(tab);
            setOnboardingActive(false);
          }}
          currentUser={currentUser}
          onUserChanged={handleUserChanged}
        />

      {/* Main Core Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab + onboardingActive}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {onboardingActive ? (
          <Onboarding onOnboardingComplete={handleOnboardingComplete} />
        ) : (
          <>
            {/* ═══════════════════════════════════════
                1. CINEMATIC LANDING PAGE
                ═══════════════════════════════════════ */}
            {currentTab === 'home' && (
              <div className="space-y-24 py-4 relative overflow-hidden">
                
                {/* Cinematic Background — Canvas particle system */}
                <CinematicBackground intensity={0.8} />
                
                {/* Floating decorative fibers */}
                <FloatingFibers />

                {/* ── HERO SECTION ── */}
                <motion.div
                  style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
                  className="relative text-center space-y-8 max-w-4xl mx-auto py-16 sm:py-24 px-4"
                >
                  {/* Multi-layer parallax ambient blobs */}
                  <motion.div
                    style={{ x: useTransform(smoothMouseX, [-1, 1], [20, -20]), y: useTransform(smoothMouseY, [-1, 1], [15, -15]) }}
                    className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full -z-10 pointer-events-none animate-blob-1"
                    style2-placeholder="true"
                  >
                    <div className="w-full h-full bg-gradient-to-tr from-emerald-200/30 via-emerald-100/20 to-green-100/20 rounded-full blur-3xl" />
                  </motion.div>

                  <motion.div
                    style={{ x: useTransform(smoothMouseX, [-1, 1], [-15, 15]), y: useTransform(smoothMouseY, [-1, 1], [-10, 10]) }}
                    className="absolute bottom-10 left-10 w-[250px] h-[250px] -z-10 pointer-events-none animate-blob-2"
                  >
                    <div className="w-full h-full bg-amber-100/20 rounded-full blur-2xl" />
                  </motion.div>

                  <motion.div
                    style={{ x: useTransform(smoothMouseX, [-1, 1], [10, -10]) }}
                    className="absolute top-10 right-10 w-[200px] h-[200px] -z-10 pointer-events-none animate-blob-3"
                  >
                    <div className="w-full h-full bg-emerald-300/10 rounded-full blur-2xl" />
                  </motion.div>

                  {/* Gentle Floating Eco-Particles */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none -z-5 select-none h-full">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                          width: `${Math.random() * 6 + 3}px`,
                          height: `${Math.random() * 6 + 3}px`,
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 80 + 10}%`,
                          background: i % 3 === 0 
                            ? 'rgba(79, 119, 45, 0.25)' 
                            : i % 3 === 1 
                            ? 'rgba(144, 169, 85, 0.2)' 
                            : 'rgba(129, 174, 113, 0.15)',
                        }}
                        animate={{
                          y: [0, -(Math.random() * 100 + 40), 0],
                          x: [0, Math.random() * 40 - 20, 0],
                          opacity: [0.05, 0.6, 0.05],
                          scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{
                          duration: Math.random() * 10 + 8,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: Math.random() * 6,
                        }}
                      />
                    ))}
                  </div>

                  {/* Badge */}
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="flex justify-center items-center gap-2"
                  >
                    <span className="flex h-3.5 w-3.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs bg-emerald-100/80 backdrop-blur-sm text-emerald-800 font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest leading-none shadow-sm border border-emerald-200/50">
                      INDIA CO-OP TEXTILE PROJECT • भारत सहकारी कपड़ा परियोजना
                    </span>
                  </motion.div>

                  {/* Animated Hero Title */}
                  <AnimatedTitle
                    text={t('heroTitle')}
                    className="font-sans font-black text-4xl sm:text-5xl lg:text-7xl text-stone-950 tracking-tight leading-[1.05]"
                  />

                  {/* Animated Hero Subtitle */}
                  <AnimatedSubtitle
                    text={t('heroSubtitle')}
                    className="text-sm sm:text-base lg:text-lg text-stone-500 leading-relaxed max-w-2xl mx-auto"
                  />

                  {/* Premium CTA Buttons */}
                  <motion.div 
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-wrap justify-center gap-4 pt-6"
                  >
                    {currentUser ? (
                      <motion.button
                        whileHover={{ scale: 1.04, y: -3 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setCurrentTab('dashboard')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-2xl text-sm shadow-lg btn-premium btn-ripple btn-glow transition-colors uppercase tracking-wider cursor-pointer"
                      >
                        Enter Simulation Dashboard ({currentUser.full_name})
                      </motion.button>
                    ) : (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.04, y: -3 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setOnboardingActive(true)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-2xl text-sm shadow-lg btn-premium btn-ripple btn-glow transition-all uppercase tracking-wider cursor-pointer relative overflow-hidden group"
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            <Leaf className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                            {t('joinAsSeller')}
                          </span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.04, y: -3 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setOnboardingActive(true)}
                          className="bg-stone-900 hover:bg-stone-800 text-white font-bold py-4 px-8 rounded-2xl text-sm shadow-lg btn-premium btn-ripple transition-all uppercase tracking-wider cursor-pointer relative overflow-hidden group"
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            <Factory className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            {t('joinAsBuyer')}
                          </span>
                        </motion.button>
                      </>
                    )}
                  </motion.div>

                  {/* Elegant Scroll Indicator */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.7, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                    className="flex flex-col items-center gap-2 pt-16 text-stone-400 select-none"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] leading-none">Scroll to explore • स्क्रॉल करें</span>
                    <motion.div
                      animate={{ y: [0, 8, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-5 h-9 border-2 border-stone-300/60 rounded-full flex justify-center p-1.5"
                    >
                      <motion.div
                        animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-1.5 h-1.5 bg-emerald-600 rounded-full"
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* ── ENVIRONMENTAL IMPACT STATISTICS ── */}
                <motion.div 
                  initial={{ opacity: 0, y: 50, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <TiltCard className="max-w-5xl mx-auto">
                    <div className="bg-gradient-to-tr from-emerald-950 via-emerald-900 to-emerald-850 rounded-3xl p-8 sm:p-12 text-white shadow-2xl border border-emerald-800/50 relative overflow-hidden">
                      {/* Animated glow orbs */}
                      <motion.div
                        animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.2, 1] }}
                        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute -right-20 -top-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"
                      />
                      <motion.div
                        animate={{ x: [0, -20, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
                        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                        className="absolute -left-20 -bottom-20 w-72 h-72 bg-green-500/10 rounded-full blur-3xl pointer-events-none"
                      />
                      {/* Subtle shimmer overlay */}
                      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
                        <motion.div
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 6, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
                          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent skew-x-12"
                        />
                      </div>

                      <div className="text-center mb-10 relative z-10">
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                          className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4"
                        >
                          <Globe2 className="w-4 h-4 text-emerald-300 animate-spin-slow" />
                          <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">Live Platform Metrics</span>
                        </motion.div>
                        <h3 className="font-display font-extrabold text-xl sm:text-2xl uppercase tracking-wide text-emerald-300">
                          {t('impactTitle')}
                        </h3>
                        <p className="text-xs text-emerald-200/60 mt-2 max-w-lg mx-auto">Real-time platform audit log showing diverted textiles from landfill dumps.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative z-10">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 }}
                          className="p-6 rounded-2xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm"
                        >
                          <p className="text-4xl sm:text-5xl font-extrabold text-white">
                            <AnimatedCounter value={metrics.totalWasteSortedKg / 1000} duration={1.6} formatter={(v) => v.toFixed(1) + ' T'} />
                          </p>
                          <h4 className="text-xs font-bold text-emerald-400 mt-3 uppercase tracking-wider">{t('statWaste')}</h4>
                          <p className="text-[10px] text-emerald-200/50 mt-1">Diverted from toxic groundwater contamination</p>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 }}
                          className="p-6 rounded-2xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm"
                        >
                          <p className="text-4xl sm:text-5xl font-extrabold text-white">
                            <AnimatedCounter value={metrics.totalDealsValue} duration={1.8} formatter={(v) => '₹' + v.toLocaleString('en-IN')} />
                          </p>
                          <h4 className="text-xs font-bold text-emerald-400 mt-3 uppercase tracking-wider">{t('statDeals')}</h4>
                          <p className="text-[10px] text-emerald-200/50 mt-1">Injected back to small tailors and boutique artisans</p>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 }}
                          className="p-6 rounded-2xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm"
                        >
                          <p className="text-4xl sm:text-5xl font-extrabold text-emerald-400">
                            <AnimatedCounter value={metrics.totalCO2SavedKg} duration={1.8} formatter={(v) => v.toLocaleString() + ' kg'} />
                          </p>
                          <h4 className="text-xs font-bold text-emerald-400 mt-3 uppercase tracking-wider">{t('statCO2')}</h4>
                          <p className="text-[10px] text-emerald-200/50 mt-1">Prevented from greenhouse incineration burnings</p>
                        </motion.div>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>

                {/* ── RECYCLING JOURNEY — Scroll Storytelling ── */}
                <RecyclingJourney />

                {/* ── HOW IT WORKS — Premium Card Grid ── */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6 }}
                  className="space-y-10 max-w-5xl mx-auto py-4"
                >
                  <div className="text-center space-y-3">
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className="inline-flex items-center gap-2 text-xs bg-emerald-100/80 backdrop-blur-sm text-emerald-800 font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm border border-emerald-200/50"
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      {language === 'en' ? 'Simple Process' : 'सरल प्रक्रिया'}
                    </motion.span>
                    <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-stone-950 tracking-tight">
                      {t('howItWorks')}
                    </h3>
                    <p className="text-sm text-stone-500 mt-1">Four simple steps toward a circular textile economy.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { step: 1, title: t('step1Title'), desc: t('step1Desc'), icon: '📦', gradient: 'from-emerald-500 to-emerald-600' },
                      { step: 2, title: t('step2Title'), desc: t('step2Desc'), icon: '🗺️', gradient: 'from-emerald-600 to-green-600' },
                      { step: 3, title: t('step3Title'), desc: t('step3Desc'), icon: '🤝', gradient: 'from-green-600 to-emerald-700' },
                      { step: 4, title: t('step4Title'), desc: t('step4Desc'), icon: '🚛', gradient: 'from-emerald-700 to-emerald-800' },
                    ].map((item, idx) => (
                      <TiltCard key={item.step}>
                        <motion.div
                          initial={{ opacity: 0, y: 35, scale: 0.95 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          viewport={{ once: true, margin: '-30px' }}
                          transition={{ duration: 0.7, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                          className="bg-white/80 backdrop-blur-sm border border-stone-200/80 rounded-2xl p-6 space-y-4 shadow-sm card-cinematic h-full relative overflow-hidden group"
                        >
                          {/* Top accent line */}
                          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient} opacity-60 group-hover:opacity-100 transition-opacity`} />
                          
                          <motion.div
                            whileHover={{ scale: 1.15, rotate: 5 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                            className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${item.gradient} flex items-center justify-center text-white font-bold text-lg shadow-md`}
                          >
                            {item.step}
                          </motion.div>
                          <h4 className="font-bold text-sm text-stone-900 group-hover:text-emerald-800 transition-colors">{item.title}</h4>
                          <p className="text-xs text-stone-500 leading-relaxed">{item.desc}</p>
                        </motion.div>
                      </TiltCard>
                    ))}
                  </div>
                </motion.div>

                {/* ── DEMO NOTICE CARD ── */}
                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="max-w-4xl mx-auto"
                >
                  <div className="bg-amber-50/80 backdrop-blur-sm border border-amber-200/60 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-cinematic relative overflow-hidden">
                    {/* Subtle shimmer */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
                      <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'linear', repeatDelay: 8 }}
                        className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-amber-200/20 to-transparent skew-x-12"
                      />
                    </div>
                    <div className="flex gap-3 relative z-10">
                      <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 animate-pulse-glow" />
                      <div>
                        <h4 className="font-bold text-xs text-stone-950 uppercase tracking-wider">Simulate Two-Sided Transactions & Escrow</h4>
                        <p className="text-[11px] text-stone-600 leading-normal mt-0.5">
                          This applet comes with fully functional database tables simulated using <strong>localStorage</strong>. 
                          Click on the <strong>{currentUser ? currentUser.full_name : 'Ramesh Gupta'}</strong> dropdown in the navigation bar to switch between Seller, Recycler, and Admin personas instantly! You can post lists, make bids, pay via sandbox Razorpay, book trucks, and resolve disputes.
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.04, y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleResetSeed}
                      className="bg-stone-900 hover:bg-stone-800 text-white font-bold py-2.5 px-5 rounded-xl text-[10px] shrink-0 uppercase tracking-wider flex items-center gap-2 btn-premium btn-ripple cursor-pointer relative z-10"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-stone-300" />
                      Reset Tables to Seed
                    </motion.button>
                  </div>
                </motion.div>

              </div>
            )}

            {/* 2. ROLE-BASED DASHBOARD DISPATCHERS */}
            {currentTab === 'dashboard' && currentUser && (
              <>
                {currentUser.role === Role.SELLER && (
                  <SellerDashboard
                    currentUser={currentUser}
                    onSelectListing={handleSelectListing}
                    onSelectDeal={handleSelectDeal}
                  />
                )}
                {currentUser.role === Role.BUYER && (
                  <BuyerDashboard
                    currentUser={currentUser}
                    onSelectListing={handleSelectListing}
                    onSelectDeal={handleSelectDeal}
                  />
                )}
              </>
            )}

            {/* 3. BROWSE ALL LISTINGS MAP SEARCH VIEW (BUYER OR GUEST) */}
            {currentTab === 'listings' && currentUser && (
              <BuyerDashboard
                currentUser={currentUser}
                onSelectListing={handleSelectListing}
                onSelectDeal={handleSelectDeal}
              />
            )}

            {/* 4. DETAIL WORKSTATIONS */}
            {currentTab === 'detail-listing' && selectedListingId && currentUser && (
              <ListingDetail
                listingId={selectedListingId}
                currentUser={currentUser}
                onBack={() => {
                  if (currentUser.role === Role.SELLER) {
                    setCurrentTab('dashboard');
                  } else {
                    setCurrentTab('listings');
                  }
                }}
                onSelectDeal={handleSelectDeal}
              />
            )}

            {currentTab === 'detail-deal' && selectedDealId && currentUser && (
              <DealDetail
                dealId={selectedDealId}
                currentUser={currentUser}
                onBack={() => setCurrentTab('dashboard')}
              />
            )}

            {/* 5. ADMIN CENTER */}
            {currentTab === 'admin' && currentUser && currentUser.role === Role.ADMIN && (
              <AdminDashboard />
            )}
          </>
        )}
          </motion.div>
        </AnimatePresence>

      </main>

      {/* ── CINEMATIC FOOTER ── */}
      <footer className="footer-cinematic py-10 mt-16 text-center shrink-0 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <Recycle className="w-5 h-5 text-emerald-600" />
            </motion.div>
            <span className="text-sm font-semibold text-stone-600">KapadaSETU Textile Ledger</span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-400">Preventing Waste Landfills in India</span>
          </motion.div>
          <p className="text-[10px] text-stone-400">
            © 2026 KapadaSETU Co-op. Under Sandbox Simulator mode. Bilingual English & हिंदी Supported.
          </p>
          <div className="flex items-center justify-center gap-6 pt-2">
            <motion.span whileHover={{ scale: 1.05 }} className="text-[10px] text-emerald-600 font-semibold cursor-pointer hover:underline">About</motion.span>
            <motion.span whileHover={{ scale: 1.05 }} className="text-[10px] text-emerald-600 font-semibold cursor-pointer hover:underline">Impact Report</motion.span>
            <motion.span whileHover={{ scale: 1.05 }} className="text-[10px] text-emerald-600 font-semibold cursor-pointer hover:underline">Partner With Us</motion.span>
          </div>
        </div>

        {/* Footer ambient particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-emerald-500/20"
              style={{ left: `${15 + i * 14}%`, bottom: '20%' }}
              animate={{ y: [0, -30, 0], opacity: [0, 0.5, 0] }}
              transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.7 }}
            />
          ))}
        </div>
      </footer>

      {/* Scroll-to-Top Button */}
      <ScrollToTop />

    </div>
    </>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
