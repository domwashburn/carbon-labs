import React from 'react';
import cx from 'classnames';
import { usePrefix } from '@carbon-labs/utilities/usePrefix';
import type { ProcessingLabelProps } from '../types';
import { StepTitle } from './StepTitle';

export const ProcessingLabel: React.FC<ProcessingLabelProps> = ({ step, animationMode }) => {
  const prefix = usePrefix();
  const blockClass = `${prefix}--inline-reasoning-trace`;

  const labelRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={labelRef}
      className={cx(`${blockClass}__processing-label`, {
        [`${blockClass}__processing-label--fade`]: animationMode === 'fade',
        [`${blockClass}__processing-label--flip`]: animationMode === 'flip',
      })}
      data-flip-id={`processing-step-${step.stepLabel}`}>
      <span className={`${blockClass}__nested-indicator`} style={{ opacity: 0 }} />
      <div className={`${blockClass}__processing-label-content`}>
        <StepTitle
          label={step.stepLabel}
          taskType={step.taskType}
          customIcon={step.customIcon}
          isProcessing={true}
        />
      </div>
    </div>
  );
};
