import React, { useState, useMemo } from 'react';
import { AppMode } from './types';
import Header from './components/Header';
import TabButton from './components/TabButton';
import FaceReading from './components/FaceReading';
import PalmReading from './components/PalmReading';
import SajuHoroscope from './components/SajuHoroscope';
import TarotReading from './components/TarotReading';
import { FaceIcon, HandIcon, StarIcon, TarotIcon } from './components/Icons';

export default function App(): React.JSX.Element {
  const [mode, setMode] = useState<AppMode>(AppMode.Face);

  const backgroundClass = useMemo(() => {
    switch (mode) {
      case AppMode.Face:
        return 'bg-face';
      case AppMode.Palm:
        return 'bg-palm';
      case AppMode.Saju:
        return 'bg-saju';
      case AppMode.Tarot:
        return 'bg-tarot';
      default:
        return '';
    }
  }, [mode]);

  const activeComponent = useMemo(() => {
    switch (mode) {
      case AppMode.Face:
        return <FaceReading />;
      case AppMode.Palm:
        return <PalmReading />;
      case AppMode.Saju:
        return <SajuHoroscope />;
      case AppMode.Tarot:
        return <TarotReading />;
      default:
        return <FaceReading />;
    }
  }, [mode]);

  return (
    <div className={`min-h-screen bg-gray-900 text-gray-200 font-sans antialiased ${backgroundClass}`}>
      <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-4xl">
        <Header />
        <nav className="flex justify-center items-center my-6 bg-gray-800/50 p-2 rounded-xl border border-gray-700 shadow-lg backdrop-blur-sm">
          <TabButton
            label="얼굴 관상"
            icon={<FaceIcon />}
            isActive={mode === AppMode.Face}
            onClick={() => setMode(AppMode.Face)}
          />
          <TabButton
            label="손금 보기"
            icon={<HandIcon />}
            isActive={mode === AppMode.Palm}
            onClick={() => setMode(AppMode.Palm)}
          />
          <TabButton
            label="사주/운세"
            icon={<StarIcon />}
            isActive={mode === AppMode.Saju}
            onClick={() => setMode(AppMode.Saju)}
          />
           <TabButton
            label="타로 운세"
            icon={<TarotIcon />}
            isActive={mode === AppMode.Tarot}
            onClick={() => setMode(AppMode.Tarot)}
          />
        </nav>
        <main className="mt-8">
          {activeComponent}
        </main>
      </div>
    </div>
  );
}