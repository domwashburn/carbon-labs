/**
 * @license
 *
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { TextHighlighter } from '@carbon-labs/react-text-highlighter';
import type { MarkdownTileAnnotation } from '../../types';

interface MarkdownRendererProps {
  annotations: MarkdownTileAnnotation[];
  activeAnnotationId?: string | null;
  blockClass: string;
  content: string;
  onAnnotationSelect: (id: string) => void;
}

interface Token {
  type: 'text' | 'code' | 'strong' | 'em' | 'link';
  text: string;
  href?: string;
  key: number;
}

export const MarkdownRenderer = ({
  annotations,
  activeAnnotationId,
  blockClass,
  content,
  onAnnotationSelect,
}: MarkdownRendererProps) => {
  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  const renderText = (text: string, blockIdx: number) =>
    parseInline(
      text,
      annotations,
      blockIdx,
      activeAnnotationId,
      onAnnotationSelect,
      blockClass
    );

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const code: string[] = [];
      i++;

      while (i < lines.length && !lines[i].startsWith('```')) {
        code.push(lines[i]);
        i++;
      }

      i++;
      blocks.push(
        <pre
          key={key}
          className={`${blockClass}__markdown-code`}
          data-block={key}>
          {lang ? (
            <span className={`${blockClass}__markdown-code-language`}>
              {lang}
            </span>
          ) : null}
          <code>{code.join('\n')}</code>
        </pre>
      );
      key++;
      continue;
    }

    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const HeadingTag = `h${Math.min(
        level + 2,
        6
      )}` as keyof JSX.IntrinsicElements;
      blocks.push(
        <HeadingTag
          key={key}
          className={`${blockClass}__markdown-heading ${blockClass}__markdown-heading--${level}`}
          data-block={key}>
          {renderText(heading[2], key)}
        </HeadingTag>
      );
      key++;
      i++;
      continue;
    }

    if (line.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      blocks.push(
        <blockquote
          key={key}
          className={`${blockClass}__markdown-quote`}
          data-block={key}>
          {quoteLines.map((quoteLine, index) => (
            <p key={index}>{renderText(quoteLine, key)}</p>
          ))}
        </blockquote>
      );
      key++;
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ''));
        i++;
      }
      blocks.push(
        <ol
          key={key}
          className={`${blockClass}__markdown-list ${blockClass}__markdown-list--ordered`}
          data-block={key}>
          {items.map((item, index) => (
            <li key={index}>{renderText(item, key)}</li>
          ))}
        </ol>
      );
      key++;
      continue;
    }

    if (/^[-*]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        items.push(lines[i].slice(2));
        i++;
      }
      blocks.push(
        <ul
          key={key}
          className={`${blockClass}__markdown-list`}
          data-block={key}>
          {items.map((item, index) => (
            <li key={index}>{renderText(item, key)}</li>
          ))}
        </ul>
      );
      key++;
      continue;
    }

    if (/^---+$/.test(line)) {
      blocks.push(
        <hr key={key++} className={`${blockClass}__markdown-rule`} />
      );
      i++;
      continue;
    }

    if (!line.trim()) {
      i++;
      continue;
    }

    const paragraph = [line];
    i++;

    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,4}\s|>|```|---+$|[-*]\s|\d+\.\s)/.test(lines[i])
    ) {
      paragraph.push(lines[i]);
      i++;
    }

    blocks.push(
      <p
        key={key}
        className={`${blockClass}__markdown-paragraph`}
        data-block={key}>
        {renderText(paragraph.join(' '), key)}
      </p>
    );
    key++;
  }

  return blocks;
};

function parseInline(
  text: string,
  annotations: MarkdownTileAnnotation[],
  blockIdx: number,
  activeAnnotationId: string | null | undefined,
  onAnnotationSelect: (id: string) => void,
  blockClass: string
) {
  const tokens: Token[] = [];
  let remaining = text;
  let key = 0;

  const patterns = [
    {
      re: /`([^`]+)`/,
      render: (match: RegExpExecArray): Token => ({
        type: 'code',
        text: match[1],
        key: key++,
      }),
    },
    {
      re: /\*\*([^*]+)\*\*/,
      render: (match: RegExpExecArray): Token => ({
        type: 'strong',
        text: match[1],
        key: key++,
      }),
    },
    {
      re: /\*([^*]+)\*/,
      render: (match: RegExpExecArray): Token => ({
        type: 'em',
        text: match[1],
        key: key++,
      }),
    },
    {
      re: /\[([^\]]+)\]\(([^)]+)\)/,
      render: (match: RegExpExecArray): Token => ({
        type: 'link',
        text: match[1],
        href: match[2],
        key: key++,
      }),
    },
  ];

  while (remaining) {
    let earliest: RegExpExecArray | null = null;
    let index = -1;
    let pattern: (typeof patterns)[number] | null = null;

    for (const item of patterns) {
      const match = item.re.exec(remaining);
      if (match && (index === -1 || match.index < index)) {
        earliest = match;
        index = match.index;
        pattern = item;
      }
    }

    if (!earliest || !pattern) {
      tokens.push({ type: 'text', text: remaining, key: key++ });
      break;
    }

    if (index > 0) {
      tokens.push({
        type: 'text',
        text: remaining.slice(0, index),
        key: key++,
      });
    }

    tokens.push(pattern.render(earliest));
    remaining = remaining.slice(index + earliest[0].length);
  }

  const blockAnnotations = annotations.filter(
    (annotation) => annotation.blockIdx === blockIdx
  );

  return tokens.map((token) => {
    if (token.type === 'code') {
      return (
        <code key={token.key} className={`${blockClass}__markdown-inline-code`}>
          {token.text}
        </code>
      );
    }

    if (token.type === 'strong') {
      return (
        <strong key={token.key}>
          {applyHighlights(
            token.text,
            blockAnnotations,
            activeAnnotationId,
            onAnnotationSelect,
            blockClass
          )}
        </strong>
      );
    }

    if (token.type === 'em') {
      return (
        <em key={token.key}>
          {applyHighlights(
            token.text,
            blockAnnotations,
            activeAnnotationId,
            onAnnotationSelect,
            blockClass
          )}
        </em>
      );
    }

    if (token.type === 'link') {
      return (
        <a
          key={token.key}
          href={token.href}
          className={`${blockClass}__markdown-link`}>
          {token.text}
        </a>
      );
    }

    return (
      <React.Fragment key={token.key}>
        {applyHighlights(
          token.text,
          blockAnnotations,
          activeAnnotationId,
          onAnnotationSelect,
          blockClass
        )}
      </React.Fragment>
    );
  });
}

