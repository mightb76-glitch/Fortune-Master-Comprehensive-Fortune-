import React, { useState, useEffect } from 'react';
import { getSajuAndHoroscope, parseDateTimeFromSpeech } from '../services/geminiService';
import type { SajuResult } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ResultCard from './ResultCard';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { MicrophoneIcon } from './Icons';

type CalendarType = 'solar' | 'lunar';
const ESTIMATED_TIME = 35; // seconds, increased for image generation

export default function SajuHoroscope(): React.JSX.Element {
  const [birthDate, setBirthDate] = useState<string>('');
  const [birthTime, setBirthTime] = useState<string>('');
  const [calendarType, setCalendarType] = useState<CalendarType>('solar');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SajuResult | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const [isParsingSpeech, setIsParsingSpeech] = useState(false);

  const {
    isListening,
    transcript,
    startListening,
    isSupported: isSpeechSupported,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      const parseSpeech = async () => {
        setIsParsingSpeech(true);
        setError(null);
        try {
          const parsedData = await parseDateTimeFromSpeech(transcript);
          if (parsedData.date) setBirthDate(parsedData.date);
          if (parsedData.time) setBirthTime(parsedData.time);
        } catch (err: any) {
          setError(err.message || '음성 분석 중 오류가 발생했습니다.');
        } finally {
          setIsParsingSpeech(false);
        }
      };
      parseSpeech();
    }
  }, [transcript]);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!birthDate) {
      setError('생년월일을 입력해주세요.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);
    setCountdown(ESTIMATED_TIME);

    try {
      const analysisResult = await getSajuAndHoroscope(birthDate, calendarType, birthTime);
      setResult(analysisResult);
    } catch (err: any) {
      setError(err.message || '분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
      setCountdown(0);
    }
  };
  
  const handleReset = () => {
    setResult(null);
    setError(null);
    setIsLoading(false);
    setBirthDate('');
    setBirthTime('');
    setCalendarType('solar');
  };

  if (isLoading) {
    return (
        <div className="w-full p-6 bg-gray-800/60 rounded-xl border border-gray-700 shadow-xl text-center">
            <LoadingSpinner />
            <p className="mt-4 text-lg text-indigo-300 animate-pulse">하늘의 기운을 읽어 당신의 운명을 분석하고 있습니다...</p>
            {countdown > 0 && <p className="mt-2 text-sm text-gray-400">예상 분석 시간: 약 {countdown}초</p>}
        </div>
    );
  }

  if (error && !isParsingSpeech) {
    return <ResultCard title="분석 오류" content={error} onReset={handleReset} isError={true} />;
  }
  
  if (result) {
    return <ResultCard 
        title="사주 & 별자리 운세 결과" 
        content={result.content} 
        sentiment={result.sentiment}
        sajuImages={result.lifeStageImages}
        onReset={handleReset} 
    />;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full p-6 bg-gray-800/60 rounded-xl border border-gray-700 shadow-xl backdrop-blur-md">
        <h2 className="text-2xl font-bold text-center text-purple-300 mb-2">사주 & 별자리 운세</h2>
        <p className="text-center text-gray-400 mb-6">생년월일을 입력하여 당신의 사주와 오늘의 운세를 확인하세요.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-300 mb-2">
              생년월일 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="birthDate"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <fieldset>
            <legend className="block text-sm font-medium text-gray-300">달력 구분 <span className="text-red-500">*</span></legend>
            <div className="mt-2 flex items-center space-x-6">
                <div className="flex items-center">
                    <input id="solar" name="calendarType" type="radio" checked={calendarType === 'solar'} onChange={() => setCalendarType('solar')} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-500 bg-gray-700" />
                    <label htmlFor="solar" className="ml-2 block text-sm text-gray-200">양력</label>
                </div>
                <div className="flex items-center">
                    <input id="lunar" name="calendarType" type="radio" checked={calendarType === 'lunar'} onChange={() => setCalendarType('lunar')} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-500 bg-gray-700" />
                    <label htmlFor="lunar" className="ml-2 block text-sm text-gray-200">음력</label>
                </div>
            </div>
          </fieldset>

          <div>
            <label htmlFor="birthTime" className="block text-sm font-medium text-gray-300 mb-2">
              태어난 시간 (선택)
            </label>
             <div className="flex items-center gap-2">
              <input
                type="time"
                id="birthTime"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="flex-grow px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {isSpeechSupported && (
                <button
                    type="button"
                    onClick={() => startListening()}
                    disabled={isListening || isParsingSpeech}
                    className={`p-2.5 rounded-lg transition-colors ${isListening ? 'bg-red-600 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-700'} disabled:bg-gray-500 disabled:cursor-wait`}
                    aria-label="음성으로 날짜 및 시간 입력"
                >
                    <MicrophoneIcon className="h-5 w-5 text-white" />
                </button>
              )}
            </div>
            {(isListening || isParsingSpeech) && (
                <p className="text-sm text-indigo-300 mt-2">
                    {isListening ? '듣고 있습니다... "1995년 10월 31일 오후 3시"처럼 말씀해보세요.' : '날짜와 시간을 분석 중입니다...'}
                </p>
            )}
            {error && isParsingSpeech && <p className="text-sm text-red-400 mt-2">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={isLoading || isParsingSpeech}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '분석 중...' : '운세 분석하기'}
          </button>
        </form>
      </div>
    </div>
  );
}