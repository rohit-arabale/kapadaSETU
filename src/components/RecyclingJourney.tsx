import { motion } from 'motion/react';
import { useI18n } from '../i18n';
import { Sparkles, Trash2, ToggleLeft, Layers, RefreshCcw, ShoppingBag, Globe } from 'lucide-react';
import { ReactNode } from 'react';

interface JourneyStep {
  phase: number;
  icon: any;
  titleEn: string;
  titleHi: string;
  descEn: string;
  descHi: string;
  accentColor: string;
  svgGraphic: ReactNode;
}

export default function RecyclingJourney() {
  const { language } = useI18n();

  const steps: JourneyStep[] = [
    {
      phase: 1,
      icon: Trash2,
      titleEn: "1. Discarded Textiles",
      titleHi: "1. फेके गए पुराने कपड़े",
      descEn: "Tons of boutique cuts, industrial rags, and surplus garments otherwise destined for landfills or open-air toxic fire pits.",
      descHi: "दर्जियों और फैक्ट्रियों का बचा हुआ कपड़ा कतरन जो कचरे के ढेर या जलते हुए प्रदूषण का कारण बनता।",
      accentColor: "from-stone-400 to-stone-500",
      svgGraphic: (
        <svg viewBox="0 0 100 100" className="w-24 h-24 text-stone-400">
          <motion.path 
            d="M20,80 Q50,40 80,80" 
            stroke="currentColor" 
            strokeWidth="4" 
            fill="none"
            animate={{ d: ["M20,80 Q50,40 80,80", "M20,80 Q52,50 80,80", "M20,80 Q48,35 80,80"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path 
            d="M30,85 Q60,50 90,85" 
            stroke="currentColor" 
            strokeWidth="3" 
            fill="none" 
            opacity="0.7"
            animate={{ d: ["M30,85 Q60,50 90,85", "M30,85 Q58,60 90,85", "M30,85 Q62,45 90,85"] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <circle cx="50" cy="75" r="3" className="fill-stone-600 animate-bounce" />
          <circle cx="35" cy="78" r="2.5" className="fill-stone-500" />
          <circle cx="65" cy="79" r="4" className="fill-stone-600/80" />
        </svg>
      )
    },
    {
      phase: 2,
      icon: ToggleLeft,
      titleEn: "2. Precise Sorting",
      titleHi: "2. सटीक वर्गीकरण",
      descEn: "Categorized instantly by pristine material composition (Pure Cotton, Mixed Wool, Synthetic Mesh) to maintain structural recycling integrity.",
      descHi: "कपड़े के प्रकार के अनुसार (शुद्ध कपास, मिश्रित, सिंथेटिक) तुरंत छंटनी की जाती है ताकि धागे की गुणवत्ता बनी रहे।",
      accentColor: "from-amber-400 to-amber-500",
      svgGraphic: (
        <svg viewBox="0 0 100 100" className="w-24 h-24 text-amber-500">
          <motion.rect 
            x="15" y="30" width="30" height="30" rx="6" 
            className="stroke-amber-500 fill-none" 
            strokeWidth="3"
            animate={{ y: [30, 25, 30] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.rect 
            x="55" y="30" width="30" height="30" rx="6" 
            className="stroke-amber-400 fill-none" 
            strokeWidth="3"
            animate={{ y: [30, 35, 30] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.path 
            d="M50,15 L50,85" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeDasharray="4,4" 
          />
          <motion.circle 
            cx="50" cy="50" r="6" 
            className="fill-amber-600"
            animate={{ x: [-20, 20, -20] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      )
    },
    {
      phase: 3,
      icon: Layers,
      titleEn: "3. Shredding & Fiber Extraction",
      titleHi: "3. श्रेडिंग और फाइबर निकालना",
      descEn: "Heavy sorting silos pull fabrics apart. High-tensile shredders extract long, organic staple fibers without compromising cellular strength.",
      descHi: "मशीनें कतरन को कोमलता से खींचकर अलग करती हैं और उनके रेशे (फाइबर) को बिना नुकसान पहुंचाए बाहर निकालती हैं।",
      accentColor: "from-emerald-400 to-emerald-500",
      svgGraphic: (
        <svg viewBox="0 0 100 100" className="w-24 h-24 text-emerald-500">
          {/* Animated spinning gears representing fiber extractor */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="origin-[35px_50px]"
          >
            <circle cx="35" cy="50" r="16" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="6,4" />
            <circle cx="35" cy="50" r="6" fill="currentColor" />
          </motion.g>
          <motion.g
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="origin-[65px_50px]"
          >
            <circle cx="65" cy="50" r="14" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="5,3" />
            <circle cx="65" cy="50" r="4" fill="currentColor" />
          </motion.g>
          {/* Flowing fibers passing between gears */}
          <motion.path
            d="M10,50 Q50,45 90,50"
            stroke="#90A955"
            strokeWidth="3"
            fill="none"
            strokeDasharray="15,10"
            animate={{ strokeDashoffset: [0, -50] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      )
    },
    {
      phase: 4,
      icon: RefreshCcw,
      titleEn: "4. Re-spinning New Eco-Yarn",
      titleHi: "4. नए इको-धागे की कताई",
      descEn: "Extracted fibers are meticulously spun into premium high-strength spools, blended with sustainable fibers to match global fashion demands.",
      descHi: "प्राप्त फाइबरों को आधुनिक कताई मशीनों द्वारा फिर से मजबूत और चमकीले धागों में तब्दील किया जाता है।",
      accentColor: "from-green-500 to-emerald-600",
      svgGraphic: (
        <svg viewBox="0 0 100 100" className="w-24 h-24 text-green-600">
          {/* Spool of yarn representation */}
          <motion.rect x="35" y="25" width="30" height="50" rx="3" className="fill-none stroke-green-600" strokeWidth="3" />
          {/* Thread wrapping animations */}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.line
              key={i}
              x1="35"
              y1={32 + i * 7}
              x2="65"
              y2={32 + i * 7}
              stroke="currentColor"
              strokeWidth="2.5"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            />
          ))}
          {/* Floating thread tip */}
          <motion.path
            d="M65,65 Q85,75 75,90"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            animate={{ d: ["M65,65 Q85,75 75,90", "M65,65 Q80,82 75,90", "M65,65 Q90,68 75,90"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      )
    },
    {
      phase: 5,
      icon: ShoppingBag,
      titleEn: "5. Sustainable Masterpieces",
      titleHi: "5. पर्यावरण अनुकूल उत्पाद",
      descEn: "Eco-conscious craftspeople, weavers, and boutique houses purchase these raw materials, crafting durable jackets, blankets, and premium wear.",
      descHi: "सच्चे बुनकर, शिल्पकार और ब्रांड इस रिसाइकल धागे से उत्कृष्ट कपड़े, जैकेट, थैले और जैविक कम्बल तैयार करते हैं।",
      accentColor: "from-emerald-600 to-emerald-800",
      svgGraphic: (
        <svg viewBox="0 0 100 100" className="w-24 h-24 text-emerald-700">
          {/* Beautiful sweater icon with pulse */}
          <motion.path
            d="M25,30 L35,20 L50,30 L65,20 L75,30 L75,55 L65,55 L65,80 L35,80 L35,55 L25,55 Z"
            stroke="currentColor"
            strokeWidth="3.5"
            fill="none"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Little heart on chest */}
          <motion.path
            d="M47,45 C47,43 53,43 53,45 C53,48 47,52 47,52 C47,52 41,48 41,45 C41,43 47,43 47,45 Z"
            fill="#10B981"
            className="animate-pulse"
          />
        </svg>
      )
    },
    {
      phase: 6,
      icon: Globe,
      titleEn: "6. Circular Future",
      titleHi: "6. चक्राकार आर्थिक भविष्य",
      descEn: "100% sustainable loop. Not a single fiber goes to waste. The carbon footprint is zeroed, and local artisans thrive on circular resource wealth.",
      descHi: "सौ प्रतिशत पुनर्चक्रण। कपड़ा कचरे की एक भी कतरन बर्बाद नहीं होती, कार्बन उत्सर्जन रुकता है और पर्यावरण खिल उठता है।",
      accentColor: "from-emerald-700 to-green-900",
      svgGraphic: (
        <svg viewBox="0 0 100 100" className="w-24 h-24 text-emerald-800">
          {/* Circular loop with arrows */}
          <motion.circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="30,10"
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          {/* Growing leaf inside circular loop */}
          <motion.path
            d="M50,70 Q50,40 68,35 Q45,55 50,70"
            fill="#10b981"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.3 }}
          />
          <motion.path
            d="M50,70 Q50,45 32,45 Q48,58 50,70"
            fill="#34d399"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 100, delay: 0.5 }}
          />
        </svg>
      )
    }
  ];

  return (
    <div className="space-y-12 max-w-5xl mx-auto py-12 px-4 relative">
      {/* Background ambient lighting – upgraded with animated blob classes */}
      <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-emerald-100/30 rounded-full blur-3xl -z-10 pointer-events-none animate-blob-1" />
      <div className="absolute bottom-0 right-10 w-64 h-64 bg-green-100/20 rounded-full blur-3xl -z-10 pointer-events-none animate-blob-2" />
      <div className="absolute top-12 right-0 w-72 h-72 bg-emerald-200/15 rounded-full blur-3xl -z-10 pointer-events-none animate-blob-3" />

      {/* Section Header – with entrance animation */}
      <motion.div
        className="text-center max-w-3xl mx-auto space-y-4"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="text-xs bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest leading-none shadow-xs border border-emerald-200/50">
          {language === 'en' ? 'The Circular Loop' : 'चक्राकार जीवन चक्र'}
        </span>
        <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-stone-950 tracking-tight">
          {language === 'en' ? 'The Journey of Textile Rebirth' : 'कपड़े के पुनर्जन्म की यात्रा'}
        </h3>
        <p className="text-sm text-stone-500 leading-relaxed">
          {language === 'en' 
            ? "Watch how KapadaSETU redirects waste cloth from India's landfills, weaving it back into the eco-fashion economy step-by-step."
            : 'देखें कैसे कपड़ाSETU भारत के कपड़ा कचरे को लैंडफिल से बचाता है और उसे कदम-दर-कदम पर्यावरण अनुकूल फैशन में वापस बुनता है।'}
        </p>
      </motion.div>

      {/* Connected Timeline – desktop only */}
      <div className="hidden lg:flex items-center justify-between relative px-8 py-4">
        {/* Animated connecting line */}
        <motion.div
          className="absolute top-1/2 left-8 right-8 h-0.5 -translate-y-1/2 origin-left"
          style={{
            background: 'linear-gradient(90deg, #31572C, #4F772D, #90A955)',
          }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Phase dots */}
        {steps.map((step, idx) => (
          <motion.div
            key={step.phase}
            className="relative z-10 flex flex-col items-center gap-2"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.5, delay: 0.2 + idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Pulse ring */}
            <motion.div
              className="absolute w-8 h-8 rounded-full bg-emerald-400/20"
              animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.3 }}
            />
            {/* Dot */}
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 border-2 border-white shadow-md shadow-emerald-900/20" />
            {/* Phase label */}
            <span className="font-mono text-[10px] font-bold text-stone-400 whitespace-nowrap">
              0{step.phase}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Grid of Steps with responsive layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {steps.map((step, idx) => {
          const IconComponent = step.icon;
          return (
            <motion.div
              key={step.phase}
              initial={{ opacity: 0, y: 35, filter: 'blur(6px)', scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{
                y: -8,
                scale: 1.02,
                boxShadow: '0 25px 50px -12px rgba(19, 42, 19, 0.12), 0 0 30px rgba(79, 119, 45, 0.06)',
                transition: { duration: 0.2 },
              }}
              className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between h-full relative overflow-hidden transition-[border-color] duration-300 hover:border-emerald-500 group"
            >
              {/* Highlight background strip */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600/10 via-emerald-500/20 to-transparent" />
              
              <div className="space-y-4">
                {/* Header Row */}
                <div className="flex justify-between items-center">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${step.accentColor} text-white flex items-center justify-center shadow-md shadow-emerald-950/10`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  {/* Phase Label – typewriter reveal */}
                  <motion.span
                    className="font-mono text-xs font-bold text-stone-400 group-hover:text-emerald-600 transition-colors overflow-hidden inline-block whitespace-nowrap"
                    initial={{ width: 0 }}
                    whileInView={{ width: 'auto' }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.6, delay: idx * 0.15 + 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    PHASE 0{step.phase}
                  </motion.span>
                </div>

                {/* Text Content */}
                <div className="space-y-2">
                  <h4 className="font-display font-bold text-base text-stone-900 group-hover:text-emerald-800 transition-colors">
                    {language === 'en' ? step.titleEn : step.titleHi}
                  </h4>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {language === 'en' ? step.descEn : step.descHi}
                  </p>
                </div>
              </div>

              {/* Graphical representation in card footer */}
              <div className="mt-6 pt-4 border-t border-stone-100 flex justify-center items-center h-28 bg-stone-50/50 rounded-2xl">
                {step.svgGraphic}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
