/**
 * @license
 *
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import '@testing-library/jest-dom';

import InlineReasoningTrace from '../components/InlineReasoningTrace';

const steps = [
  {
    stepLabel: 'Step 1',
    stepContent: 'Visible step 1',
  },
  {
    stepLabel: 'Step 2',
    stepContent: 'Visible step 2',
  },
  {
    stepLabel: 'Step 3',
    stepContent: 'Hidden step 3',
  },
  {
    stepLabel: 'Step 4',
    stepContent: 'Hidden step 4',
  },
];

describe('InlineReasoningTrace', () => {
  it('animates show less when steps are shown by default', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <InlineReasoningTrace
        triggerText="Reasoning steps"
        steps={steps}
        openByDefault
        showAllStepsByDefault
        initialVisibleSteps={2}
      />
    );

    expect(screen.getByText('Hidden step 3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show less' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );

    const hiddenSteps = container.querySelector(
      '.clabs--inline-reasoning-trace__hidden-steps'
    );

    expect(hiddenSteps).toHaveClass(
      'clabs--inline-reasoning-trace__hidden-steps--no-animation'
    );

    await user.click(screen.getByRole('button', { name: 'Show less' }));

    expect(hiddenSteps).toHaveClass(
      'clabs--inline-reasoning-trace__hidden-steps--exiting'
    );
    expect(hiddenSteps).not.toHaveClass(
      'clabs--inline-reasoning-trace__hidden-steps--no-animation'
    );
  });

  it('suppresses split list animations when collapsing the full trace', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <InlineReasoningTrace
        triggerText="Reasoning steps"
        steps={steps}
        openByDefault
        showAllStepsByDefault
        initialVisibleSteps={2}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Reasoning steps' }));

    const hiddenSteps = container.querySelector(
      '.clabs--inline-reasoning-trace__hidden-steps'
    );
    const lists = container.querySelectorAll(
      '.clabs--inline-reasoning-trace__list'
    );

    expect(hiddenSteps).not.toHaveClass(
      'clabs--inline-reasoning-trace__hidden-steps--exiting'
    );
    lists.forEach((list) => {
      expect(list).toHaveClass(
        'clabs--inline-reasoning-trace__list--no-animation'
      );
      expect(list).not.toHaveClass(
        'clabs--inline-reasoning-trace__list--exiting'
      );
    });
  });

  it('keeps hidden steps mounted until the show less transition completes', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <InlineReasoningTrace
        triggerText="Reasoning steps"
        steps={steps}
        openByDefault
        initialVisibleSteps={2}
      />
    );

    expect(screen.getByText('Visible step 1')).toBeInTheDocument();
    expect(screen.queryByText('Hidden step 3')).not.toBeInTheDocument();

    const showMoreButton = screen.getByRole('button', {
      name: 'Show 2 more steps',
    });
    expect(showMoreButton).toHaveAttribute('aria-expanded', 'false');

    await user.click(showMoreButton);

    expect(screen.getByText('Hidden step 3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show less' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );

    await user.click(screen.getByRole('button', { name: 'Show less' }));

    expect(screen.getByText('Hidden step 3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show less' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );

    const hiddenSteps = container.querySelector(
      '.clabs--inline-reasoning-trace__hidden-steps'
    );

    expect(hiddenSteps).toBeInTheDocument();

    fireEvent.transitionEnd(hiddenSteps as Element, {
      propertyName: 'grid-template-rows',
    });

    await waitFor(() => {
      expect(screen.queryByText('Hidden step 3')).not.toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Show 2 more steps' })
      ).toHaveAttribute('aria-expanded', 'false');
    });
  });
});
