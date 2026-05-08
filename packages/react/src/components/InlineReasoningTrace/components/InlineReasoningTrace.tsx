import React, { useState, useCallback } from 'react';
import cx from 'classnames';
import { ChevronDown, ChevronRight } from '@carbon/icons-react';
import { usePrefix } from '@carbon-labs/utilities/usePrefix';
import { useFLIPAnimation } from '../useFLIPAnimation';
import type { InlineReasoningTraceProps } from '../types';
import { StepList } from './StepList';
import { ProcessingLabel } from './ProcessingLabel';

export type { TaskType, StepType, InlineReasoningTraceProps } from '../types';

const InlineReasoningTrace = ({
  steps,
  triggerText,
  openByDefault = false,
  initialVisibleSteps = 5,
  showAllStepsByDefault = false,
  allowStepCollapse = true,
  isProcessing = false,
  currentProcessingStepIndex = 0,
  animationMode = 'flip'
}: InlineReasoningTraceProps) => {
  const prefix = usePrefix();
  const blockClass = `${prefix}--inline-reasoning-trace`;

  const [isExpanded, setIsExpanded] = useState(openByDefault);
  const [shouldRender, setShouldRender] = useState(openByDefault);
  const [isExiting, setIsExiting] = useState(false);
  const [hasBeenToggled, setHasBeenToggled] = useState(false);

  const handleToggle = useCallback(() => {
    setHasBeenToggled(true);
    if (isExpanded) {
      setIsExiting(true);
      setTimeout(() => {
        setIsExpanded(false);
        setShouldRender(false);
        setIsExiting(false);
      }, 240);
    } else {
      setIsExpanded(true);
      setShouldRender(true);
    }
  }, [isExpanded]);

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
        className={cx(`${blockClass}__trigger`, {
          [`${blockClass}__trigger--expanded`]: isExpanded,
        })}
        aria-expanded={isExpanded}
        onClick={handleToggle}
        style={{ anchorName: '--trigger-anchor' } as React.CSSProperties}>
        {isExpanded && <span className={`${blockClass}__nested-indicator`} />}
        <span>{triggerText}</span>
      </button>
      <span className={`${blockClass}__chevron-icon`}>
        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </span>

      {isProcessing && !isExpanded && currentProcessingStep && (
        <ProcessingLabel step={currentProcessingStep} animationMode={animationMode} />
      )}

      {shouldRender && (
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
