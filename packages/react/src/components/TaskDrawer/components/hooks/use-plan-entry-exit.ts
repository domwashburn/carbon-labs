import { useState, useRef, useCallback, useEffect } from "react";
import type { PlanStatus } from "../types";

// ─── Options ──────────────────────────────────────────────────────────────────

interface UsePlanEntryExitOptions {
  /**
   * Whether the task list body starts in the expanded (open) state.
   * Defaults to false — the drawer enters collapsed.
   */
  defaultExpanded?: boolean;
  /**
   * Current operational phase of the plan.
   * Monitored to trigger the auto-expand behaviour.
   */
  planStatus?: PlanStatus;
  /**
   * When true, the drawer automatically expands once planStatus transitions
   * away from "generating" for the first time (i.e. the plan is ready).
   * Has no effect if the component mounts with a status other than "generating".
   */
  autoExpandOnGenerated?: boolean;
  /**
   * Forwarded from TaskDrawerProps — called whenever expanded changes so
   * the parent can mirror the value if needed.
   */
  onExpandedChange?: (expanded: boolean) => void;
}

// ─── Return ───────────────────────────────────────────────────────────────────

export interface UsePlanEntryExitReturn {
  /** Current expanded state of the task list body. */
  expanded: boolean;
  /** Toggle handler — pass to TaskDrawerHeader.onToggle. */
  handleToggle: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * usePlanEntryExit
 *
 * Manages the drawer's expanded/collapsed state and the optional auto-expand
 * trigger when the plan finishes generating.
 *
 * Exit animation timing is handled externally by the parent. When the parent
 * sets planVisible=false, it should delay unmounting to allow the CSS exit
 * animation to complete — no manual isExiting state needed here.
 *
 * ## Auto-expand behaviour
 * If the component mounts while planStatus is "generating" and
 * autoExpandOnGenerated is true, the drawer automatically expands the first
 * time planStatus changes away from "generating".
 */
export function usePlanEntryExit({
  defaultExpanded = false,
  planStatus,
  autoExpandOnGenerated = false,
  onExpandedChange,
}: UsePlanEntryExitOptions): UsePlanEntryExitReturn {
  const [expanded, setExpanded] = useState(defaultExpanded);

  // Track previous status to detect the generating → ready transition.
  const prevStatusRef = useRef<PlanStatus | undefined>(planStatus);

  // Stable ref for the callback so the effect dep array stays clean.
  const onExpandedChangeRef = useRef(onExpandedChange);
  onExpandedChangeRef.current = onExpandedChange;

  // ── Auto-expand: generating → anything else ────────────────────────────────
  useEffect(() => {
    const prev = prevStatusRef.current;
    prevStatusRef.current = planStatus;

    if (
      autoExpandOnGenerated &&
      prev === "generating" &&
      planStatus !== "generating" &&
      planStatus !== undefined
    ) {
      setExpanded(true);
      onExpandedChangeRef.current?.(true);
    }
  }, [planStatus, autoExpandOnGenerated]);

  // ── Expand / collapse toggle ───────────────────────────────────────────────
  const handleToggle = useCallback(() => {
    setExpanded((prev) => {
      const next = !prev;
      onExpandedChangeRef.current?.(next);
      return next;
    });
  }, []);

  return { expanded, handleToggle };
}
