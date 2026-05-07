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
        component:
          'CondensedAttribute displays attribute values in a clean and readable format with expandable field lists.',
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

const sampleAddress = [
  {
    fieldLabel: 'Address line 1',
    fieldValue: {
      string: '11501 Burnet Road',
      segments: [{ segment: '11501 Burnet Road', comparison: 'isSame' }],
    },
    delimiter: ' ',
  },
  {
    fieldLabel: 'Address line 2',
    fieldValue: {
      string: 'Building 903, Floor 7',
      segments: [{ segment: 'Building 903, Floor 7', comparison: 'isSame' }],
    },
    delimiter: ', ',
  },
  {
    fieldLabel: 'City',
    fieldValue: {
      string: 'Austin',
      segments: [{ segment: 'Austin', comparison: 'isSame' }],
    },
    delimiter: ', ',
  },
  {
    fieldLabel: 'State/Provence',
    fieldValue: {
      string: 'TX',
      segments: [{ segment: 'TX', comparison: 'isSame' }],
    },
    delimiter: ' ',
  },
  {
    fieldLabel: 'Postal Code',
    fieldValue: {
      string: '78758',
      segments: [{ segment: '78758', comparison: 'isSame' }],
    },
  },
  {
    fieldLabel: 'Country',
    fieldValue: {
      string: 'United states',
      segments: [{ segment: 'United states', comparison: 'isSame' }],
    },
  },
];

export const ComplexAttribute = Template.bind({});
ComplexAttribute.storyName = 'Complex • Default';
ComplexAttribute.args = {
  attribute: {
    displayLabel: 'Business Address',
    type: 'Address',
    kind: 'complex',
  },
  fields: sampleAddress,
  delimiter: ', ',
  openByDefault: false,
};

export const ComplexAttributeOpen = Template.bind({});
ComplexAttributeOpen.storyName = 'Complex • Open on load';
ComplexAttributeOpen.args = {
  attribute: {
    displayLabel: 'Legal name',
    type: 'Name',
    kind: 'complex',
  },
  fields: [
    {
      fieldLabel: 'Generation',
      fieldValue: {
        string: '',
        segments: [],
      },
      delimiter: ' ',
    },
    {
      fieldLabel: 'Prefix',
      fieldValue: {
        string: '',
        segments: [],
      },
      delimiter: ', ',
    },
    {
      fieldLabel: 'Given Name',
      fieldValue: {
        string: 'Carl',
        segments: [{ segment: 'Carl', comparison: 'isSame' }],
      },
      delimiter: ', ',
    },
    {
      fieldLabel: 'Middle Name',
      fieldValue: {
        string: '',
        segments: [],
      },
      delimiter: ' ',
    },
    {
      fieldLabel: 'Last Lame',
      fieldValue: {
        string: 'Robertson',
        segments: [{ segment: 'Robertson', comparison: 'isSame' }],
      },
    },
    {
      fieldLabel: 'Suffix',
      fieldValue: {
        string: 'Jr.',
        segments: [
          { segment: 'J', comparison: 'isDifferent' },
          { segment: 'r.', comparison: 'isSame' },
        ],
      },
    },
    {
      fieldLabel: 'Full Name',
      fieldValue: {
        string: '',
        segments: [],
      },
    },
  ],
  delimiter: ', ',
  openByDefault: true,
};

export const ComplexAttributeNotGoverned = Template.bind({});
ComplexAttributeNotGoverned.storyName = 'Complex (No Governance)';
ComplexAttributeNotGoverned.args = {
  attribute: {
    displayLabel: 'Legal name',
    type: 'Name',
    kind: 'complex',
    hasOverlay: false,
    isGoverned: false,
  },
  fields: [
    {
      fieldLabel: 'Generation',
      fieldValue: {
        string: '',
        segments: [],
      },
      delimiter: ' ',
      hasOverlay: false,
      isGoverned: false,
    },
    {
      fieldLabel: 'Prefix',
      fieldValue: {
        string: '',
        segments: [],
      },
      delimiter: ', ',
      hasOverlay: false,
      isGoverned: false,
    },
    {
      fieldLabel: 'Given Name',
      fieldValue: {
        string: 'Carl',
        segments: [{ segment: 'Carl', comparison: 'isSame' }],
      },
      delimiter: ', ',
      hasOverlay: false,
      isGoverned: false,
    },
    {
      fieldLabel: 'Middle Name',
      fieldValue: {
        string: '',
        segments: [],
      },
      delimiter: ' ',
      hasOverlay: false,
      isGoverned: false,
    },
    {
      fieldLabel: 'Last Lame',
      fieldValue: {
        string: 'Robertson',
        segments: [{ segment: 'Robertson', comparison: 'isSame' }],
      },
      hasOverlay: false,
      isGoverned: false,
    },
    {
      fieldLabel: 'Suffix',
      fieldValue: {
        string: 'Jr.',
        segments: [
          { segment: 'J', comparison: 'isDifferent' },
          { segment: 'r.', comparison: 'isSame' },
        ],
      },
      hasOverlay: false,
      isGoverned: false,
    },
    {
      fieldLabel: 'Full Name',
      fieldValue: {
        string: '',
        segments: [],
      },
      hasOverlay: false,
      isGoverned: false,
    },
  ],
  openByDefault: true,
};

