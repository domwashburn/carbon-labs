import React from "react";
import { usePrefix } from "@carbon-labs/utilities/usePrefix";
import svgPaths from "./assets/svg-loading-ring";

/**
 * LoadingRing
 *
 * Carbon-faithful small loading spinner built from the Figma-imported SVG
 * paths that match Carbon's inline loading indicator exactly.
 *
 * - Track: full circle stroked with `--cds-border-subtle`
 * - Arc: ~180° segment stroked with `--cds-interactive`, rotating continuously
 *
 * Accepts an optional `size` prop for API compatibility with
 * @carbon/icons-react components (ignored — ring is always 1rem / 16 px).
 */
export function LoadingRing(_props: { size?: number }) {
  const prefix = usePrefix();

  return (
    <span
      role="img"
      aria-label="Loading"
      className={`${prefix}--loading-ring`}
    >
      <svg
        className={`${prefix}--loading-ring__svg`}
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d={svgPaths.p1e012700}
          stroke="var(--cds-border-subtle)"
          strokeWidth="3"
        />
        <g className={`${prefix}--loading-ring__spinner-group`}>
          <path
            d={svgPaths.p29d88b80}
            stroke="var(--cds-interactive)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </span>
  );
}
