/**
 * @license
 *
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable jsdoc/require-jsdoc */

import { useEffect, useState } from 'react';
import type {
  MarkdownTileActionState,
  MarkdownTileAnnotation,
  MarkdownTileFeedbackKind,
} from '../types';

interface UseMarkdownTileActionsOptions {
  content: string;
  downloadFileName: string;
  isApproved: boolean;
  onCopy?: (content: string) => void;
  onDownload?: (content: string) => void;
  onFeedback?: (kind: MarkdownTileFeedbackKind) => void;
  onPrimaryAction?: (annotations: MarkdownTileAnnotation[]) => void;
  resolvedAnnotations: MarkdownTileAnnotation[];
  setActionState: (state: MarkdownTileActionState) => void;
}

/*
 * Handles MarkdownTile header and footer actions, including approve/update,
 * markdown copy feedback, downloads, and response feedback callbacks.
 */
export function useMarkdownTileActions({
  content,
  downloadFileName,
  isApproved,
  onCopy,
  onDownload,
  onFeedback,
  onPrimaryAction,
  resolvedAnnotations,
  setActionState,
}: UseMarkdownTileActionsOptions) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // The copy confirmation is transient UI; reset it after the label/icon have
    // had enough time to communicate success.
    if (copied) {
      const timeout = window.setTimeout(() => setCopied(false), 2000);
      return () => window.clearTimeout(timeout);
    }

    return undefined;
  }, [copied]);

  const handlePrimaryAction = () => {
    if (isApproved) {
      return;
    }

    setActionState('done');
    onPrimaryAction?.(resolvedAnnotations);
  };

  const handleCopy = () => {
    // Let consumers observe copy intent, then use the browser clipboard for the
    // built-in markdown copy action.
    onCopy?.(content);
    navigator.clipboard?.writeText(content).then(() => setCopied(true));
  };

  const handleDownload = () => {
    onDownload?.(content);

    // Download relies on DOM APIs, so server-side rendering exits after the
    // callback without trying to create a link.
    if (typeof document === 'undefined') {
      return;
    }

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadFileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFeedback = (kind: MarkdownTileFeedbackKind) => {
    onFeedback?.(kind);
  };

  return {
    copied,
    handleCopy,
    handleDownload,
    handleFeedback,
    handlePrimaryAction,
  };
}
