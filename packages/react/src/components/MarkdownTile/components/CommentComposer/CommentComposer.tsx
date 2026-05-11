/**
 * @license
 *
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { Button, IconButton } from '@carbon/react';
import { Close, Quotes } from '@carbon/icons-react';
import { useCommentComposer } from '../../hooks/useCommentComposer';
import type { CommentComposerState } from '../../types';

interface CommentComposerProps {
  blockClass: string;
  composer: CommentComposerState;
  onCancel: () => void;
  onSubmit: (body: string) => void;
}

export const CommentComposer = ({
  blockClass,
  composer,
  onCancel,
  onSubmit,
}: CommentComposerProps) => {
  const { composerRef, inputRef, setValue, submit, value, visibleQuote } =
    useCommentComposer({ composer, onSubmit });

  return (
    <>
      {composer.isTouch ? (
        <div
          aria-hidden="true"
          className={`${blockClass}__composer-backdrop`}
          onPointerDown={onCancel}
        />
      ) : null}
      <div
        aria-label="Add comment"
        className={[
          `${blockClass}__composer`,
          composer.isTouch ? `${blockClass}__composer--sheet` : '',
        ]
          .filter(Boolean)
          .join(' ')}
        ref={composerRef}
        role="dialog">
        {composer.isTouch ? (
          <>
            <div
              className={`${blockClass}__composer-handle`}
              aria-hidden="true">
              <span />
            </div>
            <div className={`${blockClass}__composer-sheet-header`}>
              <span className={`${blockClass}__composer-sheet-title`}>
                Add comment
              </span>
              <IconButton
                align="left"
                kind="ghost"
                label="Cancel"
                onClick={onCancel}
                size="sm">
                <Close />
              </IconButton>
            </div>
          </>
        ) : null}
        <div className={`${blockClass}__composer-quote`}>
          <Quotes size={12} />
          <span>&quot;{visibleQuote}&quot;</span>
        </div>
        <label className={`${blockClass}__composer-label`}>
          Comment
          <textarea
            className={`${blockClass}__composer-input`}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                submit();
              }
              if (event.key === 'Escape') {
                onCancel();
              }
            }}
            placeholder="What would you like to change?"
            ref={inputRef}
            rows={composer.isTouch ? 4 : 3}
            value={value}
          />
        </label>
        <div className={`${blockClass}__composer-actions`}>
          <Button kind="ghost" onClick={onCancel} size="sm" type="button">
            Cancel
          </Button>
          <Button
            disabled={!value.trim()}
            onClick={submit}
            size="sm"
            type="button">
            Comment
          </Button>
        </div>
      </div>
    </>
  );
};
