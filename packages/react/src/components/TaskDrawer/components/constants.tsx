import {
  Renew,
  Help,
  Warning,
  Async,
  IncompleteCancel,
  Misuse,
  CheckmarkOutline,
  Pending,
  CircleDash,
} from "@carbon/icons-react";

import { LoadingRing } from "./LoadingRing";
import type { TaskStatus, StatusConfig } from "./types";

// ── Accessible status labels ───────────────────────────────────────────────
/**
 * Human-readable label for each TaskStatus.
 * Used to build aria-label strings on TaskRow so screen readers announce
 * the full state without the user needing to tab into inner elements.
 */
export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  in_progress:    "in progress",
  awaiting_input: "awaiting input",
  updating:       "updating",
  error:          "has an error",
  recovery:       "recovering",
  stopped:        "stopped",
  failed:         "failed",
  complete:       "complete",
  queued:         "queued",
  generating:     "generating",
};

/**
 * Statuses that indicate the task is actively being worked on.
 * Drives the "current task" logic in TaskDrawer: the first task
 * matching any of these is surfaced in the list aria-label and skip link.
 *
 * Aligned with the 'current' target in useScrollToTask.
 */
export const CURRENT_TASK_STATUSES = new Set<TaskStatus>([
  "in_progress",
  "awaiting_input",
  "updating",
]);

/**
 * Statuses that indicate the task requires attention (but is not cleanly
 * "in progress"). Used as a secondary fallback in the list aria-label when
 * no CURRENT_TASK_STATUSES match.
 */
export const WARNING_TASK_STATUSES = new Set<TaskStatus>([
  "error",
  "recovery",
  "stopped",
  "failed",
]);

/**
 * Maps each TaskStatus to its visual metadata.
 * All color values reference CDS theme tokens so they
 * adapt automatically across all four Carbon themes.
 */
export const STATUS_CONFIG: Record<TaskStatus, StatusConfig> = {
  in_progress: {
    Icon: LoadingRing,
    iconColor: "var(--cds-interactive)",
    rowTint: null,
    textColor: "var(--cds-text-primary)",
  },
  awaiting_input: {
    Icon: Help,
    iconColor: "var(--cds-support-info)",
    rowTint: "var(--cds-notification-background-info)",
    textColor: "var(--cds-text-primary)",
  },
  updating: {
    Icon: Renew,
    iconColor: "var(--cds-support-info)",
    rowTint: "var(--cds-notification-background-info)",
    textColor: "var(--cds-text-primary)",
    spin: true,
  },
  error: {
    Icon: Warning,
    iconColor: "var(--cds-support-warning)",
    rowTint: "var(--cds-notification-background-warning)",
    textColor: "var(--cds-text-primary)",
  },
  recovery: {
    Icon: Async,
    iconColor: "var(--cds-support-warning)",
    rowTint: "var(--cds-notification-background-warning)",
    textColor: "var(--cds-text-primary)",
  },
  stopped: {
    Icon: IncompleteCancel,
    iconColor: "var(--cds-support-error)",
    rowTint: "var(--cds-notification-background-error)",
    textColor: "var(--cds-text-primary)",
  },
  failed: {
    Icon: Misuse,
    iconColor: "var(--cds-support-error)",
    rowTint: "var(--cds-notification-background-error)",
    textColor: "var(--cds-text-primary)",
  },
  complete: {
    Icon: CheckmarkOutline,
    iconColor: "var(--cds-support-success)",
    rowTint: "var(--cds-notification-background-success)",
    textColor: "var(--cds-text-disabled)",
    strike: true,
  },
  queued: {
    Icon: Pending,
    iconColor: "var(--cds-text-disabled)",
    rowTint: null,
    textColor: "var(--cds-text-disabled)",
  },
  generating: {
    Icon: CircleDash,
    iconColor: "var(--cds-text-placeholder)",
    rowTint: null,
    textColor: "var(--cds-text-placeholder)",
  },
};