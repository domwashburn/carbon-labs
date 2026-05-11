/**
 * @license
 *
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MarkdownTile } from '../components/MarkdownTile/MarkdownTile';

const content = `## Summary

Approve the generated plan.

- First item
- Second item`;

const annotations = [
  {
    id: 'summary-note',
    quote: 'Summary',
    blockIdx: 0,
    body: 'Clarify the plan summary.',
    timestamp: 'Jan 12, 10:42 AM',
  },
];

beforeEach(() => {
  Object.defineProperty(Element.prototype, 'scrollIntoView', {
    configurable: true,
    value: jest.fn(),
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('MarkdownTile', () => {
  it('renders markdown content and title', () => {
    render(
      <MarkdownTile
        content={content}
        title="Generated plan"
        subtitle="Draft"
        initiallyExpanded
      />
    );

    expect(
      screen.getByRole('heading', { name: 'Generated plan' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Summary' })
    ).toBeInTheDocument();
    expect(screen.getByText('First item')).toBeInTheDocument();
  });

  it('toggles expanded state', async () => {
    const user = userEvent.setup();

    render(<MarkdownTile content={content} expandPillLabel="Show full plan" />);

    const toggle = screen.getByRole('button', { name: /show full plan/i });
    await user.click(toggle);

    expect(
      screen.getByRole('button', { name: /collapse/i })
    ).toBeInTheDocument();
  });

  it('calls primary action for plan tiles', async () => {
    const user = userEvent.setup();
    const onPrimaryAction = jest.fn();

    render(
      <MarkdownTile
        content={content}
        onPrimaryAction={onPrimaryAction}
        variant="plan"
      />
    );

    await user.click(screen.getByRole('button', { name: /approve plan/i }));

    expect(onPrimaryAction).toHaveBeenCalledWith([]);
    expect(
      screen.getByRole('button', { name: /approved plan/i })
    ).toBeDisabled();
  });

  it('calls controlled action state changes without mutating approval state', async () => {
    const user = userEvent.setup();
    const onActionStateChange = jest.fn();
    const onPrimaryAction = jest.fn();

    render(
      <MarkdownTile
        actionState="idle"
        annotations={annotations}
        content={content}
        onActionStateChange={onActionStateChange}
        onPrimaryAction={onPrimaryAction}
        variant="plan"
      />
    );

    await user.click(screen.getByRole('button', { name: /update plan/i }));

    expect(onActionStateChange).toHaveBeenCalledWith('done');
    expect(onPrimaryAction).toHaveBeenCalledWith(annotations);
    expect(
      screen.getByRole('button', { name: /update plan/i })
    ).not.toBeDisabled();
  });

  it('calls controlled annotation changes without mutating annotations', async () => {
    const user = userEvent.setup();
    const onAnnotationsChange = jest.fn();

    render(
      <MarkdownTile
        annotations={annotations}
        annotatable
        content={content}
        initiallyExpanded
        onAnnotationsChange={onAnnotationsChange}
      />
    );

    await user.click(screen.getByRole('button', { name: '1 comment' }));
    await user.click(screen.getByRole('button', { name: /delete comment/i }));

    expect(onAnnotationsChange).toHaveBeenCalledWith([]);
    expect(screen.getByText('1 comment')).toBeInTheDocument();
    expect(screen.getByText('Clarify the plan summary.')).toBeInTheDocument();
  });

  it('clears the active annotation when deleting it', async () => {
    const user = userEvent.setup();

    render(
      <MarkdownTile
        annotatable
        content={content}
        defaultAnnotations={annotations}
        initiallyExpanded
      />
    );

    await user.click(screen.getByRole('button', { name: 'Summary' }));
    await user.click(screen.getByRole('button', { name: /delete comment/i }));

    expect(screen.queryByText('1 comment')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Clarify the plan summary.')
    ).not.toBeInTheDocument();
  });

  it('copies markdown and shows copied state', async () => {
    const user = userEvent.setup();
    const onCopy = jest.fn();
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    render(<MarkdownTile content={content} onCopy={onCopy} />);

    await user.click(screen.getByRole('button', { name: /copy markdown/i }));

    expect(onCopy).toHaveBeenCalledWith(content);
    expect(writeText).toHaveBeenCalledWith(content);
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /copied/i })
      ).toBeInTheDocument();
    });
  });
});
