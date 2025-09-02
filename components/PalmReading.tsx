import React, { useState, useCallback, useEffect } from 'react';
import type { ImageFile, FortuneResult } from '../types';
import { getPalmReading } from '../services/geminiService';
import ImageUploader from './ImageUploader';
import LoadingSpinner from './LoadingSpinner';
import ResultCard from './ResultCard';

const ESTIMATED_TIME = 15; // seconds

export default function PalmReading(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [image, setImage] = useState<ImageFile | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isLoading && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLoading, countdown]);
  
  const handleAnalysis = useCallback(async (imageFile: ImageFile) => {
    if (!imageFile) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setImage(imageFile);
    setCountdown(ESTIMATED_TIME);

    try {
      const analysisResult = await getPalmReading(imageFile);
      setResult(analysisResult);
    } catch (err: any) {
      setError(err.message || '분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
      setCountdown(0);
    }
  }, []);

  const handleReset = () => {
    setResult(null);
    setError(null);
    setImage(null);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full p-6 bg-gray-800/60 rounded-xl border border-gray-700 shadow-xl backdrop-blur-md">
        <h2 className="text-2xl font-bold text-center text-purple-300 mb-2">손금 보기</h2>
        <p className="text-center text-gray-400 mb-6">손금이 잘 보이도록 손바닥 사진을 올려주세요.</p>
        
        {!result && !isLoading && (
          <ImageUploader onImageReady={handleAnalysis} />
        )}

        {isLoading && (
            <div className="text-center">
                <LoadingSpinner />
                <p className="mt-4 text-lg text-indigo-300 animate-pulse">AI가 당신의 손금을 읽고 있습니다...</p>
                {countdown > 0 && <p className="mt-2 text-sm text-gray-400">예상 분석 시간: 약 {countdown}초</p>}
            </div>
        )}

        {error && !isLoading && (
             <ResultCard title="분석 오류" content={error} onReset={handleReset} isError={true} />
        )}
        
        {result && !isLoading && (
          <ResultCard 
            title="AI 손금 분석 결과" 
            content={result.content}
            sentiment={result.sentiment}
            onReset={handleReset}
            imagePreview={image ? `data:${image.mimeType};base64,${image.base64}` : undefined}
          />
        )}
      </div>
    </div>
  );
}