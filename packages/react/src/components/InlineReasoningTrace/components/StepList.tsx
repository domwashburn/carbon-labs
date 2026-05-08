import React, { useState, useCallback } from 'react';
import cx from 'classnames';
import { usePrefix } from '@carbon-labs/utilities/usePrefix';
import type { StepListProps } from '../types';
import { Step } from './Step';

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
}) => {
  const prefix = usePrefix();
  const blockClass = `${prefix}--inline-reasoning-trace`;

  const effectiveShowAllStepsByDefault = isProcessing || showAllStepsByDefault;

  const [showAllSteps, setShowAllSteps] = useState(effectiveShowAllStepsByDefault);
  const [isStepsExiting, setIsStepsExiting] = useState(false);
  const [shouldRenderHiddenSteps, setShouldRenderHiddenSteps] = useState(
    effectiveShowAllStepsByDefault
  );
  const [hasUserToggled, setHasUserToggled] = useState(false);
  const timeoutRef = React.useRef<number | null>(null);
  const prevProcessingRef = React.useRef(isProcessing);

  React.useEffect(() => {
    if (isProcessing && !prevProcessingRef.current && !hasUserToggled) {
      setShowAllSteps(true);
      setShouldRenderHiddenSteps(true);
    }
    prevProcessingRef.current = isProcessing;
  }, [isProcessing, hasUserToggled]);

  const shouldShowToggle = effectiveShowAllStepsByDefault
    ? allowStepCollapse && steps.length > initialVisibleSteps
    : steps.length > initialVisibleSteps;

  const visibleSteps = steps.slice(0, initialVisibleSteps);
  const hiddenSteps = steps.slice(initialVisibleSteps);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleToggleSteps = useCallback(() => {
    setHasUserToggled(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (showAllSteps) {
      const animationDuration = effectiveShowAllStepsByDefault ? 400 : 240;

      setIsStepsExiting(true);
      if (effectiveShowAllStepsByDefault) {
        setShowAllSteps(false);
      }

      timeoutRef.current = window.setTimeout(() => {
        if (!effectiveShowAllStepsByDefault) {
          setShowAllSteps(false);
          setShouldRenderHiddenSteps(false);
        }
        setIsStepsExiting(false);
        timeoutRef.current = null;
      }, animationDuration);
    } else {
      setShowAllSteps(true);
      setShouldRenderHiddenSteps(true);
    }
  }, [showAllSteps, effectiveShowAllStepsByDefault]);

  if (effectiveShowAllStepsByDefault) {
    return (
      <div>
        <ul
          className={cx(`${blockClass}__list`, {
            [`${blockClass}__list--exiting`]: isExiting,
            [`${blockClass}__list--no-animation`]:
              isInitialRender || (!shouldAnimate && !isExiting),
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
            <li
              className={cx(`${blockClass}__list-item`, `${blockClass}__show-more-list-item`, {
                [`${blockClass}__list-item--no-animation`]: !shouldAnimate || isExiting,
              })}>
              <span className={`${blockClass}__nested-indicator`} />
              <button
                className={`${blockClass}__show-more-steps-button`}
                onClick={handleToggleSteps}
                aria-expanded={showAllSteps}>
                {showAllSteps
                  ? 'Show less'
                  : `Show ${hiddenSteps.length} more step${hiddenSteps.length > 1 ? 's' : ''}`}
              </button>
            </li>
          )}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <ul
        className={cx(`${blockClass}__list`, {
          [`${blockClass}__list--exiting`]: isExiting,
          [`${blockClass}__list--no-animation`]:
            isInitialRender || (!shouldAnimate && !isExiting),
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
          <li
            className={cx(`${blockClass}__list-item`, `${blockClass}__show-more-list-item`, {
              [`${blockClass}__list-item--no-animation`]: !shouldAnimate || isExiting,
            })}>
            <span className={`${blockClass}__nested-indicator`} />
            <button
              className={`${blockClass}__show-more-steps-button`}
              onClick={handleToggleSteps}
              aria-expanded={showAllSteps}>
              {`Show ${hiddenSteps.length} more step${hiddenSteps.length > 1 ? 's' : ''}`}
            </button>
          </li>
        )}
      </ul>
      {shouldShowToggle && shouldRenderHiddenSteps && (
        <ul
          className={cx(`${blockClass}__list`, `${blockClass}__list--hidden`, {
            [`${blockClass}__list--exiting`]: isStepsExiting || isExiting,
            [`${blockClass}__list--no-animation`]:
              !shouldAnimate && !isExiting && !isStepsExiting,
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
          <li
            className={cx(`${blockClass}__list-item`, `${blockClass}__show-more-list-item`, {
              [`${blockClass}__list-item--no-animation`]:
                isStepsExiting || isExiting || !shouldAnimate,
            })}>
            <span className={`${blockClass}__nested-indicator`} />
            <button
              className={`${blockClass}__show-more-steps-button`}
              onClick={handleToggleSteps}
              aria-expanded={showAllSteps}>
              Show less
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};
