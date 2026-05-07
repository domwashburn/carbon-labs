import React from "react";
import { usePrefix } from "@carbon-labs/utilities/usePrefix";
import type { TaskIconProps } from "./types";

/**
 * TaskIcon
 *
 * Renders the Carbon icon associated with a task status.
 * Applies an optional continuous spin animation when `config.spin` is true.
 */
export function TaskIcon({ config }: TaskIconProps) {
  const prefix = usePrefix();
  const { Icon, iconColor, spin } = config;

  return (
    <span className={`${prefix}--task-icon`} style={{ color: iconColor }}>
      <span className={spin ? `${prefix}--task-icon__spin` : `${prefix}--task-icon__static`}>
        <Icon size={16} />
      </span>
    </span>
  );
}
