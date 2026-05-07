import React from "react";
import svgPaths from "./svg-queued";

export default function QueuedIcon() {
  return (
    <div className="relative size-full" data-name="Agent Plan Satus Icons">
      <div className="absolute inset-0 overflow-clip" data-name="Queued">
        <div aria-hidden="true" className="absolute bg-[rgba(255,255,255,0)] inset-0 mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-[6.25%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
            <g id="Vector">
              <path d="M14 9H10V10H14V9Z" fill="#525252" />
              <path d="M14 11H10V12H14V11Z" fill="#525252" />
              <path d="M14 13H10V14H14V13Z" fill="#525252" />
              <path d="M9 11H8V12H9V11Z" fill="#525252" />
              <path d="M9 9H8V10H9V9Z" fill="#525252" />
              <path d="M9 13H8V14H9V13Z" fill="#525252" />
              <path d={svgPaths.p2a74a180} fill="#525252" />
              <path d={svgPaths.p1354600} fill="#525252" />
              <path d={svgPaths.p15e89a00} fill="#525252" />
              <path d={svgPaths.p34cb5c00} fill="#525252" />
              <path d={svgPaths.p26c1f300} fill="#525252" />
              <path d={svgPaths.p273b6100} fill="#525252" />
              <path d={svgPaths.p10e81f00} fill="#525252" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
