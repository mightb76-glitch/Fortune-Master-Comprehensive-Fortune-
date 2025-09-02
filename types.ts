export enum AppMode {
  Face = 'FACE',
  Palm = 'PALM',
  Saju = 'SAJU',
  Tarot = 'TAROT',
}

export interface ImageFile {
    base64: string;
    mimeType: string;
}

export type Sentiment = 'good' | 'neutral' | 'bad';

export interface FortuneResult {
    content: string;
    sentiment: Sentiment;
}

export interface SajuResult {
    content: string;
    sentiment: Sentiment;
    lifeStageImages?: {
        early: string; // base64
        middle: string; // base64
        late: string; // base64
    };
}

export interface TarotResult {
    cardName: string;
    interpretation: string;
    cardImageDescription: string;
    sentiment: Sentiment;
    cardImageBase64?: string;
}

export interface ParsedDateTime {
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
}