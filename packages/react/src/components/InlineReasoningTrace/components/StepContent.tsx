import React from 'react';
import cx from 'classnames';
import type { StepContentProps } from '../types.js';
import styles from './inline-reasoning-trace.scss';

/**
 * StepContent component
 * 
 * Displays the content of a reasoning step with expand/collapse functionality.
 * Shows a fade effect when content is clamped and overflows.
 */
export const StepContent = React.forwardRef<HTMLDivElement, StepContentProps>(
  ({ content, isExpanded, hasOverflow }, ref) => {
    const [contentHeight, setContentHeight] = React.useState<number | undefined>(undefined);
    const innerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (innerRef.current) {
        // Measure the full content height
        const fullHeight = innerRef.current.scrollHeight;
        setContentHeight(fullHeight);
      }
    }, [content]);

    // Combine refs
    React.useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

    return (
      <div
        ref={innerRef}
        className={cx(styles.stepValue, {
          [styles.stepValueClamped]: !isExpanded,
          [styles.stepValueWithFade]: !isExpanded && hasOverflow
        })}
        style={{
          maxHeight: isExpanded && contentHeight ? `${contentHeight}px` : undefined
        }}
      >
        {content}
      </div>
    );
  }
);

StepContent.displayName = 'StepContent';