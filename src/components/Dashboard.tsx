import React from 'react';
import type { AppMode } from '../App';
import { GamingDashboard } from './modes/Gaming/GamingDashboard';
import { AnimeDashboard } from './modes/Anime/AnimeDashboard';

interface DashboardProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ mode, setMode }) => {
  return mode === 'anime' 
    ? <AnimeDashboard mode={mode} setMode={setMode} />
    : <GamingDashboard mode={mode} setMode={setMode} />;
};
