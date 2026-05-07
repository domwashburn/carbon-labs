import type {Meta, StoryObj} from '@storybook/react';

import InlineReasoningTrace from '../components/InlineReasoningTrace.js';
import '../components/inline-reasoning-trace.scss';

// ============================================
// SHARED DATA
// ============================================

const sampleReasoningSteps = [
  {
    stepLabel: "Initial Analysis",
    stepContent: "Analyzing the input data to identify key patterns and relationships.",
    delimiter: " "
  },
  {
    stepLabel: "Pattern Recognition",
    stepContent: "Identified three distinct patterns in the dataset that correlate with the expected outcome.",
    delimiter: " "
  },
  {
    stepLabel: "Hypothesis Formation",
    stepContent: "Based on the patterns, formulating a hypothesis that the primary factor is temporal correlation.",
    delimiter: " "
  },
  {
    stepLabel: "Validation",
    stepContent: "Testing the hypothesis against historical data shows 87% accuracy, confirming the temporal correlation theory.",
    delimiter: " "
  },
  {
    stepLabel: "Conclusion",
    stepContent: "The analysis confirms that temporal patterns are the primary driver of the observed behavior.",
  }
]

const longReasoningStep = {
  stepLabel: "Comprehensive Analysis",
  stepContent: "This is a very long reasoning step that contains multiple sentences and detailed explanations. The analysis begins with examining the fundamental assumptions underlying the problem space. We must consider various factors including temporal dynamics, spatial relationships, and causal dependencies. Furthermore, the interaction between these factors creates emergent properties that cannot be understood in isolation. The methodology employed here draws from multiple disciplines including statistics, machine learning, and domain-specific knowledge. Each component of the analysis builds upon previous findings, creating a coherent narrative that leads to actionable insights. The validation process involves cross-referencing with historical data, expert opinions, and theoretical frameworks to ensure robustness of the conclusions.",
}

// ============================================
// IDLE STATE STORIES
// ============================================

const meta: Meta<typeof InlineReasoningTrace> = {
    title: 'Components/InlineReasoningTrace/Idle',
    component: InlineReasoningTrace,
}

export default meta;

type Story = StoryObj<typeof InlineReasoningTrace>;

export const IRT: Story = {
    name: 'Inline Reasoning Trace • Default',
    args: {
      triggerText: "5 reasoning steps",
      steps: sampleReasoningSteps,
      openByDefault: false
    },
  };

  export const IRTOpen: Story = {
    name: 'Inline Reasoning Trace • Open on load',
    args: {
      triggerText: "Decision process with 5 steps",
      steps: sampleReasoningSteps,
      openByDefault: true
    },
  };

  export const IRTWithLongStep: Story = {
    name: 'Inline Reasoning Trace • With Long Step (Show More)',
    args: {
      triggerText: "Comprehensive analysis with long reasoning",
      steps: [
        longReasoningStep,
        {
          stepLabel: "Summary",
          stepContent: "Based on the comprehensive analysis, we can proceed with confidence.",
        }
      ],
      openByDefault: true
    },
  };

export const IRTWithGovernedStep: Story = {
  name: 'Inline Reasoning Trace • Goverened Step',
  args: {
    triggerText: "Controlled analysis with partial governance",
    steps: [
      {
        stepLabel: "Public Analysis",
        stepContent: "This step contains publicly available information.",
        hasOverlay: false,
        isGoverned: false,
      },
      {
        stepLabel: "Restricted Analysis",
        stepContent: "XXXXXXXXXX",
        hasOverlay: false,
        isGoverned: "full",
      },
      {
        stepLabel: "Conclusion",
        stepContent: "Based on both public and restricted data, the conclusion is valid.",
        hasOverlay: false,
        isGoverned: false,
      }
    ],
    openByDefault: true
  }
};

