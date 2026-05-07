/**
 * @license
 *
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { CondensedAttribute } from '../components/CondensedAttribute';
import '../components/condensed-attribute.scss';

export default {
  title: 'Components/CondensedAttribute',
  component: CondensedAttribute,
  parameters: {
    docs: {
      description: {
        component: 'CondensedAttribute displays attribute values in a clean and readable format with expandable field lists.',
      },
    },
  },
  argTypes: {
    openByDefault: {
      control: 'boolean',
      description: 'Whether the field list is expanded by default',
    },
    delimiter: {
      control: 'text',
      description: 'Custom delimiter for separating field values',
    },
  },
};

const Template = (args) => <CondensedAttribute {...args} />;

export const Default = Template.bind({});
Default.args = {
  attribute: {
    displayLabel: 'Customer Name',
    type: 'string',
    hasOverlay: false,
    isGoverned: null,
  },
  fields: [
    {
      fieldLabel: 'First Name',
      fieldValue: {
        string: 'John',
        segments: [{ segment: 'John', comparison: 'isSame' }],
      },
    },
    {
      fieldLabel: 'Last Name',
      fieldValue: {
        string: 'Doe',
        segments: [{ segment: 'Doe', comparison: 'isSame' }],
      },
    },
  ],
  delimiter: ', ',
  openByDefault: false,
};

export const OpenByDefault = Template.bind({});
OpenByDefault.args = {
  attribute: {
    displayLabel: 'Address',
    type: 'string',
    hasOverlay: false,
    isGoverned: null,
  },
  fields: [
    {
      fieldLabel: 'Street',
      fieldValue: {
        string: '123 Main St',
        segments: [{ segment: '123 Main St', comparison: 'isSame' }],
      },
    },
    {
      fieldLabel: 'City',
      fieldValue: {
        string: 'New York',
        segments: [{ segment: 'New York', comparison: 'isSame' }],
      },
    },
    {
      fieldLabel: 'State',
      fieldValue: {
        string: 'NY',
        segments: [{ segment: 'NY', comparison: 'isSame' }],
      },
    },
  ],
  delimiter: ', ',
  openByDefault: true,
};

export const WithGovernance = Template.bind({});
WithGovernance.args = {
  attribute: {
    displayLabel: 'Social Security Number',
    type: 'string',
    hasOverlay: true,
    isGoverned: 'full',
  },
  fields: [
    {
      fieldLabel: 'SSN',
      fieldValue: {
        string: '***-**-1234',
        segments: [{ segment: '***-**-1234', comparison: 'isSame' }],
      },
      hasOverlay: true,
      isGoverned: 'full',
    },
  ],
  delimiter: ', ',
  openByDefault: false,
};

export const WithComparison = Template.bind({});
WithComparison.args = {
  attribute: {
    displayLabel: 'Product Name',
    type: 'string',
    hasOverlay: false,
    isGoverned: 'partial',
  },
  fields: [
    {
      fieldLabel: 'Name',
      fieldValue: {
        string: 'Carbon Design System',
        segments: [
          { segment: 'Carbon', comparison: 'isSame' },
          { segment: ' Design ', comparison: 'isDifferent' },
          { segment: 'System', comparison: 'isSame' },
        ],
      },
    },
    {
      fieldLabel: 'Version',
      fieldValue: {
        string: 'v11.0.0',
        segments: [
          { segment: 'v11', comparison: 'isDifferent' },
          { segment: '.0.0', comparison: 'isSame' },
        ],
      },
    },
  ],
  delimiter: ' • ',
  openByDefault: true,
};

// Made with Bob
