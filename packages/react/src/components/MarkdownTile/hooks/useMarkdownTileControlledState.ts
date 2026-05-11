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
import type { MarkdownTileActionState, MarkdownTileAnnotation } from '../types';

interface UseMarkdownTileControlledStateOptions {
  actionState?: MarkdownTileActionState;
  annotations?: MarkdownTileAnnotation[];
  defaultActionState: MarkdownTileActionState;
  defaultAnnotations: MarkdownTileAnnotation[];
  onActionStateChange?: (state: MarkdownTileActionState) => void;
  onAnnotationsChange?: (annotations: MarkdownTileAnnotation[]) => void;
}

/*
 * Resolves controlled and uncontrolled annotation and action state while
 * preserving Carbon's prop-first controlled component contract.
 */
export function useMarkdownTileControlledState({
  actionState,
  annotations,
  defaultActionState,
  defaultAnnotations,
  onActionStateChange,
  onAnnotationsChange,
}: UseMarkdownTileControlledStateOptions) {
  const [internalAnnotations, setInternalAnnotations] =
    useState<MarkdownTileAnnotation[]>(defaultAnnotations);
  const [internalActionState, setInternalActionState] =
    useState<MarkdownTileActionState>(defaultActionState);

  // Mirror Carbon's controlled/uncontrolled pattern: props win when supplied,
  // otherwise local state owns annotations and approval status.
  const resolvedAnnotations = annotations ?? internalAnnotations;
  const resolvedActionState = actionState ?? internalActionState;
  const hasComments = resolvedAnnotations.length > 0;
  const isApproved = resolvedActionState === 'done';

  const setAnnotations = (nextAnnotations: MarkdownTileAnnotation[]) => {
    // Controlled callers receive changes without mutating internal state.
    if (!annotations) {
      setInternalAnnotations(nextAnnotations);
    }
    onAnnotationsChange?.(nextAnnotations);
  };

  const setActionState = (nextState: MarkdownTileActionState) => {
    // Approval state follows the same controlled/uncontrolled contract.
    if (!actionState) {
      setInternalActionState(nextState);
    }
    onActionStateChange?.(nextState);
  };

  return {
    hasComments,
    isApproved,
    resolvedActionState,
    resolvedAnnotations,
    setActionState,
    setAnnotations,
  };
}
