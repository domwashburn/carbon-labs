import { useRef, useEffect } from 'react';

interface FLIPOptions {
  isExpanded: boolean;
  isProcessing: boolean;
  currentStepIndex: number;
  duration?: number;
  enabled?: boolean;
}

/**
 * Custom hook for FLIP (First, Last, Invert, Play) animation technique
 * 
 * Smoothly animates an element from one position to another by:
 * 1. First: Capturing the initial position
 * 2. Last: Moving to the final position
 * 3. Invert: Applying a transform to make it appear in the first position
 * 4. Play: Animating the transform back to 0
 * 
 * This creates buttery-smooth 60fps animations using GPU-accelerated transforms
 * instead of layout-triggering properties like top/left.
 * 
 * @param options - Configuration for the FLIP animation
 * @returns Ref to the element being animated
 */
export const useFLIPAnimation = ({
  isExpanded,
  isProcessing,
  currentStepIndex,
  duration = 400,
  enabled = true
}: FLIPOptions) => {
  const firstPositionRef = useRef<DOMRect | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);
  const isFirstRender = useRef(true);
  
  useEffect(() => {
    // Skip if FLIP is disabled or not processing
    if (!enabled || !isProcessing) {
      return;
    }
    
    // Skip animation on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    // Find the processing label element
    const processingLabel = document.querySelector(
      '[data-flip-id^="processing-step-"]'
    ) as HTMLElement;
    
    // Find the corresponding step in the expanded list
    const stepInList = document.querySelector(
      `[data-step-index="${currentStepIndex}"] .${styles.stepNameWrapper}`
    ) as HTMLElement;
    
    if (!processingLabel) {
      return;
    }
    
    elementRef.current = processingLabel;
    
    // FIRST: Capture the initial position
    // This could be either the processing label or the step in the list
    const sourceElement = isExpanded ? processingLabel : stepInList;
    if (!sourceElement) {
      return;
    }
    
    const first = sourceElement.getBoundingClientRect();
    
    // Store for next transition
    if (!firstPositionRef.current) {
      firstPositionRef.current = first;
      return;
    }
    
    // LAST: Element is now in its final position
    const targetElement = isExpanded ? stepInList : processingLabel;
    if (!targetElement) {
      return;
    }
    
    const last = targetElement.getBoundingClientRect();
    
    // INVERT: Calculate the difference between first and last positions
    const deltaX = firstPositionRef.current.left - last.left;
    const deltaY = firstPositionRef.current.top - last.top;
    const deltaW = firstPositionRef.current.width / last.width;
    const deltaH = firstPositionRef.current.height / last.height;
    
    // Apply the inverted transform (makes element appear in first position)
    targetElement.style.transformOrigin = 'top left';
    targetElement.style.transform = `
      translate(${deltaX}px, ${deltaY}px)
      scale(${deltaW}, ${deltaH})
    `;
    targetElement.setAttribute('data-flip-animating', 'true');
    
    // PLAY: Animate to the final position (transform: none)
    requestAnimationFrame(() => {
      targetElement.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0.14, 0.3, 1)`;
      targetElement.style.transform = 'none';
    });
    
    // Update first position for next transition
    firstPositionRef.current = last;
    
    // Cleanup after animation completes
    const cleanup = () => {
      targetElement.style.transition = '';
      targetElement.style.transform = '';
      targetElement.style.transformOrigin = '';
      targetElement.removeAttribute('data-flip-animating');
    };
    
    const timeoutId = setTimeout(cleanup, duration);
    
    return () => {
      clearTimeout(timeoutId);
      cleanup();
    };
    
  }, [isExpanded, isProcessing, currentStepIndex, duration, enabled]);
  
  // Reset on unmount
  useEffect(() => {
    return () => {
      isFirstRender.current = true;
      firstPositionRef.current = null;
    };
  }, []);
  
  return elementRef;
};

// Note: This is a placeholder for styles import
// In actual implementation, this would be imported from the SCSS module
const styles = {
  stepNameWrapper: 'stepNameWrapper'
};