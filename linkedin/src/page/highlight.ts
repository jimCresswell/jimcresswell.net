/**
 * Linked highlighting between the panes; DOM wiring proven by use. A selection in the text area
 * paints the same text in the rendering through the CSS Custom Highlight API (`::highlight(mirror)`
 * in the page's styles); a selection in the rendering selects the same source in the text area,
 * which then paints the rendering back through the first path. The mapping is `offsets.ts`.
 */

import {
  paragraphAt,
  paragraphRangesForSourceSpan,
  sourceOffsetAt,
  type ParagraphRange,
  type ParagraphRef,
} from '../model/offsets.js';
import type { ProfileDocument } from '../model/types.js';

/** The elements the wiring binds to. */
export interface HighlightElements {
  readonly textarea: HTMLTextAreaElement;
  readonly rendering: HTMLElement;
  readonly notice: HTMLElement;
}

/** The review as last parsed, or null before the first load. */
export type CurrentProfile = () => ProfileDocument | null;

/** Where a selection boundary sits in the rendering: its paragraph and the text offset inside it. */
interface Boundary {
  readonly ref: ParagraphRef;
  readonly offset: number;
}

const HIGHLIGHT_NAME = 'mirror';

function paragraphElement(rendering: HTMLElement, ref: ParagraphRef): HTMLElement | null {
  const entry = ref.entry === null ? '-' : String(ref.entry);
  const selector = `p[data-section="${String(ref.section)}"][data-entry="${entry}"][data-paragraph="${String(ref.paragraph)}"]`;
  const found = rendering.querySelector(selector);
  return found instanceof HTMLElement ? found : null;
}

function textNodes(root: Node): readonly Text[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  for (let node = walker.nextNode(); node !== null; node = walker.nextNode()) {
    if (node instanceof Text) {
      nodes.push(node);
    }
  }
  return nodes;
}

/** The text node and offset at a text offset within the nodes, in reading order. */
function positionAt(nodes: readonly Text[], offset: number): [Text, number] | null {
  let remaining = offset;
  for (const node of nodes) {
    if (remaining <= node.length) {
      return [node, remaining];
    }
    remaining -= node.length;
  }
  return null;
}

/** A DOM range over the paragraph element covering the paragraph text range. */
function domRange(element: HTMLElement, range: ParagraphRange): Range | null {
  const nodes = textNodes(element);
  const start = positionAt(nodes, range.start);
  const end = positionAt(nodes, range.end);
  if (start === null || end === null) {
    return null;
  }
  const dom = document.createRange();
  dom.setStart(...start);
  dom.setEnd(...end);
  return dom;
}

/** Paint the text area's selection onto the rendering and bring its first paragraph into view. */
function paintMirror(els: HighlightElements, profile: ProfileDocument): void {
  const span = { start: els.textarea.selectionStart, end: els.textarea.selectionEnd };
  const highlight = new Highlight();
  let first: HTMLElement | null = null;
  for (const range of paragraphRangesForSourceSpan(profile, span)) {
    const element = paragraphElement(els.rendering, range.ref);
    const dom = element === null ? null : domRange(element, range);
    if (dom !== null) {
      highlight.add(dom);
      first ??= element;
    }
  }
  CSS.highlights.set(HIGHLIGHT_NAME, highlight);
  first?.scrollIntoView({ block: 'nearest' });
}

function refOf(element: HTMLElement): ParagraphRef | null {
  const { section, entry, paragraph } = element.dataset;
  if (section === undefined || entry === undefined || paragraph === undefined) {
    return null;
  }
  return {
    section: Number(section),
    entry: entry === '-' ? null : Number(entry),
    paragraph: Number(paragraph),
  };
}

/** Locate a selection boundary: the paragraph it is in and how much paragraph text precedes it. */
function locate(node: Node, offset: number): Boundary | null {
  const base = node instanceof Element ? node : node.parentElement;
  const element = base?.closest('p[data-paragraph]');
  const ref = element instanceof HTMLElement ? refOf(element) : null;
  if (ref === null || !(element instanceof HTMLElement)) {
    return null;
  }
  const measure = document.createRange();
  measure.setStart(element, 0);
  measure.setEnd(node, offset);
  return { ref, offset: measure.toString().length };
}

function selectedRange(): Range | null {
  const selection = globalThis.getSelection();
  if (selection === null || selection.rangeCount === 0 || selection.isCollapsed) {
    return null;
  }
  return selection.getRangeAt(0);
}

/** The source span the rendering's selection covers, when both ends sit in paragraphs. */
function sourceSpanOfSelection(profile: ProfileDocument): [number, number] | null {
  const range = selectedRange();
  if (range === null) {
    return null;
  }
  const start = locate(range.startContainer, range.startOffset);
  const end = locate(range.endContainer, range.endOffset);
  const from = start === null ? null : paragraphAt(profile, start.ref);
  const to = end === null ? null : paragraphAt(profile, end.ref);
  if (start === null || end === null || from === null || to === null) {
    return null;
  }
  return [sourceOffsetAt(from, start.offset), sourceOffsetAt(to, end.offset)];
}

/** Select the same source in the text area; focusing it paints the rendering back. */
function selectInTextarea(els: HighlightElements, profile: ProfileDocument): void {
  const span = sourceSpanOfSelection(profile);
  if (span === null) {
    return;
  }
  els.textarea.setSelectionRange(...span);
  els.textarea.focus();
}

/**
 * Bind both directions. Returns the repaint for the page to call after it re-renders; on a host
 * without the Highlight API the notice says so and the repaint does nothing.
 */
export function bindHighlighting(els: HighlightElements, current: CurrentProfile): () => void {
  if (!('highlights' in CSS)) {
    els.notice.textContent =
      'Linked highlighting needs the CSS Custom Highlight API; this browser lacks it.';
    return (): void => undefined;
  }
  const repaint = (): void => {
    const profile = current();
    if (profile !== null && document.activeElement === els.textarea) {
      paintMirror(els, profile);
    }
  };
  const mirrorBack = (): void => {
    const profile = current();
    if (profile !== null) {
      selectInTextarea(els, profile);
    }
  };
  document.addEventListener('selectionchange', repaint);
  els.rendering.addEventListener('mouseup', mirrorBack);
  els.rendering.addEventListener('keyup', mirrorBack);
  return repaint;
}
