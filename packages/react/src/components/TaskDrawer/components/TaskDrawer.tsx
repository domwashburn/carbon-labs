import React, { useRef, useCallback } from "react";
import { usePrefix } from "@carbon-labs/utilities/usePrefix";
import { TaskDrawerHeader } from "./TaskDrawerHeader";
import { TaskRow } from "./TaskRow";
import { usePlanEntryExit } from "./hooks/use-plan-entry-exit";
import { CURRENT_TASK_STATUSES, WARNING_TASK_STATUSES, TASK_STATUS_LABELS } from "./constants";
import type { TaskDrawerProps } from "./types";

const DEFAULT_TITLE = "Updating plan";
const DEFAULT_PREVIEW =
  "This is a short preview of the implementation plan that should max out at 3 lines so. You can view the full plan in the workspace…";

/**
 * Builds the human-readable label for the task list region.
 *
 * Format: "{N} task[s][. Task {i}, {label}, is {status}.]"
 *
 * Examples:
 *   "8 tasks. Task 2, Configure CI pipeline, is in progress."
 *   "3 tasks. Task 1, Initialize project, has an error."
 *   "5 tasks."
 */
function buildListAriaLabel(
  taskCount: number,
  currentIndex: number,
  currentLabel: string,
  currentStatusLabel: string
): string {
  const base = `${taskCount} task${taskCount !== 1 ? "s" : ""}`;
  if (currentIndex < 0) return base;
  return `${base}. Task ${currentIndex + 1}, ${currentLabel}, is ${currentStatusLabel}.`;
}

/**
 * TaskDrawer
 *
 * Expandable in-chat plan and task list component.
 * Designed to sit directly above a prompt input field.
 *
 * ## Accessibility
 *
 * The component wraps everything in a `role="region"` landmark labelled by
 * the plan title so screen reader users can jump to it via landmark navigation.
 *
 * The task list (`role="list"`) carries a dynamic `aria-label` surfacing:
 *   - Total task count
 *   - Which task is currently in progress (if any)
 *
 * A visually-hidden "Skip to current task" button appears between the header
 * and the task list when the drawer is open and a current task exists. It
 * becomes visible on keyboard focus, allowing screen reader and keyboard-only
 * users to jump directly to the active task row without tabbing through every
 * preceding row.
 *
 * Each `TaskRow` carries:
 *   - `role="listitem"`
 *   - `tabIndex={0}` — makes the row directly focusable
 *   - `aria-label` — "Task N of M: {label}, {status}" read as one unit
 *   - `aria-current="step"` — on the currently active task
 *
 * The collapsed body region uses `aria-hidden` and `inert` together so that
 * hidden task rows are neither announced by screen readers nor reachable via
 * keyboard Tab when the drawer is closed.
 *
 * ## Mount animation
 *
 * The root element plays a CSS slide-up animation on mount (240 ms,
 * entrance-expressive). The parent container should have `overflow: hidden`
 * so the element is clipped below its natural boundary during the slide,
 * producing the "slide up from behind the prompt" entrance effect.
 *
 * ## Lifecycle phases
 *
 * | Phase      | planStatus values                       | Default drawer state |
 * |------------|-----------------------------------------|----------------------|
 * | Generating | `"generating"`                          | closed               |
 * | Executing  | `"updating"` `"paused"` `"executing"`   | user-controlled      |
 * | Terminal   | `"complete"` `"failed"`                 | user-controlled      |
 *
 * ## Auto-expand
 * Set `autoExpandOnGenerated` to open the drawer automatically when
 * planStatus first transitions away from `"generating"`.
 *
 * ## Scroll integration
 * ```tsx
 * const scroll = useScrollToTask(tasks);
 * <TaskDrawer bodyRef={scroll.bodyRef} registerItemRef={scroll.registerItemRef} />\
 * scroll.scrollTo('current');
 * ```
 *
 * ## Mutation tags
 * ```tsx
 * const { mutations, mutateTasks } = useTaskMutation(tasks);
 * <TaskDrawer mutations={mutations} />
 * ```
 */
