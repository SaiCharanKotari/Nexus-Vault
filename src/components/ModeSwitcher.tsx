import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Gamepad2, Sparkles } from 'lucide-react';
import type { AppMode } from '../App';

interface ModeSwitcherProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

export const ModeSwitcher: React.FC<ModeSwitcherProps> = ({ mode, setMode }) => {
  const isGaming = mode === 'gaming';

  // Motion values for tilt/rotation tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the 3D tilt effect
  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [30, -30]), { stiffness: 150, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-30, 30]), { stiffness: 150, damping: 25 });

  // Z-axis rotation for mode switching
  const z = useMotionValue(isGaming ? 0 : 180);
  const rotateZ = useSpring(z, { stiffness: 120, damping: 20 });

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Sync Z rotation when mode changes
  React.useEffect(() => {
    z.set(isGaming ? 0 : 180);
  }, [isGaming, z]);

  return (
    <div
      className="fixed top-6 left-1/2 -translate-x-1/2 w-[160px] h-[80px] z-[5000] flex justify-center"
      style={{ WebkitAppRegion: 'no-drag', perspective: '1000px' } as React.CSSProperties}
    >
      <motion.div
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={() => setMode(isGaming ? 'anime' : 'gaming')}
        style={{
          rotateX,
          rotateY,
          rotateZ,
          WebkitAppRegion: 'no-drag',
          transformStyle: 'preserve-3d',
          x: 0, // Force no translation
          y: 0
        } as any}
        animate={{ rotateZ: isGaming ? 0 : 180 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className="absolute top-[-80px] w-[160px] h-[160px] rounded-full border border-white/20 bg-[#0a0a0f]/90 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.9)] pointer-events-auto cursor-pointer flex items-center justify-center group"
      >
        {/* 3D Depth Rings */}
        <div className="absolute inset-0 rounded-full border border-white/5 translate-z-[-10px]" />
        <div className="absolute inset-4 rounded-full border border-white/5 translate-z-[10px]" />

        {/* Gaming Side */}
        <motion.div
          style={{ transformStyle: 'preserve-3d' }}
          className={`absolute bottom-3 flex flex-col items-center gap-0.5 transition-all duration-500 pointer-events-none ${isGaming ? 'text-nexus-accent translate-z-[20px]' : 'text-white/5 rotate-180 translate-z-[-20px]'
            }`}
        >
          <Gamepad2 size={18} className={isGaming ? 'drop-shadow-[0_0_8px_rgba(0,242,255,1)]' : ''} />
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Gaming</span>
        </motion.div>

        {/* Anime Side */}
        <motion.div
          style={{ transformStyle: 'preserve-3d' }}
          className={`absolute top-3 flex flex-col items-center gap-0.5 transition-all duration-500 pointer-events-none ${!isGaming ? 'text-pink-500 rotate-180 translate-z-[20px]' : 'text-white/5 translate-z-[-20px]'
            }`}
        >
          <Sparkles size={18} className={!isGaming ? 'drop-shadow-[0_0_8px_rgba(236,72,153,1)]' : ''} />
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Anime</span>
        </motion.div>

        {/* 3D Center Hub */}
        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-inner translate-z-[15px]">
          <div className="w-2 h-2 rounded-full bg-white/20" />
        </div>
      </motion.div>

      {/* Static Indicator Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-[5px] bg-white/60 rounded-full blur-[0.5px] pointer-events-none z-10" />
    </div>
  );
};