export const IRTWithManySteps: Story = {
  name: 'Inline Reasoning Trace • Many Steps (Show More/Less)',
  args: {
    triggerText: "Analysis with 10 reasoning steps",
    steps: [
      {
        stepLabel: "Step 1: Data Collection",
        stepContent: "Gathering relevant data from multiple sources including databases, APIs, and user inputs.",
      },
      {
        stepLabel: "Step 2: Data Validation",
        stepContent: "Validating the collected data for completeness, accuracy, and consistency.",
      },
      {
        stepLabel: "Step 3: Preprocessing",
        stepContent: "Cleaning and transforming the data into a suitable format for analysis.",
      },
      {
        stepLabel: "Step 4: Feature Extraction",
        stepContent: "Identifying and extracting key features that are relevant to the analysis.",
      },
      {
        stepLabel: "Step 5: Pattern Analysis",
        stepContent: "Analyzing patterns and trends in the extracted features to identify correlations.",
      },
      {
        stepLabel: "Step 6: Hypothesis Formation",
        stepContent: "Formulating hypotheses based on the observed patterns and domain knowledge.",
      },
      {
        stepLabel: "Step 7: Statistical Testing",
        stepContent: "Applying statistical tests to validate the hypotheses and measure significance.",
      },
      {
        stepLabel: "Step 8: Model Building",
        stepContent: "Constructing predictive models based on validated hypotheses and patterns.",
      },
      {
        stepLabel: "Step 9: Validation",
        stepContent: "Testing the models against holdout data to ensure generalization and accuracy.",
      },
      {
        stepLabel: "Step 10: Conclusion",
        stepContent: "Synthesizing findings into actionable insights and recommendations for stakeholders.",
      }
    ],
    openByDefault: true
  }
};

export const IRTWithStatusIcon: Story = {
  name: 'Inline Reasoning Trace • With Status Icon',
  args: {
    triggerText: "Analysis with detected anomalies",
    steps: [
      {
        stepLabel: "Initial Check",
        stepContent: "Initial analysis shows no issues.",
        hasOverlay: false,
        isGoverned: false,
      },
      {
        stepLabel: "Anomaly Detected",
        stepContent: "An anomaly was detected in the data that requires attention.",
        hasOverlay: true,
        isGoverned: false,
      },
      {
        stepLabel: "Resolution",
        stepContent: "The anomaly has been documented for further review.",
        hasOverlay: false,
        isGoverned: false,
      }
    ],
    openByDefault: true
  }
};

export const IRTShowAllByDefault: Story = {
  name: 'Inline Reasoning Trace • Show All Steps by Default',
  args: {
    triggerText: "Analysis with 10 reasoning steps (all visible)",
    steps: [
      {
        stepLabel: "Step 1: Data Collection",
        stepContent: "Gathering relevant data from multiple sources including databases, APIs, and user inputs.",
      },
      {
        stepLabel: "Step 2: Data Validation",
        stepContent: "Validating the collected data for completeness, accuracy, and consistency.",
      },
      {
        stepLabel: "Step 3: Preprocessing",
        stepContent: "Cleaning and transforming the data into a suitable format for analysis.",
      },
      {
        stepLabel: "Step 4: Feature Extraction",
        stepContent: "Identifying and extracting key features that are relevant to the analysis.",
      },
      {
        stepLabel: "Step 5: Pattern Analysis",
        stepContent: "Analyzing patterns and trends in the extracted features to identify correlations.",
      },
      {
        stepLabel: "Step 6: Hypothesis Formation",
        stepContent: "Formulating hypotheses based on the observed patterns and domain knowledge.",
      },
      {
        stepLabel: "Step 7: Statistical Testing",
        stepContent: "Applying statistical tests to validate the hypotheses and measure significance.",
      },
      {
        stepLabel: "Step 8: Model Building",
        stepContent: "Constructing predictive models based on validated hypotheses and patterns.",
      },
      {
        stepLabel: "Step 9: Validation",
        stepContent: "Testing the models against holdout data to ensure generalization and accuracy.",
      },
      {
        stepLabel: "Step 10: Conclusion",
        stepContent: "Synthesizing findings into actionable insights and recommendations for stakeholders.",
      }
    ],
    openByDefault: true,
    showAllStepsByDefault: true,
    allowStepCollapse: true
  }
};

