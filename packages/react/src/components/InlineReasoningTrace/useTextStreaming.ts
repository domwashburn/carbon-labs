import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTextStreamingOptions {
  text: string;
  isProcessing: boolean;
  charDelay?: number; // milliseconds per character
  minDuration?: number; // minimum animation duration in ms
  maxDuration?: number; // maximum animation duration in ms
}

interface UseTextStreamingReturn {
  visibleChars: number;
  isStreaming: boolean;
  hasStreamed: boolean;
  progress: number; // 0 to 1
}

/**
 * Custom hook for smooth character-by-character text streaming animation
 * Uses requestAnimationFrame for butter-smooth 60fps animation
 * 
 * @param options - Configuration for the streaming animation
 * @returns State and progress of the streaming animation
 */
export const useTextStreaming = ({
  text,
  isProcessing,
  charDelay = 30,
  minDuration = 400,
  maxDuration = 1800
}: UseTextStreamingOptions): UseTextStreamingReturn => {
  const [visibleChars, setVisibleChars] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasStreamed, setHasStreamed] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const prevProcessingRef = useRef(isProcessing);
  const isInitialMount = useRef(true);
  
  // Calculate optimal duration based on text length
  const duration = Math.min(
    Math.max(text.length * charDelay, minDuration),
    maxDuration
  );
  
  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }
    
    const elapsed = timestamp - startTimeRef.current;
    const currentProgress = Math.min(elapsed / duration, 1);
    
    // Easing function for smooth acceleration/deceleration
    // Using ease-out-cubic for natural feel
    const eased = 1 - Math.pow(1 - currentProgress, 3);
    
    const currentVisibleChars = Math.floor(eased * text.length);
    
    setVisibleChars(currentVisibleChars);
    setProgress(currentProgress);
    
    if (currentProgress < 1) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      // Animation complete
      setVisibleChars(text.length);
      setProgress(1);
      setIsStreaming(false);
      rafRef.current = null;
      startTimeRef.current = null;
    }
  }, [text.length, duration]);
  
  // Start streaming when processing begins
  useEffect(() => {
    const processingJustStarted = isProcessing && !prevProcessingRef.current;
    const initialProcessing = isInitialMount.current && isProcessing;
    
    if ((processingJustStarted || initialProcessing) && !hasStreamed) {
      // Start streaming animation
      setIsStreaming(true);
      setHasStreamed(true);
      setVisibleChars(0);
      setProgress(0);
      startTimeRef.current = null;
      
      // Start RAF loop
      rafRef.current = requestAnimationFrame(animate);
    }
    
    // Reset when processing stops
    if (!isProcessing && prevProcessingRef.current) {
      setHasStreamed(false);
      setIsStreaming(false);
      setVisibleChars(0);
      setProgress(0);
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      startTimeRef.current = null;
    }
    
    isInitialMount.current = false;
    prevProcessingRef.current = isProcessing;
  }, [isProcessing, hasStreamed, animate]);
  
  // Reset when text changes
  useEffect(() => {
    setHasStreamed(false);
    setIsStreaming(false);
    setVisibleChars(0);
    setProgress(0);
    
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    startTimeRef.current = null;
  }, [text]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);
  
  return {
    visibleChars,
    isStreaming,
    hasStreamed,
    progress
  };
};