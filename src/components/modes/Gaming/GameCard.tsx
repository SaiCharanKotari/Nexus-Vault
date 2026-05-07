import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ImageOff } from 'lucide-react';

export const GameCard = ({ game, index, accentColor, onClick }: any) => {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + (index * 0.05) }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-3 border border-white/5 transition-all group-hover:border-white/20 group-hover:-translate-y-2 group-hover:shadow-[0_10px_30px_rgba(0,242,255,0.2)]">
        {!imgError && game.image ? (
          <img
            src={game.image}
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        ) : (
          // Fallback when image fails or is missing
          <div className="w-full h-full bg-gradient-to-br from-[#0d0d1a] to-[#1a1a2e] flex flex-col items-center justify-center gap-3">
            <ImageOff className="w-10 h-10 text-white/10" />
            <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest px-3 text-center leading-tight">
              {game.title}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-nexus-accent/20 p-4 rounded-full backdrop-blur-sm">
            <Play className="w-8 h-8 text-nexus-accent fill-nexus-accent" />
          </div>
        </div>
        <div className="absolute bottom-3 left-3 flex flex-col">
          <span className="text-[10px] text-white/50 uppercase font-bold tracking-widest">{game.developer}</span>
        </div>
      </div>
      <h4 className="text-sm font-bold text-white/90 group-hover:text-white truncate">{game.title}</h4>
    </motion.div>
  );
};
