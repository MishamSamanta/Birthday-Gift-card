import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Gift, 
  Heart, 
  Flame, 
  Cake, 
  Volume2, 
  VolumeX, 
  Copy, 
  RotateCcw, 
  CheckCircle, 
  Lock, 
  Unlock, 
  ArrowRight, 
  ShieldQuestion, 
  PartyPopper,
  AlertCircle
} from 'lucide-react';
import Confetti from './components/Confetti';
import { sound } from './utils/audio';

// Dynamic, cheeky roasts and toasts for Bhoomi
const MEMORABLE_QUOTES = [
  {
    type: "Roast",
    text: "We debated whether you deserved this... we're still not sure about it. 🤔",
    severity: "Lighthearted burn"
  },
  {
    type: "Toast",
    text: "You're not getting any younger, but you are definitely getting more iconic. 💅",
    severity: "Factually true"
  },
  {
    type: "Roast",
    text: "Fine. You're kind of amazing. Don't let it go to your head. 🙄",
    severity: "Maximum pride restriction"
  },
  {
    type: "Toast",
    text: "You possess an unmatched license to cause pure chaos, and we support it. 🌪️",
    severity: "Enabling bad behavior"
  },
  {
    type: "Roast",
    text: "Statistically speaking, you consume 80% of our patience, yet somehow keep us smiling. 📈",
    severity: "Mathematical truth"
  }
];

// Interactive Aura readings
const AURA_TEMPLATES = [
  { rating: "Aura Level: +20,000,000", sass: "115% (Dangerous)", chaos: "Critical", label: "Absolute Birthday Sovereign 👑", desc: "Legally immune to criticism for the next 24 hours. Recommended activity: eating cake with your hands." },
  { rating: "Aura Level: +777,000", sass: "98% (Slightly restricted)", chaos: "Lethal", label: "Professional Menace Mode 💅", desc: "Subject is causing heavy eye-rolls, yet looking spectacular while doing so. Proceed with caution." },
  { rating: "Aura Level: Infinite", sass: "Max Overflow", chaos: "Nuclear", label: "Iconic Chaos Elemental 🔥", desc: "Energy levels are radiating straight up main-character mainframes. Birthday gravity is centered directly on Bhoomi." },
  { rating: "Aura Level: +5,000,000", sass: "85% (Unusually polite)", chaos: "Suspiciously Low", label: "Sassy Saint 🌸", desc: "Plotting a major operation or simply waiting for the custom birthday pastries to arrive. High-alert status." },
  { rating: "Aura Level: +99,999,999", sass: "Off-The-Charts", chaos: "Category 5 Core", label: "The Supreme Empress of eye-rolls 🙄", desc: "Can reject advice, plans, and instructions instantly just with a tilt of the chin. Incredibly powerful." }
];

// Floating sparkles data helper
const BASE_PARTICLES = Array.from({ length: 40 }).map((_, i) => ({
  id: i,
  size: Math.random() * 6 + 4,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: Math.random() * 12 + 8,
  delay: Math.random() * 5,
}));

