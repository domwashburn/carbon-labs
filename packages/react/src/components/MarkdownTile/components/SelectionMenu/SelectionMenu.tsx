/**
 * @license
 *
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { Button } from '@carbon/react';
import { Chat } from '@carbon/icons-react';
import { usePositionedLayer } from '../../hooks/usePositionedLayer';
import type { SelectionMenuPosition } from '../../types';

interface SelectionMenuProps {
  blockClass: string;
  isTouch: boolean;
  onAnnotate: () => void;
  position: SelectionMenuPosition | null;
}

export const SelectionMenu = ({
  blockClass,
  isTouch,
  onAnnotate,
  position,
}: SelectionMenuProps) => {
  const menuRef = usePositionedLayer<HTMLDivElement>(position);

  if (!position) {
    return null;
  }

  return (
    <div
      aria-label="Selection actions"
      className={[
        `${blockClass}__selection-menu`,
        isTouch ? `${blockClass}__selection-menu--touch` : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onMouseDown={(event) => event.preventDefault()}
      onTouchStart={(event) => event.stopPropagation()}
      ref={menuRef}
      role="toolbar">
      <Button
        kind="ghost"
        renderIcon={Chat}
        size="sm"
        type="button"
        onPointerDown={(event) => {
          event.preventDefault();
          onAnnotate();
        }}>
        Add comment
      </Button>
    </div>
  );
};