function applyHighlights(
  text: string,
  annotations: MarkdownTileAnnotation[],
  activeAnnotationId: string | null | undefined,
  onAnnotationSelect: (id: string) => void,
  blockClass: string
) {
  if (!annotations.length) {
    return text;
  }

  const matches: Array<{
    start: number;
    end: number;
    annotation: MarkdownTileAnnotation;
  }> = [];

  annotations.forEach((annotation) => {
    const index = text.indexOf(annotation.quote);
    if (index !== -1) {
      matches.push({
        start: index,
        end: index + annotation.quote.length,
        annotation,
      });
    }
  });

  if (!matches.length) {
    return text;
  }

  matches.sort((a, b) => a.start - b.start);
  const parts: React.ReactNode[] = [];
  let position = 0;
  let key = 0;

  for (const match of matches) {
    if (match.start < position) {
      continue;
    }

    if (match.start > position) {
      parts.push(
        <React.Fragment key={key++}>
          {text.slice(position, match.start)}
        </React.Fragment>
      );
    }

    const isActive = activeAnnotationId === match.annotation.id;
    parts.push(
      <span
        key={key++}
        className={[
          `${blockClass}__annotation`,
          isActive ? `${blockClass}__annotation--active` : '',
        ]
          .filter(Boolean)
          .join(' ')}
        data-annotation-id={match.annotation.id}
        onClick={(event) => {
          event.stopPropagation();
          onAnnotationSelect(match.annotation.id);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onAnnotationSelect(match.annotation.id);
          }
        }}
        role="button"
        tabIndex={0}>
        <TextHighlighter
          kind="mark"
          type={isActive ? 'high-contrast' : 'default'}>
          {text.slice(match.start, match.end)}
        </TextHighlighter>
      </span>
    );
    position = match.end;
  }

  if (position < text.length) {
    parts.push(
      <React.Fragment key={key++}>{text.slice(position)}</React.Fragment>
    );
  }

  return parts;
}