export default function App() {
  const [stage, setStage] = useState<'invite' | 'verification_q1' | 'verification_q2' | 'identity_confirmed' | 'revealed'>('invite');
  const [identityError, setIdentityError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  
  // Custom states inside revealed section
  const [currentQuoteIdx, setCurrentQuoteIdx] = useState(0);
  const [aura, setAura] = useState(AURA_TEMPLATES[0]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [emojiExplosions, setEmojiExplosions] = useState<{ id: number; char: string; x: number; y: number }[]>([]);
  const [activePolaroidIndex, setActivePolaroidIndex] = useState<number | null>(null);

  // Play sound indicator helper
  const handleInteractiveSound = (type: 'pop' | 'unlock' | 'sparkle') => {
    if (!audioEnabled) return;
    if (type === 'pop') sound.playPop();
    if (type === 'sparkle') sound.playSparkle();
    if (type === 'unlock') sound.playMagicUnlock();
  };

  // Toast auto-closer
  useEffect(() => {
    if (showToast) {
      const t = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(t);
    }
  }, [showToast]);

  const handleVerifyQ1 = (index: number) => {
    setSelectedAnswer(index);
    setIdentityError(null);
    handleInteractiveSound('pop');

    if (index === 1) {
      // She selected: Quiet, well-behaved adult
      setIdentityError("Wait... database check failed. Bhoomi is definitely NOT quiet or well-behaved! Try again.");
      setTimeout(() => {
        setSelectedAnswer(null);
      }, 1600);
    } else {
      setTimeout(() => {
        setStage('verification_q2');
        setSelectedAnswer(null);
      }, 900);
    }
  };

  const handleVerifyQ2 = (index: number) => {
    setSelectedAnswer(index);
    setIdentityError(null);
    handleInteractiveSound('pop');

    if (index === 0) {
      // Getting younger
      setIdentityError("⚠️ Lie Detector Alert: Nice try, Bhoomi! Let's be factually honest here...");
      setTimeout(() => {
        setSelectedAnswer(null);
      }, 1600);
    } else {
      setTimeout(() => {
        setStage('identity_confirmed');
        setSelectedAnswer(null);
        handleInteractiveSound('unlock');
      }, 950);
    }
  };

  const executeSurpriseReveal = () => {
    setIsRevealing(true);
    handleInteractiveSound('unlock');
    setTimeout(() => {
      setStage('revealed');
      setConfettiActive(true);
      setIsRevealing(false);
    }, 1500);
  };

  const regenerateAura = () => {
    handleInteractiveSound('pop');
    let nextAura;
    do {
      nextAura = AURA_TEMPLATES[Math.floor(Math.random() * AURA_TEMPLATES.length)];
    } while (nextAura.label === aura.label);
    setAura(nextAura);
  };

  const triggerEmojiExplosion = (char: string, e: React.MouseEvent) => {
    handleInteractiveSound('sparkle');
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    // Generate 8 floating emojis
    const newExplosions = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      char,
      x: x + (Math.random() * 120 - 60),
      y: y - (Math.random() * 50 + 20),
    }));

    setEmojiExplosions(prev => [...prev, ...newExplosions]);

    // Clean up floating emojis after animation ends
    setTimeout(() => {
      setEmojiExplosions(prev => prev.filter(item => !newExplosions.find(ne => ne.id === item.id)));
    }, 1200);
  };

  const handleShareLove = () => {
    handleInteractiveSound('pop');
    const textToCopy = `Bhoomi is legally getting 1 year older but is actively denying it! Come celebrate the absolute menace here: ${window.location.href} 🎂✨🥂`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setShowToast(true);
      })
      .catch(() => {
        alert("Clipboard failed, but you are still amazing, Bhoomi!");
      });
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-x-hidden font-sans transition-all duration-1000 bg-geometric text-purple-950 selection:bg-rose-200 selection:text-purple-900">
      
      {/* Background soft color gradients - Geometric Balance Brush patterns */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 w-80 h-80 rounded-full bg-white/40 blur-3xl transition-all duration-1000"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-purple-300/30 blur-3xl transition-all duration-1000 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-48 h-48 rounded-full bg-pink-200/40 blur-2xl transition-all duration-1000"></div>
      </div>

      {/* Top Cryptic Tag */}
      <div className="absolute top-8 left-12 hidden md:block select-none scale-90 origin-left">
        <p className="text-xs tracking-widest uppercase text-purple-900/40 font-semibold">Secret Transmission #402</p>
        <p className="text-sm text-purple-900/60 font-medium italic">Someone left this here for you...</p>
      </div>

      {/* Floating Animated Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {BASE_PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute bg-purple-600/10 rounded-full opacity-35"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            animate={{
              y: ['0px', '-180px', '0px'],
              opacity: [0.1, 0.5, 0.1],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Custom Canvas Stars Confetti overlay */}
      <Confetti active={confettiActive} />

      {/* Floating Emojis Exploder Element */}
      <AnimatePresence>
        {emojiExplosions.map(emoji => (
          <motion.div
            key={emoji.id}
            initial={{ opacity: 1, scale: 0.5, x: emoji.x - 30, y: emoji.y }}
            animate={{ 
              opacity: 0, 
              scale: 1.8, 
              y: emoji.y - 180, 
              rotate: Math.random() * 90 - 45 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="fixed pointer-events-none text-3xl z-50 filter drop-shadow-md select-none"
          >
            {emoji.char}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Persistent Controls Area */}
      <div className="absolute top-4 right-4 z-40 flex items-center gap-3">
        <button
          onClick={() => {
            setAudioEnabled(!audioEnabled);
            handleInteractiveSound('pop');
          }}
          className="p-3.5 rounded-full bg-white/40 backdrop-blur-xl border border-white/60 hover:bg-white/80 active:scale-95 transition-all text-purple-950 hover:text-pink-600 shadow-sm"
          title={audioEnabled ? "Mute chimes" : "Enable magical chime effects"}
          id="toggle-audio-btn"
        >
          {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        {stage === 'revealed' && (
          <button
            onClick={() => {
              setStage('invite');
              setConfettiActive(false);
              handleInteractiveSound('pop');
            }}
            className="p-3.5 rounded-full bg-white/40 backdrop-blur-xl border border-white/60 hover:bg-white/80 active:scale-95 transition-all text-purple-950 hover:text-pink-600 shadow-sm flex items-center gap-1 text-xs font-semibold px-4"
            title="Read envelope again"
            id="replay-btn"
          >
            <RotateCcw size={13} />
            Reset State
          </button>
        )}
      </div>

      {/* Main Container */}
      <main className="w-full max-w-4xl px-4 py-16 z-10 flex flex-col items-center">
        
        <AnimatePresence mode="wait">
          
          {/* STAGE 1: Mysterious Invite Envelope */}
          {stage === 'invite' && (
            <motion.div
              key="invite"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-full max-w-lg text-center"
            >
              {/* Decorative classified seal/stamp stamp design */}
              <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-600 text-2xl animate-pulse">
                🔑
              </div>

              {/* Glassmorphic encrypted dossier structure - Rounded [48px] */}
              <div className="p-8 md:p-12 rounded-[48px] bg-white/45 backdrop-blur-xl border border-white/60 shadow-[0_32px_64px_rgba(0,0,0,0.04)] relative overflow-hidden text-purple-950 text-center">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 via-purple-300 to-amber-300" />
                
                <h1 className="font-serif text-3xl md:text-4xl text-purple-950 tracking-tight mb-4 font-bold">
                  Hey Bhoomi... we need to talk 👀
                </h1>
                
                <p className="text-purple-900/85 font-sans tracking-wide text-sm md:text-base leading-relaxed mb-8">
                  A high-priority secret dossier has been compiled specifically at your coordinates. The security systems require temporary verification to authorize decryption.
                </p>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10 text-xs font-mono text-purple-900 text-left flex items-start gap-3">
                    <ShieldQuestion size={18} className="text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-purple-950 font-bold block mb-1">DOSSIER STATUS:</span>
                      Classified access, highly sensitive details. Proceed only if you acknowledge your legal index of iconic chaos.
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setStage('verification_q1');
                      handleInteractiveSound('pop');
                    }}
                    className="w-full py-4 px-6 rounded-full bg-purple-900 hover:bg-purple-950 text-white font-semibold tracking-wider transition-all duration-300 shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2"
                    id="begin-verification-btn"
                  >
                    <span>Begin Verification Protocol</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

                <div className="mt-6 text-xs text-purple-900/40 font-mono">
                  SECURE END-TO-END BHOOMI COMPLIANT CHANNEL
                </div>
              </div>
            </motion.div>
          )}

          {/* STAGE 2: Verification Question 1 */}
          {stage === 'verification_q1' && (
            <motion.div
              key="verification_q1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full max-w-md text-center"
            >
              <div className="p-8 md:p-10 rounded-[48px] bg-white/45 backdrop-blur-xl border border-white/60 shadow-[0_32px_64px_rgba(0,0,0,0.04)] relative overflow-hidden text-purple-950">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 to-purple-400" />
                
                <span className="font-mono text-xs text-pink-600 font-semibold tracking-widest uppercase block mb-2">Protocol Step 01 / 02</span>
                <h2 className="font-serif text-2xl text-purple-950 mb-6 font-bold">
                  Verify your security identity:
                </h2>

                <div className="space-y-3 text-left">
                  {[
                    "An absolute menace to society, legendary trouble maker",
                    "Quiet, highly mature, extremely well-behaved model citizen",
                    "100% iconic, 200% aesthetic chaos, secretly softhearted"
                  ].map((ans, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleVerifyQ1(idx)}
                      disabled={selectedAnswer !== null}
                      className={`w-full p-4 rounded-xl border text-sm transition-all duration-300 text-left flex items-center justify-between ${
                        selectedAnswer === idx 
                          ? idx === 1 
                            ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold' 
                            : 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                          : 'bg-white/40 border-white text-purple-900 hover:bg-white/80'
                      }`}
                    >
                      <span>{ans}</span>
                      {selectedAnswer === idx && (
                        <span>
                          {idx === 1 ? <AlertCircle size={16} className="text-rose-600" /> : <CheckCircle size={16} className="text-emerald-600" />}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {identityError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 mt-5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-950 flex items-center gap-2 text-left shadow-sm"
                  >
                    <AlertCircle size={16} className="text-rose-600 shrink-0" />
                    <span>{identityError}</span>
                  </motion.div>
                )}

                <div className="mt-6 text-xs text-purple-950/40 font-mono">
                  Select carefully. The system is watching.
                </div>
              </div>
            </motion.div>
          )}

          {/* STAGE 3: Verification Question 2 */}
          {stage === 'verification_q2' && (
            <motion.div
              key="verification_q2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full max-w-md text-center"
            >
              <div className="p-8 md:p-10 rounded-[48px] bg-white/45 backdrop-blur-xl border border-white/60 shadow-[0_32px_64px_rgba(0,0,0,0.04)] relative overflow-hidden text-purple-950">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-amber-300" />
                
                <span className="font-mono text-xs text-purple-600 font-semibold tracking-widest uppercase block mb-2">Protocol Step 02 / 02</span>
                <h2 className="font-serif text-2xl text-purple-950 mb-6 font-bold">
                  Confirm official birthday policy:
                </h2>

                <div className="space-y-3 text-left">
                  {[
                    "Getting younger every single day (I'm practically 12 years old)",
                    "Ageless iconic ruler who demands instant pastries and absolute obedience"
                  ].map((ans, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleVerifyQ2(idx)}
                      disabled={selectedAnswer !== null}
                      className={`w-full p-4 rounded-xl border text-sm transition-all duration-300 text-left flex items-center justify-between ${
                        selectedAnswer === idx 
                          ? idx === 0 
                            ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold' 
                            : 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                          : 'bg-white/40 border-white text-purple-900 hover:bg-white/80'
                      }`}
                    >
                      <span>{ans}</span>
                      {selectedAnswer === idx && (
                        <span>
                          {idx === 0 ? <AlertCircle size={16} className="text-rose-600" /> : <CheckCircle size={16} className="text-emerald-600" />}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {identityError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 mt-5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-center gap-2 text-left shadow-sm"
                  >
                    <AlertCircle size={16} className="text-amber-600 shrink-0" />
                    <span>{identityError}</span>
                  </motion.div>
                )}

                <div className="mt-6 text-xs text-purple-950/40 font-mono">
                  Failure to confirm agelessness will result in immediate eye-rolling.
                </div>
              </div>
            </motion.div>
          )}

          {/* STAGE 4: Identity Confirmed - Glowing Pulsing surprise button mechanic */}
          {stage === 'identity_confirmed' && (
            <motion.div
              key="confirmed"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.05, opacity: 0 }}
              className="w-full max-w-lg text-center"
            >
              <div className="p-8 md:p-12 rounded-[48px] bg-white/45 backdrop-blur-xl border border-white/60 shadow-[0_32px_64px_rgba(0,0,0,0.04)] relative overflow-hidden text-purple-950">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400" />
                
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center text-2xl">
                  🔓
                </div>

                <h2 className="font-serif text-2xl md:text-3xl text-purple-950 mb-3 tracking-tight font-bold">
                  Cleared! Target Decrypted
                </h2>
                
                <p className="text-purple-900/80 text-sm md:text-base mb-8 font-sans">
                  Identity verified: <strong className="text-pink-600 text-base font-semibold">Bhoomi (The Supreme Menace)</strong>. Security clearance level absolute. Dossier is live.
                </p>

                {/* Pulsing trigger surprise button */}
                <div className="relative inline-block w-full">
                  <div className="absolute inset-x-0 -top-2 -bottom-2 bg-gradient-to-r from-pink-400 via-rose-350 to-purple-400 rounded-3xl blur-xl opacity-75 animate-pulse" />
                  
                  <button
                    onClick={executeSurpriseReveal}
                    disabled={isRevealing}
                    className="relative w-full py-5 px-8 rounded-full bg-purple-950 text-white font-bold text-lg md:text-xl tracking-wider hover:text-rose-100 hover:scale-102 transition-all duration-300 active:scale-98 shadow-2xl flex items-center justify-center gap-3 overflow-hidden"
                    id="surprise-glowing-btn"
                  >
                    {isRevealing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-ping" />
                        Decrypting Files...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        <PartyPopper className="text-pink-300 shrink-0" />
                        Do You Ready for This? 👀
                      </span>
                    )}
                  </button>
                </div>

                <p className="mt-5 text-xs text-pink-600/80 font-mono">
                  DO NOT CLICK IF SENSITIVE TO MAXIMUM ICONIC ENERGIES
                </p>
              </div>
            </motion.div>
          )}

          {/* STAGE 5: The Complete Birthday Card Experience (Revealed Stage) */}
          {stage === 'revealed' && (
            <motion.div
              key="revealed"
              initial={{ opacity: 0, scale: 0.93, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, type: 'spring', damping: 25 }}
              className="w-full space-y-8"
            >
              
              {/* Massive Aesthetic Reveal Greeting */}
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ rotate: -15, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="inline-block px-4 py-2 rounded-full bg-pink-100 text-pink-700 border border-pink-200 text-xs font-mono uppercase tracking-widest font-semibold"
                >
                  🎉 SENSORY BURST MAXIMUM 🎉
                </motion.div>

                <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-purple-950 drop-shadow-sm pb-2">
                  Happy Birthday, <span className="text-pink-600">Bhoomi! 🎂</span>
                </h1>

                <p className="max-w-xl mx-auto font-serif italic text-lg md:text-xl text-purple-900/80 tracking-wide font-light leading-relaxed">
                  "Did you really think we'd forget? As if. You're stuck with us."
                </p>
              </div>

              {/* Grid of Interactive Modules (Bento style for aesthetics) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                
                {/* 1. Main Heartfelt and cheeky letter (frosted glass) */}
                <div className="md:col-span-8 rounded-[48px] p-8 bg-white/45 backdrop-blur-xl border border-white/60 shadow-[0_32px_64px_rgba(0,0,0,0.04)] flex flex-col justify-between relative overflow-hidden text-purple-950">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl" />
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-pink-600">
                      <Heart size={20} fill="currentColor" />
                      <span className="font-mono text-xs tracking-wider uppercase font-bold">TO OUR FAVORITE INSURGENT</span>
                    </div>

                    <h2 className="font-serif text-2xl text-purple-950 font-bold">
                      An Official Directive, signed with chaos.
                    </h2>

                    <div className="text-purple-900/90 space-y-4 text-justify leading-relaxed text-sm md:text-base font-light">
                      <p>
                        Listen, <strong>Bhoomi</strong>. We ran multiple computer simulations on whether we should allocate system memory to compile you a birthday app. The results were mixed (some algorithms claimed you are far too sassy), but we made it anyway because... well, you're pretty iconic.
                      </p>
                      <p>
                        You have officially survived another cosmic loop around the sun. You aren't getting any older (we legally verified this in Phase 2), you're simply upgrading your status as our primary director of eye-rolls and cheeky complaints. 
                      </p>
                      <p>
                        Thank you for keeping our lives packed with laughter, style, and absolutely brilliant mischief. Have an spectacular time today! We hope you get drowned in pastries, candles, and endless sparkling compliments.
                      </p>
                    </div>
                  </div>

                  {/* Aesthetic stamp inside card */}
                  <div className="mt-8 pt-6 border-t border-purple-100 flex flex-wrap justify-between items-center gap-4 text-xs font-mono text-purple-900/50">
                    <div>
                      <span>COORDINATE LOCK: SUCCESS</span>
                      <span className="block text-pink-600/80 font-semibold">AUTHENTICATED BHOOMI SPECIAL EDITION</span>
                    </div>
                    <div className="flex items-center gap-1 bg-pink-50 text-pink-700 px-3 py-1.5 rounded-full border border-pink-200">
                      <Sparkles size={11} />
                      <span className="font-medium">Class of Ageless Royalty</span>
                    </div>
                  </div>
                </div>

                {/* 2. Interactive Sticky Note (Wobbles on hover, highly cheekily customizable) */}
                <div className="md:col-span-4 flex flex-col justify-between">
                  <motion.div
                    whileHover={{ scale: 1.03, rotate: -2 }}
                    className="rounded-2xl p-6 bg-gradient-to-br from-amber-100 to-amber-200 text-slate-900 shadow-xl relative transform -rotate-1 border border-amber-300 h-full flex flex-col justify-between select-none"
                    id="cheeky-sticky-note"
                  >
                    {/* Tiny push pin design element */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-rose-500 rounded-full shadow-md border-2 border-white" />
                    
                    <div className="space-y-4 pt-2">
                      <span className="font-serif text-xs px-2.5 py-1 rounded bg-amber-900/10 inline-block font-bold">P.S. IMPORTANT DOCUMENT</span>
                      <p className="font-serif italic text-lg leading-relaxed text-amber-950">
                        "P.S. You owe me big time for custom writing code for you instead of sending a boring template message. I accept payment in high-quality caffeine & chocolates."
                      </p>
                    </div>

                    <div className="mt-8 border-t border-amber-900/15 pt-4 flex justify-between items-center text-[10px] font-mono tracking-widest text-amber-900 uppercase">
                      <span>BOOST CODE: ACTIVE</span>
                      <span>- SINCERELY YOUR FAVORITE CODER</span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Multi-Module Lower Panel: Roast Stack and Aura Generator */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 3. ROASTS & TOASTS STACK */}
                <div className="rounded-[48px] p-8 bg-white/45 backdrop-blur-xl border border-white/60 shadow-[0_32px_64px_rgba(0,0,0,0.04)] flex flex-col justify-between relative overflow-hidden text-purple-950">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-serif text-lg md:text-xl text-purple-950 font-bold flex items-center gap-2">
                        <Flame size={18} className="text-orange-500 animate-pulse" />
                        Teasing Roast & Toast Engine
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-1.5 bg-purple-100 border border-purple-200 text-purple-800 rounded-md font-semibold">
                        Card {currentQuoteIdx + 1}/{MEMORABLE_QUOTES.length}
                      </span>
                    </div>

                    <div className="h-44 flex flex-col justify-center text-center px-4 relative">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentQuoteIdx}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-3"
                        >
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase font-semibold ${
                            MEMORABLE_QUOTES[currentQuoteIdx].type === 'Roast' 
                              ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {MEMORABLE_QUOTES[currentQuoteIdx].type}
                          </span>
                          
                          <p className="font-serif text-base md:text-lg text-purple-950 leading-relaxed italic">
                            "{MEMORABLE_QUOTES[currentQuoteIdx].text}"
                          </p>

                          <span className="text-purple-900/55 text-xs block font-mono">
                            Verifiably: {MEMORABLE_QUOTES[currentQuoteIdx].severity}
                          </span>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-purple-100">
                    {MEMORABLE_QUOTES.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setCurrentQuoteIdx(i);
                          handleInteractiveSound('pop');
                        }}
                        className={`flex-1 h-1.5 rounded-full transition-all ${
                          i === currentQuoteIdx ? 'bg-purple-900' : 'bg-purple-250/30 hover:bg-purple-200'
                        }`}
                        title={`Go to quote ${i+1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* 4. SURPRISE AURA AND STATUS READING CARD */}
                <div className="rounded-[48px] p-8 bg-white/45 backdrop-blur-xl border border-white/60 shadow-[0_32px_64px_rgba(0,0,0,0.04)] flex flex-col justify-between relative overflow-hidden text-purple-950">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl" />
                  
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-serif text-lg md:text-xl text-purple-950 font-bold flex items-center gap-2">
                        <Sparkles size={18} className="text-amber-500" />
                        Bhoomi Official Aura Reader
                      </h3>
                      
                      <button 
                        onClick={regenerateAura}
                        className="p-1 px-3 text-[10px] font-mono text-purple-800 hover:text-purple-950 bg-purple-500/10 hover:bg-purple-500/20 rounded-md border border-purple-500/15 transition-all flex items-center gap-1"
                        id="roll-aura-btn"
                      >
                        <RotateCcw size={10} />
                        Reroll Aura
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-white/40 p-4 rounded-2xl border border-white">
                        <div>
                          <span className="text-[10px] text-purple-900/40 font-mono block">STATION TITLE ID</span>
                          <span className="text-pink-600 font-serif font-black text-lg">{aura.label}</span>
                        </div>
                        <div className="text-right">
                          <span className="px-2.5 py-1 rounded bg-amber-100 border border-amber-300 text-[10px] font-mono text-amber-800 font-semibold">
                            {aura.rating}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-purple-500/[0.03] p-2.5 rounded-xl border border-purple-500/10">
                          <span className="text-purple-900/40 font-mono block text-[10px]">SASS INDEX:</span>
                          <span className="font-mono text-pink-600 font-bold">{aura.sass}</span>
                        </div>
                        <div className="bg-purple-500/[0.03] p-2.5 rounded-xl border border-purple-500/10">
                          <span className="text-purple-900/40 font-mono block text-[10px]">CHAOS SPEED:</span>
                          <span className="font-mono text-pink-600 font-bold">{aura.chaos}</span>
                        </div>
                      </div>

                      <p className="text-purple-900/80 text-xs md:text-sm italic leading-relaxed font-light">
                        "{aura.desc}"
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-purple-100 text-[10px] text-purple-900/40 font-mono">
                    REAL-TIME BHOOMI SATELLITE DIAGNOSTICS
                  </div>
                </div>

              </div>

              {/* Interactive Photo Polaroids Box */}
              <div className="rounded-[48px] p-8 md:p-10 bg-white/45 backdrop-blur-xl border border-white/60 shadow-[0_32px_64px_rgba(0,0,0,0.04)] space-y-6 text-purple-950">
                <div className="text-center md:text-left space-y-1">
                  <h3 className="font-serif text-2xl text-purple-950 font-bold flex items-center justify-center md:justify-start gap-2">
                    📸 Digital Memo Box
                  </h3>
                  <p className="text-xs text-purple-900/40 font-mono uppercase tracking-widest font-semibold">
                    Tap polaroids to inspect classified comments
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                  {[
                    { title: "Living Iconically 👑", note: "That time she thought she was hiding major sass behind a straight face. (Alert: Spoiler, she failed)." },
                    { title: "Menace Mode Activated 🌪️", note: "Carefully structuring how to steal the biggest slice of custom triple-chocolate cake while pretending to smile." },
                    { title: "Secretly Adorable 🌸", note: "Even a professional chaotic rebel has a pure heart of gold inside. Extremely rare documentation. Archive with caution." }
                  ].map((polaroid, idx) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        setActivePolaroidIndex(activePolaroidIndex === idx ? null : idx);
                        handleInteractiveSound('sparkle');
                      }}
                      className="cursor-pointer group relative"
                    >
                      <motion.div
                        className="bg-white p-4 pb-8 transform transition-all duration-300 rounded-md shadow-2xl relative select-none"
                        style={{
                          rotate: idx === 0 ? '-3deg' : idx === 1 ? '2deg' : '-1deg'
                        }}
                        whileHover={{ scale: 1.05, y: -6, rotate: idx === 0 ? '-1deg' : idx === 1 ? '4deg' : '1deg' }}
                      >
                        {/* Polaroid frame border design */}
                        <div className="aspect-square bg-purple-950/5 overflow-hidden relative rounded border border-purple-900/10 flex flex-col items-center justify-center">
                          {idx === 0 && <span className="text-5xl">👑</span>}
                          {idx === 1 && <span className="text-5xl">🎂</span>}
                          {idx === 2 && <span className="text-5xl">🌸</span>}
                          <div className="absolute inset-0 bg-rose-500/5 mix-blend-overlay" />
                        </div>
                        
                        <div className="mt-4 text-center">
                          <span className="font-serif italic text-sm md:text-base font-bold text-slate-800 tracking-wide block">
                            {polaroid.title}
                          </span>
                        </div>

                        {/* Back overlay flipped explanation */}
                        <AnimatePresence>
                          {activePolaroidIndex === idx && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-purple-950 p-5 flex flex-col justify-between rounded-md text-slate-100"
                            >
                              <div className="space-y-2 text-center pt-4">
                                <span className="text-pink-400 font-mono text-[9px] block uppercase tracking-wider font-semibold">SECURE BHOOMI FOOTNOTE:</span>
                                <p className="font-serif italic text-xs leading-relaxed text-slate-200">
                                  {polaroid.note}
                                </p>
                              </div>
                              <div className="text-[9px] font-mono text-slate-400 text-center">
                                Tap to flip back
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emoji Exploder Trigger Area */}
              <div className="rounded-[48px] p-8 bg-white/45 backdrop-blur-xl border border-white/60 shadow-[0_32px_64px_rgba(0,0,0,0.04)] text-center space-y-4 text-purple-950">
                <h3 className="font-serif text-lg text-purple-950 font-bold block">
                  👉 Interactive Sparks: Explode Bhoomi Birthday Emojis!
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {["🎂", "🎉", "🌸", "✨", "💫", "💖", "🧸", "🍰", "🍭", "🎈"].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={(e) => triggerEmojiExplosion(emoji, e)}
                      className="w-12 h-12 rounded-full bg-white/40 border border-white/60 hover:bg-white/80 hover:border-white text-2xl transition-all shadow-sm active:scale-90 flex items-center justify-center cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Post Reveal Call-To-Actions */}
              <div className="pt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
                
                <button
                  onClick={handleShareLove}
                  className="w-full sm:w-auto py-4 px-8 rounded-full bg-purple-900 hover:bg-purple-950 font-bold tracking-wider text-white transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 text-sm cursor-pointer"
                  id="share-love-btn"
                >
                  <Copy size={16} />
                  Share the love 💌 (Copy Prank Invite)
                </button>

                <div className="text-center sm:text-left text-xs font-mono text-purple-900/60">
                  ⚡ Now go celebrate, you absolute menace. You deserve it. 🎉
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* Copy Toast Alert */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-full bg-purple-950 text-white text-xs font-mono font-bold shadow-2xl flex items-center gap-2 z-50 border border-purple-800"
          >
            <CheckCircle size={14} className="text-emerald-400" />
            Cheeky invitation copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Aesthetic credit absolute footer */}
      <footer className="mt-auto py-8 text-center text-[10px] font-mono tracking-widest text-purple-900/40">
        BHOOMI BIRTHDAY SURPRISE APPLET EDITION • © 2026 COSMIC REBEL LTD.
      </footer>
    </div>
  );
}
