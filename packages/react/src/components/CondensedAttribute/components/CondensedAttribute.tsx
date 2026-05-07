/**
 * @license
 *
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState, useMemo, useCallback } from 'react';
import cx from 'classnames';
import { DefinitionTooltip } from '@carbon/react';
import { Rule, RulePartial, WarningAlt} from '@carbon/icons-react';
import { ComparisonString } from '../../ComparisonString';
import { usePrefix } from '@carbon-labs/utilities/usePrefix';

const CondensedAttribute = ({ attribute, fields, delimiter = ', ', openByDefault = false, hasOverlay= true }) => {

  const prefix = usePrefix();
  const [isExpanded, setIsExpanded] = openByDefault ? useState(true) : useState(false);

  const triggerText = useMemo(() => {
    return fields.map((field, index) => {
      if (!field.fieldValue.string) {
        return;
      } else {
        const isLastItem = index === fields.length - 1;
        const delimiterToUse = field.delimiter || delimiter;
        return `${field.fieldValue.string}${isLastItem ? '' : delimiterToUse.trim() + ' '}`;}
    }).join('');
  }, [fields, delimiter]);

  const handleToggle = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  return (
    <div className={`${prefix}--condensed-attribute`}>
      <CondensedAttribute.Header attribute={attribute} />
      <button
        className={`${prefix}--condensed-attribute__trigger`}
        aria-expanded={isExpanded}
        onClick={handleToggle}
      >
        <span className={`${prefix}--condensed-attribute__nested-indicator`} />
        <span>{triggerText}</span>
      </button>
      {isExpanded ? <CondensedAttribute.FieldList fields={fields} isExpanded /> : null }
    </div>
  );
};

const CondensedAttributeHeader = ({ attribute, governanceRuleType="partial", Link = {linkLabel: "link"} }) => {
  const prefix = usePrefix();
  return (
    <div className={`${prefix}--condensed-attribute__header-wrapper`}>
      <div className={`${prefix}--condensed-attribute__header-title-group`}>
        <DefinitionTooltip
            openOnHover
            align="bottom"
            tooltipText={`${attribute.type} • attribute type`}
        >
            {attribute.displayLabel}
        </DefinitionTooltip>
        <CondensedAttributeIconIndicators value={attribute} />
      </div>
      { Link && <a href={ Link.path ? Link.path : '#' }>{ Link.linkLabel } </a> }
    </div>
  )
}

const CondensedAttributeIconIndicators = ({value}) => {
  return([
    value.hasOverlay && <WarningAlt />,
    value.isGoverned === "full" ? <Rule /> : null,
    value.isGoverned === "partial" ? <RulePartial /> : null,
  ])
}

const CondensedAttributeFieldList = ({fields, isExpanded}) => {
  const prefix = usePrefix();
  return (
    <div>
      <ul className={cx(`${prefix}--condensed-attribute__list`)}>
        {fields.map((field, index) => <CondensedAttribute.Field field={field} index={index} key={index} /> )}
      </ul>
    </div>
  );
}

const CondensedAttributeField = ({field, index}) => {
  const prefix = usePrefix();
  return (
    <li key={index} className={`${prefix}--condensed-attribute__list-item`}>
      <span className={`${prefix}--condensed-attribute__nested-indicator`} />
      <div className={`${prefix}--condensed-attribute__field-list-content`}>
        <span className={`${prefix}--condensed-attribute__attribute-name`}>{field.fieldLabel}</span>
        <ComparisonString compareMode={true} className={`${prefix}--condensed-attribute__attribute-value`} segmentedString={field.fieldValue.segments} />
      </div>
      <CondensedAttributeIconIndicators value={field} />
    </li>
  );
}

CondensedAttribute.Header = CondensedAttributeHeader;
CondensedAttribute.FieldList = CondensedAttributeFieldList;
CondensedAttribute.Field = CondensedAttributeField;

export {
  CondensedAttribute,
  CondensedAttributeHeader,
  CondensedAttributeFieldList,
  CondensedAttributeField
}
export default CondensedAttribute;
