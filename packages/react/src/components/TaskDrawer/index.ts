/**
 * @license
 *
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// ── Component ────────────────────────────────────────────────────────────────
export { TaskDrawer } from './components/TaskDrawer.js';

// ── Hooks ────────────────────────────────────────────────────────────────────
export { useScrollToTask } from './components/hooks/use-scroll-to-task.js';
export { useTaskMutation } from './components/hooks/use-task-mutation.js';
export { useTaskStatusUpdate } from './components/hooks/use-task-status-update.js';
export { usePlanEntryExit } from './components/hooks/use-plan-entry-exit.js';
export type { UsePlanEntryExitReturn } from './components/hooks/use-plan-entry-exit.js';

// ── Types ────────────────────────────────────────────────────────────────────
export type {
  PlanTask,
  TaskDrawerProps,
  PlanStatus,
  TaskStatus,
  MutationType,
  ScrollTarget,
} from './components/types.js';
