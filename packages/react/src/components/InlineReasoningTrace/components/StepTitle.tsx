import React from 'react';
import cx from 'classnames';
import { usePrefix } from '@carbon-labs/utilities/usePrefix';
import type { StepTitleProps } from '../types';
import { getTaskIcon } from '../utils/getTaskIcon';
import { useTextStreaming } from '../useTextStreaming';

export const StepTitle: React.FC<StepTitleProps> = ({
  label,
  taskType,
  customIcon,
  isProcessing = false,
}) => {
  const prefix = usePrefix();
  const blockClass = `${prefix}--inline-reasoning-trace`;

  const { visibleChars, isStreaming, progress } = useTextStreaming({
    text: label,
    isProcessing,
    charDelay: 30,
    minDuration: 400,
    maxDuration: 1800,
  });

  const icon = getTaskIcon(taskType, customIcon, `${blockClass}__task-icon`);

  const showStreaming = isStreaming;
  const showGradient = isProcessing && !isStreaming;

  const visibleText = label.slice(0, visibleChars);

  return (
    <span
      className={cx(`${blockClass}__step-name-wrapper`, {
        [`${blockClass}__step-name-wrapper--processing`]: showGradient,
        [`${blockClass}__step-name-wrapper--streaming`]: showStreaming,
      })}>
      {icon && <span className={`${blockClass}__task-icon-wrapper`}>{icon}</span>}
      <span style={{ position: 'relative', display: 'inline-block' }}>
        <span className={`${blockClass}__accessible-text`}>{label}</span>

        {!showStreaming && !showGradient ? (
          <span className={`${blockClass}__step-name`} aria-hidden="true">
            {label}
          </span>
        ) : (
          <span
            className={cx(`${blockClass}__step-name-gradient`, {
              [`${blockClass}__step-name-gradient--processing`]: showGradient,
              [`${blockClass}__step-name-gradient--streaming`]: showStreaming,
            })}
            aria-hidden="true"
            style={{
              ...(showStreaming && {
                backgroundPosition: `${200 - progress * 400}% 0`,
              }),
            } as React.CSSProperties}>
            {showStreaming ? visibleText : label}
          </span>
        )}
      </span>
    </span>
  );
};
