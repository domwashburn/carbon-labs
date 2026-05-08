import React from 'react';
import cx from 'classnames';
import { usePrefix } from '@carbon-labs/utilities/usePrefix';
import type { StepContentProps } from '../types';

export const StepContent = React.forwardRef<HTMLDivElement, StepContentProps>(
  ({ content, isExpanded, hasOverflow }, ref) => {
    const prefix = usePrefix();
    const blockClass = `${prefix}--inline-reasoning-trace`;

    const [contentHeight, setContentHeight] = React.useState<number | undefined>(undefined);
    const innerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (innerRef.current) {
        setContentHeight(innerRef.current.scrollHeight);
      }
    }, [content]);

    React.useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

    return (
      <div
        ref={innerRef}
        className={cx(`${blockClass}__step-value`, {
          [`${blockClass}__step-value--clamped`]: !isExpanded,
          [`${blockClass}__step-value--with-fade`]: !isExpanded && hasOverflow,
        })}
        style={{
          maxHeight: isExpanded && contentHeight ? `${contentHeight}px` : undefined,
        }}>
        {content}
      </div>
    );
  }
);

StepContent.displayName = 'StepContent';
