import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AppMode } from '../App';

interface AmbientBackgroundProps {
  mode: AppMode;
}

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({ mode }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <AnimatePresence mode="wait">
        {mode === 'anime' ? (
          <motion.div
            key="anime-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            {/* Dreamy Purple/Pink Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-500/10 blur-[100px] rounded-full" />
            <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-cyan-400/5 blur-[80px] rounded-full" />
            
            {/* Sakura Particles */}
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: Math.random() * 100 + '%', 
                  y: -20, 
                  opacity: 0,
                  rotate: 0 
                }}
                animate={{ 
                  y: '110vh', 
                  opacity: [0, 0.4, 0],
                  rotate: 360 
                }}
                transition={{ 
                  duration: 10 + Math.random() * 15, 
                  repeat: Infinity, 
                  delay: Math.random() * 10,
                  ease: "linear"
                }}
                className="absolute w-2 h-2 bg-pink-300/30 rounded-full blur-[1px]"
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="gaming-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            {/* Cyber Neon Glows */}
            <div className="absolute top-[-20%] left-[20%] w-[70%] h-[70%] bg-blue-900/10 blur-[150px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/5 blur-[100px] rounded-full" />
            
            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03]" 
                 style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            
            {/* Kinetic Particles */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: Math.random() * 100 + '%', 
                  y: Math.random() * 100 + '%', 
                  opacity: 0,
                  scale: 0.5
                }}
                animate={{ 
                  scale: [0.5, 1, 0.5],
                  opacity: [0, 0.2, 0],
                }}
                transition={{ 
                  duration: 3 + Math.random() * 5, 
                  repeat: Infinity, 
                  delay: Math.random() * 5,
                  ease: "easeInOut"
                }}
                className="absolute w-[2px] h-[2px] bg-cyan-400/50 rounded-full"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
