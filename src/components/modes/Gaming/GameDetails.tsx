import React, { useState, useRef } from 'react';
import {
    Play,
    Settings,
    ChevronLeft,
    ChevronRight,
    ThumbsUp,
    Volume2,
    VolumeX,
    Maximize,
    Loader2,
} from 'lucide-react';
import { fetchRequirements, type ParsedRequirements } from './requirementsService';

interface GameDetailsProps {
    game: any;
    onBack: () => void;
    accentColor: string;
}

export const GameDetails: React.FC<GameDetailsProps> = ({ game, onBack, accentColor }) => {
    const [activeMediaIndex, setActiveMediaIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const [requirements, setRequirements] = useState<ParsedRequirements | null>(null);
    const [reqLoading, setReqLoading] = useState(true);
    const [videoError, setVideoError] = useState<string | null>(null);
    const thumbnailRef = useRef<HTMLDivElement>(null);

    const scrollThumbnails = (dir: 'left' | 'right') => {
        if (thumbnailRef.current) {
            thumbnailRef.current.scrollBy({ left: dir === 'left' ? -800 : 800, behavior: 'smooth' });
        }
    };

    // Filter live movies to ensure they have at least one valid source
    const liveMovies = React.useMemo(() =>
        requirements?.movies?.filter(m => m.mp4 || m.webm) || [],
        [requirements?.movies]
    );

    const movies = React.useMemo(() => (liveMovies.length > 0)
        ? liveMovies
        : (game.movies || []), [liveMovies, game.movies]);

    const screenshots = React.useMemo(() => (requirements?.screenshots && requirements.screenshots.length > 0)
        ? requirements.screenshots
        : (game.screenshots || []), [requirements, game.screenshots]);

    const mediaList = React.useMemo(() => [
        ...movies.map((m: any) => ({
            type: 'video',
            // Normalize to a single url field
            url: m.mp4 || m.webm || m.url || "",
            thumb: m.thumbnail,
            name: m.name
        })),
        ...screenshots.map((url: string) => ({ type: 'image', url }))
    ], [movies, screenshots]);

    // Always start at the first video if one exists
    const firstVideoIndex = mediaList.findIndex(m => m.type === 'video');
    const startIndex = firstVideoIndex !== -1 ? firstVideoIndex : 0;

    // Reset to first video whenever the game changes
    React.useEffect(() => {
        setActiveMediaIndex(startIndex);
    }, [game.id]);

    const activeMedia = mediaList[activeMediaIndex];

    // Preload first video URL so it loads faster
    React.useEffect(() => {
        const firstMedia = mediaList[0];
        if (firstMedia?.type === 'video' && firstMedia.url) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'video';
            link.href = firstMedia.url;
            document.head.appendChild(link);
            return () => { document.head.removeChild(link); };
        }
    }, [game.id, mediaList]);

    // Fetch live requirements from Steam API
    React.useEffect(() => {
        setReqLoading(true);
        setRequirements(null);
        fetchRequirements(game.id).then(data => {
            setRequirements(data);
            setReqLoading(false);
        });
    }, [game.id]);
    return (
        <div className="relative w-full min-h-screen bg-[#0b0b0f] text-[#d1d1d1] pb-20 font-sans selection:bg-white selection:text-black">

            {/* ── CLASSIC HEADER SECTION ── */}
            <section className="relative h-[55vh] w-full border-b border-white/10 overflow-hidden">
                <img src={game.banner} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end p-12 lg:px-24">
                    <button
                        onClick={onBack}
                        className="absolute top-8 left-8 flex items-center gap-2 text-white/40 hover:text-white transition-colors no-drag uppercase text-[10px] tracking-[0.2em] font-bold"
                    >
                        <ChevronLeft size={16} /> Back to Library
                    </button>

                    <div className="flex flex-col md:flex-row items-end gap-12">
                        <div className="w-full md:w-auto">
                            <img src={game.logo} className="w-full max-w-[350px]" alt="Game Logo" />
                        </div>

                        <div className="flex-1 space-y-6">
                            <div className="flex items-center gap-6">
                                <button className="flex items-center gap-3 px-10 py-3.5 bg-[#3a9bed] hover:bg-[#47a8ff] text-white font-bold rounded-sm transition-all shadow-lg active:translate-y-0.5">
                                    <Play size={18} fill="white" /> PLAY
                                </button>
                                <button className="p-3.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-sm transition-all">
                                    <Settings size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── MAIN CONTENT ── */}
            <div className="max-w-[1400px] mx-auto px-12 lg:px-24 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Left: Media & About */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Interactive Media Showcase */}
                    <section className="space-y-4">
                        {/* Main Media Player/Viewer */}
                        <div className="relative aspect-video bg-black rounded-sm border border-white/10 overflow-hidden group">
                            {activeMedia.type === 'video' ? (
                                <video
                                    key={activeMedia.url}
                                    src={activeMedia.url}
                                    className="w-full h-full object-contain"
                                    autoPlay
                                    muted={isMuted}
                                    loop
                                    controls
                                    playsInline
                                    preload="auto"
                                    onLoadStart={() => {
                                        setVideoError(null);
                                    }}
                                    onError={(e) => {
                                        const errorMsg = (e.target as any).error?.message || "Unknown video error";
                                        setVideoError(errorMsg);
                                    }}
                                />
                            ) : (
                                <img
                                    src={activeMedia.url}
                                    alt=""
                                    className="w-full h-full object-contain"
                                />
                            )}

                            {videoError && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-6 text-center">
                                    <p className="text-red-500 text-sm font-bold mb-2">Playback Error</p>
                                    <p className="text-white/40 text-[10px] break-all max-w-md">{videoError}</p>
                                    <p className="text-white/20 text-[8px] mt-4 uppercase tracking-widest">Check console for details</p>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Strip with Fade Effect */}
                        <div className="relative group flex items-center">
                            <button
                                onClick={() => scrollThumbnails('left')}
                                className="absolute left-0 z-20 h-full px-2 bg-gradient-to-r from-[#0b0b0f] to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <div
                                ref={thumbnailRef}
                                className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth w-full"
                            >
                                {mediaList.map((item, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setActiveMediaIndex(i)}
                                        className={`relative shrink-0 w-32 aspect-video cursor-pointer border-2 transition-all rounded-sm overflow-hidden ${activeMediaIndex === i ? 'border-[#3a9bed] scale-105 z-10' : 'border-white/10 opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={item.type === 'video' ? item.thumb : item.url} className="w-full h-full object-cover" alt="" />
                                        {item.type === 'video' && (
                                            <>
                                                {/* Dark overlay so it's clearly different from a screenshot */}
                                                <div className="absolute inset-0 bg-black/50" />
                                                {/* Centered play button */}
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                                                        <Play size={18} fill="white" className="text-white" />
                                                    </div>
                                                </div>
                                                {/* "TRAILER" badge top-left */}
                                                <div className="absolute top-1 left-1 bg-red-600 text-white text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm">
                                                    Trailer
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => scrollThumbnails('right')}
                                className="absolute right-0 z-20 h-full px-2 bg-gradient-to-l from-[#0b0b0f] to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </section>

                    {/* About Section */}
                    <section className="space-y-6 pt-4">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-2">About This Game</h3>
                        <div className="text-[#a3a3a3] leading-relaxed space-y-4 text-sm font-medium">
                            <p>{game.description}</p>
                        </div>
                    </section>

                    {/* Requirements */}
                    <section className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-2">System Requirements</h3>
                        {reqLoading ? (
                            <div className="flex items-center gap-3 text-white/30 text-xs pt-4">
                                <Loader2 size={14} className="animate-spin" />
                                Fetching requirements from Steam...
                            </div>
                        ) : (!requirements?.minimum && !requirements?.recommended) ? (
                            <p className="text-xs text-white/20 italic pt-4">System requirements not available for this title.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
                                {requirements?.minimum && (
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold uppercase text-white/40 tracking-widest">Minimum</h4>
                                        <pre className="text-xs text-white/70 font-medium whitespace-pre-wrap leading-relaxed">
                                            {requirements.minimum}
                                        </pre>
                                    </div>
                                )}
                                {requirements?.recommended && (
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold uppercase text-white/40 tracking-widest">Recommended</h4>
                                        <pre className="text-xs text-white/70 font-medium whitespace-pre-wrap leading-relaxed">
                                            {requirements.recommended}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>
                </div>

                {/* Right: Sidebar Summary */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-sm space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-start">
                                <span className="text-[10px] font-bold uppercase text-white/30 tracking-widest">Recent Reviews</span>
                                <span className="text-xs font-bold text-[#66c0f4]">Overwhelmingly Positive</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <span className="text-[10px] font-bold uppercase text-white/30 tracking-widest">Release Date</span>
                                <span className="text-xs font-bold text-white/70">{game.releaseDate}</span>
                            </div>
                            <div className="flex justify-between items-start">
                                <span className="text-[10px] font-bold uppercase text-white/30 tracking-widest">Developer</span>
                                <span className="text-xs font-bold text-[#66c0f4]">{game.developer}</span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/5 space-y-4">
                            <span className="text-[10px] font-bold uppercase text-white/30 tracking-widest block">Popular Tags</span>
                            <div className="flex flex-wrap gap-2">
                                {['Action', 'RPG', 'Souls-like', 'Mythology'].map(tag => (
                                    <div key={tag} className="bg-white/10 px-2 py-1 rounded-sm text-[10px] text-[#66c0f4]">
                                        {tag}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

