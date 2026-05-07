/**
 * @license
 *
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { TaskRow } from '../components/TaskRow';
import '../components/task-drawer.scss';

export default {
  title: 'Components/TaskDrawer/TaskRow',
  component: TaskRow,
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: { height: '80px' },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '1rem' }}>
        <div role="list" style={{ width: 480 }}>
          <Story />
        </div>
      </div>
    ),
  ],
};

const makeTask = (status, label = 'Implement authentication module') => ({
  id: 'task-1',
  label,
  status,
});

const baseArgs = {
  index: 0,
  taskCount: 6,
  isCurrent: false,
};

// Valid transitions between task statuses (state machine)
const TRANSITIONS = {
  generating:     ['queued'],
  queued:         ['in_progress'],
  in_progress:    ['awaiting_input', 'updating', 'error', 'complete', 'stopped'],
  awaiting_input: ['in_progress', 'error', 'stopped'],
  updating:       ['in_progress', 'error', 'stopped'],
  error:          ['recovery', 'failed'],
  recovery:       ['in_progress', 'failed'],
  failed:         [],
  stopped:        [],
  complete:       [],
};

const ACTIVE_STATUSES = new Set(['in_progress', 'awaiting_input', 'updating']);

// ── Transition harness ────────────────────────────────────────────────────────

export const TransitionHarness = {
  name: 'Transition Harness',
  parameters: {
    docs: { story: { height: '320px' } },
  },
  render: function Render() {
    const [status, setStatus] = React.useState('generating');
    const [history, setHistory] = React.useState(['generating']);
    const nextStates = TRANSITIONS[status] ?? [];
    const isTerminal = nextStates.length === 0;

    function go(s) {
      setStatus(s);
      setHistory(h => [...h, s]);
    }

    function reset() {
      setStatus('generating');
      setHistory(['generating']);
    }

    return (
      <>
        <TaskRow
          task={{ id: 'harness', label: 'Implement authentication module', status }}
          index={0}
          taskCount={1}
          isCurrent={ACTIVE_STATUSES.has(status)}
        />
        <div style={{
          borderTop: '1px solid var(--cds-border-subtle)',
          padding: '0.75rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <span style={{
              fontSize: '0.6875rem',
              color: 'var(--cds-text-helper)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              {isTerminal ? 'Terminal state' : 'Transition to'}
            </span>
            {!isTerminal && (
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                {nextStates.map(s => (
                  <button
                    key={s}
                    onClick={() => go(s)}
                    style={{
                      padding: '0.25rem 0.75rem',
                      border: '1px solid var(--cds-border-interactive)',
                      borderRadius: '2px',
                      background: 'transparent',
                      color: 'var(--cds-link-primary)',
                      cursor: 'pointer',
                      fontSize: '0.8125rem',
                      fontFamily: 'inherit',
                    }}
                  >
                    {s.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.25rem' }}>
            {history.map((s, i) => (
              <React.Fragment key={i}>
                <span style={{
                  fontSize: '0.75rem',
                  color: i === history.length - 1 ? 'var(--cds-text-primary)' : 'var(--cds-text-secondary)',
                  fontWeight: i === history.length - 1 ? 600 : 400,
                }}>
                  {s.replace(/_/g, ' ')}
                </span>
                {i < history.length - 1 && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)', opacity: 0.5 }}>→</span>
                )}
              </React.Fragment>
            ))}
          </div>

          <button
            onClick={reset}
            style={{
              alignSelf: 'flex-start',
              padding: '0.125rem 0.375rem',
              border: 'none',
              background: 'transparent',
              color: 'var(--cds-text-secondary)',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontFamily: 'inherit',
            }}
          >
            ↺ reset
          </button>
        </div>
      </>
    );
  },
};

// ── Status stories ───────────────────────────────────────────────────────────

export const InProgress = {
  args: {
    ...baseArgs,
    task: makeTask('in_progress'),
    isCurrent: true,
  },
};

export const AwaitingInput = {
  args: {
    ...baseArgs,
    task: makeTask('awaiting_input'),
    isCurrent: true,
  },
};

export const Updating = {
  args: {
    ...baseArgs,
    task: makeTask('updating'),
    isCurrent: true,
  },
};

export const Error = {
  args: {
    ...baseArgs,
    task: makeTask('error'),
  },
};

export const Recovery = {
  args: {
    ...baseArgs,
    task: makeTask('recovery'),
  },
};

export const Stopped = {
  args: {
    ...baseArgs,
    task: makeTask('stopped'),
  },
};

export const Failed = {
  args: {
    ...baseArgs,
    task: makeTask('failed'),
  },
};

export const Complete = {
  args: {
    ...baseArgs,
    task: makeTask('complete'),
  },
};

export const Queued = {
  args: {
    ...baseArgs,
    task: makeTask('queued'),
  },
};

export const Generating = {
  args: {
    ...baseArgs,
    task: makeTask('generating', ''),
  },
};

// ── Mutation stories ─────────────────────────────────────────────────────────

export const MutationNew = {
  args: {
    ...baseArgs,
    task: makeTask('queued'),
    mutation: 'new',
  },
};

export const MutationUpdated = {
  args: {
    ...baseArgs,
    task: makeTask('queued'),
    mutation: 'updated',
  },
};

export const MutationDropped = {
  args: {
    ...baseArgs,
    task: makeTask('queued'),
    mutation: 'dropped',
  },
};
