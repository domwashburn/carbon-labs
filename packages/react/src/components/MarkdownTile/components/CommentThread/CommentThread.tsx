/**
 * @license
 *
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { IconButton } from '@carbon/react';
import { Chat, ChevronDown, ChevronUp, TrashCan } from '@carbon/icons-react';
import type { MarkdownTileAnnotation } from '../../types';

interface CommentThreadProps {
  activeAnnotationId?: string | null;
  annotations: MarkdownTileAnnotation[];
  blockClass: string;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  onToggle: () => void;
  open: boolean;
}

export const CommentThread = ({
  activeAnnotationId,
  annotations,
  blockClass,
  onDelete,
  onSelect,
  onToggle,
  open,
}: CommentThreadProps) => {
  if (!annotations.length) {
    return null;
  }

  return (
    <div
      className={[
        `${blockClass}__thread`,
        open ? `${blockClass}__thread--open` : '',
      ]
        .filter(Boolean)
        .join(' ')}>
      <button
        aria-expanded={open}
        className={`${blockClass}__thread-toggle`}
        onClick={onToggle}
        type="button">
        <Chat size={14} />
        <span className={`${blockClass}__thread-count`}>
          {annotations.length}{' '}
          {annotations.length === 1 ? 'comment' : 'comments'}
        </span>
        <span className={`${blockClass}__thread-chevron`}>
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>
      {open ? (
        <ul className={`${blockClass}__thread-list`}>
          {annotations.map((annotation) => (
            <li
              className={[
                `${blockClass}__thread-item`,
                activeAnnotationId === annotation.id
                  ? `${blockClass}__thread-item--active`
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
              key={annotation.id}>
              <button
                className={`${blockClass}__thread-item-main`}
                onClick={() => onSelect(annotation.id)}
                type="button">
                <div className={`${blockClass}__thread-quote`}>
                  <span className={`${blockClass}__thread-quote-bar`} />
                  <span className={`${blockClass}__thread-quote-text`}>
                    &quot;
                    {annotation.quote.length > 80
                      ? `${annotation.quote.slice(0, 80)}...`
                      : annotation.quote}
                    &quot;
                  </span>
                </div>
                <p className={`${blockClass}__thread-body`}>
                  {annotation.body}
                </p>
                {annotation.timestamp ? (
                  <span className={`${blockClass}__thread-meta`}>
                    {annotation.timestamp}
                  </span>
                ) : null}
              </button>
              <IconButton
                align="left"
                className={`${blockClass}__thread-delete`}
                kind="ghost"
                label="Delete comment"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(annotation.id);
                }}
                size="sm">
                <TrashCan />
              </IconButton>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
