import React from "react";
import svgPaths from "./svg-help";

export default function HelpIcon() {
  return (
    <div className="relative size-full" data-name="Agent Plan Satus Icons">
      <div className="absolute inset-0 overflow-clip" data-name="Help">
        <div aria-hidden="true" className="absolute bg-[rgba(255,255,255,0)] inset-0 mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-[6.25%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
            <g id="Vector">
              <path d={svgPaths.p254be180} fill="#525252" />
              <path d={svgPaths.pb278600} fill="#525252" />
              <path d={svgPaths.p178f400} fill="#525252" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
