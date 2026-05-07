import { useState, useEffect, useRef } from "react";
import type { TaskStatus } from "../types";

/**
 * EXIT_DURATION_MS
 *
 * Half of Carbon's `--cds-motion-duration-moderate-02` (240 ms).
 * Used as the exit phase of a status transition: the outgoing visuals
 * have this window to animate out before the incoming status takes over.
 */
const EXIT_DURATION_MS = 120;

/**
 * useTaskStatusUpdate
 *
 * Smoothly transitions between TaskStatus values by introducing a
 * two-phase swap:
 *
 * 1. **Exit phase** (`isTransitioning = true`): The incoming `status`
 *    differs from the currently displayed one. A 120 ms timer starts,
 *    giving the existing keyed elements time to dim via CSS.
 *
 * 2. **Enter phase** (`isTransitioning = false`): After the timer fires,
 *    `displayStatus` is updated to the new status. React re-renders the
 *    row with new config; keyed CSS animations play on the new elements.
 *
 * If `status` changes again before the timer fires, the pending timer is
 * cancelled and replaced — rapid updates always converge to the latest value.
 *
 * ## Usage (inside TaskRow)
 * ```tsx
 * const { displayStatus, isTransitioning, previousStatus } =
 *   useTaskStatusUpdate(task.status);
 *
 * const config = STATUS_CONFIG[displayStatus];
 *
 * // Key elements on displayStatus so React remounts them on change,
 * // which re-triggers CSS enter animations:
 * <span key={displayStatus} className={styles.iconEnter}>
 *   <TaskIcon config={config} />
 * </span>
 * ```
 *
 * ## Returns
 * | Field            | Type              | Description                                      |
 * |------------------|-------------------|--------------------------------------------------|
 * | `displayStatus`  | `TaskStatus`      | The status currently rendered in the UI          |
 * | `isTransitioning`| `boolean`         | True during the 120 ms exit phase                |
 * | `previousStatus` | `TaskStatus\|null`| The status before the most recent transition     |
 */
export function useTaskStatusUpdate(status: TaskStatus) {
  const [displayStatus, setDisplayStatus] = useState<TaskStatus>(status);
  const [isTransitioning, setIsTransitioning] = useState(false);

  /**
   * Track the displayed status in a ref so the setTimeout callback always
   * has the correct "previous" value without a stale closure.
   */
  const displayStatusRef = useRef<TaskStatus>(status);
  const previousStatusRef = useRef<TaskStatus | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep displayStatusRef in sync with state
  useEffect(() => {
    displayStatusRef.current = displayStatus;
  }, [displayStatus]);

  useEffect(() => {
    // No-op when status hasn't changed from what is currently shown
    if (status === displayStatusRef.current) return;

    // Cancel any pending transition (handles rapid successive updates)
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Phase 1 — mark transitioning so consumers can dim via CSS
    setIsTransitioning(true);

    // Phase 2 — after exit window, commit the new status
    timerRef.current = setTimeout(() => {
      previousStatusRef.current = displayStatusRef.current;
      setDisplayStatus(status);
      setIsTransitioning(false);
      timerRef.current = null;
    }, EXIT_DURATION_MS);
  }, [status]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

  return {
    /** The status value currently driving the row's visual state. */
    displayStatus,
    /**
     * True for the 120 ms exit window between a status change being
     * detected and `displayStatus` being updated.
     */
    isTransitioning,
    /** The status displayed immediately before the most recent transition. */
    previousStatus: previousStatusRef.current,
  } as const;
}
