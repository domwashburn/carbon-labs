import React from 'react';
import cx from 'classnames';
import type { StepTitleProps } from '../types.js';
import { getTaskIcon } from '../utils/getTaskIcon.js';
import { useTextStreaming } from '../useTextStreaming.js';
import styles from './inline-reasoning-trace.scss';

/**
 * StepTitle component
 *
 * Displays a step title with an optional leading icon (positioned to the left) to identify the task type.
 * Supports predefined task types for both development and reasoning workflows, or a custom icon.
 * When isProcessing is true, displays an animated gradient effect on the text with a character-by-character streaming effect.
 *
 * State transitions:
 * 1. static: Normal text display
 * 2. streaming: Characters stream in one by one when processing starts
 * 3. processing: Gradient animation plays after streaming completes
 */
export const StepTitle: React.FC<StepTitleProps> = ({ 
  label, 
  taskType, 
  customIcon, 
  isProcessing = false 
}) => {
  // Use custom hook for smooth RAF-based streaming animation
  const { visibleChars, isStreaming, progress } = useTextStreaming({
    text: label,
    isProcessing,
    charDelay: 30, // 30ms per character for smooth feel
    minDuration: 400,
    maxDuration: 1800
  });
  
  const icon = getTaskIcon(taskType, customIcon);
  
  // Determine which state we're in
  const showStreaming = isStreaming;
  const showGradient = isProcessing && !isStreaming;
  
  // Get visible portion of text for streaming
  const visibleText = label.slice(0, visibleChars);
  
  return (
    <span className={cx(styles.stepNameWrapper, {
      [styles.stepNameWrapperProcessing]: showGradient,
      [styles.stepNameWrapperStreaming]: showStreaming
    })}>
      {icon && <span className={styles.taskIconWrapper}>{icon}</span>}
      <span style={{ position: 'relative', display: 'inline-block' }}>
        {/* Accessible text - always present for screen readers */}
        <span className={styles.accessibleText}>
          {label}
        </span>
        
        {/* Visual text - either static or gradient */}
        {!showStreaming && !showGradient ? (
          // Static state: show normal text
          <span className={styles.stepName} aria-hidden="true">
            {label}
          </span>
        ) : (
          // Streaming or processing state: show gradient text
          <span
            className={cx(styles.stepNameGradient, {
              [styles.stepNameGradientProcessing]: showGradient,
              [styles.stepNameGradientStreaming]: showStreaming
            })}
            aria-hidden="true"
            style={{
              // Dynamically adjust gradient position based on streaming progress
              ...(showStreaming && {
                backgroundPosition: `${200 - (progress * 400)}% 0`
              })
            } as React.CSSProperties}
          >
            {showStreaming ? visibleText : label}
          </span>
        )}
      </span>
    </span>
  );
};