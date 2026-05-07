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
import styles from './condensed-attribute.scss';

/**
 * CondensedAttribute component
 * 
 * Displays a list of attribute values in a clean and readable format.
 * 
 * @param {object} props
 * @param {string} props.attribute - Attribute name
 * @param {array} props.fields - Array of field objects with label and value
 * @param {string} props.delimiter - Custom delimiter (e.g. ";", or " • ")
 */

const CondensedAttribute = ({ attribute, fields, delimiter = ', ', openByDefault = false, hasOverlay= true }) => {

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
    <div className={styles.attributeValueList}>
      <CondensedAttribute.Header attribute={attribute} />
      <button
        className={styles.trigger}
        aria-expanded={isExpanded}
        onClick={handleToggle}
      >
        <span className={styles.nestedIndicator} />
        <span>{triggerText}</span>
      </button>
      {isExpanded ? <CondensedAttribute.FieldList fields={fields} isExpanded /> : null }
    </div>
  );
};

const CondensedAttributeHeader = ({ attribute, governanceRuleType="partial", Link = {linkLabel: "link"} }) => {
  return (
    <div className={cx(styles.headerWrapper)}>
      <div className={cx(styles.headerTitleGroup)}>
        <DefinitionTooltip
            openOnHover
            align="bottom"
            tooltipText={`${attribute.type} • attribute type`}
        >
            {attribute.displayLabel}
        </DefinitionTooltip>
        <CondensedAttributeIconIndicators value={attribute} />
      </div>
      {/* Render a link in the header if one is passed in */}
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
  return (
    <div className="" >
      <ul className={cx(styles.accordionContent, styles.list)}>
        {fields.map((field, index) => <CondensedAttribute.Field field={field} index={index} /> )}
      </ul>
    </div>
  );
}

const CondensedAttributeField = ({field, index}) => {
  return (
    <li key={index} className={styles.listItem}>
      <span className={styles.nestedIndicator} />
      <div className={styles.fieldListContent}>
        <span className={styles.attributeName}>{field.fieldLabel}</span>
        <ComparisonString compareMode={true} className={styles.attributeValue} segmentedString={field.fieldValue.segments} />
      </div>
      <CondensedAttributeIconIndicators value={field} />
    </li>
  );
}

CondensedAttribute.Header = CondensedAttributeHeader;
CondensedAttribute.FieldList = CondensedAttributeFieldList;
CondensedAttribute.Field = CondensedAttributeField;


export {
  CondensedAttributeHeader,
  CondensedAttributeFieldList,
  CondensedAttributeField
}
export default CondensedAttribute;

// Made with Bob
