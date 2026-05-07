import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Settings,
  Bell,
  User,
  Play,
  Home,
} from 'lucide-react';
import type { AppMode } from '../../../App';
import { ModeSwitcher } from '../../ModeSwitcher';
import { AmbientBackground } from '../../AmbientBackground';
import { GameDetails } from './GameDetails';

const WUKONG_DATA = {
  id: 2358720,
  title: "Black Myth: Wukong",
  image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2358720/library_600x900.jpg",
  banner: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2358720/library_hero.jpg",
  logo: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2358720/logo.png",
  description: "Black Myth: Wukong is an action RPG rooted in Chinese mythology. The story is based on Journey to the West, one of the Four Great Classical Novels of Chinese literature. You shall set out as the Destined One to venture into the challenges and marvels ahead, to uncover the obscured truth beneath the veil of a glorious legend from the past.",
  rating: "9.6/10",
  releaseDate: "Aug 20, 2024",
  developer: "Game Science",
  movies: [
    {
      id: 256965216,
      name: "Black Myth: Wukong Gameplay | Gamescom ONL 2023",
      thumbnail: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2358720/ss_d9391ab31a4d15dddf7ba4949bfa44f5d9170580.1920x1080.jpg",
      url: "https://video.akamai.steamstatic.com/store_trailers/256965216/movie_max.mp4"
    }
  ],
  screenshots: [
    "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2358720/ss_d9391ab31a4d15dddf7ba4949bfa44f5d9170580.1920x1080.jpg",
    "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2358720/ss_86c4b7462bba219a0d0b89931a35812b9f188976.1920x1080.jpg",
    "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2358720/ss_524a39da392ee83dde091033562bc719d46b5838.1920x1080.jpg",
    "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2358720/ss_968bbc9caceb7d798bd0c393e1e9b4c44ed6d835.1920x1080.jpg",
    "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2358720/ss_63477e8ce2c0582b81c6ed576377d78e692b5642.1920x1080.jpg"
  ]
};

interface GamingDashboardProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

export const GamingDashboard: React.FC<GamingDashboardProps> = ({ mode, setMode }) => {
  const [selectedGame, setSelectedGame] = useState<any | null>(null);
  const accentColor = 'text-nexus-accent';
  const accentBg = 'bg-nexus-accent';
  const accentGlow = 'shadow-[0_0_20px_rgba(0,242,255,0.4)]';

  const sidebarItems = [
    { icon: <Home />, label: "Home" },
  ];

  return (
    <div className={`h-full w-full text-white flex overflow-hidden relative transition-all duration-700 bg-[#050508]`}>
      <AmbientBackground mode={mode} />

      {/* Dynamic Sidebar */}
      {!selectedGame && (
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ width: 80 }}
            className={`bg-black/40 backdrop-blur-3xl border-r border-white/5 flex flex-col p-4 z-20 relative transition-all duration-500`}
          >
            <nav className="flex-1 space-y-4 pt-10">
              {sidebarItems.map((item, i) => (
                <NavItem 
                    key={item.label} 
                    icon={item.icon} 
                    label={item.label} 
                    active={i === 0} 
                    mode={mode}
                    accentBg={accentBg}
                    accentGlow={accentGlow}
                    onClick={() => setSelectedGame(null)}
                />
              ))}
            </nav>

            <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
              <NavItem icon={<Settings />} label="Settings" mode={mode} accentBg={accentBg} accentGlow={accentGlow} />
              <div className="flex items-center justify-center lg:justify-start gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                <div className={`w-8 h-8 shrink-0 rounded-full bg-nexus-surface border border-white/10 flex items-center justify-center overflow-hidden`}>
                  <User className={`w-5 h-5 ${accentColor}`} />
                </div>
              </div>
            </div>
          </motion.aside>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative flex flex-col z-10 scrollbar-hide">
        <AnimatePresence mode="wait">
            {!selectedGame ? (
                <motion.div
                    key="main-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6 lg:p-10 flex-1"
                >
                    {/* Header */}
                    <header className="flex items-center justify-between mb-10 pt-4 app-header relative z-20">
                        <div className="relative w-full max-w-md no-drag">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                        <input
                            type="text"
                            placeholder="Search games..."
                            className="w-full bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-white/20 transition-all text-sm"
                        />
                        </div>
                        <div className="no-drag">
                            <ModeSwitcher mode={mode} setMode={setMode} />
                        </div>
                        <div className="flex items-center gap-4 no-drag">
                            <Bell className="w-5 h-5 text-white/30 hover:text-white cursor-pointer" />
                        </div>
                    </header>

                    <div className="space-y-12">
                        <section className="relative h-[460px] rounded-[32px] overflow-hidden group border border-white/10 shadow-2xl cursor-pointer" onClick={() => setSelectedGame(WUKONG_DATA)}>
                            <img src={WUKONG_DATA.banner} alt={WUKONG_DATA.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent" />
                            <div className="absolute bottom-10 left-10 right-10">
                                <img src={WUKONG_DATA.logo} alt="Logo" className="w-64 mb-6 drop-shadow-2xl" />
                                <div className="flex items-center gap-6">
                                    <button className="flex items-center gap-3 px-10 py-5 bg-white text-black font-black rounded-2xl hover:bg-nexus-accent transition-all hover:scale-105 active:scale-95 group">
                                        <Play className="w-6 h-6 fill-black" />
                                        PLAY NOW
                                    </button>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Release Date</span>
                                        <span className="text-sm font-bold text-nexus-accent">{WUKONG_DATA.releaseDate}</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </motion.div>
            ) : (
                <GameDetails 
                    game={selectedGame} 
                    onBack={() => setSelectedGame(null)} 
                    accentColor={accentColor} 
                />
            )}
        </AnimatePresence>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, mode, accentBg, accentGlow, onClick }: any) => (
  <div 
    onClick={onClick}
    className={`flex items-center justify-center lg:justify-start gap-4 px-4 py-4 rounded-2xl cursor-pointer transition-all duration-300 group ${active ? `${accentBg} text-black font-bold ${accentGlow}` : 'hover:bg-white/5 text-white/30 hover:text-white'}`}
  >
    <div className={`${active ? '' : 'group-hover:scale-110 transition-transform'}`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    {mode === 'anime' && <span className="hidden lg:block text-sm font-bold tracking-tight">{label}</span>}
  </div>
);
