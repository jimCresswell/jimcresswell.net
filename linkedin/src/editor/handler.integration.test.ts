import { unwrap } from '@engraph/result';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { parse } from '../model/parse.js';
import { documentPayloadSchema, fileReportSchema, parseWith } from '../model/schema.js';

import { createEditorHandler, type EditorSeams } from './handler.js';

const SOURCE = '# Profile\n\n## About\n\nStatus: approved\n\nSource copy.\n';
const REVIEW = '# Profile\n\n## About\n\nStatus: approved\n\nReview copy.\n';

/** The editor's own address, as a browser sends it in the Host header. */
const HOST = '127.0.0.1:4780';

/** A request to the editor's own host; the Host check has its own test below. */
const at = (method: string, url: string, body = '') => ({ host: HOST, method, url, body });

/** The shape of an error answer. */
const errorBody = z.strictObject({ error: z.string() });

/** Constant reads, a writer that records what it receives, and the two page texts. */
function seams(written: string[]): EditorSeams {
  return {
    readSource: () => Promise.resolve(SOURCE),
    readReview: () => Promise.resolve(REVIEW),
    writeReview: (text) => {
      written.push(text);
      return Promise.resolve();
    },
    pageHtml: '<!doctype html><title>Editor</title>',
    pageScript: 'export {};',
  };
}

/** A writer that fails: reaching it turns a response that must not write into a 500. */
const neverWrite: EditorSeams = {
  ...seams([]),
  writeReview: () => Promise.reject(new Error('the review must not be written')),
};

describe('the editor handler', () => {
  it('answers GET / with the injected page as html', async () => {
    const response = await createEditorHandler(seams([]))(at('GET', '/'));

    expect(response).toEqual({
      status: 200,
      contentType: 'text/html; charset=utf-8',
      body: '<!doctype html><title>Editor</title>',
    });
  });

  it('answers GET /app.js with the injected page script as javascript', async () => {
    const response = await createEditorHandler(seams([]))(at('GET', '/app.js'));

    expect(response).toEqual({
      status: 200,
      contentType: 'text/javascript; charset=utf-8',
      body: 'export {};',
    });
  });

  it('answers GET /api/document with both reports, the folds, and the review model equal to its parse', async () => {
    const response = await createEditorHandler(seams([]))(at('GET', '/api/document'));

    expect(response.status).toBe(200);
    const payload = unwrap(parseWith(documentPayloadSchema, JSON.parse(response.body)));
    expect(payload.source).toMatchObject({ kind: 'parsed', text: SOURCE });
    expect(payload.review).toMatchObject({
      kind: 'parsed',
      text: REVIEW,
      document: unwrap(parse(REVIEW)),
    });
    expect(payload.folds.length).toBeGreaterThan(0);
  });

  it('answers GET /api/document with the review parse error beside the source model when the review is unparsable', async () => {
    const broken: EditorSeams = {
      ...seams([]),
      readReview: () => Promise.resolve('no title here\n'),
    };

    const response = await createEditorHandler(broken)(at('GET', '/api/document'));

    const payload = unwrap(parseWith(documentPayloadSchema, JSON.parse(response.body)));
    expect(payload.source.kind).toBe('parsed');
    expect(payload.review).toEqual({
      kind: 'unparsable',
      text: 'no title here\n',
      error: { kind: 'no-title', line: 1 },
    });
  });

  it('writes the text of PUT /api/review through the seam and answers its report', async () => {
    const written: string[] = [];
    const text = '# Profile\n\n## About\n\nStatus: drafted\n\nEdited copy.\n';

    const response = await createEditorHandler(seams(written))(
      at('PUT', '/api/review', JSON.stringify({ text })),
    );

    expect(written).toEqual([text]);
    expect(response.status).toBe(200);
    expect(unwrap(parseWith(fileReportSchema, JSON.parse(response.body)))).toMatchObject({
      kind: 'parsed',
      text,
      document: unwrap(parse(text)),
    });
  });

  it('refuses a PUT body that is not JSON with 400 and writes nothing', async () => {
    const response = await createEditorHandler(neverWrite)(at('PUT', '/api/review', 'not json'));

    expect(response.status).toBe(400);
    expect(JSON.parse(response.body)).toEqual({ error: 'the body is not JSON' });
  });

  it('refuses a PUT body of another shape with 400 and writes nothing', async () => {
    const response = await createEditorHandler(neverWrite)(
      at('PUT', '/api/review', JSON.stringify({ content: 'x' })),
    );

    expect(response.status).toBe(400);
    expect(unwrap(parseWith(errorBody, JSON.parse(response.body))).error).toContain('text');
  });

  it('refuses a request to any Host but its own with 403, reading and writing nothing', async () => {
    const foreign = {
      ...at('PUT', '/api/review', JSON.stringify({ text: REVIEW })),
      host: 'attacker.example:4780',
    };
    const foreignRead = { ...at('GET', '/api/document'), host: 'localhost:4780' };

    const write = await createEditorHandler(neverWrite)(foreign);
    const read = await createEditorHandler(neverWrite)(foreignRead);

    expect(write.status).toBe(403);
    expect(JSON.parse(write.body)).toEqual({ error: 'host not accepted' });
    expect(read.status).toBe(403);
  });

  it('answers an unknown route with 404', async () => {
    const response = await createEditorHandler(seams([]))(at('GET', '/elsewhere'));

    expect(response).toMatchObject({ status: 404 });
    expect(JSON.parse(response.body)).toEqual({ error: 'not found' });
  });

  it('answers 500 with the message when a read seam fails', async () => {
    const failing: EditorSeams = {
      ...seams([]),
      readSource: () => Promise.reject(new Error('disk gone')),
    };

    const response = await createEditorHandler(failing)(at('GET', '/api/document'));

    expect(response.status).toBe(500);
    expect(JSON.parse(response.body)).toEqual({ error: 'disk gone' });
  });

  it('ignores a query string on a known route', async () => {
    const response = await createEditorHandler(seams([]))(at('GET', '/api/document?x=1'));

    expect(response.status).toBe(200);
  });
});
