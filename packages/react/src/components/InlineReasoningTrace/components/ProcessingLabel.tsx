import React from 'react';
import cx from 'classnames';
import type { ProcessingLabelProps } from '../types.js';
import { StepTitle } from './StepTitle.js';
import styles from './inline-reasoning-trace.scss';

/**
 * ProcessingLabel component
 *
 * Displays the current processing step's label below the collapsed trigger.
 * Supports two animation modes:
 * - 'fade': Simple fade in/out transition
 * - 'flip': FLIP technique for smooth position animation
 */
export const ProcessingLabel: React.FC<ProcessingLabelProps> = ({ step, animationMode }) => {
  const labelRef = React.useRef<HTMLDivElement>(null);
  
  return (
    <div
      ref={labelRef}
      className={cx(styles.processingLabel, {
        [styles.processingLabelFade]: animationMode === 'fade',
        [styles.processingLabelFlip]: animationMode === 'flip'
      })}
      data-flip-id={`processing-step-${step.stepLabel}`}
    >
      <span className={styles.nestedIndicator} style={{ opacity: 0 }} />
      <div className={styles.processingLabelContent}>
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