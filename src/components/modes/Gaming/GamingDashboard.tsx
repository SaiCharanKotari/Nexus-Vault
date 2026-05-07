import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Settings,
  Bell,
  User,
  Home,
} from 'lucide-react';
import type { AppMode } from '../../../App';
import { ModeSwitcher } from '../../ModeSwitcher';
import { AmbientBackground } from '../../AmbientBackground';
import { GameDetails } from './GameDetails';
import { GameCard } from './GameCard';
// import { SearchPage } from './SearchPage';
import { fetchLibraryIds, fetchSteamBasicInfo } from './requirementsService';
import { WifiOff } from 'lucide-react';


interface GamingDashboardProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

export const GamingDashboard: React.FC<GamingDashboardProps> = ({ mode, setMode }) => {
  const [selectedGame, setSelectedGame] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'search'>('home');
  const [libraryFilter, setLibraryFilter] = useState<'online' | 'protected'>('online');
  const [libraryGames, setLibraryGames] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [serverDown, setServerDown] = useState(false);
  const accentColor = 'text-nexus-accent';
  const accentBg = 'bg-nexus-accent';
  const accentGlow = 'shadow-[0_0_20px_rgba(0,242,255,0.4)]';

  const sidebarItems = [
    { id: 'home', icon: <Home />, label: "Home" },
    { id: 'search', icon: <Search />, label: "Search" },
  ];

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setLibraryGames([]);
      setServerDown(false);
      const ids = await fetchLibraryIds(libraryFilter);
      if (ids.length === 0) {
        if (!cancelled) { setServerDown(true); setIsLoading(false); }
        return;
      }
      const games = await Promise.all(ids.map((id) => fetchSteamBasicInfo(id)));
      if (!cancelled) {
        setLibraryGames(games.filter(Boolean));
        setIsLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [libraryFilter]);


  return (
    <div className={`h-full w-full text-white flex overflow-hidden relative transition-all duration-700 bg-[#050508]`}>
      <AmbientBackground mode={mode} />

      {/* Dynamic Sidebar */}
      {!selectedGame && (
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
                label={item.label}
                active={activeTab === item.id}
                mode={mode}
                accentBg={accentBg}
                accentGlow={accentGlow}
                onClick={() => {
                  setSelectedGame(null);
                  setActiveTab(item.id as any);
                }}
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
              <header className="flex items-center justify-end gap-6 mb-10 pt-4 app-header relative z-20">
                {/* Online/Protected Toggle */}
                <div className="flex bg-white/5 border border-white/10 rounded-sm p-1 no-drag mr-auto ml-1">
                  <button
                    onClick={() => setLibraryFilter('online')}
                    className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-sm ${libraryFilter === 'online' ? 'bg-[#3a9bed] text-white shadow-lg' : 'text-white/30 hover:text-white/60'}`}
                  >
                    Online
                  </button>
                  <button
                    onClick={() => setLibraryFilter('protected')}
                    className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all rounded-sm ${libraryFilter === 'protected' ? 'bg-[#3a9bed] text-white shadow-lg' : 'text-white/30 hover:text-white/60'}`}
                  >
                    Protected
                  </button>
                </div>

                <div className="no-drag">
                  <ModeSwitcher mode={mode} setMode={setMode} />
                </div>
                <div className="flex items-center gap-4 no-drag">
                  <Bell className="w-5 h-5 text-white/30 hover:text-white cursor-pointer" />
                </div>
              </header>

              {activeTab === 'home' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {isLoading ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-40 text-white/10">
                      <div className="w-16 h-16 border-4 border-white/5 border-t-[#3a9bed] rounded-full animate-spin mb-6" />
                      <p className="text-sm font-black uppercase tracking-[0.4em] opacity-40">Loading Library...</p>
                    </div>
                  ) : serverDown ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-40 gap-4 text-white/20">
                      <WifiOff className="w-16 h-16 opacity-20" />
                      <p className="text-sm font-black uppercase tracking-[0.4em]">Server is down</p>
                      <p className="text-xs opacity-50">Start the Nexus server to load your library</p>
                    </div>
                  ) : libraryGames.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-40 text-white/10">
                      <Search className="w-20 h-20 mb-6 opacity-20" />
                      <p className="text-sm font-black uppercase tracking-[0.4em] opacity-40">No Games Found</p>
                    </div>
                  ) : (
                    libraryGames.map((game, i) => (
                      <GameCard
                        key={game.id}
                        game={game}
                        index={i}
                        accentColor={accentColor}
                        onClick={() => setSelectedGame(game)}
                      />
                    ))
                  )}
                </div>
              ) : (
                <SearchPage onGameSelect={setSelectedGame} accentColor={accentColor} />
              )}
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
