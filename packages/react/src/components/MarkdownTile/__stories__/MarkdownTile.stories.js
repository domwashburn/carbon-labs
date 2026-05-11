/**
 * @license
 *
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState } from 'react';
import { Launch } from '@carbon/icons-react';
import mdx from './MarkdownTile.mdx';
import { MarkdownTile } from '../components/MarkdownTile/MarkdownTile';
import '../components/markdown-tile.scss';

const planMarkdown = `## Summary

I'll build the Figma to Bob bridge in three phases. Each phase ships independently and unblocks the next, so the work compounds without blocking on the round-trip stage.

## Key changes

### Phase 1 - MCP wiring

1. Stand up Figma's MCP server inside Bob's runtime
2. Register tool surface for \`get_node\`, \`push_component\`, and \`list_pages\`
3. Verify auth flow with a personal access token

### Phase 2 - Token mapping

- Read Carbon v11 tokens from \`@carbon/themes\`
- Map IBM Design Language type ramp to Figma text styles
- Generate variable collections programmatically

### Phase 3 - Round-tripping

\`\`\`typescript
async function pushComponent(node) {
  const ast = parseJSX(node);
  return figma.createInstance(ast);
}
\`\`\`

> The trickiest part is preserving auto-layout intent across the round trip. Naive translation collapses spacing tokens.

Once all three phases land, natural-language design generation becomes a single-pass operation.`;

const referenceMarkdown = `## Carbon for AI styling notes

Carbon for AI is an extension of the v11 system. It uses light-inspired effects - brightness, glow, gradients - to mark AI presence without requiring a separate theme.

### Token additions

- \`ai-border-strong\` marks strong AI edges
- \`ai-border-start\` and \`ai-border-end\` define gradient endpoints
- \`ai-aura-start\` and \`ai-aura-end\` create the AI signal

### Required affordances

Every AI component should include an embedded AI label, explainability content, and visual differentiation from non-AI variants.`;

const insightMarkdown = `## Three patterns in recent sessions

### Pattern 1 - Image-anchored pivots

The strongest verse-to-chorus transitions plant a concrete visual late in the verse, then the chorus pays it off abstractly.

### Pattern 2 - Tense shift on the lift

Verses sit in past tense, then the pre-chorus jumps to present or imperative.

### Pattern 3 - Pronoun compression

Three pronouns in the verse, one in the chorus. The narrowing forces the listener to fill in who matters.`;

const seededAnnotations = [
  {
    id: 'round-trip-note',
    blockIdx: 8,
    quote: 'preserving auto-layout intent',
    body: 'Call out whether this covers nested auto-layout frames.',
    timestamp: 'Jan 12, 10:42 AM',
  },
];

/**
 * No-op action for visual-only Storybook controls.
 */
const noop = () => {};

/**
 * Render controlled annotations for Storybook.
 *
 * @param {object} props story args
 * @returns {React.ReactElement} rendered story
 */
function ControlledAnnotationsStory(props) {
  const [annotations, setAnnotations] = useState(seededAnnotations);

  return (
    <MarkdownTile
      {...props}
      annotations={annotations}
      onAnnotationsChange={setAnnotations}
    />
  );
}

export default {
  title: 'Components/MarkdownTile',
  component: MarkdownTile,
  parameters: {
    docs: {
      page: mdx,
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '48rem', padding: '3rem' }}>
        <Story />
      </div>
    ),
  ],
};

export const Plan = {
  args: {
    variant: 'plan',
    title: 'Phased Figma to Bob integration',
    subtitle: '3 phases - about 6 weeks',
    content: planMarkdown,
    expandPillLabel: 'Show full plan',
    approveActionLabel: 'Approve plan',
    updateActionLabel: 'Update plan',
    annotatable: true,
    initiallyExpanded: true,
  },
};

export const WithComments = {
  args: {
    ...Plan.args,
    defaultAnnotations: seededAnnotations,
  },
};

export const Reference = {
  args: {
    variant: 'reference',
    title: 'Carbon for AI styling notes',
    subtitle: 'Source: carbondesignsystem.com',
    content: referenceMarkdown,
    expandPillLabel: 'Show full reference',
  },
};

export const Insight = {
  args: {
    variant: 'insight',
    title: 'Pattern analysis',
    subtitle: 'Synthesized from recent sessions',
    content: insightMarkdown,
    expandPillLabel: 'Show full insight',
    secondaryActions: [
      {
        label: 'Open source',
        icon: <Launch />,
        onClick: noop,
      },
    ],
  },
};

export const ControlledAnnotations = {
  /**
   * Render the controlled annotation example.
   *
   * @param {object} args story args
   * @returns {React.ReactElement} rendered story
   */
  render: (args) => <ControlledAnnotationsStory {...args} />,
  args: {
    ...Plan.args,
    title: 'Controlled annotation workflow',
    annotations: seededAnnotations,
  },
};
