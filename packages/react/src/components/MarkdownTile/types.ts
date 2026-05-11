/**
 * @license
 *
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type React from 'react';

export type MarkdownTileVariant = 'plan' | 'reference' | 'insight';

export type MarkdownTileActionState = 'idle' | 'done';

export type MarkdownTileFeedbackKind = 'positive' | 'negative';

export interface MarkdownTileAnnotation {
  id: string;
  quote: string;
  blockIdx: number;
  body: string;
  timestamp?: string;
}

export interface CommentComposerState {
  top: number;
  left: number;
  quote: string;
  blockIdx: number;
  isTouch: boolean;
}

export interface SelectionMenuPosition {
  top: number;
  left: number;
  quote: string;
  blockIdx: number;
}

export interface MarkdownTileSecondaryAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export interface MarkdownTileProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'onCopy' | 'title'> {
  variant?: MarkdownTileVariant;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  content: string;
  initiallyExpanded?: boolean;
  aiLabel?: boolean;
  aiLabelText?: string;
  aiExplainabilityTitle?: string;
  aiExplainabilityDescription?: React.ReactNode;
  annotatable?: boolean;
  annotations?: MarkdownTileAnnotation[];
  defaultAnnotations?: MarkdownTileAnnotation[];
  onAnnotationsChange?: (annotations: MarkdownTileAnnotation[]) => void;
  approveActionLabel?: string;
  updateActionLabel?: string;
  doneActionLabel?: string;
  expandPillLabel?: string;
  collapseLabel?: string;
  actionState?: MarkdownTileActionState;
  defaultActionState?: MarkdownTileActionState;
  onActionStateChange?: (state: MarkdownTileActionState) => void;
  onPrimaryAction?: (annotations: MarkdownTileAnnotation[]) => void;
  onCopy?: (content: string) => void;
  onDownload?: (content: string) => void;
  downloadFileName?: string;
  onFeedback?: (kind: MarkdownTileFeedbackKind) => void;
  secondaryActions?: MarkdownTileSecondaryAction[];
}
