import { useState, useEffect, useRef } from 'react';

// FIX: Add TypeScript definitions for the Web Speech API to fix "Cannot find name 'SpeechRecognition'" errors.
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}
interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}
interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}
interface SpeechRecognitionStatic {
  new (): SpeechRecognition;
}

// TypeScript definitions for SpeechRecognition
declare global {
  interface Window {
    // FIX: Use the defined SpeechRecognitionStatic interface for the constructor.
    SpeechRecognition: SpeechRecognitionStatic;
    webkitSpeechRecognition: SpeechRecognitionStatic;
  }
}

interface SpeechRecognitionHook {
  isListening: boolean;
  transcript: string;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
}

const useSpeechRecognition = (): SpeechRecognitionHook => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  // FIX: The type `SpeechRecognition` is now defined and can be used here.
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const isSupported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  useEffect(() => {
    if (!isSupported) {
      console.warn("Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;
    
    recognition.continuous = false;
    recognition.lang = 'ko-KR';
    recognition.interimResults = false;

    // FIX: Add explicit types to event handlers for better type safety.
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const speechResult = event.results[event.results.length - 1][0].transcript;
      setTranscript(speechResult);
      stopListening();
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error', event.error);
      stopListening();
    };

    recognition.onend = () => {
        setIsListening(false);
    };

    return () => {
      if(recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isSupported]);
  
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setIsListening(true);
      try {
        recognitionRef.current.start();
      } catch(e) {
        console.error("Error starting speech recognition:", e);
        setIsListening(false);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  return { isListening, transcript, startListening, stopListening, isSupported };
};

export default useSpeechRecognition;
