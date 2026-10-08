import { describe, expect, it } from 'vitest';

import type { SectionChange } from '../model/compare.js';
import { reportFile } from '../model/report.js';
import type { StructureTable } from '../model/structure-table.js';

import { escapeHtml, renderDocument } from './render.js';

const table: StructureTable = {
  sections: [
    { heading: 'About', body: 'paragraphs', entries: true, limit: 2600, entryLimit: 2000 },
    { heading: 'Skills', body: 'list', entries: false, limit: null, entryLimit: null },
    { heading: 'Contact', body: 'paragraphs', entries: false, limit: null, entryLimit: null },
  ],
  folds: [10, 20],
};

const noChanges: readonly SectionChange[] = [];
const render = (text: string, changes: readonly SectionChange[] = noChanges): string =>
  renderDocument({ review: reportFile(text, table), changes, folds: table.folds });

const profile = (about: string): string =>
  `# Profile\n\n## About\n\nStatus: approved (Jim)\n\n${about}\n\n## Skills\n\nStatus: open\n\n- Tooling\n\n## Contact\n\nStatus: open\n`;

describe('renderDocument', () => {
  it('renders each section with its heading, status badge, count and believed limit', () => {
    const html = render(profile('Copy here.'));

    expect(html).toContain('<h2>About <span class="badge status-approved">approved · Jim</span>');
    expect(html).toContain('<span class="meta">10 characters · believed limit 2,600</span>');
    expect(html).toContain('<h2>Skills <span class="badge status-open">open</span>');
    expect(html).toContain('7 characters · no believed limit');
  });

  it('renders an entry with the first part of its heading as the title and the rest as a meta line', () => {
    const html = render(
      profile('Intro.\n\n### Role · Place · 2020 – 2021\n\nStatus: drafted\n\nEntry copy.'),
    );

    expect(html).toContain('<h3>Role <span class="badge status-drafted">drafted</span>');
    expect(html).toContain('<div class="entry-meta">Place · 2020 – 2021</div>');
    expect(html).toContain('11 characters · believed limit 2,000');
  });

  it('shades the first fold in one span and the second in another across paragraphs', () => {
    const html = render(profile('abcdefghijkl\n\nmnopqrstuvwxyz'));

    expect(html).toContain('<span class="fold-a">abcdefghij</span><span class="fold-b">kl</span>');
    expect(html).toContain('<span class="fold-b">mnopqr</span>stuvwxyz');
  });

  it('collapses open sections without copy into one list and renders them nowhere else', () => {
    const html = render(profile('Copy.'));

    expect(html).toContain(
      '<section class="open-list"><h2>Still open</h2><ul><li>Contact</li></ul></section>',
    );
    expect(html).not.toContain('<h2>Contact');
  });

  it('lists structure errors with their lines in the strip', () => {
    const html = render(
      '# Profile\n\n## About\n\nCopy.\n\n## Skills\n\nStatus: open\n\n## Contact\n\nStatus: open\n',
    );

    expect(html).toContain(
      '<div class="strip strip-error"><strong>1 structure error</strong><ul><li>L3 About: missing status</li></ul></div>',
    );
  });

  it('marks a changed section and a changed entry with the badge', () => {
    const changes: readonly SectionChange[] = [
      { heading: 'About', changed: true, entries: [{ heading: 'Role', changed: true }] },
      { heading: 'Skills', changed: false, entries: [] },
      { heading: 'Contact', changed: false, entries: [] },
    ];

    const html = render(profile('Intro.\n\n### Role\n\nStatus: open\n\nEntry.'), changes);

    expect(html).toContain(
      '<h2>About <span class="badge status-approved">approved · Jim</span> <span class="meta">6 characters · believed limit 2,600</span> <span class="badge changed">changed from source</span></h2>',
    );
    expect(html).toContain(
      '<h3>Role <span class="badge status-open">open</span> <span class="badge changed">changed from source</span></h3>',
    );
    expect(html).not.toContain(
      '<h2>Skills <span class="badge status-open">open</span> <span class="meta">7 characters · no believed limit</span> <span class="badge changed">',
    );
  });

  it('escapes the copy and the headings', () => {
    const html = render(profile('A & <b>'));

    expect(html).toContain('<span class="fold-a">A &amp; &lt;b&gt;</span>');
    expect(escapeHtml("it's")).toBe('it&#39;s');
  });

  it('renders the parse error and no sections for an unparsable review', () => {
    const html = render('Stray.\n# Profile\n');

    expect(html).toBe(
      '<div class="strip strip-error"><strong>Cannot parse:</strong> L1 no-title</div>',
    );
  });

  it('gives every paragraph the data attributes that locate it in the model', () => {
    const html = render(profile('One.\n\nTwo.\n\n### Role\n\nStatus: open\n\nThree.'));

    expect(html).toContain('<p data-section="0" data-entry="-" data-paragraph="0">');
    expect(html).toContain('<p data-section="0" data-entry="-" data-paragraph="1">');
    expect(html).toContain('<p data-section="0" data-entry="0" data-paragraph="0">');
  });
});
