import React from 'react';
import {
  BuildTool,
  Add,
  Edit,
  Renew,
  Run,
  TestTool,
  Rocket,
  Misuse,
  Idea,
  Search,
  View,
  Inspection,
  Checkmark,
  Flow,
  Task,
  Watson
} from '@carbon/icons-react';
import type { TaskType } from '../types.js';
import styles from '../components/inline-reasoning-trace.scss';

/**
 * getTaskIcon utility function
 * 
 * Returns the appropriate icon component for a given task type.
 * Supports both development and reasoning task types.
 * 
 * @param taskType - The type of task
 * @param customIcon - Optional custom icon to use instead of the default
 * @returns React node containing the icon, or null if no icon should be displayed
 */
export const getTaskIcon = (
  taskType?: TaskType,
  customIcon?: React.ReactNode
): React.ReactNode => {
  // If custom icon is provided, use it
  if (customIcon) {
    return customIcon;
  }
  
  // Otherwise, return icon based on task type
  if (!taskType) {
    return null;
  }
  
  const iconProps = { size: 16, className: styles.taskIcon };
  
  switch (taskType) {
    // Development task types
    case 'build':
      return <BuildTool {...iconProps} />;
    case 'create':
      return <Add {...iconProps} />;
    case 'edit':
      return <Edit {...iconProps} />;
    case 'update':
      return <Renew {...iconProps} />;
    case 'run':
      return <Run {...iconProps} />;
    case 'test':
      return <TestTool {...iconProps} />;
    case 'deploy':
      return <Rocket {...iconProps} />;
    case 'misc':
      return <Misuse {...iconProps} />;
    
    // Reasoning task types
    case 'thinking':
      return <Idea {...iconProps} />;
    case 'analyzing':
      return <Inspection {...iconProps} />;
    case 'searching':
      return <Search {...iconProps} />;
    case 'reviewing':
      return <View {...iconProps} />;
    case 'validating':
      return <Checkmark {...iconProps} />;
    case 'planning':
      return <Flow {...iconProps} />;
    case 'executing':
      return <Task {...iconProps} />;
    case 'reasoning':
      return <Watson {...iconProps} />;
    
    default:
      return null;
  }
};