import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';

interface FLIPOptions {
  isExpanded: boolean;
  isProcessing: boolean;
  currentStepIndex: number;
  duration?: number;
  enabled?: boolean;
  blockClass?: string;
  containerRef?: RefObject<HTMLElement>;
}

interface FLIPState {
  first: DOMRect;
}

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Custom hook for FLIP (First, Last, Invert, Play) animation technique.
 *
 * @param {object} options - Configuration for the FLIP animation
 * @param {boolean} options.isExpanded - Whether the trace is expanded
 * @param {boolean} options.isProcessing - Whether a step is processing
 * @param {number} options.currentStepIndex - Index of the processing step
 * @param {number} [options.duration] - Animation duration in milliseconds
 * @param {boolean} [options.enabled] - Whether FLIP animation is enabled
 * @param {string} [options.blockClass] - Component block class
 * @param {RefObject<HTMLElement>} [options.containerRef] - Trace root element
 * @returns FLIP controls for capturing the first position before state changes
 */
export const useFLIPAnimation = ({
  isExpanded,
  isProcessing,
  currentStepIndex,
  duration = 400,
  enabled = true,
  blockClass = 'clabs--inline-reasoning-trace',
  containerRef,
}: FLIPOptions) => {
  const pendingStateRef = useRef<FLIPState | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const cleanupTimeoutRef = useRef<number | null>(null);
  const animatedElementRef = useRef<HTMLElement | null>(null);
  const hiddenElementRef = useRef<HTMLElement | null>(null);

  const getRootElement = useCallback(
    () => containerRef?.current ?? document,
    [containerRef]
  );

  const getCollapsedTitle = useCallback(() => {
    return getRootElement().querySelector(
      '[data-flip-id^="processing-step-"]'
    ) as HTMLElement | null;
  }, [getRootElement]);

  const getExpandedTitle = useCallback(() => {
    return getRootElement().querySelector(
      `[data-step-index="${currentStepIndex}"] .${blockClass}__step-name-wrapper`
    ) as HTMLElement | null;
  }, [blockClass, currentStepIndex, getRootElement]);

  const cleanupAnimation = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (cleanupTimeoutRef.current !== null) {
      clearTimeout(cleanupTimeoutRef.current);
      cleanupTimeoutRef.current = null;
    }

    if (animatedElementRef.current) {
      animatedElementRef.current.style.transition = '';
      animatedElementRef.current.style.transform = '';
      animatedElementRef.current.style.transformOrigin = '';
      animatedElementRef.current.removeAttribute('data-flip-animating');
      animatedElementRef.current = null;
    }

    if (hiddenElementRef.current) {
      hiddenElementRef.current.style.visibility = '';
      hiddenElementRef.current = null;
    }
  }, []);

  const captureFirst = useCallback(() => {
    if (!enabled || !isProcessing) {
      pendingStateRef.current = null;
      return;
    }

    const sourceElement = isExpanded ? getExpandedTitle() : getCollapsedTitle();
    if (!sourceElement) {
      pendingStateRef.current = null;
      return;
    }

    cleanupAnimation();
    pendingStateRef.current = {
      first: sourceElement.getBoundingClientRect(),
    };
  }, [
    cleanupAnimation,
    enabled,
    getCollapsedTitle,
    getExpandedTitle,
    isExpanded,
    isProcessing,
  ]);

  useIsomorphicLayoutEffect(() => {
    if (!enabled || !isProcessing) {
      pendingStateRef.current = null;
      cleanupAnimation();
      return;
    }

    const pendingState = pendingStateRef.current;
    if (!pendingState) {
      return;
    }

    pendingStateRef.current = null;

    const targetElement = isExpanded ? getExpandedTitle() : getCollapsedTitle();
    if (!targetElement) {
      return;
    }

    const last = targetElement.getBoundingClientRect();
    const deltaX = pendingState.first.left - last.left;
    const deltaY = pendingState.first.top - last.top;
    const hasMoved = Math.abs(deltaX) > 0.5 || Math.abs(deltaY) > 0.5;

    if (!hasMoved) {
      return;
    }

    const duplicateElement = isExpanded
      ? getCollapsedTitle()
      : getExpandedTitle();
    if (duplicateElement && duplicateElement !== targetElement) {
      duplicateElement.style.visibility = 'hidden';
      hiddenElementRef.current = duplicateElement;
    }

    animatedElementRef.current = targetElement;
    targetElement.style.transformOrigin = 'top left';
    targetElement.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
    targetElement.setAttribute('data-flip-animating', 'true');

    targetElement.getBoundingClientRect();

    animationFrameRef.current = requestAnimationFrame(() => {
      targetElement.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0.14, 0.3, 1)`;
      targetElement.style.transform = 'translate3d(0, 0, 0)';
    });

    cleanupTimeoutRef.current = window.setTimeout(cleanupAnimation, duration);

    return cleanupAnimation;
  }, [
    cleanupAnimation,
    duration,
    enabled,
    getCollapsedTitle,
    getExpandedTitle,
    isExpanded,
    isProcessing,
  ]);

  useEffect(() => {
    return cleanupAnimation;
  }, [cleanupAnimation]);

  return { captureFirst };
};
