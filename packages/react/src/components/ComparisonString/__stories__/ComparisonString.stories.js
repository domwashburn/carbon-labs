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

export const Default = Template.bind({});
Default.args = {
  segmentedString: [
    { segment: 'Hello', comparison: 'isSame' },
    { segment: ' ', comparison: 'isSame' },
    { segment: 'World', comparison: 'isDifferent' },
  ],
  compareMode: false,
  highlightIsSame: false,
  highlightIsDifferent: false,
};

export const CompareMode = Template.bind({});
CompareMode.args = {
  segmentedString: [
    { segment: 'Hello', comparison: 'isSame' },
    { segment: ' ', comparison: 'isSame' },
    { segment: 'World', comparison: 'isDifferent' },
  ],
  compareMode: true,
  highlightIsSame: false,
  highlightIsDifferent: false,
};

export const HighlightSame = Template.bind({});
HighlightSame.args = {
  segmentedString: [
    { segment: 'Hello', comparison: 'isSame' },
    { segment: ' ', comparison: 'isSame' },
    { segment: 'World', comparison: 'isDifferent' },
  ],
  compareMode: true,
  highlightIsSame: true,
  highlightIsDifferent: false,
};

export const HighlightDifferent = Template.bind({});
HighlightDifferent.args = {
  segmentedString: [
    { segment: 'Hello', comparison: 'isSame' },
    { segment: ' ', comparison: 'isSame' },
    { segment: 'World', comparison: 'isDifferent' },
  ],
  compareMode: true,
  highlightIsSame: false,
  highlightIsDifferent: true,
};

export const HighlightBoth = Template.bind({});
HighlightBoth.args = {
  segmentedString: [
    { segment: 'Hello', comparison: 'isSame' },
    { segment: ' ', comparison: 'isSame' },
    { segment: 'World', comparison: 'isDifferent' },
  ],
  compareMode: true,
  highlightIsSame: true,
  highlightIsDifferent: true,
};

// Made with Bob
