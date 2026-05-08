import React, { useState, useCallback, useEffect, useRef } from 'react';
import cx from 'classnames';
import { ChevronDown, ChevronRight } from '@carbon/icons-react';
import { usePrefix } from '@carbon-labs/utilities/usePrefix';
import { useFLIPAnimation } from '../useFLIPAnimation';
import type { InlineReasoningTraceProps } from '../types';
import { StepList } from './StepList';
import { ProcessingLabel } from './ProcessingLabel';

export type { TaskType, StepType, InlineReasoningTraceProps } from '../types';

const exitAnimationDuration = 240;
const exitAnimationFallbackDelay = exitAnimationDuration + 80;

const InlineReasoningTrace = ({
  steps,
  triggerText,
  openByDefault = false,
  initialVisibleSteps = 5,
  showAllStepsByDefault = false,
  allowStepCollapse = true,
  isProcessing = false,
  currentProcessingStepIndex = 0,
  animationMode = 'flip',
}: InlineReasoningTraceProps) => {
  const prefix = usePrefix();
  const blockClass = `${prefix}--inline-reasoning-trace`;

  const [isExpanded, setIsExpanded] = useState(openByDefault);
  const [shouldRender, setShouldRender] = useState(openByDefault);
  const [isExiting, setIsExiting] = useState(false);
  const [hasBeenToggled, setHasBeenToggled] = useState(false);
  const exitTimeoutRef = useRef<number | null>(null);

  const clearExitTimeout = useCallback(() => {
    if (exitTimeoutRef.current !== null) {
      window.clearTimeout(exitTimeoutRef.current);
      exitTimeoutRef.current = null;
    }
  }, []);

  const completeExit = useCallback(() => {
    clearExitTimeout();
    setIsExpanded(false);
    setShouldRender(false);
    setIsExiting(false);
  }, [clearExitTimeout]);

  const handleToggle = useCallback(() => {
    setHasBeenToggled(true);
    if (isExpanded) {
      clearExitTimeout();
      setIsExiting(true);
      exitTimeoutRef.current = window.setTimeout(
        completeExit,
        exitAnimationFallbackDelay
      );
    } else {
      clearExitTimeout();
      setIsExiting(false);
      setIsExpanded(true);
      setShouldRender(true);
    }
  }, [clearExitTimeout, completeExit, isExpanded]);

  useEffect(() => {
    return clearExitTimeout;
  }, [clearExitTimeout]);

  const handleContentTransitionEnd = useCallback(
    (event: React.TransitionEvent<HTMLDivElement>) => {
      if (
        isExiting &&
        event.target === event.currentTarget &&
        event.propertyName === 'grid-template-rows'
      ) {
        completeExit();
      }
    },
    [completeExit, isExiting]
  );

  const currentProcessingStep =
    isProcessing && currentProcessingStepIndex < steps.length
      ? steps[currentProcessingStepIndex]
      : null;

  useFLIPAnimation({
    isExpanded,
    isProcessing,
    currentStepIndex: currentProcessingStepIndex,
    duration: 400,
    enabled: animationMode === 'flip',
    blockClass,
  });

  return (
    <div className={blockClass}>
      <button
        type="button"
        className={cx(`${blockClass}__trigger`, {
          [`${blockClass}__trigger--expanded`]: isExpanded,
        })}
        aria-expanded={isExpanded}
        onClick={handleToggle}>
        {isExpanded && <span className={`${blockClass}__nested-indicator`} />}
        <span>{triggerText}</span>
      </button>
      <span className={`${blockClass}__chevron-icon`}>
        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </span>

      {isProcessing && !isExpanded && currentProcessingStep && (
        <ProcessingLabel
          step={currentProcessingStep}
          animationMode={animationMode}
        />
      )}

      {shouldRender && (
        <div
          className={cx(`${blockClass}__content`, {
            [`${blockClass}__content--exiting`]: isExiting,
            [`${blockClass}__content--no-animation`]:
              !hasBeenToggled && openByDefault,
          })}
          onTransitionEnd={handleContentTransitionEnd}>
          <StepList
            steps={steps}
            isExpanded={isExpanded}
            isExiting={isExiting}
            shouldAnimate={hasBeenToggled}
            isInitialRender={!hasBeenToggled && openByDefault}
            initialVisibleSteps={initialVisibleSteps}
            showAllStepsByDefault={showAllStepsByDefault}
            allowStepCollapse={allowStepCollapse}
            isProcessing={isProcessing}
            currentProcessingStepIndex={currentProcessingStepIndex}
            animationMode={animationMode}
          />
        </div>
      )}
    </div>
  );
};

import { IconIndicators } from './IconIndicators';
import { StepTitle } from './StepTitle';
import { StepContent } from './StepContent';
import { Step } from './Step';
import { StepList as StepListComponent } from './StepList';
import { ProcessingLabel as ProcessingLabelComponent } from './ProcessingLabel';

InlineReasoningTrace.StepList = StepListComponent;
InlineReasoningTrace.Step = Step;
InlineReasoningTrace.StepContent = StepContent;
InlineReasoningTrace.StepTitle = StepTitle;
InlineReasoningTrace.ProcessingLabel = ProcessingLabelComponent;
InlineReasoningTrace.IconIndicators = IconIndicators;

export {
  StepListComponent as InlineReasoningTraceStepList,
  Step as InlineReasoningTraceStep,
  StepContent as ReasoningStepContent,
  StepTitle as ReasoningTraceStepTitle,
  ProcessingLabelComponent as ProcessingLabel,
  IconIndicators,
};
export default InlineReasoningTrace;
