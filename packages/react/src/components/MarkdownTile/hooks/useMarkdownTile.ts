/**
 * @license
 *
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable jsdoc/require-jsdoc */

import { useState } from 'react';
import { usePrefix } from '@carbon-labs/utilities/usePrefix';
import type { CommentComposerState, MarkdownTileProps } from '../types';
import { useMarkdownTileActions } from './useMarkdownTileActions';
import { useMarkdownTileAnnotations } from './useMarkdownTileAnnotations';
import { useMarkdownTileControlledState } from './useMarkdownTileControlledState';
import { useMarkdownTileSelection } from './useMarkdownTileSelection';

type UseMarkdownTileOptions = Pick<
  MarkdownTileProps,
  | 'actionState'
  | 'annotations'
  | 'annotatable'
  | 'content'
  | 'defaultActionState'
  | 'defaultAnnotations'
  | 'downloadFileName'
  | 'initiallyExpanded'
  | 'onActionStateChange'
  | 'onAnnotationsChange'
  | 'onCopy'
  | 'onDownload'
  | 'onFeedback'
  | 'onPrimaryAction'
>;

/*
 * Coordinates MarkdownTile presentation state, annotation workflow state, and
 * tile-level actions while delegating focused behavior to smaller internal
 * hooks.
 */
export function useMarkdownTile({
  actionState,
  annotations,
  annotatable = false,
  content,
  defaultActionState = 'idle',
  defaultAnnotations = [],
  downloadFileName = 'markdown-tile.md',
  initiallyExpanded = false,
  onActionStateChange,
  onAnnotationsChange,
  onCopy,
  onDownload,
  onFeedback,
  onPrimaryAction,
}: UseMarkdownTileOptions) {
  const prefix = usePrefix();
  const blockClass = `${prefix}--markdown-tile`;
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const {
    hasComments,
    isApproved,
    resolvedActionState,
    resolvedAnnotations,
    setActionState,
    setAnnotations,
  } = useMarkdownTileControlledState({
    actionState,
    annotations,
    defaultActionState,
    defaultAnnotations,
    onActionStateChange,
    onAnnotationsChange,
  });
  const [composer, setComposer] = useState<CommentComposerState | null>(null);
  const { contentRef, isTouch, selectionMenu, setSelectionMenu, tileRef } =
    useMarkdownTileSelection({
      annotatable,
      expanded,
      setComposer,
    });
  const annotationsState = useMarkdownTileAnnotations({
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
  });
  const {
    activeAnnotationId,
    handleAnnotate,
    handleDeleteComment,
    handleSelectAnnotation,
    handleSubmitComment,
    setThreadOpen,
    threadOpen,
  } = annotationsState;
  const {
    copied,
    handleCopy,
    handleDownload,
    handleFeedback,
    handlePrimaryAction,
  } = useMarkdownTileActions({
    content,
    downloadFileName,
    isApproved,
    onCopy,
    onDownload,
    onFeedback,
    onPrimaryAction,
    resolvedAnnotations,
    setActionState,
  });

  return {
    activeAnnotationId,
    blockClass,
    composer,
    contentRef,
    copied,
    expanded,
    handleAnnotate,
    handleCopy,
    handleDeleteComment,
    handleDownload,
    handleFeedback,
    handlePrimaryAction,
    handleSelectAnnotation,
    handleSubmitComment,
    hasComments,
    isApproved,
    isTouch,
    resolvedAnnotations,
    resolvedActionState,
    selectionMenu,
    setComposer,
    setExpanded,
    setThreadOpen,
    threadOpen,
    tileRef,
  };
}
