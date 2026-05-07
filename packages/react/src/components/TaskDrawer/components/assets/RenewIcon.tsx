import React from "react";
import svgPaths from "./svg-renew";

export default function RenewIcon() {
  return (
    <div className="relative size-full" data-name="Agent Plan Satus Icons">
      <div className="absolute inset-0 overflow-clip" data-name="Renew">
        <div aria-hidden="true" className="absolute bg-[rgba(255,255,255,0)] inset-0 mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-[9.33%_9.38%_9.33%_9.37%]" data-name="Vector">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 13.0134">
            <g id="Vector">
              <path d={svgPaths.p310cb3f0} fill="#525252" />
              <path d={svgPaths.p12f7ae00} fill="#525252" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
