import React from 'react';
import cx from 'classnames';
import { CodeSnippet } from '@carbon/react';
import { usePrefix } from '@carbon-labs/utilities/usePrefix';
import type { StepContentItem, StepContentProps } from '../types';

const stepContentItemTypes = new Set(['text', 'code', 'custom']);
const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

const isStepContentItem = (item: unknown): item is StepContentItem => {
  return (
    typeof item === 'object' &&
    item !== null &&
    'type' in item &&
    typeof item.type === 'string' &&
    stepContentItemTypes.has(item.type)
  );
};

const isStepContentItemArray = (
  content: StepContentProps['content']
): content is StepContentItem[] => {
  return Array.isArray(content) && content.every(isStepContentItem);
};

const StepContentComponent: React.ForwardRefRenderFunction<
  HTMLDivElement,
  StepContentProps
> = ({ content, isExpanded, hasOverflow }, ref) => {
  const prefix = usePrefix();
  const blockClass = `${prefix}--inline-reasoning-trace`;

  const [contentHeight, setContentHeight] = React.useState<number | undefined>(
    undefined
  );
  const containerRef = React.useRef<HTMLDivElement>(null);
  const measureRef = React.useRef<HTMLDivElement>(null);
  const isStructuredContent = isStepContentItemArray(content);

  const updateContentHeight = React.useCallback(() => {
    if (!measureRef.current) {
      return;
    }

    const nextContentHeight = measureRef.current.scrollHeight;
    setContentHeight((currentContentHeight) =>
      currentContentHeight === nextContentHeight
        ? currentContentHeight
        : nextContentHeight
    );
  }, []);

  useIsomorphicLayoutEffect(() => {
    updateContentHeight();
  }, [content, updateContentHeight]);

  React.useEffect(() => {
    if (!measureRef.current || typeof ResizeObserver === 'undefined') {
      return;
    }

    const resizeObserver = new ResizeObserver(updateContentHeight);
    resizeObserver.observe(measureRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateContentHeight]);

  useIsomorphicLayoutEffect(() => {
    const element = containerRef.current;
    const measureElement = measureRef.current;

    if (!element || !measureElement) {
      return;
    }

    if (isExpanded) {
      const nextContentHeight = measureElement.scrollHeight;
      element.style.maxHeight = `${nextContentHeight}px`;

      if (contentHeight !== nextContentHeight) {
        setContentHeight(nextContentHeight);
      }
    } else {
      element.style.removeProperty('max-height');
    }
  }, [contentHeight, isExpanded]);

  React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

  return (
    <div
      ref={containerRef}
      className={cx(`${blockClass}__step-value`, {
        [`${blockClass}__step-value--clamped`]: !isExpanded,
        [`${blockClass}__step-value--with-fade`]: !isExpanded && hasOverflow,
      })}>
      <div ref={measureRef}>
        {isStructuredContent ? (
          <div className={`${blockClass}__step-content-items`}>
            {content.map((item, index) => {
              if (item.type === 'text') {
                return (
                  <p
                    className={`${blockClass}__step-content-item-text`}
                    key={index}>
                    {item.content}
                  </p>
                );
              }

              if (item.type === 'code') {
                return (
                  <div
                    className={`${blockClass}__step-content-item-code`}
                    key={index}>
                    {item.label && (
                      <div className={`${blockClass}__step-content-item-label`}>
                        {item.label}
                      </div>
                    )}
                    <CodeSnippet
                      type="multi"
                      feedback="Copied!"
                      className={cx({
                        [`language-${item.language}`]: item.language,
                      })}>
                      {item.code}
                    </CodeSnippet>
                  </div>
                );
              }

              return (
                <div
                  className={`${blockClass}__step-content-item-custom`}
                  key={index}>
                  {item.content}
                </div>
              );
            })}
          </div>
        ) : (
          content
        )}
      </div>
    </div>
  );
};

export const StepContent = React.forwardRef(StepContentComponent);

StepContent.displayName = 'StepContent';
