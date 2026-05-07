import React from "react";
import svgPaths from "./svg-async";

export default function AsyncIcon() {
  return (
    <div className="relative size-full" data-name="Agent Plan Satus Icons">
      <div className="absolute inset-0 overflow-clip" data-name="Async">
        <div aria-hidden="true" className="absolute bg-[rgba(255,255,255,0)] inset-0 mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-[6.25%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
            <g id="Vector">
              <path d={svgPaths.p3672f880} fill="var(--fill-0, #525252)" />
              <path d={svgPaths.p316c280} fill="var(--fill-0, #525252)" />
              <path d="M7.5 3.5H6.5V8H7.5V3.5Z" fill="var(--fill-0, #525252)" />
              <path d={svgPaths.p23d7df80} fill="var(--fill-0, #525252)" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
