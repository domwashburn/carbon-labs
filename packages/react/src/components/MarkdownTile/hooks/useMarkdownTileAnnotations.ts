/**
 * @license
 *
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable jsdoc/require-jsdoc */

import {
  useState,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from 'react';
import type {
  CommentComposerState,
  MarkdownTileActionState,
  MarkdownTileAnnotation,
  SelectionMenuPosition,
} from '../types';

interface UseMarkdownTileAnnotationsOptions {
  composer: CommentComposerState | null;
  contentRef: RefObject<HTMLDivElement>;
  defaultAnnotations: MarkdownTileAnnotation[];
  isApproved: boolean;
  isTouch: boolean;
  resolvedAnnotations: MarkdownTileAnnotation[];
  selectionMenu: SelectionMenuPosition | null;
  setActionState: (state: MarkdownTileActionState) => void;
  setAnnotations: (annotations: MarkdownTileAnnotation[]) => void;
  setComposer: Dispatch<SetStateAction<CommentComposerState | null>>;
  setSelectionMenu: (selectionMenu: SelectionMenuPosition | null) => void;
}

function createAnnotation(
  composer: CommentComposerState,
  body: string
): MarkdownTileAnnotation {
  return {
    id:
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `annotation-${Date.now()}`,
    quote: composer.quote,
    blockIdx: composer.blockIdx,
    body,
    timestamp: new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }),
  };
}

/*
 * Owns the annotation review workflow: opening the composer from a selection,
 * submitting and deleting comments, tracking active comments, and thread state.
 */
export function useMarkdownTileAnnotations({
  composer,
  contentRef,
  defaultAnnotations,
  isApproved,
  isTouch,
  resolvedAnnotations,
  selectionMenu,
  setActionState,
  setAnnotations,
  setComposer,
  setSelectionMenu,
}: UseMarkdownTileAnnotationsOptions) {
  const [activeAnnotationId, setActiveAnnotationId] = useState<string | null>(
    null
  );
  const [threadOpen, setThreadOpen] = useState(defaultAnnotations.length > 0);

  const handleAnnotate = () => {
    if (!selectionMenu) {
      return;
    }

    // Opening the composer consumes the selection menu and clears the browser
    // highlight so the comment box becomes the active interaction.
    setComposer({
      isTouch,
      quote: selectionMenu.quote,
      blockIdx: selectionMenu.blockIdx,
      top: selectionMenu.top + 44,
      left: selectionMenu.left,
    });
    setSelectionMenu(null);
    window.getSelection()?.removeAllRanges();
  };

  const handleSubmitComment = (body: string) => {
    if (!composer) {
      return;
    }

    const newAnnotation = createAnnotation(composer, body);

    // A new comment means the plan needs another review pass; reopen the thread
    // and move an approved tile back to idle.
    setAnnotations([...resolvedAnnotations, newAnnotation]);
    setComposer(null);
    if (isApproved) {
      setActionState('idle');
    }
    setThreadOpen(true);
  };

  const handleDeleteComment = (id: string) => {
    setAnnotations(
      resolvedAnnotations.filter((annotation) => annotation.id !== id)
    );
    if (activeAnnotationId === id) {
      setActiveAnnotationId(null);
    }
  };

  const handleSelectAnnotation = (id: string) => {
    setActiveAnnotationId(id);
    const element = contentRef.current?.querySelector(
      `[data-annotation-id="${id}"]`
    );
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return {
    activeAnnotationId,
    handleAnnotate,
    handleDeleteComment,
    handleSelectAnnotation,
    handleSubmitComment,
    setComposer,
    setThreadOpen,
    threadOpen,
  };
}
