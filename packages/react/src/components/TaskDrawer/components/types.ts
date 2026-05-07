import type React from "react";

// ─── Plan-level Status ────────────────────────────────────────────────────────

/**
 * PlanStatus
 *
 * Represents the operational phase of the overall plan (not individual tasks).
 * Drives the icon, colour, and available actions in the TaskDrawerHeader trailing area.
 *
 * | Value        | Meaning                                      | Icon          |
 * |--------------|----------------------------------------------|---------------|
 * | `generating` | Plan is being created from scratch           | Renew (spin)  |
 * | `updating`   | Plan is being revised mid-execution          | Renew (spin)  |
 * | `paused`     | Execution halted — waiting on user input     | Help          |
 * | `executing`  | Tasks are actively running                   | Async/clock   |
 * | `complete`   | All tasks finished successfully              | Checkmark     |
 * | `failed`     | Plan encountered a terminal error            | Critical      |
 */
export type PlanStatus =
  | "generating"
  | "updating"
  | "paused"
  | "executing"
  | "complete"
  | "failed";

// ─── Task Domain ─────────────────────────────────────────────────────────────

export type TaskStatus =
  | "in_progress"
  | "awaiting_input"
  | "updating"
  | "error"
  | "recovery"
  | "stopped"
  | "failed"
  | "complete"
  | "queued"
  | "generating";

export interface PlanTask {
  id: string;
  label: string;
  status: TaskStatus;
}

// ─── Mutation ─────────────────────────────────────────────────────────────────

/**
 * MutationType
 *
 * Indicates what kind of plan-level change affected a queued task.
 * Only `queued` tasks may carry a mutation; the `useTaskMutation` hook
 * enforces this constraint and auto-clears stale mutations.
 *
 * | Value      | Meaning                              | Visual side-effect      |
 * |------------|--------------------------------------|-------------------------|
 * | `'new'`    | Task added in latest plan revision   | Blue pill tag           |
 * | `'updated'`| Task label/details changed           | Blue pill tag           |
 * | `'dropped'`| Task removed from the plan           | Blue pill tag + strike  |
 */
export type MutationType = "new" | "updated" | "dropped";

// ─── Scroll Targeting ─────────────────────────────────────────────────────────

/**
 * ScrollTarget
 *
 * Accepted by `useScrollToTask`'s `scrollTo(target)` function.
 *
 * | Value              | Resolves to                                                     |
 * |--------------------|-----------------------------------------------------------------|
 * | `'first'`          | First task in the array                                         |
 * | `'current'`        | First task with in_progress / awaiting_input / updating status  |
 * | `'first-warning'`  | First task with error / recovery / failed / stopped status      |
 * | `'last'`           | Last task in the array                                          |
 * | `string` (task id) | Task with that exact id                                         |
 */
export type ScrollTarget = "first" | "current" | "first-warning" | "last" | string;

// ─── Status Config ────────────────────────────────────────────────────────────

export interface StatusConfig {
  /** Carbon icon component to render for this status */
  Icon: React.ComponentType<{ size?: number }>;
  /** CSS color value for the icon (uses --cds-* tokens) */
  iconColor: string;
  /**
   * CDS token for the row gradient tint background,
   * or null when no tint should be applied.
   */
  rowTint: string | null;
  /** CDS token for the label text color */
  textColor: string;
  /** Whether to render the label with a line-through */
  strike?: boolean;
  /** Whether to apply a continuous spin animation to the icon */
  spin?: boolean;
}

// ─── Component Props ──────────────────────────────────────────────────────────

export interface TaskDrawerProps {
  /** Ordered list of tasks to render */
  tasks: PlanTask[];
  /** Header title text */
  title?: string;
  /** Short description line shown below the title when expanded */
  preview?: string;
  /**
   * Whether the task list starts in the expanded state.
   * Defaults to false — the drawer enters collapsed.
   */
  defaultExpanded?: boolean;
  /**
   * When true, the drawer automatically expands once planStatus transitions
   * away from "generating" for the first time (i.e. the plan is ready to execute).
   * Has no effect if the component mounts with a status other than "generating".
   * Defaults to false.
   */
  autoExpandOnGenerated?: boolean;
  /**
   * Current operational phase of the plan.
   * Passed through to TaskDrawerHeader to drive the status icon and actions.
   * Defaults to `'updating'` for backward compatibility.
   */
  planStatus?: PlanStatus;
  /**
   * Optional callback fired when the user toggles the panel.
   * Useful for lifting expanded state when needed.
   */
  onExpandedChange?: (expanded: boolean) => void;
  /**
   * Called when the user clicks the "Review" ghost button.
   * Only visible when `planStatus === 'complete'`.
   */
  onReview?: () => void;
  /**
   * Called when the user clicks the dismiss/close ghost button.
   * Only visible when `planStatus === 'complete'`.
   */
  onDismiss?: () => void;

  // ── Scroll integration (useScrollToTask) ──────────────────────────────────
  /**
   * Ref to attach to the scrollable body container.
   * Obtain from `useScrollToTask(tasks).bodyRef`.
   */
  bodyRef?: React.RefObject<HTMLDivElement | null>;
  /**
   * Callback to register each task row's root DOM element.
   * Obtain from `useScrollToTask(tasks).registerItemRef`.
   */
  registerItemRef?: (id: string, el: HTMLDivElement | null) => void;

  // ── Mutation tags (useTaskMutation) ───────────────────────────────────────
  /**
   * Map of task id → MutationType to render as inline tags.
   * Obtain from `useTaskMutation(tasks).mutations`.
   * Only rendered for `queued` tasks; the hook enforces this automatically.
   */
  mutations?: Map<string, MutationType>;
}

export interface TaskDrawerHeaderProps {
  title: string;
  preview: string;
  expanded: boolean;
  onToggle: () => void;
  /**
   * Current operational phase of the plan.
   * Determines the status icon shown in the trailing area and which
   * action buttons (if any) are rendered in the actionsGroup.
   * Defaults to `'updating'` for backward compatibility.
   */
  planStatus?: PlanStatus;
  /**
   * Called when the user clicks the "Review" ghost button.
   * Only rendered when `planStatus === 'complete'`.
   */
  onReview?: () => void;
  /**
   * Called when the user clicks the dismiss/close ghost button.
   * Only rendered when `planStatus === 'complete'`.
   */
  onDismiss?: () => void;
}

export interface TaskRowProps {
  task: PlanTask;
  index: number;
  /**
   * Mutation tag to display for this task row.
   * Passed down from TaskDrawer via the `mutations` prop.
   * Only rendered when the task status is `queued`.
   */
  mutation?: MutationType | null;
  /**
   * Callback to register this row's root DOM element with useScrollToTask.
   * Called with the element on mount and with null on unmount.
   */
  registerRef?: (el: HTMLDivElement | null) => void;
  /**
   * Whether this task is the currently active task in the plan.
   * When true, `aria-current="step"` is applied to the row so screen readers
   * can identify it as the task presently in progress.
   */
  isCurrent?: boolean;
  /**
   * Total number of tasks in the list.
   * Used to build "Task N of M" aria-label strings for richer screen reader
   * context without requiring the user to count rows manually.
   */
  taskCount?: number;
}

export interface TaskIconProps {
  config: StatusConfig;
}
