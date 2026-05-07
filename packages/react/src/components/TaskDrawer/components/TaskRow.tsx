import React, { useEffect } from "react";
import { usePrefix } from "@carbon-labs/utilities/usePrefix";
import { STATUS_CONFIG, TASK_STATUS_LABELS } from "./constants";
import { useTaskFadeIn } from "./hooks/use-task-fade-in";
import { useTaskStatusUpdate } from "./hooks/use-task-status-update";
import { TaskIcon } from "./TaskIcon";
import type { TaskRowProps } from "./types";

/**
 * TaskRow
 *
 * Renders a single numbered task item with:
 *
 * - **Status-driven visuals** — icon, text colour, and row tint gradient are
 *   all derived from `STATUS_CONFIG[displayStatus]`.
 * - **Smooth status transitions** — `useTaskStatusUpdate` introduces a 120 ms
 *   exit phase before swapping `displayStatus`; CSS animations on keyed
 *   elements cross-fade the outgoing and incoming visuals.
 * - **Viewport fade-in** — `useTaskFadeIn` (IntersectionObserver) fires once
 *   and then disconnects; the item remains visible on subsequent scrolls.
 * - **Mutation tags** — when `mutation` is provided (and the task is `queued`),
 *   an animated blue pill tag (`new` / `updated` / `dropped`) is shown.
 *   A `dropped` mutation also applies line-through to the label.
 * - **Scroll registration** — calls `registerRef` on mount / unmount so that
 *   `useScrollToTask` can target this row imperatively.
 *
 * ## Accessibility
 *
 * The row root div is a `role="listitem"` with `tabIndex={0}` (directly
 * focusable) and a single `aria-label` that reads the complete task description
 * as one unit: "Task N of M: {label}, {status}". When this is the active task,
 * `aria-current="step"` is set.
 *
 * All inner visual elements (index number, label text, mutation pill, status icon)
 * carry `aria-hidden="true"` so assistive technology reads only the outer
 * `aria-label` and never double-announces the content.
 *
 * Importantly, `aria-label` is derived from `task.status` (the true current
 * value), not `displayStatus` (which lags 120 ms for animation), so screen
 * reader announcements are always accurate even during visual transitions.
 *
 * Pure display component — receives all data via props.
 */
export function TaskRow({
  task,
  index,
  mutation,
  registerRef,
  isCurrent = false,
  taskCount,
}: TaskRowProps) {
  const prefix = usePrefix();

  // ── Status transition ───────────────────────────────────────────────────────
  const { displayStatus, isTransitioning } =
    useTaskStatusUpdate(task.status);
  const config = STATUS_CONFIG[displayStatus];

  // ── Viewport fade-in ────────────────────────────────────────────────────────
  const { ref: rowRef, isVisible } = useTaskFadeIn();

  // ── Scroll registration ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!registerRef) return;
    const el = rowRef.current;
    if (el) registerRef(el);
    return () => registerRef(null);
    // rowRef is a stable useRef — only re-run when registerRef changes
  }, [registerRef, rowRef]);

  // ── Derived presentation values ─────────────────────────────────────────────
  const tintGradient = config.rowTint
    ? `linear-gradient(90deg, transparent 80%, ${config.rowTint} 100%)`
    : undefined;

  // A `dropped` mutation forces line-through regardless of status config
  const isStruck = config.strike || mutation === "dropped";

  // Only render mutation tag when task is genuinely queued
  const activeMutation =
    task.status === "queued" && mutation ? mutation : null;

  // ── Accessible label ────────────────────────────────────────────────────────
  // Derived from task.status (true current value, not displayStatus) so screen
  // readers always hear the correct state even while the visual transition plays.
  // Format: "Task N of M: {label}, {statusLabel}"
  const of = taskCount != null ? ` of ${taskCount}` : "";
  const ariaLabel = `Task ${index + 1}${of}: ${task.label}, ${TASK_STATUS_LABELS[task.status]}`;

  return (
    <div
      ref={rowRef}
      className={`${prefix}--task-row`}
      data-visible={isVisible}
      data-transitioning={isTransitioning}
      role="listitem"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-current={isCurrent ? "step" : undefined}
    >
      {/* ── Tint gradient overlay ─────────────────────────────────────────── */}
      {tintGradient && (
        <div
          className={`${prefix}--task-row__tint`}
          data-visible={isVisible}
          style={{
            background: config.rowTint
              ? `linear-gradient(90deg, transparent 85%, color-mix(in srgb, ${config.iconColor} 30%, transparent) 110%)`
              : undefined,
          }}
          aria-hidden="true"
        />
      )}

      <div className={`${prefix}--task-row__content`} aria-hidden="true">
        <span
          className={`${prefix}--task-row__index`}
          style={
            displayStatus === "generating" ||
            displayStatus === "queued" ||
            displayStatus === "complete"
              ? { color: "var(--cds-text-disabled)" }
              : undefined
          }
        >
          {index + 1}.
        </span>

        <div style={{ flex: 1, minWidth: 0, display: "grid" }}>
          {displayStatus === "generating" ? (
            <div
              key="skeleton"
              className={`${prefix}--task-row__label ${prefix}--task-row__label-enter`}
              style={{
                gridArea: "1 / 1",
                display: "flex",
                alignItems: "center",
                minHeight: "1rem",
              }}
            >
              <div className={`${prefix}--task-row__skeleton`} />
            </div>
          ) : (
            <div
              key={displayStatus}
              className={`${prefix}--task-row__label ${prefix}--task-row__label-enter`}
              data-strike={isStruck}
              style={{
                color: config.textColor,
                gridArea: "1 / 1",
              }}
            >
              {task.label}
            </div>
          )}
        </div>
      </div>

      {activeMutation && (
        <span
          className={`${prefix}--task-row__mutation-tag`}
          data-mutation={activeMutation}
          aria-hidden="true"
        >
          {activeMutation}
        </span>
      )}

      <span
        key={displayStatus}
        className={`${prefix}--task-row__icon-enter`}
        style={{ display: "inline-flex", flexShrink: 0 }}
        aria-hidden="true"
      >
        <TaskIcon config={config} />
      </span>
    </div>
  );
}
