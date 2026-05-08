import React, { useState, useCallback } from 'react';
import cx from 'classnames';
import { usePrefix } from '@carbon-labs/utilities/usePrefix';
import type { StepProps } from '../types';
import { StepTitle } from './StepTitle';
import { StepContent } from './StepContent';
import { IconIndicators } from './IconIndicators';

export const Step: React.FC<StepProps> = ({
  step,
  index,
  shouldAnimate = true,
  isExiting = false,
  isNotLast = false,
  isHidden = false,
  isProcessing = false,
  currentProcessingStepIndex = 0,
}) => {
  const prefix = usePrefix();
  const blockClass = `${prefix}--inline-reasoning-trace`;

  const [isStepExpanded, setIsStepExpanded] = useState(false);
  const [needsShowMore, setNeedsShowMore] = useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const handleStepToggle = useCallback(() => {
    setIsStepExpanded(!isStepExpanded);
  }, [isStepExpanded]);

  React.useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        const element = contentRef.current;
        const computedStyle = window.getComputedStyle(element);
        const lineHeight = parseFloat(computedStyle.lineHeight);
        const clampedHeight = lineHeight * 3;
        setNeedsShowMore(element.scrollHeight > clampedHeight);
      }
    };

    const rafId = requestAnimationFrame(() => {
      checkOverflow();
    });

    return () => cancelAnimationFrame(rafId);
  }, [step.stepContent]);

  return (
    <li
      key={index}
      className={cx(`${blockClass}__list-item`, {
        [`${blockClass}__list-item--no-animation`]: !shouldAnimate || isExiting,
        [`${blockClass}__list-item--not-last`]: isNotLast,
        [`${blockClass}__list-item--hidden`]: isHidden,
      })}
      data-step-index={index}>
      <span className={`${blockClass}__nested-indicator`} />
      <div className={`${blockClass}__step-content`}>
        <div
          className={`${blockClass}__step-name-wrapper`}
          data-flip-id={`step-${index}`}>
          <StepTitle
            label={step.stepLabel}
            taskType={step.taskType}
            customIcon={step.customIcon}
            isProcessing={isProcessing && index === currentProcessingStepIndex}
          />
        </div>
        <div className={`${blockClass}__step-value-wrapper`}>
          <StepContent
            content={step.stepContent}
            isExpanded={isStepExpanded}
            hasOverflow={needsShowMore}
            ref={contentRef}
          />
          {needsShowMore && (
            <button
              type="button"
              className={`${blockClass}__show-more-button`}
              onClick={handleStepToggle}
              aria-expanded={isStepExpanded}>
              {isStepExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      </div>
      <IconIndicators value={step} />
    </li>
  );
};
