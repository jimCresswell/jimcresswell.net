/**
 * The page's wiring: load both files from the server, fill the text area with the review text,
 * render the pane, and save the text area through `PUT /api/review` after a short pause in
 * typing. Pure work (rendering, comparing) lives in modules with tests; this file only binds
 * them to the DOM and the network, and is proven by use.
 */

import { compareToSource, type SectionChange } from '../model/compare.js';
import type { FileReport } from '../model/report.js';
import { documentPayloadSchema, fileReportSchema, parseWith } from '../model/schema.js';

import { renderDocument } from './render.js';

const SAVE_DELAY_MS = 600;

interface Elements {
  readonly textarea: HTMLTextAreaElement;
  readonly rendering: HTMLElement;
  readonly saved: HTMLElement;
}

interface State {
  source: FileReport | null;
  folds: readonly number[];
}

function elements(): Elements | null {
  const textarea = document.querySelector('#md');
  const rendering = document.querySelector('#rendering');
  const saved = document.querySelector('#saved');
  if (
    !(textarea instanceof HTMLTextAreaElement) ||
    !(rendering instanceof HTMLElement) ||
    !(saved instanceof HTMLElement)
  ) {
    return null;
  }
  return { textarea, rendering, saved };
}

function changesFor(source: FileReport | null, review: FileReport): readonly SectionChange[] {
  if (source === null || source.kind !== 'parsed' || review.kind !== 'parsed') {
    return [];
  }
  return compareToSource(source.document, review.document);
}

function render(els: Elements, state: State, review: FileReport): void {
  els.rendering.innerHTML = renderDocument({
    review,
    changes: changesFor(state.source, review),
    folds: state.folds,
  });
}

function clock(): string {
  return new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

async function save(els: Elements, state: State): Promise<void> {
  els.saved.textContent = 'Saving…';
  const response = await fetch('/api/review', {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text: els.textarea.value }),
  });
  const report = parseWith(fileReportSchema, await response.json());
  if (!response.ok || !report.ok) {
    els.saved.textContent = `Not saved: ${report.ok ? String(response.status) : report.error}`;
    return;
  }
  render(els, state, report.value);
  els.saved.textContent = `Saved ${clock()} · autosave on`;
}

async function load(els: Elements, state: State): Promise<void> {
  const response = await fetch('/api/document');
  const payload = parseWith(documentPayloadSchema, await response.json());
  if (!payload.ok) {
    els.saved.textContent = `Could not load: ${payload.error}`;
    return;
  }
  state.source = payload.value.source;
  state.folds = payload.value.folds;
  els.textarea.value = payload.value.review.text;
  render(els, state, payload.value.review);
  els.saved.textContent = 'Loaded · autosave on';
}

function failure(els: Elements, verb: string): (error: unknown) => void {
  return (error) => {
    els.saved.textContent = `${verb} failed: ${error instanceof Error ? error.message : String(error)}`;
  };
}

function start(): void {
  const els = elements();
  if (els === null) {
    return;
  }
  const state: State = { source: null, folds: [] };
  let pending: ReturnType<typeof setTimeout> | null = null;
  els.textarea.addEventListener('input', () => {
    if (pending !== null) {
      clearTimeout(pending);
    }
    pending = setTimeout(() => {
      pending = null;
      save(els, state).catch(failure(els, 'Save'));
    }, SAVE_DELAY_MS);
  });
  load(els, state).catch(failure(els, 'Load'));
}

start();
