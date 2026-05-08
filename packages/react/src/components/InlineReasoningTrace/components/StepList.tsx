import React, { useState, useCallback } from 'react';
import cx from 'classnames';
import { usePrefix } from '@carbon-labs/utilities/usePrefix';
import type { StepListProps } from '../types';
import { Step } from './Step';

const hiddenStepsAnimationDuration = 240;
const hiddenStepsAnimationFallbackDelay = hiddenStepsAnimationDuration + 80;

export const StepList: React.FC<StepListProps> = ({
  steps,
  isExiting,
  shouldAnimate = true,
  isInitialRender = false,
  initialVisibleSteps = 5,
  showAllStepsByDefault = false,
  allowStepCollapse = true,
  isProcessing = false,
  currentProcessingStepIndex = 0,
  suppressListAnimations = false,
}) => {
  const prefix = usePrefix();
  const blockClass = `${prefix}--inline-reasoning-trace`;

  const effectiveShowAllStepsByDefault = isProcessing || showAllStepsByDefault;

  const [showAllSteps, setShowAllSteps] = useState(
    effectiveShowAllStepsByDefault
  );
  const [isStepsEntering, setIsStepsEntering] = useState(false);
  const [isStepsExiting, setIsStepsExiting] = useState(false);
  const [shouldRenderHiddenSteps, setShouldRenderHiddenSteps] = useState(
    effectiveShowAllStepsByDefault
  );
  const [hasUserToggled, setHasUserToggled] = useState(false);
  const timeoutRef = React.useRef<number | null>(null);
  const enterAnimationFrameRef = React.useRef<number | null>(null);
  const prevProcessingRef = React.useRef(isProcessing);
  const suppressInitialListAnimationsRef = React.useRef(
    suppressListAnimations
  );

  const clearExitTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const clearEnterAnimationFrame = useCallback(() => {
    if (enterAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(enterAnimationFrameRef.current);
      enterAnimationFrameRef.current = null;
    }
  }, []);

  const completeHiddenStepsExit = useCallback(() => {
    clearExitTimeout();
    clearEnterAnimationFrame();
    setShowAllSteps(false);
    setShouldRenderHiddenSteps(false);
    setIsStepsEntering(false);
    setIsStepsExiting(false);
  }, [clearEnterAnimationFrame, clearExitTimeout]);

  React.useEffect(() => {
    if (isProcessing && !prevProcessingRef.current && !hasUserToggled) {
      clearEnterAnimationFrame();
      clearExitTimeout();
      setShowAllSteps(true);
      setShouldRenderHiddenSteps(true);
      setIsStepsEntering(false);
      setIsStepsExiting(false);
    }
    prevProcessingRef.current = isProcessing;
  }, [
    clearEnterAnimationFrame,
    clearExitTimeout,
    isProcessing,
    hasUserToggled,
  ]);

  const visibleSteps = steps.slice(0, initialVisibleSteps);
  const hiddenSteps = steps.slice(initialVisibleSteps);
  const hasHiddenSteps = hiddenSteps.length > 0;

  const shouldShowToggle = effectiveShowAllStepsByDefault
    ? allowStepCollapse && hasHiddenSteps
    : hasHiddenSteps;

  React.useEffect(() => {
    return () => {
      clearEnterAnimationFrame();
      clearExitTimeout();
    };
  }, [clearEnterAnimationFrame, clearExitTimeout]);

  const handleToggleSteps = useCallback(() => {
    setHasUserToggled(true);
    clearEnterAnimationFrame();
    clearExitTimeout();

    if (showAllSteps) {
      setIsStepsExiting(true);
      setIsStepsEntering(false);

      timeoutRef.current = window.setTimeout(
        completeHiddenStepsExit,
        hiddenStepsAnimationFallbackDelay
      );
    } else {
      setShowAllSteps(true);
      setIsStepsEntering(true);
      setIsStepsExiting(false);
      setShouldRenderHiddenSteps(true);
      enterAnimationFrameRef.current = window.requestAnimationFrame(() => {
        enterAnimationFrameRef.current = window.requestAnimationFrame(() => {
          setIsStepsEntering(false);
          enterAnimationFrameRef.current = null;
        });
      });
    }
  }, [
    clearEnterAnimationFrame,
    clearExitTimeout,
    completeHiddenStepsExit,
    showAllSteps,
  ]);

  const handleHiddenStepsTransitionEnd = useCallback(
    (event: React.TransitionEvent<HTMLDivElement>) => {
      if (
        isStepsExiting &&
        event.target === event.currentTarget &&
        event.propertyName === 'grid-template-rows'
      ) {
        completeHiddenStepsExit();
      }
    },
    [completeHiddenStepsExit, isStepsExiting]
  );

  const toggleButtonLabel = showAllSteps
    ? 'Show less'
    : `Show ${hiddenSteps.length} more step${
        hiddenSteps.length > 1 ? 's' : ''
      }`;

  const hiddenStepsShouldAnimate =
    (shouldAnimate && !isInitialRender && !isExiting) ||
    (hasUserToggled && !isExiting);
  const shouldAnimateListItems =
    shouldAnimate &&
    !isInitialRender &&
    !isExiting &&
    !suppressInitialListAnimationsRef.current;

  return (
    <div>
      <ul
        className={cx(`${blockClass}__list`, {
          [`${blockClass}__list--no-animation`]:
            !shouldAnimateListItems,
        })}>
        {visibleSteps.map((step, index) => (
          <Step
            step={step}
            index={index}
            key={index}
            shouldAnimate={shouldAnimateListItems}
            isExiting={isExiting}
            isNotLast={
              index === visibleSteps.length - 1 &&
              hasHiddenSteps &&
              (shouldShowToggle || shouldRenderHiddenSteps)
            }
            isProcessing={isProcessing}
            currentProcessingStepIndex={currentProcessingStepIndex}
          />
        ))}
      </ul>
      {hasHiddenSteps && shouldRenderHiddenSteps && (
        <div
          className={cx(`${blockClass}__hidden-steps`, {
            [`${blockClass}__hidden-steps--entering`]: isStepsEntering,
            [`${blockClass}__hidden-steps--exiting`]: isStepsExiting,
            [`${blockClass}__hidden-steps--no-animation`]:
              !hiddenStepsShouldAnimate,
          })}
          onTransitionEnd={handleHiddenStepsTransitionEnd}>
          <div className={`${blockClass}__hidden-steps-inner`}>
            <ul
              className={cx(
                `${blockClass}__list`,
                `${blockClass}__list--hidden`,
                {
                  [`${blockClass}__list--no-animation`]:
                    !shouldAnimateListItems,
                }
              )}>
              {hiddenSteps.map((step, index) => (
                <Step
                  step={step}
                  index={initialVisibleSteps + index}
                  key={initialVisibleSteps + index}
                  shouldAnimate={shouldAnimateListItems}
                  isExiting={isExiting}
                  isNotLast={
                    index === hiddenSteps.length - 1 && shouldShowToggle
                  }
                  isProcessing={isProcessing}
                  currentProcessingStepIndex={currentProcessingStepIndex}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
      {shouldShowToggle && (
        <ul
          className={cx(`${blockClass}__list`, `${blockClass}__list--toggle`, {
            [`${blockClass}__list--no-animation`]:
              !shouldAnimateListItems,
          })}>
          <li
            className={cx(
              `${blockClass}__list-item`,
              `${blockClass}__show-more-list-item`,
              {
                [`${blockClass}__list-item--no-animation`]:
                  !shouldAnimate || isExiting,
              }
            )}>
            <span className={`${blockClass}__nested-indicator`} />
            <button
              type="button"
              className={`${blockClass}__show-more-steps-button`}
              onClick={handleToggleSteps}
              aria-expanded={showAllSteps}>
              {toggleButtonLabel}
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};