export const IRTShowAllNoCollapse: Story = {
  name: 'Inline Reasoning Trace • Show All Steps (No Collapse)',
  args: {
    triggerText: "Analysis with 10 reasoning steps (always expanded)",
    steps: [
      {
        stepLabel: "Step 1: Data Collection",
        stepContent: "Gathering relevant data from multiple sources including databases, APIs, and user inputs.",
      },
      {
        stepLabel: "Step 2: Data Validation",
        stepContent: "Validating the collected data for completeness, accuracy, and consistency.",
      },
      {
        stepLabel: "Step 3: Preprocessing",
        stepContent: "Cleaning and transforming the data into a suitable format for analysis.",
      },
      {
        stepLabel: "Step 4: Feature Extraction",
        stepContent: "Identifying and extracting key features that are relevant to the analysis.",
      },
      {
        stepLabel: "Step 5: Pattern Analysis",
        stepContent: "Analyzing patterns and trends in the extracted features to identify correlations.",
      },
      {
        stepLabel: "Step 6: Hypothesis Formation",
        stepContent: "Formulating hypotheses based on the observed patterns and domain knowledge.",
      },
      {
        stepLabel: "Step 7: Statistical Testing",
        stepContent: "Applying statistical tests to validate the hypotheses and measure significance.",
      },
      {
        stepLabel: "Step 8: Model Building",
        stepContent: "Constructing predictive models based on validated hypotheses and patterns.",
      },
      {
        stepLabel: "Step 9: Validation",
        stepContent: "Testing the models against holdout data to ensure generalization and accuracy.",
      },
      {
        stepLabel: "Step 10: Conclusion",
        stepContent: "Synthesizing findings into actionable insights and recommendations for stakeholders.",
      }
    ],
    openByDefault: true,
    showAllStepsByDefault: true,
    allowStepCollapse: false
  }
};

export const IRTCustomInitialSteps: Story = {
  name: 'Inline Reasoning Trace • Custom Initial Steps (3)',
  args: {
    triggerText: "Analysis with 10 steps (showing 3 initially)",
    steps: [
      {
        stepLabel: "Step 1: Data Collection",
        stepContent: "Gathering relevant data from multiple sources including databases, APIs, and user inputs.",
      },
      {
        stepLabel: "Step 2: Data Validation",
        stepContent: "Validating the collected data for completeness, accuracy, and consistency.",
      },
      {
        stepLabel: "Step 3: Preprocessing",
        stepContent: "Cleaning and transforming the data into a suitable format for analysis.",
      },
      {
        stepLabel: "Step 4: Feature Extraction",
        stepContent: "Identifying and extracting key features that are relevant to the analysis.",
      },
      {
        stepLabel: "Step 5: Pattern Analysis",
        stepContent: "Analyzing patterns and trends in the extracted features to identify correlations.",
      },
      {
        stepLabel: "Step 6: Hypothesis Formation",
        stepContent: "Formulating hypotheses based on the observed patterns and domain knowledge.",
      },
      {
        stepLabel: "Step 7: Statistical Testing",
        stepContent: "Applying statistical tests to validate the hypotheses and measure significance.",
      },
      {
        stepLabel: "Step 8: Model Building",
        stepContent: "Constructing predictive models based on validated hypotheses and patterns.",
      },
      {
        stepLabel: "Step 9: Validation",
        stepContent: "Testing the models against holdout data to ensure generalization and accuracy.",
      },
      {
        stepLabel: "Step 10: Conclusion",
        stepContent: "Synthesizing findings into actionable insights and recommendations for stakeholders.",
      }
    ],
    openByDefault: true,
    initialVisibleSteps: 3
  }
};

