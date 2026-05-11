/**
 * @license
 *
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable jsdoc/require-jsdoc */

import { useEffect, useRef } from 'react';

interface LayerPosition {
  top: number;
  left: number;
}

/*
 * Positions a floating layer from tile-relative coordinates whenever the layer
 * is enabled and a target position is available.
 */
export function usePositionedLayer<TElement extends HTMLElement>(
  position?: LayerPosition | null,
  enabled = true
) {
  const layerRef = useRef<TElement>(null);

  useEffect(() => {
    if (enabled && position && layerRef.current) {
      layerRef.current.style.insetBlockStart = `${position.top}px`;
      layerRef.current.style.insetInlineStart = `${position.left}px`;
    }
  }, [enabled, position]);

  return layerRef;
}
