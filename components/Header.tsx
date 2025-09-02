
import React from 'react';
import { AIEyeIcon } from './Icons';

export default function Header(): React.JSX.Element {
  return (
    <header className="text-center p-4 rounded-lg bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-700/50 shadow-2xl">
      <div className="flex items-center justify-center gap-4">
        <AIEyeIcon />
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
          AI 운세 마스터
        </h1>
      </div>
      <p className="mt-3 text-lg text-indigo-300">
        최첨단 AI가 당신의 미래를 분석합니다.
      </p>
    </header>
  );
}
