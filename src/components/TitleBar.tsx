import React from 'react';

export const TitleBar: React.FC = () => {
  return (
    <div 
      className="h-8 bg-[#050508] w-full flex items-center border-b border-white/2 select-none z-[100] relative shrink-0"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      <div className="pl-4 h-full flex items-center gap-2 pointer-events-none">
        <img src="/nv-logo.png" alt="Icon" className="w-4 h-4 object-contain rounded-full" />
        <span className="text-xs font-bold text-white/50 tracking-[0.3em] uppercase italic">Nexus Vault</span>
      </div>
      
      {/* 
          Native Caption Buttons (Minimize, Maximize, Close) 
          are automatically provided by Electron's titleBarOverlay.
          They handle Snap Layouts, hover states, and native hit-testing.
          No HTML buttons required for these actions.
      */}
      <div className="flex-1 h-full" />
    </div>
  );
};
