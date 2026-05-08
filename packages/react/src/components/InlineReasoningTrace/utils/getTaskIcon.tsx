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
  Watson,
} from '@carbon/icons-react';
import type { TaskType } from '../types';

export const getTaskIcon = (
  taskType?: TaskType,
  customIcon?: React.ReactNode,
  iconClassName?: string
): React.ReactNode => {
  if (customIcon) {
    return customIcon;
  }

  if (!taskType) {
    return null;
  }

  const iconProps = { size: 16, className: iconClassName };

  switch (taskType) {
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
