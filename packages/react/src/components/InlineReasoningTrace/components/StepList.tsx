import React, { useState, useCallback } from 'react';
import cx from 'classnames';
import type { StepListProps } from '../types.js';
import { Step } from './Step.js';
import styles from './inline-reasoning-trace.scss';

/**
 * StepList component
 * 
 * Manages the list of reasoning steps with show more/less functionality.
 * Handles animation states and visibility of steps.
 */
export const StepList: React.FC<StepListProps> = ({
  steps,
  isExiting,
  shouldAnimate = true,
  isInitialRender = false,
  initialVisibleSteps = 5,
  showAllStepsByDefault = false,
  allowStepCollapse = true,
  isProcessing = false,
  currentProcessingStepIndex = 0
}) => {
  // When processing, automatically show all steps so the processing step is visible
  const effectiveShowAllStepsByDefault = isProcessing || showAllStepsByDefault;
  
  const [showAllSteps, setShowAllSteps] = useState(effectiveShowAllStepsByDefault);
  const [isStepsExiting, setIsStepsExiting] = useState(false);
  const [shouldRenderHiddenSteps, setShouldRenderHiddenSteps] = useState(effectiveShowAllStepsByDefault);
  const [hasUserToggled, setHasUserToggled] = useState(false);
  const timeoutRef = React.useRef<number | null>(null);
  const prevProcessingRef = React.useRef(isProcessing);
  
  // Only auto-expand when processing state changes from false to true (and user hasn't manually toggled)
  React.useEffect(() => {
    if (isProcessing && !prevProcessingRef.current && !hasUserToggled) {
      setShowAllSteps(true);
      setShouldRenderHiddenSteps(true);
    }
    prevProcessingRef.current = isProcessing;
  }, [isProcessing, hasUserToggled]);
  
  // Determine if we should show the toggle button
  // If effectiveShowAllStepsByDefault is true and allowStepCollapse is false, never show toggle
  const shouldShowToggle = effectiveShowAllStepsByDefault
    ? (allowStepCollapse && steps.length > initialVisibleSteps)
    : steps.length > initialVisibleSteps;
  
  const visibleSteps = steps.slice(0, initialVisibleSteps);
  const hiddenSteps = steps.slice(initialVisibleSteps);
  
  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  const handleToggleSteps = useCallback(() => {
    // Mark that user has manually toggled
    setHasUserToggled(true);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (showAllSteps) {
      // When using effectiveShowAllStepsByDefault (processing state), steps use inline transitions
      // Need to wait for the inline style transition (400ms) to complete
      const animationDuration = effectiveShowAllStepsByDefault ? 400 : 240;
      
      setIsStepsExiting(true);
      // Immediately trigger the hidden state for inline style transitions
      if (effectiveShowAllStepsByDefault) {
        setShowAllSteps(false);
      }
      
      // Wait for animation to complete before cleaning up
      timeoutRef.current = window.setTimeout(() => {
        if (!effectiveShowAllStepsByDefault) {
          setShowAllSteps(false);
          setShouldRenderHiddenSteps(false);
        }
        setIsStepsExiting(false);
        timeoutRef.current = null;
      }, animationDuration);
    } else {
      // Expanding - render immediately and animate in
      setShowAllSteps(true);
      setShouldRenderHiddenSteps(true);
    }
  }, [showAllSteps, effectiveShowAllStepsByDefault]);

  // When showing all steps by default, render everything in a single list
  if (effectiveShowAllStepsByDefault) {
    return (
      <div className="">
        <ul className={cx(styles.accordionContent, styles.list, {
          [styles.listExiting]: isExiting,
          [styles.listNoAnimation]: isInitialRender || (!shouldAnimate && !isExiting)
        })}>
          {steps.map((step, index) => {
            const isHidden = !showAllSteps && index >= initialVisibleSteps;
            return (
              <Step
                step={step}
                index={index}
                key={index}
                shouldAnimate={shouldAnimate && !isInitialRender}
                isExiting={isExiting}
                isHidden={isHidden}
                isProcessing={isProcessing}
                currentProcessingStepIndex={currentProcessingStepIndex}
              />
            );
          })}
          {shouldShowToggle && (
            <li className={cx(styles.listItem, styles.showMoreListItem, {
              [styles.listItemNoAnimation]: !shouldAnimate || isExiting
            })}>
              <span className={styles.nestedIndicator} />
              <button
                className={styles.showMoreStepsButton}
                onClick={handleToggleSteps}
                aria-expanded={showAllSteps}
              >
                {showAllSteps ? 'Show less' : `Show ${hiddenSteps.length} more step${hiddenSteps.length > 1 ? 's' : ''}`}
              </button>
            </li>
          )}
        </ul>
      </div>
    );
  }

  // Default behavior: show initial steps with "show more" functionality
  return (
    <div className="" >
      <ul className={cx(styles.accordionContent, styles.list, {
        [styles.listExiting]: isExiting,
        [styles.listNoAnimation]: isInitialRender || (!shouldAnimate && !isExiting)
      })}>
        {visibleSteps.map((step, index) => (
          <Step
            step={step}
            index={index}
            key={index}
            shouldAnimate={shouldAnimate && !isInitialRender}
            isExiting={isExiting}
            isNotLast={index === visibleSteps.length - 1 && shouldShowToggle}
            isProcessing={isProcessing}
            currentProcessingStepIndex={currentProcessingStepIndex}
          />
        ))}
        {shouldShowToggle && !showAllSteps && (
          <li className={cx(styles.listItem, styles.showMoreListItem, {
            [styles.listItemNoAnimation]: !shouldAnimate || isExiting
          })}>
            <span className={styles.nestedIndicator} />
            <button
              className={styles.showMoreStepsButton}
              onClick={handleToggleSteps}
              aria-expanded={showAllSteps}
            >
              {`Show ${hiddenSteps.length} more step${hiddenSteps.length > 1 ? 's' : ''}`}
            </button>
          </li>
        )}
      </ul>
      {shouldShowToggle && shouldRenderHiddenSteps && (
        <ul className={cx(styles.accordionContent, styles.list, styles.hiddenStepsList, {
          [styles.listExiting]: isStepsExiting || isExiting,
          [styles.listNoAnimation]: !shouldAnimate && !isExiting && !isStepsExiting
        })}>
          {hiddenSteps.map((step, index) => (
            <Step
              step={step}
              index={initialVisibleSteps + index}
              key={initialVisibleSteps + index}
              shouldAnimate={shouldAnimate}
              isExiting={isExiting || isStepsExiting}
              animationDelay={(initialVisibleSteps + index + 1) * 0.03}
              isProcessing={isProcessing}
              currentProcessingStepIndex={currentProcessingStepIndex}
            />
          ))}
          <li className={cx(styles.listItem, styles.showMoreListItem, {
            [styles.listItemNoAnimation]: isStepsExiting || isExiting || !shouldAnimate
          })}>
            <span className={styles.nestedIndicator} />
            <button
              className={styles.showMoreStepsButton}
              onClick={handleToggleSteps}
              aria-expanded={showAllSteps}
            >
              Show less
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};