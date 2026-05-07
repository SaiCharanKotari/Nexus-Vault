import { useState } from 'react'
import { SplashScreen } from './components/SplashScreen'
import { Dashboard } from './components/Dashboard'
import { TitleBar } from './components/TitleBar'
import { AnimatePresence } from 'framer-motion'

export type AppMode = 'gaming' | 'anime';

function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [mode, setMode] = useState<AppMode>('gaming')

  return (
    <div className={`h-screen w-screen flex flex-col box-border overflow-hidden transition-colors duration-700 ${mode === 'anime' ? 'bg-[#0f0a14]' : 'bg-[#050508]'}`}>
      <TitleBar />
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {!isLoaded ? (
            <SplashScreen key="splash" onComplete={() => setIsLoaded(true)} />
          ) : (
            <Dashboard key="dashboard" mode={mode} setMode={setMode} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