export function TaskDrawer({
  tasks,
  title = DEFAULT_TITLE,
  preview = DEFAULT_PREVIEW,
  defaultExpanded = false,
  autoExpandOnGenerated = false,
  onExpandedChange,
  planStatus,
  onReview,
  onDismiss,
  // Scroll integration
  bodyRef,
  registerItemRef,
  // Mutation tags
  mutations,
}: TaskDrawerProps) {
  const prefix = usePrefix();
  const { expanded, handleToggle } = usePlanEntryExit({
    defaultExpanded,
    planStatus,
    autoExpandOnGenerated,
    onExpandedChange,
  });

  // ── Internal ref map for skip-link focus ────────────────────────────────────
  // Always maintained regardless of whether the consumer provides registerItemRef,
  // so the "Skip to current task" button can imperatively focus the current row.
  const internalItemRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  const handleRegisterRef = useCallback(
    (id: string, el: HTMLDivElement | null) => {
      if (el) {
        internalItemRefs.current.set(id, el);
      } else {
        internalItemRefs.current.delete(id);
      }
      // Forward to external scroll-integration callback if provided
      registerItemRef?.(id, el);
    },
    [registerItemRef]
  );

  // ── Current-task derivation ─────────────────────────────────────────────────
  // Priority: CURRENT_TASK_STATUSES (in_progress / awaiting_input / updating)
  //           then WARNING_TASK_STATUSES (error / recovery / stopped / failed)
  const taskCount = tasks.length;

  const currentIndex = (() => {
    const active = tasks.findIndex((t) => CURRENT_TASK_STATUSES.has(t.status));
    if (active >= 0) return active;
    return tasks.findIndex((t) => WARNING_TASK_STATUSES.has(t.status));
  })();

  const currentTask = currentIndex >= 0 ? tasks[currentIndex] : null;

  // ── List aria-label ─────────────────────────────────────────────────────────
  const listAriaLabel = buildListAriaLabel(
    taskCount,
    currentIndex,
    currentTask?.label ?? "",
    currentTask ? TASK_STATUS_LABELS[currentTask.status] : ""
  );

  // ── Skip link handler ───────────────────────────────────────────────────────
  const handleJumpToCurrent = () => {
    if (!currentTask) return;
    internalItemRefs.current.get(currentTask.id)?.focus();
  };

  return (
    <div
      className={`${prefix}--task-drawer`}
      role="region"
      aria-label={title}
    >
      <TaskDrawerHeader
        title={title}
        preview={preview}
        expanded={expanded}
        onToggle={handleToggle}
        planStatus={planStatus}
        onReview={onReview}
        onDismiss={onDismiss}
      />

      {/* ── Skip link ─────────────────────────────────────────────────────────
          Placed between the header and the body so it sits outside aria-hidden
          and is always reachable via Tab. Becomes visible only on :focus-visible
          so it stays invisible to sighted users during normal mouse interaction.
          Only rendered when the drawer is open and a current task exists.
      ──────────────────────────────────────────────────────────────────────── */}
      {expanded && currentTask && (
        <button
          type="button"
          className={`${prefix}--task-drawer__skip-link`}
          onClick={handleJumpToCurrent}
        >
          Skip to current task: Task {currentIndex + 1} of {taskCount},{" "}
          {currentTask.label}
        </button>
      )}

      {/* ── Body ──────────────────────────────────────────────────────────────
          aria-hidden hides all descendants from assistive technology when
          collapsed. inert additionally prevents keyboard focus from reaching
          any focusable children (tabIndex={0} rows) while the drawer is shut.
      ──────────────────────────────────────────────────────────────────────── */}
      <div
        ref={bodyRef}
        className={`${prefix}--task-drawer__body`}
        style={{ maxHeight: expanded ? "var(--ptl-max-body-height)" : 0 }}
        aria-hidden={!expanded}
        inert={!expanded ? '' : undefined}
      >
        <div
          className={`${prefix}--task-drawer__task-list`}
          role="list"
          aria-label={listAriaLabel}
        >
          {tasks.map((task, index) => (
            <TaskRow
              key={task.id}
              task={task}
              index={index}
              taskCount={taskCount}
              isCurrent={index === currentIndex}
              mutation={mutations?.get(task.id) ?? null}
              registerRef={(el) => handleRegisterRef(task.id, el)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
