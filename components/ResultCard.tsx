import React, { useState } from 'react';
import TarotCard from './TarotCard';
import SentimentAnimation from './SentimentAnimation';
import type { Sentiment } from '../types';
import { ShareIcon } from './Icons';

interface ResultCardProps {
  title: string;
  content: string;
  onReset: () => void;
  isError?: boolean;
  imagePreview?: string;
  tarotCardName?: string;
  tarotCardImageDescription?: string;
  tarotCardImageBase64?: string;
  sentiment?: Sentiment;
  sajuImages?: {
    early: string;
    middle: string;
    late: string;
  };
}

export default function ResultCard({ 
  title, 
  content, 
  onReset, 
  isError = false, 
  imagePreview, 
  tarotCardName, 
  tarotCardImageDescription, 
  tarotCardImageBase64,
  sentiment,
  sajuImages
}: ResultCardProps): React.JSX.Element {
  const [isCopied, setIsCopied] = useState(false);
  const titleColor = isError ? 'text-red-400' : 'text-purple-300';
  const borderColor = isError ? 'border-red-500/50' : 'border-purple-500/50';

  const formatContent = (text: string) => {
    return text
      .replace(/(\d+\.\s*\*?.*?\*?:)/g, '\n\n<strong class="text-indigo-300">$1</strong>')
      .replace(/(###\s?.*)/g, '<h3 class="text-2xl font-bold mt-6 mb-3 text-purple-300">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-yellow-300">$1</strong>')
      .replace(/(\n)/g, '<br />');
  };

  const handleShare = async () => {
    const plainTextContent = content
        .replace(/###\s?/g, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/(\d+\.\s*\*?.*?\*?:)/g, '\n$1')
        .trim();

    let shareText = `AI 운세 마스터 - ${title}\n\n`;

    if (tarotCardName) {
        shareText += `뽑은 카드: ${tarotCardName}\n\n해석:\n${plainTextContent}`;
    } else {
        shareText += plainTextContent;
    }

    const shareData = {
        title: 'AI 운세 마스터 결과',
        text: shareText,
        url: window.location.href
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.error('Share failed:', err);
        }
    } else {
        try {
            await navigator.clipboard.writeText(shareText);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2500);
        } catch (err) {
            console.error('Failed to copy: ', err);
            alert('클립보드에 복사하는데 실패했습니다.');
        }
    }
  };

  return (
    <div className={`relative w-full p-6 bg-gray-800/80 rounded-xl border ${borderColor} shadow-2xl backdrop-blur-lg animate-fade-in overflow-hidden`}>
      {sentiment && !isError && <SentimentAnimation sentiment={sentiment} />}
      
      <div className="relative z-10">
        <h2 className={`text-2xl font-bold text-center mb-6 ${titleColor}`}>{title}</h2>
        
        {imagePreview && (
          <div className="mb-6 flex justify-center">
              <img src={imagePreview} alt="Analysis subject" className="rounded-lg max-h-64 shadow-lg" />
          </div>
        )}
        
        {(tarotCardName || tarotCardImageDescription) && (
          <div className="mb-8 flex flex-col items-center gap-6">
            {tarotCardName && (
              <TarotCard 
                name={tarotCardName} 
                isFlipped={true} 
                onClick={() => {}} 
                isSelectable={false} 
                imageSrc={tarotCardImageBase64 ? `data:image/jpeg;base64,${tarotCardImageBase64}` : undefined}
              />
            )}
            {tarotCardImageDescription && (
              <div className="w-full p-4 bg-gray-900/50 border border-purple-700/50 rounded-lg">
                  <h4 className="text-lg font-bold text-purple-300 mb-2 text-center">카드 이미지 묘사</h4>
                  <p className="text-gray-400 italic text-center">{tarotCardImageDescription}</p>
              </div>
            )}
          </div>
        )}

        <div 
          className="text-gray-300 leading-relaxed whitespace-pre-wrap prose prose-invert prose-p:text-gray-300"
          dangerouslySetInnerHTML={{ __html: formatContent(content) }}
        >
        </div>

        {sajuImages && (
            <div className="mt-8">
                <h3 className="text-2xl font-bold text-center text-purple-300 mb-4">인생의 흐름 시각화</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col items-center">
                        <img src={`data:image/jpeg;base64,${sajuImages.early}`} alt="초년운" className="rounded-lg shadow-lg w-full h-auto aspect-square object-cover border-2 border-indigo-500/50" />
                        <p className="mt-2 text-lg font-semibold text-indigo-300">초년운</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <img src={`data:image/jpeg;base64,${sajuImages.middle}`} alt="중년운" className="rounded-lg shadow-lg w-full h-auto aspect-square object-cover border-2 border-indigo-500/50" />
                        <p className="mt-2 text-lg font-semibold text-indigo-300">중년운</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <img src={`data:image/jpeg;base64,${sajuImages.late}`} alt="말년운" className="rounded-lg shadow-lg w-full h-auto aspect-square object-cover border-2 border-indigo-500/50" />
                        <p className="mt-2 text-lg font-semibold text-indigo-300">말년운</p>
                    </div>
                </div>
            </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <button
            onClick={onReset}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
            새로 분석하기
            </button>
            {!isError && (
                <button
                    onClick={handleShare}
                    disabled={isCopied}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-500 rounded-lg shadow-sm text-base font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    <ShareIcon />
                    <span>{isCopied ? '복사 완료!' : '결과 공유하기'}</span>
                </button>
            )}
        </div>
      </div>
    </div>
  );
}