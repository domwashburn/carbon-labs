/**
 * @license
 *
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable jsdoc/require-jsdoc */

import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import type { CommentComposerState, SelectionMenuPosition } from '../types';

interface UseMarkdownTileSelectionOptions {
  annotatable: boolean;
  expanded: boolean;
  setComposer: Dispatch<SetStateAction<CommentComposerState | null>>;
}

function getSelectionBlockIndex(container: Node) {
  // MarkdownRenderer marks each block with data-block; walking upward links the
  // selected quote back to the block the comment belongs to.
  let blockElement: Node | null = container;
  while (blockElement && blockElement.nodeType !== 1) {
    blockElement = blockElement.parentElement;
  }
  while (blockElement instanceof HTMLElement && !blockElement.dataset?.block) {
    blockElement = blockElement.parentElement;
  }

  return blockElement instanceof HTMLElement && blockElement.dataset.block
    ? parseInt(blockElement.dataset.block, 10)
    : 0;
}

/*
 * Tracks markdown text selections, converts browser range geometry into
 * tile-relative menu coordinates, and clears selection UI on outside clicks.
 */
export function useMarkdownTileSelection({
  annotatable,
  expanded,
  setComposer,
}: UseMarkdownTileSelectionOptions) {
  const [selectionMenu, setSelectionMenu] =
    useState<SelectionMenuPosition | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const tileRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Touch pointers need a lower selection menu and a longer debounce so the
    // browser has time to settle handles before we measure the range.
    if (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function'
    ) {
      setIsTouch(window.matchMedia('(pointer: coarse)').matches);
    }
  }, []);

  useEffect(() => {
    if (!annotatable || !expanded || typeof document === 'undefined') {
      return undefined;
    }

    let timeoutId: number;

    const handleSelectionChange = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(
        () => {
          // Ignore empty selections and selections that start outside the
          // markdown content; annotations should only attach to rendered blocks.
          const selection = window.getSelection();
          if (!selection || selection.isCollapsed) {
            setSelectionMenu(null);
            return;
          }

          const text = selection.toString().trim();
          if (!text || text.length < 2) {
            setSelectionMenu(null);
            return;
          }

          const range = selection.getRangeAt(0);
          if (!contentRef.current?.contains(range.commonAncestorContainer)) {
            setSelectionMenu(null);
            return;
          }

          // Convert the browser selection rectangle into tile-relative
          // coordinates so the floating menu can stay inside the tile.
          const rect = range.getBoundingClientRect();
          const tileRect = tileRef.current?.getBoundingClientRect();
          if (!tileRect) {
            return;
          }

          const blockIdx = getSelectionBlockIndex(
            range.commonAncestorContainer
          );
          const menuOffset = isTouch ? rect.height + 12 : -48;
          const menuLeft = Math.max(
            8,
            Math.min(
              rect.left - tileRect.left + rect.width / 2 - 90,
              tileRect.width - 188
            )
          );

          setSelectionMenu({
            top: rect.top - tileRect.top + menuOffset,
            left: menuLeft,
            quote: text,
            blockIdx,
          });
          setComposer(null);
        },
        isTouch ? 350 : 80
      );
    };

    document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      window.clearTimeout(timeoutId);
    };
  }, [annotatable, expanded, isTouch, setComposer]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    const onDocumentPointerDown = (event: PointerEvent) => {
      if (tileRef.current && !tileRef.current.contains(event.target as Node)) {
        setSelectionMenu(null);
        setComposer(null);
      }
    };

    document.addEventListener('pointerdown', onDocumentPointerDown);

    return () =>
      document.removeEventListener('pointerdown', onDocumentPointerDown);
  }, [setComposer]);

  return {
    contentRef,
    isTouch,
    selectionMenu,
    setSelectionMenu,
    tileRef,
  };
}