export const ComplexAttributePartiallyGoverned = Template.bind({});
ComplexAttributePartiallyGoverned.storyName = 'Complex (Partial Governance)';
ComplexAttributePartiallyGoverned.args = {
  attribute: {
    displayLabel: 'Legal name',
    type: 'Name',
    kind: 'complex',
    hasOverlay: false,
    isGoverned: 'partial',
  },
  fields: [
    {
      fieldLabel: 'Generation',
      fieldValue: {
        string: '',
        segments: [],
      },
      delimiter: ' ',
      hasOverlay: false,
      isGoverned: false,
    },
    {
      fieldLabel: 'Prefix',
      fieldValue: {
        string: '',
        segments: [],
      },
      delimiter: ', ',
      hasOverlay: false,
      isGoverned: false,
    },
    {
      fieldLabel: 'Given Name',
      fieldValue: {
        string: 'XXXXXX',
        segments: [],
      },
      delimiter: ', ',
      hasOverlay: false,
      isGoverned: 'full',
    },
    {
      fieldLabel: 'Middle Name',
      fieldValue: {
        string: '',
        segments: [],
      },
      delimiter: ' ',
      hasOverlay: false,
      isGoverned: false,
    },
    {
      fieldLabel: 'Last Lame',
      fieldValue: {
        string: 'Robertson',
        segments: [{ segment: 'Robertson', comparison: 'isSame' }],
      },
      hasOverlay: false,
      isGoverned: false,
    },
    {
      fieldLabel: 'Suffix',
      fieldValue: {
        string: 'Jr.',
        segments: [
          { segment: 'J', comparison: 'isDifferent' },
          { segment: 'r.', comparison: 'isSame' },
        ],
      },
      hasOverlay: false,
      isGoverned: false,
    },
    {
      fieldLabel: 'Full Name',
      fieldValue: {
        string: '',
        segments: [],
      },
      hasOverlay: false,
      isGoverned: false,
    },
  ],
  openByDefault: true,
};

export const ComplexAttributeFullyGoverned = Template.bind({});
ComplexAttributeFullyGoverned.storyName = 'Complex (Full Governance)';
ComplexAttributeFullyGoverned.args = {
  attribute: {
    displayLabel: 'Legal name',
    type: 'Name',
    kind: 'complex',
    hasOverlay: false,
    isGoverned: 'full',
  },
  fields: [
    {
      fieldLabel: 'Generation',
      fieldValue: {
        string: '',
        segments: [],
      },
      delimiter: ' ',
      hasOverlay: false,
      isGoverned: 'full',
    },
    {
      fieldLabel: 'Prefix',
      fieldValue: {
        string: '',
        segments: [],
      },
      delimiter: ', ',
      hasOverlay: false,
      isGoverned: 'full',
    },
    {
      fieldLabel: 'Given Name',
      fieldValue: {
        string: 'XXXXXXXXX',
        segments: [],
      },
      delimiter: ', ',
      hasOverlay: false,
      isGoverned: 'full',
    },
    {
      fieldLabel: 'Middle Name',
      fieldValue: {
        string: '',
        segments: [],
      },
      delimiter: ' ',
      hasOverlay: false,
      isGoverned: 'full',
    },
    {
      fieldLabel: 'Last Lame',
      fieldValue: {
        string: 'XXXXXXXXX',
        segments: [],
      },
      hasOverlay: false,
      isGoverned: 'full',
    },
    {
      fieldLabel: 'Suffix',
      fieldValue: {
        string: 'XXXX',
        segments: [],
      },
      hasOverlay: false,
      isGoverned: 'full',
    },
    {
      fieldLabel: 'Full Name',
      fieldValue: {
        string: '',
        segments: [],
      },
      hasOverlay: false,
      isGoverned: 'full',
    },
  ],
  openByDefault: true,
};

export const ComplexAttributeWithOverlay = Template.bind({});
ComplexAttributeWithOverlay.storyName = 'Complex (With Overlay)';
ComplexAttributeWithOverlay.args = {
  attribute: {
    displayLabel: 'Legal name',
    type: 'Name',
    kind: 'complex',
    hasOverlay: true,
    isGoverned: false,
  },
  fields: [
    {
      fieldLabel: 'Generation',
      fieldValue: {
        string: '',
        segments: [],
      },
      delimiter: ' ',
      hasOverlay: false,
      isGoverned: false,
    },
    {
      fieldLabel: 'Prefix',
      fieldValue: {
        string: '',
        segments: [],
      },
      delimiter: ', ',
      hasOverlay: false,
      isGoverned: false,
    },
    {
      fieldLabel: 'Given Name',
      fieldValue: {
        string: 'Carl',
        segments: [{ segment: 'Carl', comparison: 'isSame' }],
      },
      delimiter: ', ',
      hasOverlay: false,
      isGoverned: false,
    },
    {
      fieldLabel: 'Middle Name',
      fieldValue: {
        string: '',
        segments: [],
      },
      delimiter: ' ',
      hasOverlay: false,
      isGoverned: false,
    },
    {
      fieldLabel: 'Last Lame',
      fieldValue: {
        string: 'Robertson',
        segments: [{ segment: 'Robertson', comparison: 'isSame' }],
      },
      hasOverlay: false,
      isGoverned: false,
    },
    {
      fieldLabel: 'Suffix',
      fieldValue: {
        string: 'Jr.',
        segments: [
          { segment: 'J', comparison: 'isDifferent' },
          { segment: 'r.', comparison: 'isSame' },
        ],
      },
      hasOverlay: true,
      isGoverned: false,
    },
    {
      fieldLabel: 'Full Name',
      fieldValue: {
        string: '',
        segments: [],
      },
      hasOverlay: false,
      isGoverned: false,
    },
  ],
  openByDefault: true,
};

// Made with Bob
