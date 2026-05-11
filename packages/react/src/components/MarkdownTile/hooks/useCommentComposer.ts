/**
 * @license
 *
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable jsdoc/require-jsdoc */

import { useEffect, useRef, useState } from 'react';
import type { CommentComposerState } from '../types';
import { usePositionedLayer } from './usePositionedLayer';

interface UseCommentComposerOptions {
  composer: CommentComposerState;
  onSubmit: (body: string) => void;
}

/*
 * Manages the comment composer input, quote preview, focus timing, and
 * positioned layer ref used by the inline and touch composer variants.
 */
export function useCommentComposer({
  composer,
  onSubmit,
}: UseCommentComposerOptions) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const composerRef = usePositionedLayer<HTMLDivElement>(
    composer,
    !composer.isTouch
  );
  const maxQuoteLength = composer.isTouch ? 120 : 60;
  const visibleQuote =
    composer.quote.length > maxQuoteLength
      ? `${composer.quote.slice(0, maxQuoteLength)}...`
      : composer.quote;

  useEffect(() => {
    const timeout = window.setTimeout(
      () => inputRef.current?.focus(),
      composer.isTouch ? 200 : 0
    );

    return () => window.clearTimeout(timeout);
  }, [composer.isTouch]);

  const submit = () => {
    const trimmed = value.trim();
    if (trimmed) {
      onSubmit(trimmed);
    }
  };

  return {
    composerRef,
    inputRef,
    setValue,
    submit,
    value,
    visibleQuote,
  };
}
