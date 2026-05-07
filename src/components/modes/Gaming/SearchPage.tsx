import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, WifiOff } from 'lucide-react';
import { GameCard } from './GameCard';
import { fetchLibraryIds, fetchSteamBasicInfo } from './requirementsService';

interface SearchPageProps {
  onGameSelect: (game: any) => void;
  accentColor: string;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onGameSelect, accentColor }) => {
  const [query, setQuery] = useState('');
  const [allGames, setAllGames] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [serverDown, setServerDown] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true);
      setServerDown(false);
      try {
        const [onlineIds, protectedIds] = await Promise.all([
          fetchLibraryIds('online'),
          fetchLibraryIds('protected'),
        ]);

        if (onlineIds.length === 0 && protectedIds.length === 0) {
          setServerDown(true);
          setIsLoading(false);
          return;
        }

        const allIds = [...new Set([...onlineIds, ...protectedIds])];
        const games = await Promise.all(allIds.map((id) => fetchSteamBasicInfo(id)));
        setAllGames(games.filter(Boolean));
      } catch {
        setServerDown(true);
      } finally {
        setIsLoading(false);
      }
    };
    loadAll();
  }, []);

  const filteredGames = query.trim() === ''
    ? []
    : allGames.filter(game =>
        game.title?.toLowerCase().includes(query.toLowerCase()) ||
        game.developer?.toLowerCase().includes(query.toLowerCase())
      );

  // Server down state
  if (serverDown) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-white/30">
        <WifiOff className="w-16 h-16 opacity-30" />
        <p className="text-lg font-black uppercase tracking-widest">Server is down</p>
        <p className="text-sm opacity-50">Start the Nexus server to load your library</p>
      </div>
    );
  }

  return (
    <motion.div
      key="search-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col h-full overflow-hidden"
    >
      <div className="mb-10 max-w-2xl mx-auto w-full pt-8 no-drag relative z-30">
        <div className="relative w-full">
          {isLoading ? (
            <Loader2 className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/30 animate-spin" />
          ) : (
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/30" />
          )}
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isLoading ? 'Loading library...' : `Search ${allGames.length} games...`}
            disabled={isLoading}
            className="w-full bg-[#1a1a24]/80 backdrop-blur-xl border border-white/10 rounded-3xl py-5 pl-16 pr-6 focus:outline-none focus:border-nexus-accent/30 transition-all text-lg shadow-2xl disabled:opacity-50"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10 px-2">
        <AnimatePresence mode="wait">
          {filteredGames.length > 0 ? (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredGames.map((game, i) => (
                <GameCard key={game.id} game={game} index={i} accentColor={accentColor} onClick={() => onGameSelect(game)} />
              ))}
            </motion.div>
          ) : query.trim() !== '' ? (
            <motion.div key="no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-64 text-white/40">
              <Search className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">No games found for "{query}"</p>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-64 text-white/10">
              <Search className="w-24 h-24 mb-6 opacity-5" />
              <p className="text-xl font-black uppercase tracking-[0.3em] opacity-20">
                {isLoading ? 'Loading...' : 'Start typing to search...'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