export const IRTWithTaskTypeIcons: Story = {
  name: 'Inline Reasoning Trace • Development Task Icons',
  args: {
    triggerText: "Development workflow with task icons",
    steps: [
      {
        stepLabel: "Build Project",
        stepContent: "Compiling source code and generating build artifacts.",
        taskType: "build"
      },
      {
        stepLabel: "Create Configuration",
        stepContent: "Creating new configuration files for the deployment environment.",
        taskType: "create"
      },
      {
        stepLabel: "Edit Settings",
        stepContent: "Modifying application settings to match production requirements.",
        taskType: "edit"
      },
      {
        stepLabel: "Update Dependencies",
        stepContent: "Updating project dependencies to their latest stable versions.",
        taskType: "update"
      },
      {
        stepLabel: "Run Tests",
        stepContent: "Executing the test suite to verify functionality.",
        taskType: "run"
      },
      {
        stepLabel: "Test Coverage",
        stepContent: "Analyzing test coverage and identifying gaps in testing.",
        taskType: "test"
      },
      {
        stepLabel: "Deploy Application",
        stepContent: "Deploying the application to the production environment.",
        taskType: "deploy"
      },
      {
        stepLabel: "Miscellaneous Tasks",
        stepContent: "Performing additional cleanup and maintenance tasks.",
        taskType: "misc"
      }
    ],
    openByDefault: true
  }
};

export const IRTWithReasoningIcons: Story = {
  name: 'Inline Reasoning Trace • Reasoning Task Icons',
  args: {
    triggerText: "AI reasoning process with cognitive task icons",
    steps: [
      {
        stepLabel: "Initial Thinking",
        stepContent: "Considering the problem space and potential approaches to solve the user's request.",
        taskType: "thinking"
      },
      {
        stepLabel: "Analyzing Requirements",
        stepContent: "Breaking down the requirements into specific, actionable components and identifying dependencies.",
        taskType: "analyzing"
      },
      {
        stepLabel: "Searching Knowledge Base",
        stepContent: "Querying relevant documentation, code examples, and best practices from the knowledge base.",
        taskType: "searching"
      },
      {
        stepLabel: "Planning Approach",
        stepContent: "Developing a step-by-step plan to implement the solution efficiently and correctly.",
        taskType: "planning"
      },
      {
        stepLabel: "Executing Solution",
        stepContent: "Implementing the planned solution with attention to code quality and best practices.",
        taskType: "executing"
      },
      {
        stepLabel: "Reviewing Output",
        stepContent: "Examining the generated solution for correctness, completeness, and potential improvements.",
        taskType: "reviewing"
      },
      {
        stepLabel: "Validating Results",
        stepContent: "Verifying that the solution meets all requirements and handles edge cases appropriately.",
        taskType: "validating"
      },
      {
        stepLabel: "Final Reasoning",
        stepContent: "Synthesizing all steps into a coherent explanation of the solution and its rationale.",
        taskType: "reasoning"
      }
    ],
    openByDefault: true
  }
};

export const IRTWithMixedIcons: Story = {
  name: 'Inline Reasoning Trace • Mixed Icons (Task Types + Status)',
  args: {
    triggerText: "Complex workflow with multiple indicators",
    steps: [
      {
        stepLabel: "Build Application",
        stepContent: "Successfully compiled all source files.",
        taskType: "build",
        hasOverlay: false,
        isGoverned: false
      },
      {
        stepLabel: "Run Security Scan",
        stepContent: "Security vulnerability detected in dependencies.",
        taskType: "run",
        hasOverlay: true,
        isGoverned: false
      },
      {
        stepLabel: "Update Packages",
        stepContent: "Updated vulnerable packages to secure versions.",
        taskType: "update",
        hasOverlay: false,
        isGoverned: false
      },
      {
        stepLabel: "Test Application",
        stepContent: "All tests passed successfully.",
        taskType: "test",
        hasOverlay: false,
        isGoverned: false
      },
      {
        stepLabel: "Deploy to Production",
        stepContent: "XXXXXXXXXX",
        taskType: "deploy",
        hasOverlay: false,
        isGoverned: "full"
      }
    ],
    openByDefault: true
  }
};