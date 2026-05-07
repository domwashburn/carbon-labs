import { useRef, useCallback, useEffect } from "react";
import type { PlanTask, ScrollTarget } from "../types";

/**
 * useScrollToTask
 *
 * Manages scroll targeting within the TaskDrawer's scrollable body.
 * Each TaskRow registers its DOM element via `registerItemRef`; the
 * returned `scrollTo` then resolves named targets or direct task IDs
 * and calls `scrollIntoView` with smooth behaviour.
 *
 * ## Usage
 * ```tsx
 * const scroll = useScrollToTask(tasks);
 * // Pass into TaskDrawer:
 * <TaskDrawer
 *   tasks={tasks}
 *   bodyRef={scroll.bodyRef}
 *   registerItemRef={scroll.registerItemRef}
 * />
 * // Then call imperatively:
 * scroll.scrollTo('current');
 * scroll.scrollTo('first-warning');
 * scroll.scrollTo('last');
 * scroll.scrollTo('task-id-123');
 * ```
 *
 * ## ScrollTarget values
 * | Value            | Resolves to                                                        |
 * |------------------|--------------------------------------------------------------------|
 * | `'first'`        | First task in the array                                            |
 * | `'current'`      | First task with status in_progress / awaiting_input / updating    |
 * | `'first-warning'`| First task with status error / recovery / failed / stopped        |
 * | `'last'`         | Last task in the array                                             |
 * | `string`         | Task with that exact id                                            |
 */

const ACTIVE_STATUSES = new Set([
  "in_progress",
  "awaiting_input",
  "updating",
] as const);

const WARNING_STATUSES = new Set([
  "error",
  "recovery",
  "failed",
  "stopped",
] as const);

export function useScrollToTask(tasks: PlanTask[]) {
  // Keep latest tasks snapshot in a ref so scrollTo always has fresh data
  // without needing to be re-created on every render.
  const tasksRef = useRef<PlanTask[]>(tasks);
  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  /** Ref to attach to the scrollable body container inside TaskDrawer. */
  const bodyRef = useRef<HTMLDivElement>(null);

  /** Per-task element registry — populated by TaskRow via registerItemRef. */
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  /**
   * Register (or unregister) a task row's root element.
   * Pass `null` to unregister (called on unmount).
   */
  const registerItemRef = useCallback(
    (id: string, el: HTMLDivElement | null) => {
      if (el) {
        itemRefs.current.set(id, el);
      } else {
        itemRefs.current.delete(id);
      }
    },
    []
  );

  /**
   * Scroll to a task row by id or named target.
   * No-ops silently when the target cannot be resolved.
   */
  const scrollTo = useCallback((target: ScrollTarget) => {
    const currentTasks = tasksRef.current;
    let taskId: string | undefined;

    if (target === "first") {
      taskId = currentTasks[0]?.id;
    } else if (target === "current") {
      taskId = currentTasks.find((t) =>
        (ACTIVE_STATUSES as Set<string>).has(t.status)
      )?.id;
    } else if (target === "first-warning") {
      taskId = currentTasks.find((t) =>
        (WARNING_STATUSES as Set<string>).has(t.status)
      )?.id;
    } else if (target === "last") {
      taskId = currentTasks[currentTasks.length - 1]?.id;
    } else {
      // Direct task id
      taskId = target;
    }

    if (!taskId) return;

    const el = itemRefs.current.get(taskId);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  return { bodyRef, registerItemRef, scrollTo } as const;
}
