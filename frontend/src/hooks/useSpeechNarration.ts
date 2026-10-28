import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseSpeechNarrationReturn {
  isSupported: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  play: (text: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  replay: () => void;
  lastText: string;
}

export function useSpeechNarration(): UseSpeechNarrationReturn {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [lastText, setLastText] = useState<string>('');
  
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      synthRef.current = window.speechSynthesis;
    } else {
      setIsSupported(false);
    }

    return () => {
      // Safe cleanup on unmount
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  const play = useCallback((text: string) => {
    if (!synthRef.current || !text) return;

    // Cancel existing
    synthRef.current.cancel();
    setLastText(text);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // slightly gentle, calm pace
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis utterance error:', e);
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onpause = () => {
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  }, []);

  const pause = useCallback(() => {
    if (synthRef.current && isPlaying && !isPaused) {
      synthRef.current.pause();
      setIsPaused(true);
    }
  }, [isPlaying, isPaused]);

  const resume = useCallback(() => {
    if (synthRef.current && isPlaying && isPaused) {
      synthRef.current.resume();
      setIsPaused(false);
    }
  }, [isPlaying, isPaused]);

  const replay = useCallback(() => {
    if (lastText) {
      play(lastText);
    }
  }, [lastText, play]);

  return {
    isSupported,
    isPlaying,
    isPaused,
    play,
    pause,
    resume,
    stop,
    replay,
    lastText
  };
}
