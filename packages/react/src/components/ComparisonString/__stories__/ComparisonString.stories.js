/**
 * @license
 *
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { ComparisonString } from '../components/ComparisonString';
import '../components/comparison-string.scss';

export default {
  title: 'Components/ComparisonString',
  component: ComparisonString,
  parameters: {
    docs: {
      description: {
        component: 'ComparisonString displays segmented strings with comparison highlighting.',
      },
    },
  },
  argTypes: {
    compareMode: {
      control: 'boolean',
      description: 'Enable comparison mode styling',
    },
    highlightIsSame: {
      control: 'boolean',
      description: 'Highlight segments that are the same',
    },
    highlightIsDifferent: {
      control: 'boolean',
      description: 'Highlight segments that are different',
    },
  },
};

const Template = (args) => <ComparisonString {...args} />;

const compareValue = [
  { segment: 'BE', comparison: 'isSame' },
  { segment: 'MI', comparison: 'isDifferent' },
  { segment: 'S', comparison: 'isSame' },
];

export const CompareOff = Template.bind({});
CompareOff.storyName = 'Comparison • no highlight';
CompareOff.args = {
  segmentedString: compareValue,
  compareMode: false,
  highlightIsSame: true,
  highlightIsDifferent: true,
};

export const CompareDifferent = Template.bind({});
CompareDifferent.storyName = 'Comparison • Highlight differences';
CompareDifferent.args = {
  segmentedString: [
    { segment: 'BE', comparison: 'isSame' },
    { segment: 'MI', comparison: 'isDifferent' },
    { segment: 'S', comparison: 'isSame' },
  ],
  compareMode: true,
  highlightIsSame: false,
  highlightIsDifferent: true,
};

export const CompareSame = Template.bind({});
CompareSame.storyName = 'Comparison • Highlight similarities';
CompareSame.args = {
  segmentedString: [
    { segment: 'BE', comparison: 'isSame' },
    { segment: 'MI', comparison: 'isDifferent' },
    { segment: 'S', comparison: 'isSame' },
  ],
  compareMode: true,
  highlightIsSame: true,
  highlightIsDifferent: false,
};

export const CompareAll = Template.bind({});
CompareAll.storyName = 'Comparison • Highlight all';
CompareAll.args = {
  segmentedString: [
    { segment: 'BE', comparison: 'isSame' },
    { segment: 'MI', comparison: 'isDifferent' },
    { segment: 'S', comparison: 'isSame' },
  ],
  compareMode: true,
  highlightIsSame: true,
  highlightIsDifferent: true,
};

export const CompareNone = Template.bind({});
CompareNone.storyName = 'Comparison • Highlight neutral';
CompareNone.args = {
  segmentedString: [
    { segment: 'BE', comparison: 'isSame' },
    { segment: 'MI', comparison: 'isDifferent' },
    { segment: 'S', comparison: 'isSame' },
  ],
  compareMode: true,
  highlightIsSame: false,
  highlightIsDifferent: false,
};

export const CompareLong = Template.bind({});
CompareLong.args = {
  segmentedString: [
    { segment: 'this is a ', comparison: 'isSame' },
    { segment: 'really long string ', comparison: 'isDifferent' },
    { segment: 'that should end up wrapping ', comparison: 'isSame' },
    { segment: "if there isn't enough space ", comparison: 'isDifferent' },
  ],
  compareMode: true,
  highlightIsSame: true,
  highlightIsDifferent: true,
};

// Made with Bob
