import type {Meta, StoryObj} from '@storybook/react';
import React from 'react';

import InlineReasoningTrace from '../components/InlineReasoningTrace.js';
import '../components/inline-reasoning-trace.scss';

// Processing State Stories
// Note: Only the LAST step can be processing (all previous are completed/idle)

const processingSteps = [
  {
    stepLabel: "Understanding Requirements",
    stepContent: "Analyzed the user's request and identified key requirements for the implementation.",
    taskType: "analyzing" as const
  },
  {
    stepLabel: "Searching Documentation",
    stepContent: "Found relevant documentation and code examples in the knowledge base.",
    taskType: "searching" as const
  },
  {
    stepLabel: "Planning Implementation",
    stepContent: "Developed a comprehensive plan with step-by-step implementation details.",
    taskType: "planning" as const
  },
  {
    stepLabel: "Implementing Solution",
    stepContent: "Currently writing code and implementing the planned solution with best practices...",
    taskType: "executing" as const
  },
  {
    stepLabel: "Testing & Validation",
    stepContent: "Will test the implementation once execution is complete.",
    taskType: "validating" as const
  },
  {
    stepLabel: "Final Review",
    stepContent: "Will perform final review and documentation.",
    taskType: "reviewing" as const
  }
];

const meta: Meta<typeof InlineReasoningTrace> = {
  title: 'Components/InlineReasoningTrace/Processing',
  component: InlineReasoningTrace,
}

export default meta;

type Story = StoryObj<typeof InlineReasoningTrace>;

export const ProcessingCollapsed: Story = {
  name: 'Processing (Collapsed)',
  args: {
    triggerText: "AI reasoning in progress (6 steps)",
    steps: processingSteps,
    openByDefault: false,
    isProcessing: true,
    currentProcessingStepIndex: 5, // Only the last step can be processing
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the processing state when collapsed using FLIP animation (default). The current step label appears below the trigger. Toggle to see the smooth FLIP animation as the label moves between positions. Note: Only the last step can be processing.'
      }
    }
  }
};

export const ProcessingExpanded: Story = {
  name: 'Processing (Expanded)',
  args: {
    triggerText: "AI reasoning in progress (6 steps)",
    steps: processingSteps,
    openByDefault: true,
    isProcessing: true,
    currentProcessingStepIndex: 5, // Only the last step can be processing
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the processing state when expanded using FLIP animation (default). The last step displays with a gradient animation. Toggle to collapsed to see the smooth FLIP animation. Note: Only the last step can be processing.'
      }
    }
  }
};

export const ProcessingCollapsedFade: Story = {
  name: 'Processing (Collapsed, Fade Animation)',
  args: {
    triggerText: "AI reasoning in progress (6 steps)",
    steps: processingSteps,
    openByDefault: false,
    isProcessing: true,
    currentProcessingStepIndex: 5, // Only the last step can be processing
    animationMode: 'fade'
  },
  parameters: {
    docs: {
      description: {
        story: 'Alternative fade animation mode. The current step label fades in below the trigger with a simple opacity transition. Note: Only the last step can be processing.'
      }
    }
  }
};

export const ProcessingExpandedFade: Story = {
  name: 'Processing (Expanded, Fade Animation)',
  args: {
    triggerText: "AI reasoning in progress (6 steps)",
    steps: processingSteps,
    openByDefault: true,
    isProcessing: true,
    currentProcessingStepIndex: 5, // Only the last step can be processing
    animationMode: 'fade'
  },
  parameters: {
    docs: {
      description: {
        story: 'Alternative fade animation mode when expanded. Uses simple fade transitions instead of FLIP. Note: Only the last step can be processing.'
      }
    }
  }
};

export const ProcessingFirstStep: Story = {
  name: 'Processing First Step',
  args: {
    triggerText: "AI just started reasoning",
    steps: [
      {
        stepLabel: "Understanding Requirements",
        stepContent: "Currently analyzing the user's request and identifying key requirements...",
        taskType: "analyzing" as const
      }
    ],
    openByDefault: false,
    isProcessing: true,
    currentProcessingStepIndex: 0,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows processing state when on the first (and only) step. The step is currently being processed.'
      }
    }
  }
};

export const ProcessingLastStep: Story = {
  name: 'Processing Last Step',
  args: {
    triggerText: "AI almost done reasoning",
    steps: processingSteps,
    openByDefault: false,
    isProcessing: true,
    currentProcessingStepIndex: 5,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows processing state when on the last step. The final review step is currently processing.'
      }
    }
  }
};

export const AnimationComparison: Story = {
  name: 'Animation Comparison',
  render: () => {
    return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '2rem' } },
      React.createElement('div', null,
        React.createElement('h3', { style: { marginBottom: '1rem' } }, 'FLIP Animation Mode (Default)'),
        React.createElement('p', { style: { marginBottom: '1rem', color: '#525252' } },
          'FLIP technique for smooth position animation. Click to toggle and watch the label smoothly move between positions. Only the last step can be processing.'
        ),
        React.createElement(InlineReasoningTrace, {
          triggerText: "FLIP animation (default, 6 steps)",
          steps: processingSteps,
          openByDefault: false,
          isProcessing: true,
          currentProcessingStepIndex: 5, // Only the last step can be processing
          animationMode: 'flip'
        })
      ),
      React.createElement('div', null,
        React.createElement('h3', { style: { marginBottom: '1rem' } }, 'Fade Animation Mode'),
        React.createElement('p', { style: { marginBottom: '1rem', color: '#525252' } },
          'Alternative fade animation. Click to toggle and see the simpler fade effect. Only the last step can be processing.'
        ),
        React.createElement(InlineReasoningTrace, {
          triggerText: "Fade animation (6 steps)",
          steps: processingSteps,
          openByDefault: false,
          isProcessing: true,
          currentProcessingStepIndex: 5, // Only the last step can be processing
          animationMode: 'fade'
        })
      )
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of both animation modes. FLIP (default) provides smooth position-based animation, while fade offers a simpler alternative. Note: Only the last step can be processing.'
      }
    }
  }
};