import React, { useState, useEffect } from 'react';
import { getTarotReading, getTarotCardImage } from '../services/geminiService';
import type { TarotResult } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ResultCard from './ResultCard';
import TarotCard from './TarotCard';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { MicrophoneIcon } from './Icons';

const ESTIMATED_TIME = 25; // seconds, increased for image generation

const MAJOR_ARCANA = [
  '바보', '마법사', '여사제', '여황제', '황제', '교황',
  '연인', '전차', '힘', '은둔자', '운명의 수레바퀴',
  '정의', '매달린 남자', '죽음', '절제', '악마', '탑',
  '별', '달', '태양', '심판', '세계'
];

const TAROT_TOPICS = {
    "사랑과 연애": [
        "현재 저의 연애 상태는 어떤가요?",
        "미래에 어떤 연인을 만나게 될까요?",
        "새로운 연애를 시작할 수 있을까요?",
        "지금 파트너와의 궁합은 어떤가요?",
        "헤어진 연인과 재회할 가능성이 있을까요?",
        "저의 짝사랑은 이루어질까요?",
    ],
    "커리어와 직업": [
        "저에게 맞는 직업은 무엇일까요?",
        "현재 직장에서 승진할 수 있을까요?",
        "직장 내 갈등을 어떻게 해결해야 할까요?",
        "새로운 일자리를 찾을 수 있을까요?",
        "지금 직장을 바꿔도 괜찮을까요?",
        "이 프로젝트는 성공적으로 끝날까요?",
    ],
    "재정과 돈": [
        "저의 전반적인 재물운은 어떤가요?",
        "이 투자는 성공할까요?",
        "현재의 재정적 어려움을 해결할 수 있을까요?",
        "돈을 벌 수 있는 새로운 기회가 있을까요?",
        "가까운 미래에 저의 재정 상황은 어떻게 될까요?",
    ],
    "건강": [
        "현재 저의 건강 상태에 대해 조언해주세요.",
        "미래에 주의해야 할 건강 문제가 있을까요?",
        "정신적 스트레스를 줄이려면 어떻게 해야 할까요?",
        "육체적 웰빙을 위해 무엇을 해야 할까요?",
    ],
    "개인적 성장과 영성": [
        "제 삶의 목적은 무엇일까요?",
        "내면의 갈등을 어떻게 해결할 수 있을까요?",
        "영적으로 성장하기 위해 무엇을 해야 하나요?",
        "현재 제 삶의 가장 큰 교훈은 무엇인가요?",
    ],
    "가족과 인간관계": [
        "가족과의 갈등을 해결할 수 있을까요?",
        "친구와의 관계를 개선하려면 어떻게 해야 할까요?",
        "새로운 사회적 관계를 맺는 데 조언이 필요해요.",
        "이 친구와 계속 관계를 유지해야 할까요?",
    ],
    "미래 전반": [
        "올해 저에게 어떤 중요한 일이 일어날까요?",
        "다음 달 저의 전반적인 운세는 어떤가요?",
        "가까운 미래에 예상치 못한 사건이 있을까요?",
        "지금 제가 가장 집중해야 할 것은 무엇인가요?",
    ],
};


const shuffleAndPick = (arr: string[], num: number): string[] => {
    return [...arr].sort(() => 0.5 - Math.random()).slice(0, num);
};

const getFullTarotResult = async (currentConcern: string, selectedCard: string): Promise<TarotResult> => {
    const [readingResult, imageBase64] = await Promise.all([
      getTarotReading(currentConcern, selectedCard),
      getTarotCardImage(selectedCard)
    ]);
    return {
      ...readingResult,
      cardImageBase64: imageBase64,
    };
};

type TarotStep = 'category' | 'question' | 'shuffling' | 'selection' | 'result';

