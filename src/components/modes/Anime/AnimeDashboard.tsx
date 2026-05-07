import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Settings,
  Bell,
  User,
  Home,
  Play,
} from 'lucide-react';
import type { AppMode } from '../../../App';
import { ModeSwitcher } from '../../ModeSwitcher';
import { AmbientBackground } from '../../AmbientBackground';

interface MediaItem {
  id: number;
  title: string;
  image: string;
  stats: string;
  statLabel: string;
}

const ANIME_ITEMS: MediaItem[] = [
  { id: 10, title: "Solo Leveling", image: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800&q=60", stats: "Ep 12", statLabel: "Latest" },
  { id: 11, title: "Demon Slayer", image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=800&q=60", stats: "S4 E02", statLabel: "Latest" },
  { id: 12, title: "Jujutsu Kaisen", image: "https://images.unsplash.com/photo-1621478374422-35206faeddfb?w=800&q=60", stats: "S2 E23", statLabel: "Latest" },
  { id: 13, title: "Spy x Family", image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&q=60", stats: "S2 E12", statLabel: "Latest" },
  { id: 14, title: "One Piece", image: "https://images.unsplash.com/photo-1613317611103-68d907094246?w=800&q=60", stats: "Ep 1104", statLabel: "Latest" },
  { id: 15, title: "Attack on Titan", image: "https://images.unsplash.com/photo-1541562232579-512a21360020?w=800&q=60", stats: "Final", statLabel: "Status" },
];

interface AnimeDashboardProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

export const AnimeDashboard: React.FC<AnimeDashboardProps> = ({ mode, setMode }) => {
  const [selectedAnime, setSelectedAnime] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'search'>('home');
  const accentColor = 'text-pink-500';
  const accentBg = 'bg-pink-500';
  const accentGlow = 'shadow-[0_0_20px_rgba(236,72,153,0.4)]';

  const sidebarItems = [
    { id: 'home', icon: <Home />, label: "Home" },
    { id: 'search', icon: <Search />, label: "Search" },
  ];

  return (
    <div className={`h-full w-full text-white flex overflow-hidden relative transition-all duration-700 bg-[#0f0a14]`}>
      <AmbientBackground mode={mode} />

      {/* Dynamic Sidebar */}
      {!selectedAnime && (
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          style={{ width: 85 }}
          className={`bg-black/40 backdrop-blur-3xl border-r border-white/5 flex flex-col p-4 z-20 relative transition-all duration-500`}
        >
          <nav className="flex-1 space-y-4 pt-14">
            {sidebarItems.map((item) => (
              <NavItem
                key={item.id}
                icon={item.icon}
                active={activeTab === item.id}
                mode={mode}
                accentBg={accentBg}
                accentGlow={accentGlow}
                onClick={() => {
                  setSelectedAnime(null);
                  setActiveTab(item.id as any);
                }}
              />
            ))}
          </nav>

          <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
            <NavItem icon={<Settings />} mode={mode} accentBg={accentBg} accentGlow={accentGlow} />
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
          {!selectedAnime ? (
            <motion.div
              key="main-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 lg:p-10 flex-1"
            >
              {/* Header */}
              <header className="flex items-center justify-end gap-6 mb-10 pt-4 app-header relative z-20">
                <div className="no-drag">
                  <ModeSwitcher mode={mode} setMode={setMode} />
                </div>
                <div className="flex items-center gap-4 no-drag">
                  <Bell className="w-5 h-5 text-white/30 hover:text-white cursor-pointer" />
                </div>
              </header>

              {activeTab === 'home' ? (
                <div className="space-y-12">
                  <section className="relative h-[420px] rounded-[32px] overflow-hidden group border border-white/10">
                    <img src="https://images.unsplash.com/photo-1541562232579-512a21360020?w=1600" alt="Hero" className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute bottom-10 left-10">
                      <h2 className="text-6xl font-black mb-6 italic uppercase text-pink-500">Solo Leveling</h2>
                      <button className="flex items-center gap-3 px-8 py-4 bg-pink-500 text-black font-bold rounded-2xl hover:scale-105 transition-all">
                        <Play size={20} fill="black" /> WATCH NOW
                      </button>
                    </div>
                  </section>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {ANIME_ITEMS.map((item, i) => (
                      <MediaCard key={item.id} item={item} index={i} accentColor="text-pink-500" />
                    ))}
                  </div>
                </div>
              ) : (
                <AnimeSearchPage accentColor={accentColor} />
              )}
            </motion.div>
          ) : (
            <div className="p-10 text-center">
              <button onClick={() => setSelectedAnime(null)} className="text-pink-500 mb-8 flex items-center gap-2 mx-auto uppercase text-xs font-bold tracking-widest"><Play size={12} className="rotate-180" /> Back to Library</button>
              <h1 className="text-6xl font-black italic uppercase text-white mb-4">{selectedAnime.title}</h1>
              <p className="text-white/40">Detailed view coming soon...</p>
            </div>
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

const MediaCard = ({ item, index, accentColor }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 + (index * 0.05) }}
    className="group cursor-pointer"
  >
    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3 border border-white/5 transition-all group-hover:border-white/20 group-hover:-translate-y-2">
      <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
      <div className="absolute bottom-3 left-3 flex flex-col">
        <span className="text-[10px] text-white/50 uppercase">Trending</span>
        <span className={`text-xs font-bold ${accentColor}`}>{item.stats}</span>
      </div>
    </div>
    <h4 className="text-sm font-medium text-white/70 group-hover:text-white truncate">{item.title}</h4>
  </motion.div>
);

const AnimeSearchPage = ({ accentColor }: any) => {
  const [query, setQuery] = useState('');
  const filteredAnime = query.trim() === ''
    ? []
    : ANIME_ITEMS.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col h-full"
    >
      <div className="mb-10 max-w-2xl mx-auto w-full pt-8 no-drag relative z-30">
        <div className="relative w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/30" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for anime..."
            className="w-full bg-[#1a1a24]/80 backdrop-blur-xl border border-white/10 rounded-3xl py-5 pl-16 pr-6 focus:outline-none focus:border-pink-500/20 transition-all text-lg shadow-2xl"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10 px-2">
        {filteredAnime.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {filteredAnime.map((item, i) => (
              <MediaCard key={item.id} item={item} index={i} accentColor="text-pink-500" />
            ))}
          </div>
        ) : query.trim() !== '' ? (
          <div className="flex flex-col items-center justify-center h-64 text-white/40">
            <Search className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">No anime found matching "{query}"</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-white/10">
            <Search className="w-24 h-24 mb-6 opacity-5" />
            <p className="text-xl font-bold uppercase tracking-[0.3em] opacity-20">Start typing to search...</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
