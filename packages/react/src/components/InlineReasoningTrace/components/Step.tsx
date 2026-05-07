import React, { useState, useCallback } from 'react';
import cx from 'classnames';
import type { StepProps } from '../types.js';
import { StepTitle } from './StepTitle.js';
import { StepContent } from './StepContent.js';
import { IconIndicators } from './IconIndicators.js';
import styles from './inline-reasoning-trace.scss';

/**
 * Step component
 * 
 * Renders an individual reasoning step with expand/collapse functionality.
 * Includes step title, content, and indicator icons.
 */
export const Step: React.FC<StepProps> = ({
  step,
  index,
  shouldAnimate = true,
  isExiting = false,
  isNotLast = false,
  animationDelay,
  isHidden = false,
  isProcessing = false,
  currentProcessingStepIndex = 0
}) => {
  const [isStepExpanded, setIsStepExpanded] = useState(false);
  const [needsShowMore, setNeedsShowMore] = useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);
  
  const handleStepToggle = useCallback(() => {
    setIsStepExpanded(!isStepExpanded);
  }, [isStepExpanded]);

  // Check if content overflows the max-height after render
  React.useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        const element = contentRef.current;
        
        // Always check the full scrollHeight against the clamped height (4.5em)
        // Calculate 4.5em in pixels based on the element's font size
        const computedStyle = window.getComputedStyle(element);
        const lineHeight = parseFloat(computedStyle.lineHeight);
        const clampedHeight = lineHeight * 3; // 3 lines (4.5em / 1.5 line-height)
        
        // Check if scrollHeight exceeds the clamped height
        const hasOverflow = element.scrollHeight > clampedHeight;
        
        setNeedsShowMore(hasOverflow);
      }
    };
    
    // Use requestAnimationFrame for more reliable layout measurement
    const rafId = requestAnimationFrame(() => {
      checkOverflow();
    });
    
    return () => cancelAnimationFrame(rafId);
  }, [step.stepContent]);

  return (
    <li
      key={index}
      className={cx(styles.listItem, {
        [styles.listItemNoAnimation]: !shouldAnimate || isExiting,
        [styles.listItemNotLast]: isNotLast
      })}
      data-step-index={index}
      style={{
        ...(animationDelay !== undefined ? { animationDelay: `${animationDelay}s` } : {}),
        ...(isHidden ? {
          maxHeight: '0',
          opacity: '0',
          overflow: 'hidden',
          transition: 'max-height 0.4s cubic-bezier(0.4, 0.14, 0.3, 1), opacity 0.4s cubic-bezier(0.4, 0.14, 0.3, 1)',
          marginTop: '0',
          marginBottom: '0'
        } : {
          maxHeight: '500px',
          opacity: '1',
          transition: 'max-height 0.4s cubic-bezier(0.4, 0.14, 0.3, 1), opacity 0.4s cubic-bezier(0.4, 0.14, 0.3, 1)'
        })
      }}
    >
      <span className={styles.nestedIndicator} />
      <div className={styles.stepListContent}>
        <div
          className={styles.stepNameWrapper}
          data-flip-id={`step-${index}`}
        >
          <StepTitle
            label={step.stepLabel}
            taskType={step.taskType}
            customIcon={step.customIcon}
            isProcessing={isProcessing && index === currentProcessingStepIndex}
          />
        </div>
        <div className={styles.stepValueWrapper}>
          <StepContent
            content={step.stepContent}
            isExpanded={isStepExpanded}
            hasOverflow={needsShowMore}
            ref={contentRef}
          />
          {needsShowMore && (
            <button
              className={styles.showMoreButton}
              onClick={handleStepToggle}
              aria-expanded={isStepExpanded}
            >
              {isStepExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      </div>
      <IconIndicators value={step} />
    </li>
  );
};