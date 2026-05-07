import React, { useState, useCallback } from 'react';
import cx from 'classnames';
import { ChevronDown, ChevronRight } from '@carbon/icons-react';
import styles from './inline-reasoning-trace.scss';
import { useFLIPAnimation } from '../useFLIPAnimation.js';
import type { InlineReasoningTraceProps } from '../types.js';
import { StepList } from './StepList.js';
import { ProcessingLabel } from './ProcessingLabel.js';

/**
 * InlineReasoningTrace component
 *
 * Displays a list of reasoning steps in a clean and readable format.
 * Each step can be expanded to show detailed reasoning content.
 */

// Re-export types for backward compatibility
export type { TaskType, StepType, InlineReasoningTraceProps } from './types';

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

  const [isExpanded, setIsExpanded] = useState(openByDefault);
  const [shouldRender, setShouldRender] = useState(openByDefault);
  const [isExiting, setIsExiting] = useState(false);
  const [hasBeenToggled, setHasBeenToggled] = useState(false);

  const handleToggle = useCallback(() => {
    setHasBeenToggled(true);
    if (isExpanded) {
      // Start exit animation
      setIsExiting(true);
      // Wait for animation to complete before unmounting (240ms for moderate-02)
      setTimeout(() => {
        setIsExpanded(false);
        setShouldRender(false);
        setIsExiting(false);
      }, 240);
    } else {
      // Expanding - render immediately and animate in
      setIsExpanded(true);
      setShouldRender(true);
    }
  }, [isExpanded]);

  // Get the current processing step
  const currentProcessingStep = isProcessing && currentProcessingStepIndex < steps.length
    ? steps[currentProcessingStepIndex]
    : null;

  // Use FLIP animation hook when in flip mode
  useFLIPAnimation({
    isExpanded,
    isProcessing,
    currentStepIndex: currentProcessingStepIndex,
    duration: 400,
    enabled: animationMode === 'flip'
  });

  return (
    <div className={styles.reasoningTraceList}>
      <button
        className={cx(styles.trigger, {
          [styles.triggerExpanded]: isExpanded
        })}
        aria-expanded={isExpanded}
        onClick={handleToggle}
        style={{ anchorName: '--trigger-anchor' } as React.CSSProperties}
      >
        {isExpanded && <span className={styles.nestedIndicator} />}
        <span>{triggerText}</span>
      </button>
      <span className={styles.chevronIcon}>
        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </span>
      
      {/* Processing label shown when collapsed and processing */}
      {isProcessing && !isExpanded && currentProcessingStep && (
        <ProcessingLabel
          step={currentProcessingStep}
          animationMode={animationMode}
        />
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

// Import extracted components
import { IconIndicators } from './IconIndicators.js';
import { StepTitle } from './StepTitle.js';
import { StepContent } from './StepContent.js';
import { Step } from './Step.js';
import { StepList as StepListComponent } from './StepList.js';
import { ProcessingLabel as ProcessingLabelComponent } from './ProcessingLabel.js';

// Attach components to main component for backward compatibility
InlineReasoningTrace.StepList = StepListComponent;
InlineReasoningTrace.Step = Step;
InlineReasoningTrace.StepContent = StepContent;
InlineReasoningTrace.StepTitle = StepTitle;
InlineReasoningTrace.ProcessingLabel = ProcessingLabelComponent;
InlineReasoningTrace.IconIndicators = IconIndicators;

// Export individual components for direct imports
export {
  StepListComponent as InlineReasoningTraceStepList,
  Step as InlineReasoningTraceStep,
  StepContent as ReasoningStepContent,
  StepTitle as ReasoningTraceStepTitle,
  ProcessingLabelComponent as ProcessingLabel,
  IconIndicators
};
export default InlineReasoningTrace;