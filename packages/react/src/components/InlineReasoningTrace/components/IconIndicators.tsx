import React from 'react';
import { Rule, RulePartial, WarningAlt } from '@carbon/icons-react';
import type { IconIndicatorsProps } from '../types';

/**
 * IconIndicators component
 * 
 * Displays warning and governance icons for a step based on its properties.
 */
export const IconIndicators: React.FC<IconIndicatorsProps> = ({ value }) => {
  return (
    <>
      {value.hasOverlay && <WarningAlt key="warning" />}
      {value.isGoverned === "full" ? <Rule key="rule-full" /> : null}
      {value.isGoverned === "partial" ? <RulePartial key="rule-partial" /> : null}
    </>
  );
};