import React from "react";
import { Button } from "@carbon/react";
import { ChevronDown, ChevronUp, Close } from "@carbon/icons-react";
import { usePrefix } from "@carbon-labs/utilities/usePrefix";
import type { TaskDrawerHeaderProps, PlanStatus } from "./types";

// ── Figma plan-status icons ────────────────────────────────────────────────
// Each icon is a Figma-exported SVG component sized to fill its container.
import QueuedIcon from "./assets/QueuedIcon";
import HelpIcon from "./assets/HelpIcon";
import RenewIcon from "./assets/RenewIcon";
import AsyncIcon from "./assets/AsyncIcon";
import CheckmarkIcon from "./assets/CheckmarkIcon";
import CriticalIcon from "./assets/CriticalIcon";

// ── Icon key resolution ────────────────────────────────────────────────────
// `generating` and `updating` both use the Renew icon — share the same key so
// CSS animation does NOT re-trigger when toggling between these two states.
function resolveIconKey(status: PlanStatus): string {
  return status === "generating" || status === "updating" ? "renew" : status;
}

// ── Per-status icon renderer ───────────────────────────────────────────────
function TaskDrawerStatusIcon({ planStatus, prefix }: { planStatus: PlanStatus; prefix: string }) {
  switch (planStatus) {
    case "generating":
    case "updating":
      return (
        <span className={`${prefix}--task-drawer-header__spin`}>
          <RenewIcon />
        </span>
      );
    case "paused":
      return <HelpIcon />;
    case "executing":
      return <AsyncIcon />;
    case "complete":
      return <CheckmarkIcon />;
    case "failed":
      return <CriticalIcon />;
    default:
      return <QueuedIcon />;
  }
}

// ── Accessible labels ──────────────────────────────────────────────────────
const PLAN_STATUS_LABELS: Record<PlanStatus, string> = {
  generating: "Plan generating",
  updating: "Plan updating",
  paused: "Plan paused — awaiting input",
  executing: "Plan executing",
  complete: "Plan complete",
  failed: "Plan failed",
};

/**
 * TaskDrawerHeader
 *
 * Expandable header strip for TaskDrawer.
 *
 * ## Trailing area structure
 * The header is structured to progressively support inline actions and dismissal:
 *   1. `statusArea` — flex row containing an optional inline action (e.g. "Review")
 *      and the always-present `statusIconSlot`. The icon slot cross-fades via
 *      a keyed CSS animation, inheriting `currentColor` via CSS data-attributes.
 *   2. `dismissBtn` — an optional icon-only button rendered entirely outside
 *      the main `contentWrapper` so it stays pinned to the right edge.
 *
 * ## Animation contract
 * - Icons cross-fade via keyed CSS animation — React remounts the span on
 *   key change which re-triggers the fade-in keyframes.
 * - The spinning Renew icon (generating / updating) is applied as a pure CSS
 *   animation on a wrapper `<span>` — no JS timers.
 * - Preview text and all labels animate only their CSS properties (grid-rows,
 *   opacity) — they never unmount.
 */
export function TaskDrawerHeader({
  title,
  preview,
  expanded,
  onToggle,
  planStatus = "updating",
  onReview,
  onDismiss,
}: TaskDrawerHeaderProps) {
  const prefix = usePrefix();
  const iconKey = resolveIconKey(planStatus);

  return (
    <div className={`${prefix}--task-drawer-header`} data-expanded={expanded}>
      {/* ── Expand / collapse toggle ─────────────────────────────────────── */}
      <Button
          kind="ghost"
          size="sm"
          renderIcon={expanded ? ChevronUp : ChevronDown }
          iconDescription={expanded ? "Collapse plan" : "Expand plan"}
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse plan" : "Expand plan"}
          className={`${prefix}--task-drawer-header__toggle-btn`}
          onClick={onToggle}
        />

      {/* ── Main content (title + preview) ──────────────────────────────── */}
      <div className={`${prefix}--task-drawer-header__content-wrapper`}>
        <div className={`${prefix}--task-drawer-header__title-column`}>
          <p className={`${prefix}--task-drawer-header__title`}>{title}</p>

          <div className={`${prefix}--task-drawer-header__preview-wrap`} data-expanded={expanded}>
            <div className={`${prefix}--task-drawer-header__preview-inner`}>
              <p className={`${prefix}--task-drawer-header__preview`}>{preview}</p>
            </div>
          </div>
        </div>

        {/* ── Status area: optional inline action + always-present status icon ── */}
        <div className={`${prefix}--task-drawer-header__status-area`}>
          {planStatus === "complete" && onReview && (
            <button
              type="button"
              className={`${prefix}--task-drawer-header__inline-action`}
              onClick={onReview}
            >
              Review
            </button>
          )}

          <div
            className={`${prefix}--task-drawer-header__status-icon-slot`}
            data-plan-status={planStatus}
            role="img"
            aria-label={PLAN_STATUS_LABELS[planStatus]}
          >
            <span
              key={iconKey}
              className={`${prefix}--task-drawer-header__icon-frame`}
            >
              <TaskDrawerStatusIcon planStatus={planStatus} prefix={prefix} />
            </span>
          </div>
        </div>
      </div>

      {/* ── Optional trailing dismiss button ───────────────────────────── */}
      {planStatus === "complete" && onDismiss && (
        <Button
          kind="ghost"
          size="sm"
          renderIcon={Close}
          iconDescription="Dismiss plan"
          aria-label="Dismiss plan"
          className={`${prefix}--task-drawer-header__dismiss-btn`}
          onClick={onDismiss}
        />
      )}
    </div>
  );
}
