# InlineReasoningTrace Component

## Overview

The `InlineReasoningTrace` component is an extension of the `CondensedAttribute`
component, specifically designed to display AI reasoning steps in a clean,
hierarchical format. Each accordion item represents a reasoning step that can be
expanded to show detailed content.

## Key Features

### 0. **Processing State** ⭐ NEW

- **Real-time Processing Indicator**: Shows which step is currently being
  processed
- **Collapsed Processing View**: When collapsed, displays the current processing
  step's label below the trigger
- **Two Animation Modes**:
  - **FLIP Mode** (default): Advanced FLIP technique for smooth position-based
    animation between expanded/collapsed states
  - **Fade Mode**: Simple fade in/out transition for the processing label when a
    fallback is needed
- **Visual Feedback**: Processing steps show gradient animation on their labels
- **Seamless Transitions**: Smooth animations when toggling between
  expanded/collapsed states during processing

### 1. **Semantic Naming**

- `trace` instead of `attribute` - represents the reasoning trace metadata
- `steps` instead of `fields` - array of reasoning steps
- `stepLabel` instead of `fieldLabel` - label for each reasoning step
- `stepContent` instead of `fieldValue` - content of each reasoning step

### 2. **Step Visibility Management**

- **Individual Step Expansion**: Reasoning steps are automatically clamped to 3
  lines using CSS
- Steps with overflow display a "Show more/Show less" toggle button
- Each step can be independently expanded/collapsed
- **List-Level Pagination**: Configurable number of initially visible steps
  (default: 5)
- A "Show X more steps" link appears as a list item to reveal remaining steps
- Users can collapse back to the initial visible steps with a "Show less" link
- **Flexible Configuration**:
  - Set custom initial visible steps count via `initialVisibleSteps` prop
  - Show all steps by default with `showAllStepsByDefault={true}`
  - Disable collapse functionality with `allowStepCollapse={false}` for
    always-expanded view

### 3. **Visual Hierarchy**

- Maintains the nested indicator system from CondensedAttribute
- Tree-like structure shows relationships between steps
- Expandable/collapsible accordion behavior

### 4. **Comparison Support**

- Integrates with `ComparisonString` component
- Supports highlighting differences in reasoning steps
- Useful for comparing different reasoning paths

### 5. **Governance Indicators**

- Supports full, partial, or no governance indicators
- Warning overlays for problematic steps
- Visual icons (Rule, RulePartial, WarningAlt) from Carbon Design System

## Component Structure

```
InlineReasoningTrace/
├── InlineReasoningTrace.tsx       # Main component with TypeScript types
├── inlineReasoningTrace.module.scss  # Styling with 4-line clamp
├── index.ts                       # Export file
└── README.md                      # This file
```

## Usage

### Basic Usage

```tsx
import InlineReasoningTrace from './components/InlineReasoningTrace';

const steps = [
  {
    stepLabel: 'Step 1: Initial Analysis',
    stepContent: 'Analyzing the input data...',
  },
  {
    stepLabel: 'Step 2: Pattern Recognition',
    stepContent: 'Identified three distinct patterns...',
  },
  // ... more steps
];

<InlineReasoningTrace
  triggerText="5 reasoning steps"
  steps={steps}
  openByDefault={false}
/>;
```

### Configuration Examples

**Default behavior (5 steps with show more):**

```tsx
<InlineReasoningTrace
  triggerText="10 reasoning steps"
  steps={steps}
  openByDefault={true}
/>
```

**Custom initial visible steps (show 3 initially):**

```tsx
<InlineReasoningTrace
  triggerText="10 reasoning steps"
  steps={steps}
  openByDefault={true}
  initialVisibleSteps={3}
/>
```

**Show all steps by default with collapse option:**

```tsx
<InlineReasoningTrace
  triggerText="10 reasoning steps (all visible)"
  steps={steps}
  openByDefault={true}
  showAllStepsByDefault={true}
  allowStepCollapse={true}
/>
```

**Always show all steps (no collapse):**

```tsx
<InlineReasoningTrace
  triggerText="10 reasoning steps (always expanded)"
  steps={steps}
  openByDefault={true}
  showAllStepsByDefault={true}
  allowStepCollapse={false}
/>
```

## Props

### InlineReasoningTraceProps

- `steps: StepType[]` - Array of reasoning steps
- `triggerText: string` - Text to display in the collapsed trigger button
- `openByDefault?: boolean` - Whether to show expanded on load (default: false)
- `initialVisibleSteps?: number` - Number of steps to show initially before
  "Show more" (default: 5)
- `showAllStepsByDefault?: boolean` - Whether to show all steps when opening the
  trace (default: false)
- `allowStepCollapse?: boolean` - Whether to allow collapsing steps when all are
  shown (default: true)
- `isProcessing?: boolean` - Whether the trace is in processing state (default:
  false)
- `currentProcessingStepIndex?: number` - Index of the currently processing step
  (default: 0)
- `animationMode?: 'fade' | 'flip'` - Animation mode for processing state
  transitions (default: 'flip')

### TraceType

