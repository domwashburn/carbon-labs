/**
 * Shared types and interfaces for InlineReasoningTrace component
 */

export type TaskType =
  | 'build'
  | 'create'
  | 'edit'
  | 'update'
  | 'run'
  | 'test'
  | 'deploy'
  | 'misc'
  | 'thinking'
  | 'analyzing'
  | 'searching'
  | 'reviewing'
  | 'validating'
  | 'planning'
  | 'executing'
  | 'reasoning';

export interface StepType {
  stepLabel: string;
  stepContent: React.ReactNode; // Flexible content - can be string, JSX, or any React node
  delimiter?: string;
  hasOverlay?: boolean;
  isGoverned?: string | boolean;
  taskType?: TaskType;
  customIcon?: React.ReactNode;
  isProcessing?: boolean;
}

export interface InlineReasoningTraceProps {
  steps: StepType[];
  triggerText: string; // Simple string for the collapsed summary
  openByDefault?: boolean;
  initialVisibleSteps?: number; // Number of steps to show initially (default: 5)
  showAllStepsByDefault?: boolean; // Whether to show all steps when opening (default: false)
  allowStepCollapse?: boolean; // Whether to allow collapsing steps when all are shown (default: true)
  isProcessing?: boolean; // Whether the trace is in processing state
  currentProcessingStepIndex?: number; // Index of the currently processing step
  animationMode?: 'fade' | 'flip'; // Animation mode for processing state transitions (default: 'flip')
}

export interface IconIndicatorsProps {
  value: StepType;
}

export interface StepTitleProps {
  label: string;
  taskType?: TaskType;
  customIcon?: React.ReactNode;
  isProcessing?: boolean;
}

export interface StepListProps {
  steps: StepType[];
  isExpanded?: boolean;
  isExiting?: boolean;
  shouldAnimate?: boolean;
  isInitialRender?: boolean;
  initialVisibleSteps?: number;
  showAllStepsByDefault?: boolean;
  allowStepCollapse?: boolean;
  isProcessing?: boolean;
  currentProcessingStepIndex?: number;
  animationMode?: 'fade' | 'flip';
}

export interface StepProps {
  step: StepType;
  index: number;
  shouldAnimate?: boolean;
  isExiting?: boolean;
  isNotLast?: boolean;
  animationDelay?: number;
  isHidden?: boolean;
  isProcessing?: boolean;
  currentProcessingStepIndex?: number;
}

export interface StepContentProps {
  content: React.ReactNode;
  isExpanded: boolean;
  hasOverflow: boolean;
}

export interface ProcessingLabelProps {
  step: StepType;
  animationMode: 'fade' | 'flip';
}