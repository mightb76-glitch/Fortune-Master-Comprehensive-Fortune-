import React from 'react';
import type { Sentiment } from '../types';

interface SentimentAnimationProps {
  sentiment: Sentiment;
}

export default function SentimentAnimation({ sentiment }: SentimentAnimationProps): React.JSX.Element {
  const sentimentClasses: Record<Sentiment, string> = {
    good: 'sentiment-bg-good',
    neutral: 'sentiment-bg-neutral',
    bad: 'sentiment-bg-bad',
  };

  const animationClass = sentimentClasses[sentiment] || '';

  return (
    <div 
      className={`absolute inset-0 -z-10 transition-opacity duration-1000 animate-fade-in ${animationClass}`}
      aria-hidden="true"
    />
  );
}