/**
 * @license
 *
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState } from 'react';
import { TaskDrawer } from '../components/TaskDrawer';
import '../components/task-drawer.scss';
import { useTaskMutation } from '../components/hooks/use-task-mutation';
import mdx from './TaskDrawer.mdx';

export default {
  title: 'Components/TaskDrawer',
  component: TaskDrawer,
  parameters: {
    layout: 'padded',
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    planStatus: {
      control: 'select',
      options: [
        'generating',
        'updating',
        'paused',
        'executing',
        'complete',
        'failed',
      ],
    },
    defaultExpanded: {
      control: 'boolean',
    },
    autoExpandOnGenerated: {
      control: 'boolean',
    },
  },
};

const sampleTasks = [
  { id: 'task-1', label: 'Set up project scaffolding', status: 'complete' },
  { id: 'task-2', label: 'Configure CI pipeline', status: 'complete' },
  { id: 'task-3', label: 'Implement authentication module', status: 'in_progress' },
  { id: 'task-4', label: 'Write unit tests for auth', status: 'queued' },
  { id: 'task-5', label: 'Create API documentation', status: 'queued' },
  { id: 'task-6', label: 'Deploy to staging environment', status: 'queued' },
];

const generatingTasks = [
  { id: 'task-1', label: '', status: 'generating' },
  { id: 'task-2', label: '', status: 'generating' },
  { id: 'task-3', label: '', status: 'generating' },
  { id: 'task-4', label: '', status: 'generating' },
];

const completeTasks = [
  { id: 'task-1', label: 'Set up project scaffolding', status: 'complete' },
  { id: 'task-2', label: 'Configure CI pipeline', status: 'complete' },
  { id: 'task-3', label: 'Implement authentication module', status: 'complete' },
  { id: 'task-4', label: 'Write unit tests for auth', status: 'complete' },
  { id: 'task-5', label: 'Create API documentation', status: 'complete' },
];

const mixedStatusTasks = [
  { id: 'task-1', label: 'Set up project scaffolding', status: 'complete' },
  { id: 'task-2', label: 'Configure CI pipeline', status: 'complete' },
  { id: 'task-3', label: 'Implement authentication module', status: 'error' },
  { id: 'task-4', label: 'Write unit tests for auth', status: 'recovery' },
  { id: 'task-5', label: 'Create API documentation', status: 'awaiting_input' },
  { id: 'task-6', label: 'Deploy to staging environment', status: 'queued' },
  { id: 'task-7', label: 'Run integration tests', status: 'queued' },
];

const mutationTasks = [
  { id: 'task-1', label: 'Set up project scaffolding', status: 'complete' },
  { id: 'task-2', label: 'Configure CI pipeline', status: 'in_progress' },
  { id: 'task-3', label: 'Implement authentication module', status: 'queued' },
  { id: 'task-4', label: 'Write unit tests for auth', status: 'queued' },
  { id: 'task-5', label: 'Update API documentation', status: 'queued' },
  { id: 'task-6', label: 'Deploy to staging environment', status: 'queued' },
];

/**
 * Default collapsed TaskDrawer with tasks in various statuses.
 */
export const Default = {
  args: {
    tasks: sampleTasks,
    title: 'Implementation plan',
    preview: 'Setting up the project with authentication and CI/CD pipeline.',
    planStatus: 'executing',
  },
};

/**
 * TaskDrawer pre-expanded to show the full task list on mount.
 */
export const Expanded = {
  args: {
    tasks: sampleTasks,
    title: 'Implementation plan',
    preview: 'Setting up the project with authentication and CI/CD pipeline.',
    planStatus: 'executing',
    defaultExpanded: true,
  },
};

/**
 * TaskDrawer in the generating state — tasks show skeleton loading.
 */
export const Generating = {
  args: {
    tasks: generatingTasks,
    title: 'Generating plan',
    preview: 'Analyzing requirements and creating an implementation plan…',
    planStatus: 'generating',
    defaultExpanded: true,
  },
};

/**
 * TaskDrawer with all tasks complete. Shows Review and Dismiss actions.
 */
export const Complete = {
  render: function RenderComplete(args) {
    const [visible, setVisible] = useState(true);

    if (!visible) {
      return (
        <button onClick={() => setVisible(true)}>
          Show drawer again
        </button>
      );
    }

    return (
      <TaskDrawer
        {...args}
        onReview={() => console.log('Review clicked')}
        onDismiss={() => setVisible(false)}
      />
    );
  },
  args: {
    tasks: completeTasks,
    title: 'Plan complete',
    preview: 'All tasks have been completed successfully.',
    planStatus: 'complete',
    defaultExpanded: true,
  },
};

/**
 * TaskDrawer showing mixed task statuses including errors and recovery.
 */
export const MixedStatuses = {
  args: {
    tasks: mixedStatusTasks,
    title: 'Implementation plan',
    preview: 'Some tasks need attention — review errors below.',
    planStatus: 'paused',
    defaultExpanded: true,
  },
};

/**
 * TaskDrawer showing mutation tags (new, updated, dropped) on queued tasks.
 */
export const WithMutations = {
  render: function RenderWithMutations(args) {
    const { mutations, mutateTasks } = useTaskMutation(args.tasks);

    React.useEffect(() => {
      mutateTasks([
        { id: 'task-3', type: 'new' },
        { id: 'task-5', type: 'updated' },
        { id: 'task-6', type: 'dropped' },
      ]);
    }, []);

    return <TaskDrawer {...args} mutations={mutations} />;
  },
  args: {
    tasks: mutationTasks,
    title: 'Updated plan',
    preview: 'Plan has been revised — review the changes below.',
    planStatus: 'updating',
    defaultExpanded: true,
  },
};
