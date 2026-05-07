import React, { useState } from 'react';
import {
    Play,
    Settings,
    ChevronLeft,
    ChevronRight,
    ThumbsUp,
    Volume2,
    VolumeX,
    Maximize
} from 'lucide-react';

interface GameDetailsProps {
    game: any;
    onBack: () => void;
    accentColor: string;
}

export const GameDetails: React.FC<GameDetailsProps> = ({ game, onBack, accentColor }) => {
    const [activeMediaIndex, setActiveMediaIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);

    // Combine movies and screenshots into a single media list
    const mediaList = [
        ...(game.movies || []).map((m: any) => ({ type: 'video', url: m.url, thumb: m.thumbnail, name: m.name })),
        ...game.screenshots.map((url: string) => ({ type: 'image', url }))
    ];

    const activeMedia = mediaList[activeMediaIndex];

    const nextMedia = () => {
        setActiveMediaIndex((prev) => (prev + 1) % mediaList.length);
    };

    const prevMedia = () => {
        setActiveMediaIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
    };

    return (
        <div className="relative w-full min-h-screen bg-[#0b0b0f] text-[#d1d1d1] pb-20 font-sans selection:bg-white selection:text-black">

            {/* ── CLASSIC HEADER SECTION ── */}
            <section className="relative h-[40vh] w-full border-b border-white/10 overflow-hidden">
                <img src={game.banner} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 blur-[8px]" />
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
                                    ref={(el) => {
                                        if (el) {
                                            el.play().catch((err) => {
                                                console.error("Autoplay blocked or video failed to start:", err);
                                            });
                                        }
                                    }}
                                    src={activeMedia.url}
                                    className="w-full h-full object-contain"
                                    autoPlay
                                    muted={isMuted}
                                    loop
                                    controls
                                    playsInline
                                    preload="auto"
                                    poster={activeMedia.thumb}
                                    onCanPlay={(e) => {
                                        console.log("Video can play", e.currentTarget.currentSrc);
                                    }}
                                    onError={(e) => {
                                        const el = e.currentTarget as HTMLVideoElement;
                                        console.error("Video error:", el.error);
                                    }}
                                />
                            ) : (
                                <img
                                    src={activeMedia.url}
                                    alt=""
                                    className="w-full h-full object-contain"
                                />
                            )}

                            {/* Navigation Buttons Overlay */}
                            <button
                                onClick={prevMedia}
                                className="absolute left-0 top-0 bottom-0 px-6 bg-gradient-to-r from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center"
                            >
                                <ChevronLeft size={32} />
                            </button>
                            <button
                                onClick={nextMedia}
                                className="absolute right-0 top-0 bottom-0 px-6 bg-gradient-to-l from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center"
                            >
                                <ChevronRight size={32} />
                            </button>
                        </div>

                        {/* Thumbnail Strip with Fade Effect */}
                        <div className="relative group">
                            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
                                {mediaList.map((item, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setActiveMediaIndex(i)}
                                        className={`relative shrink-0 w-32 aspect-video cursor-pointer border-2 transition-all rounded-sm overflow-hidden ${activeMediaIndex === i ? 'border-[#3a9bed] scale-105 z-10' : 'border-white/10 opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={item.type === 'video' ? item.thumb : item.url} className="w-full h-full object-cover" alt="" />
                                        {item.type === 'video' && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                <Play size={16} fill="white" className="opacity-80" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {/* Right-side Fade Mask */}
                            <div className="absolute top-0 right-0 bottom-4 w-24 bg-gradient-to-l from-[#0b0b0f] to-transparent pointer-events-none" />
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-bold uppercase text-white/40 tracking-widest">Minimum</h4>
                                <ul className="space-y-3 text-xs">
                                    <RequirementRow label="OS" value="Windows 10 64-bit" />
                                    <RequirementRow label="Processor" value="Intel Core i5-8400 / AMD Ryzen 5 1600" />
                                    <RequirementRow label="Memory" value="16 GB RAM" />
                                    <RequirementRow label="Graphics" value="NVIDIA GTX 1060 / AMD RX 580" />
                                    <RequirementRow label="Storage" value="130 GB available space" />
                                </ul>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-bold uppercase text-white/40 tracking-widest">Recommended</h4>
                                <ul className="space-y-3 text-xs">
                                    <RequirementRow label="OS" value="Windows 10/11 64-bit" />
                                    <RequirementRow label="Processor" value="Intel Core i7-9700 / AMD Ryzen 5 5500" />
                                    <RequirementRow label="Memory" value="16 GB RAM" />
                                    <RequirementRow label="Graphics" value="NVIDIA RTX 2060 / AMD RX 5700 XT" />
                                    <RequirementRow label="Storage" value="130 GB available space" />
                                </ul>
                            </div>
                        </div>
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
                                    <div key={tag} className="bg-white/10 px-2 py-1 rounded-sm text-[10px] text-[#66c0f4] hover:bg-white/20 cursor-pointer">
                                        {tag}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-white/40">
                        <ThumbsUp size={14} className="text-green-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Nexus Hub Classic</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RequirementRow = ({ label, value }: { label: string, value: string }) => (
    <li>
        <span className="text-white/30 font-bold uppercase mr-2">{label}:</span>
        <span className="text-white/70 font-medium">{value}</span>
    </li>
);