- `displayLabel: string` - Display name for the trace
- `type: string` - Type of reasoning (e.g., "Analytical", "Decision")
- `kind?: string` - Kind of trace (e.g., "reasoning")
- `hasOverlay?: boolean` - Show warning overlay
- `isGoverned?: string | boolean` - Governance level ("full", "partial", false)

### StepType

- `stepLabel: string` - Label for the reasoning step
- `stepContent: React.ReactNode` - Content of the step (can be string, JSX, or
  any React node)
- `delimiter?: string` - Custom delimiter for this step
- `hasOverlay?: boolean` - Show warning overlay for this step
- `isGoverned?: string | boolean` - Governance level for this step
- `taskType?: TaskType` - Type of task (shows corresponding icon)
- `customIcon?: React.ReactNode` - Custom icon to display instead of task type
  icon
- `isProcessing?: boolean` - Whether this individual step is processing (shows
  gradient animation)

### StepContentType

- `string: string` - Plain text content
- `segments: SegmentType[]` - Segmented content for comparison highlighting

## Processing State

### Animation Modes

#### FLIP Mode (Default)

Uses the FLIP (First, Last, Invert, Play) technique for buttery-smooth
position-based animations:

- **First**: Captures initial position of the element
- **Last**: Moves element to final position
- **Invert**: Applies transform to make it appear in first position
- **Play**: Animates transform back to 0

Benefits:

- 60fps GPU-accelerated animations
- Smooth visual continuity as labels move between positions
- Natural feel when toggling between expanded/collapsed states

```tsx
<InlineReasoningTrace
  triggerText="AI reasoning in progress"
  steps={steps}
  isProcessing={true}
  currentProcessingStepIndex={2}
  // animationMode="flip" is the default, no need to specify
/>
```

#### Fade Mode (Alternative)

Simple and performant fade in/out transition:

- Processing label fades in below the collapsed trigger
- Smooth opacity and slight vertical translation
- Best for: simpler fallback use cases

```tsx
<InlineReasoningTrace
  triggerText="AI reasoning in progress"
  steps={steps}
  isProcessing={true}
  currentProcessingStepIndex={2}
  animationMode="fade"
/>
```

### FLIP Resources

- [CSS-Tricks: FLIP Technique](https://css-tricks.com/animating-layouts-with-the-flip-technique/)
- [Paul Lewis: FLIP Your Animations](https://aerotwist.com/blog/flip-your-animations/)
- [GSAP Flip Plugin](https://gsap.com/docs/v3/Plugins/Flip/)

## Storybook Stories

The component includes comprehensive Storybook stories demonstrating:

- **Default**: Basic reasoning trace (collapsed by default)
- **Open on load**: Reasoning trace expanded on load
- **With Long Step**: Long reasoning steps with "Show more" functionality
- **Governed Step**: Governance variations (none, partial, full)
- **With Status Icon**: Warning overlays for problematic steps
- **Many Steps**: Show more/less functionality with 10 steps
- **Show All by Default**: All steps visible with collapse option
- **Show All (No Collapse)**: All steps always visible, no collapse button
- **Custom Initial Steps**: Custom number of initially visible steps (3 instead
  of 5)
- **Processing (Collapsed)**: Processing state with FLIP animation (default)
  when collapsed
- **Processing (Expanded)**: Processing state with FLIP animation (default) when
  expanded
- **Processing (Collapsed, Explicit FLIP)**: Processing state with FLIP
  explicitly configured when collapsed
- **Processing (Expanded, Explicit FLIP)**: Processing state with FLIP
  explicitly configured when expanded
- **Processing (Collapsed, Fade)**: Alternative fade animation when collapsed
- **Processing (Expanded, Fade)**: Alternative fade animation when expanded
- **Processing First Step**: Edge case testing with first step processing
- **Processing Last Step**: Edge case testing with last step processing
- **FLIP vs Fade Comparison**: Side-by-side comparison of FLIP and fade behavior

Access stories at: `src/stories/InlineReasoningTrace.stories.ts`

## Differences from CondensedAttribute

| Feature    | CondensedAttribute             | InlineReasoningTrace            |
| ---------- | ------------------------------ | ------------------------------- |
| Purpose    | Display attribute fields       | Display reasoning steps         |
| Naming     | fields, fieldLabel, fieldValue | steps, stepLabel, stepContent   |
| Line Limit | 2 lines (fixed)                | 4 lines with "Show more" toggle |
| Expansion  | Accordion only                 | Accordion + per-step expansion  |
| Use Case   | Data attributes                | AI reasoning traces             |

## Styling

The component uses Carbon Design System tokens and follows the same visual
patterns as CondensedAttribute:

- IBM Plex Sans font family
- Carbon spacing and color tokens
- Nested tree indicators
- Hover and focus states

### Key Style Classes

- `.reasoningTraceList` - Main container
- `.stepListContent` - Step content wrapper (column layout)
- `.stepName` - Step label (bold, primary text)
- `.stepValue` - Step content
- `.stepValueClamped` - 4-line clamp applied
- `.showMoreButton` - Toggle button for long content

## Future Enhancements

Potential additions for future versions:

- Timestamp display for each step
- Confidence scores visualization
- Step numbering (automatic)
- Nested sub-steps support
- Export/copy reasoning trace functionality
- Search/filter within reasoning steps
