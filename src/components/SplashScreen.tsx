import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';

interface SplashScreenProps {
  onComplete: () => void;
}

// ── Top Games from Steam CDN ──────────────────────────────────────────────

const TOP_GAMES = [
  '271590', '1174180', '1091500', '1245620', '292030',
  '1086940', '1716740', '1551360', '1593500', '1817070',
  '2050650', '1985510', '2431280', '553850', '1938090',
  '582010', '1172470', '1151640', '1289310', '230410'
];

const GAME_COVERS = TOP_GAMES.map(id => `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${id}/library_600x900.jpg`);

const STRIP = [...GAME_COVERS, ...GAME_COVERS];
const ROW_1 = STRIP;
const ROW_2 = [...STRIP.slice(10), ...STRIP.slice(0, 10)];

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [showCenter, setShowCenter] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // ── Sounds ──
    const exitSound = new Howl({
      src: ['/751152__nightdrawr__alien-creature-sound.mp3'],
      volume: 0.7
    });

    const entrySound = new Howl({
      src: ['/eff.wav'],
      volume: 0.6,
      onend: () => {
        // Play second sound immediately after the first one finishes
        exitSound.play();
      }
    });

    const s = (fn: () => void, ms: number) => {
      const id = setTimeout(fn, ms);
      timers.current.push(id);
    };

    // Sequence
    s(() => {
      setShowCenter(true);
      entrySound.play();
    }, 800);

    // Visual disappearance remains at the same timing unless requested otherwise
    s(() => {
      setShowCenter(false);
    }, 4600);

    s(() => onComplete(), 5900);

    return () => {
      timers.current.forEach(clearTimeout);
      entrySound.unload();
      exitSound.unload();
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden z-50" style={{ background: '#050508' }}>

      {/* ── Background Grid ── */}
      <div className="absolute inset-0 overflow-hidden" style={{ transform: 'rotate(-8deg) scale(1.2)', paddingTop: '80px', opacity: 0.15 }}>
        {[ROW_1, ROW_2, ROW_1].map((row, ri) => (
          <motion.div key={ri} className={`flex gap-4 ${ri < 2 ? 'mb-4' : ''}`}
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 75, ease: 'linear', repeat: Infinity }}
            style={{ width: 'max-content' }}>
            {row.map((src, i) => (
              <div key={i} className="shrink-0 w-[160px] h-[220px] rounded-xl overflow-hidden border border-white/5">
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover"
                  style={{ filter: 'blur(4px)' }}
                  draggable={false}
                />
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      <div className="absolute inset-0 bg-black/6 backdrop-blur-sm" />

      <AnimatePresence>
        {showCenter && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.4, filter: 'blur(25px)', rotate: 10 }}
            transition={{
              duration: 1.2,
              ease: [0.34, 1.56, 0.64, 1]
            }}
            className="relative z-10"
          >
            {/* Pulsing Aura */}
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute inset-[-30px] rounded-full border-2 border-nexus-accent/20"
              style={{ boxShadow: '0 0 60px rgba(0, 242, 255, 0.1)' }}
            />

            {/* Main Icon Circle */}
            <div className="w-44 h-44 rounded-full border-2 border-white/10 bg-nexus-black/40 backdrop-blur-lg flex items-center justify-center shadow-[0_0_70px_rgba(0,242,255,0.25)]">
              <img
                src="/nv-ico.ico"
                alt="Nexus Icon"
                className="w-24 h-24 object-contain drop-shadow-[0_0_30px_rgba(0,242,255,0.6)]"
              />
            </div>

            {/* Branded Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.9, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap flex flex-col items-center"
            >
              <h1 className="text-[18px] tracking-[1.2em] uppercase text-white font-bold" style={{ textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>
                Nexus Vault
              </h1>
              <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-nexus-accent/60 to-transparent mt-3" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
