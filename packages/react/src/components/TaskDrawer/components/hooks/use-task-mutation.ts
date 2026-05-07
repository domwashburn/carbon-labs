import { useState, useCallback, useEffect } from "react";
import type { PlanTask, MutationType } from "../types";

/**
 * useTaskMutation
 *
 * Manages mutation tags on task items. A mutation tag indicates that a
 * pending (queued) task has been newly added, updated, or dropped in the
 * most recent plan revision.
 *
 * **Constraint:** Only `queued` tasks may carry a mutation. Mutations applied
 * to non-queued tasks are silently ignored. When a task's status changes away
 * from `queued`, any existing mutation for it is automatically cleared.
 *
 * ## Usage
 * ```tsx
 * const mutation = useTaskMutation(tasks);
 *
 * // Tag a single task
 * mutation.mutateTasks([{ id: 'task-5', type: 'new' }]);
 *
 * // Tag multiple tasks in one batch
 * mutation.mutateTasks([
 *   { id: 'task-5', type: 'new' },
 *   { id: 'task-6', type: 'updated' },
 *   { id: 'task-7', type: 'dropped' },
 * ]);
 *
 * // Clear a single tag
 * mutation.clearMutation('task-5');
 *
 * // Clear all tags
 * mutation.clearAllMutations();
 *
 * // Pass into TaskDrawer
 * <TaskDrawer tasks={tasks} mutations={mutation.mutations} />
 * ```
 *
 * ## MutationType values
 * | Value      | Meaning                                   | Visual            |
 * |------------|-------------------------------------------|-------------------|
 * | `'new'`    | Task was added in latest plan revision    | Blue pill tag     |
 * | `'updated'`| Task label/details changed                | Blue pill tag     |
 * | `'dropped'`| Task was removed from the plan            | Blue pill + strike|
 */
export function useTaskMutation(tasks: PlanTask[]) {
  const [mutations, setMutations] = useState<Map<string, MutationType>>(
    new Map()
  );

  // ── Auto-clean mutations when tasks leave the `queued` status ──────────────
  useEffect(() => {
    const queuedIds = new Set(
      tasks.filter((t) => t.status === "queued").map((t) => t.id)
    );

    setMutations((prev) => {
      let dirty = false;
      const next = new Map(prev);

      for (const id of prev.keys()) {
        if (!queuedIds.has(id)) {
          next.delete(id);
          dirty = true;
        }
      }

      return dirty ? next : prev;
    });
  }, [tasks]);

  /**
   * Apply one or more mutation tags in a single batch.
   * Pass `type: null` to clear a specific mutation within the same batch.
   * Non-queued tasks are silently skipped.
   */
  const mutateTasks = useCallback(
    (changes: Array<{ id: string; type: MutationType | null }>) => {
      const queuedIds = new Set(
        tasks.filter((t) => t.status === "queued").map((t) => t.id)
      );

      setMutations((prev) => {
        const next = new Map(prev);

        for (const { id, type } of changes) {
          if (!queuedIds.has(id)) continue; // enforce queued-only

          if (type === null) {
            next.delete(id);
          } else {
            next.set(id, type);
          }
        }

        return next;
      });
    },
    [tasks]
  );

  /** Remove the mutation tag for a single task. */
  const clearMutation = useCallback((id: string) => {
    setMutations((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  /** Remove all mutation tags. */
  const clearAllMutations = useCallback(() => {
    setMutations(new Map());
  }, []);

  return { mutations, mutateTasks, clearMutation, clearAllMutations } as const;
}
