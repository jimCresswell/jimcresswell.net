/**
 * The editor's listener, the one composition root with real IO: it reads the page and its
 * bundle once, binds the handler's seams to the two profile files, and serves the handler on a
 * fixed loopback port. Proven by a recorded observation, never a test; the handler it serves is
 * proven in process.
 *
 * Run as `pnpm --filter linkedin editor`, which builds the page bundle first. A port already in
 * use is an error with the port named, never a fallback.
 */

import { readFile, writeFile } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';

import { createEditorHandler, type EditorHandler } from './handler.js';

const HOST = '127.0.0.1';
const PORT = 4780;

const workspace = path.resolve(import.meta.dirname, '..', '..');
const sourcePath = path.join(workspace, 'profile.md');
const reviewPath = path.join(workspace, 'profile.review.md');
const pageHtmlPath = path.join(workspace, 'src', 'page', 'index.html');
const pageScriptPath = path.join(workspace, 'dist', 'app.js');

async function readBody(request: http.IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

async function answer(
  handle: EditorHandler,
  request: http.IncomingMessage,
  response: http.ServerResponse,
): Promise<void> {
  const answered = await handle({
    method: request.method ?? '',
    url: request.url ?? '/',
    body: await readBody(request),
  });
  response.writeHead(answered.status, {
    'content-type': answered.contentType,
    'cache-control': 'no-store',
  });
  response.end(answered.body);
}

function failRequest(response: http.ServerResponse): (error: unknown) => void {
  return (error) => {
    process.stderr.write(`editor: ${error instanceof Error ? error.message : String(error)}\n`);
    if (!response.headersSent) {
      response.statusCode = 500;
    }
    response.end();
  };
}

const pageScript = await readFile(pageScriptPath, 'utf8').catch(() => null);
if (pageScript === null) {
  process.stderr.write(`editor: ${pageScriptPath} is missing; run pnpm --filter linkedin build\n`);
  process.exitCode = 1;
} else {
  const handle = createEditorHandler({
    readSource: () => readFile(sourcePath, 'utf8'),
    readReview: () => readFile(reviewPath, 'utf8'),
    writeReview: (text) => writeFile(reviewPath, text, 'utf8'),
    pageHtml: await readFile(pageHtmlPath, 'utf8'),
    pageScript,
  });
  const server = http.createServer((request, response) => {
    answer(handle, request, response).catch(failRequest(response));
  });
  server.on('error', (error: NodeJS.ErrnoException) => {
    const reason =
      error.code === 'EADDRINUSE' ? `port ${String(PORT)} is already in use` : error.message;
    process.stderr.write(`editor: ${reason}\n`);
    process.exitCode = 1;
  });
  server.listen(PORT, HOST, () => {
    process.stdout.write(`http://${HOST}:${String(PORT)}/\n`);
  });
}
