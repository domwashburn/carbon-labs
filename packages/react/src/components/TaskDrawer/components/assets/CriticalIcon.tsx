import React from "react";
import svgPaths from "./svg-critical";

export default function CriticalIcon() {
  return (
    <div className="relative size-full" data-name="Agent Plan Satus Icons">
      <div className="absolute inset-0 overflow-clip" data-name="Critical">
        <div aria-hidden="true" className="absolute bg-[rgba(255,255,255,0)] inset-0 mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-[12.5%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.0006 12.0005">
            <g id="Vector">
              <path d={svgPaths.p11b3bd80} fill="#525252" />
              <path d={svgPaths.p3411d200} fill="#525252" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