export default function TarotReading(): React.JSX.Element {
  const [step, setStep] = useState<TarotStep>('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [concern, setConcern] = useState<string>('');
  const [customConcern, setCustomConcern] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TarotResult | null>(null);
  const [cards, setCards] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  
  const {
    isListening,
    transcript,
    startListening,
    isSupported: isSpeechSupported,
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
        setCustomConcern(prev => prev ? `${prev} ${transcript}` : transcript);
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

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setStep('question');
  };
  
  const handleQuestionSubmit = (question: string) => {
    if (!question.trim()) {
        setError('고민이나 질문을 입력해주세요.');
        return;
    }
    setError(null);
    setConcern(question);
    setStep('shuffling');
    
    setTimeout(() => {
        setCards(shuffleAndPick(MAJOR_ARCANA, 10));
        setStep('selection');
    }, 3000); // Duration for shuffle animation
  };

  const handleCardSelect = async (cardName: string, index: number) => {
    if (selectedIndex !== null || isLoading) return;
    
    setSelectedIndex(index);
    setStep('result'); // Switch to the result/loading screen immediately
    setIsLoading(true);
    setCountdown(ESTIMATED_TIME);

    try {
      const fullResult = await getFullTarotResult(concern, cardName);
      setResult(fullResult);
    } catch (err: any) {
      setError(err.message || '분석 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false); // Stop loading when done
      setCountdown(0);
    }
  };
  
  const handleReset = () => {
    setStep('category');
    setSelectedCategory(null);
    setResult(null);
    setError(null);
    setIsLoading(false);
    setConcern('');
    setCustomConcern('');
    setCards([]);
    setSelectedIndex(null);
  };

  const renderContent = () => {
    switch (step) {
      case 'category':
        return (
          <div>
            <p className="text-center text-gray-300 mb-6">어떤 주제에 대해 고민하고 계신가요?</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.keys(TAROT_TOPICS).map((topic) => (
                <button
                  key={topic}
                  onClick={() => handleCategorySelect(topic)}
                  className="p-4 bg-gray-700/50 hover:bg-indigo-600/50 border border-gray-600 rounded-lg text-lg font-semibold transition-all duration-200"
                >
                  {topic}
                </button>
              ))}
              <button
                onClick={() => handleCategorySelect('기타 고민')}
                className="p-4 bg-gray-700/50 hover:bg-purple-600/50 border border-gray-600 rounded-lg text-lg font-semibold transition-all duration-200 md:col-span-3"
              >
                기타 고민 직접 입력
              </button>
            </div>
          </div>
        );
      
      case 'question':
        if (!selectedCategory) return null;
        const questions = TAROT_TOPICS[selectedCategory as keyof typeof TAROT_TOPICS] || [];
        return (
          <div>
            <button onClick={() => { setStep('category'); setError(null); }} className="text-sm text-indigo-400 hover:underline mb-4">&larr; 주제 다시 선택</button>
            <h3 className="text-xl font-bold text-center text-purple-300 mb-6">{selectedCategory}</h3>
            {questions.length > 0 ? (
                <div className="space-y-3">
                    {questions.map((q, i) => (
                        <button key={i} onClick={() => handleQuestionSubmit(q)} className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                            {q}
                        </button>
                    ))}
                </div>
            ) : (
                <form onSubmit={(e) => { e.preventDefault(); handleQuestionSubmit(customConcern); }} className="space-y-4">
                    <div className="relative">
                        <textarea
                            rows={4}
                            value={customConcern}
                            onChange={(e) => { setCustomConcern(e.target.value); setError(null); }}
                            placeholder="여기에 직접 질문을 입력해주세요."
                            required
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:ring-2 focus:ring-indigo-500 pr-12"
                        />
                         {isSpeechSupported && (
                            <button
                                type="button"
                                onClick={() => startListening()}
                                disabled={isListening}
                                className={`absolute top-3 right-3 p-1.5 rounded-full transition-colors ${isListening ? 'bg-red-600 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                aria-label="음성으로 질문 입력"
                            >
                                <MicrophoneIcon className="h-5 w-5 text-white" />
                            </button>
                        )}
                    </div>
                    {isListening && <p className="text-sm text-indigo-300 text-center">듣고 있습니다...</p>}
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        카드 펼치기
                    </button>
                </form>
            )}
          </div>
        );

      case 'shuffling':
        return (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <p className="text-center text-gray-300 mb-6 text-lg animate-pulse">운명의 카드를 섞고 있습니다...</p>
            <div className="relative w-40 h-64">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="card-shuffle-animate"
                  style={{ '--i': i, animationDelay: `${i * 0.1}s` } as React.CSSProperties}
                >
                  <TarotCard name="" isFlipped={false} onClick={()=>{}} isSelectable={false} />
                </div>
              ))}
            </div>
          </div>
        );

      case 'selection':
         return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <p className="text-center text-gray-300 mb-6">마음 속 질문을 생각하며 카드 한 장을 선택하세요.</p>
              <div className="flex justify-center gap-2 md:gap-4 my-4 flex-wrap animate-fade-in-grid">
                {cards.map((cardName, index) => (
                  <TarotCard
                    key={index}
                    name={cardName}
                    isFlipped={false}
                    onClick={() => handleCardSelect(cardName, index)}
                    isSelectable={!isLoading && selectedIndex === null}
                  />
                ))}
              </div>
            </div>
          );
        
      case 'result':
        if (error) {
            return <ResultCard title="분석 오류" content={error} onReset={handleReset} isError={true} />;
        }
        if (selectedIndex === null) return null;

        return (
            <div className="w-full flex flex-col items-center">
                {/* This part renders the card, which updates when the result is ready */}
                <div className="animate-card-reveal mb-6">
                    <TarotCard
                        name={result ? result.cardName : cards[selectedIndex]}
                        isFlipped={true}
                        onClick={() => {}}
                        isSelectable={false}
                        isChosen={true}
                        imageSrc={result?.cardImageBase64 ? `data:image/jpeg;base64,${result.cardImageBase64}` : undefined}
                    />
                </div>

                {/* This part renders the loading spinner */}
                {isLoading && (
                    <div className="text-center">
                        <LoadingSpinner />
                        <p className="mt-4 text-lg text-indigo-300 animate-pulse">우주의 기운을 모아 카드를 해석하고 있습니다...</p>
                        {countdown > 0 && <p className="mt-2 text-sm text-gray-400">예상 분석 시간: 약 {countdown}초</p>}
                    </div>
                )}

                {/* This part renders the result text when loading is done */}
                {!isLoading && result && (
                    <ResultCard 
                        title="AI 타로 마스터의 조언" 
                        content={result.interpretation} 
                        sentiment={result.sentiment}
                        onReset={handleReset} 
                        tarotCardImageDescription={result.cardImageDescription}
                    />
                )}
            </div>
        );
    }
  };
  
  const getSubtitle = () => {
    switch(step) {
      case 'category':
        return '마음 속 질문에 대한 답을 신비로운 타로 카드에서 찾아보세요.';
      case 'question':
        return `주제: ${selectedCategory}`;
      case 'shuffling':
        return '운명의 카드를 섞고 있습니다...';
      case 'selection':
      case 'result':
        return `당신의 질문: ${concern}`;
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full p-6 bg-gray-800/60 rounded-xl border border-gray-700 shadow-xl backdrop-blur-md min-h-[550px]">
        <h2 className="text-2xl font-bold text-center text-purple-300 mb-2">AI 타로 마스터</h2>
        <p className="text-center text-gray-400 mb-6 h-6">{getSubtitle()}</p>
        {renderContent()}
      </div>
    </div>
  );
}