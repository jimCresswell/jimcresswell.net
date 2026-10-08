/**
 * The editor's request handler, below the listener: a request value in, a response value out,
 * every file read or write through an injected seam, so the whole surface is proven in process.
 *
 * Routes: `GET /` the page; `GET /app.js` the page script; `GET /api/document` both files'
 * reports and the fold offsets; `PUT /api/review` the review file's new text, answered with its
 * report. Nothing in a request names a path: the seams fix the files.
 *
 * @packageDocumentation
 */

import { reportFile, type FileReport } from '../model/report.js';
import { parseWith, reviewPutBodySchema } from '../model/schema.js';
import { PROFILE_STRUCTURE } from '../model/structure-table.js';

/** What `GET /api/document` answers: both files' reports and the fold offsets to shade. */
interface DocumentPayload {
  readonly source: FileReport;
  readonly review: FileReport;
  readonly folds: readonly number[];
}

/** The editor's IO, injected: the two files and the page's two static texts. */
export interface EditorSeams {
  readonly readSource: () => Promise<string>;
  readonly readReview: () => Promise<string>;
  readonly writeReview: (text: string) => Promise<void>;
  readonly pageHtml: string;
  readonly pageScript: string;
}

/** The loopback address the editor listens on; a Host that is neither it nor localhost is refused. */
export const EDITOR_HOST = '127.0.0.1';
export const EDITOR_PORT = 4780;
const ACCEPTED_HOSTS: ReadonlySet<string> = new Set([
  `${EDITOR_HOST}:${String(EDITOR_PORT)}`,
  `localhost:${String(EDITOR_PORT)}`,
]);

/** The part of an HTTP request the handler reads. */
interface EditorRequest {
  /**
   * The Host header. A browser sets it from the URL and DNS rebinding cannot change it, so
   * refusing every value but the editor's own two keeps a rebound page from reaching the files.
   */
  readonly host: string;
  readonly method: string;
  readonly url: string;
  readonly body: string;
}

/** What the handler answers; the listener writes it out. */
interface EditorResponse {
  readonly status: number;
  readonly contentType: string;
  readonly body: string;
}

/** The handler: the listener calls it with each request's values. */
export type EditorHandler = (request: EditorRequest) => Promise<EditorResponse>;

const HTML = 'text/html; charset=utf-8';
const SCRIPT = 'text/javascript; charset=utf-8';
const JSON_TYPE = 'application/json; charset=utf-8';

function json(status: number, payload: unknown): EditorResponse {
  return { status, contentType: JSON_TYPE, body: JSON.stringify(payload) };
}

function pathnameOf(url: string): string | null {
  const parsed = URL.parse(url, 'http://127.0.0.1');
  return parsed === null ? null : parsed.pathname;
}

async function documentPayload(seams: EditorSeams): Promise<EditorResponse> {
  const [source, review] = await Promise.all([seams.readSource(), seams.readReview()]);
  const payload: DocumentPayload = {
    source: reportFile(source),
    review: reportFile(review),
    folds: [...PROFILE_STRUCTURE.folds],
  };
  return json(200, payload);
}

function parseJson(body: string): unknown {
  try {
    return JSON.parse(body);
  } catch {
    return undefined;
  }
}

async function putReview(seams: EditorSeams, body: string): Promise<EditorResponse> {
  const parsed = parseJson(body);
  if (parsed === undefined) {
    return json(400, { error: 'the body is not JSON' });
  }
  const accepted = parseWith(reviewPutBodySchema, parsed);
  if (!accepted.ok) {
    return json(400, { error: accepted.error });
  }
  await seams.writeReview(accepted.value.text);
  return json(200, reportFile(accepted.value.text));
}

async function route(seams: EditorSeams, request: EditorRequest): Promise<EditorResponse> {
  const pathname = pathnameOf(request.url);
  const key = `${request.method} ${pathname ?? ''}`;
  switch (key) {
    case 'GET /':
      return { status: 200, contentType: HTML, body: seams.pageHtml };
    case 'GET /app.js':
      return { status: 200, contentType: SCRIPT, body: seams.pageScript };
    case 'GET /api/document':
      return documentPayload(seams);
    case 'PUT /api/review':
      return putReview(seams, request.body);
    default:
      return json(404, { error: 'not found' });
  }
}

/**
 * Build the handler over the given seams. A foreign Host answers 403 before any route; a seam
 * that rejects answers 500 with its message.
 */
export function createEditorHandler(seams: EditorSeams): EditorHandler {
  return async (request) => {
    if (!ACCEPTED_HOSTS.has(request.host)) {
      return json(403, { error: 'host not accepted' });
    }
    try {
      return await route(seams, request);
    } catch (error: unknown) {
      return json(500, { error: error instanceof Error ? error.message : String(error) });
    }
  };
}
