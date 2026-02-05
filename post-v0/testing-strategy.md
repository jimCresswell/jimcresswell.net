# Testing Strategy (Post-v0)

## Manual Testing (First Pass)

### Visual

- [ ] Light mode renders correctly
- [ ] Dark mode renders correctly
- [ ] System theme preference respected
- [ ] No flash of wrong theme on load
- [ ] Print preview looks correct (A4, proper margins)

### Accessibility

- [ ] Keyboard navigation works (Tab through all interactive elements)
- [ ] Skip link present and functional
- [ ] Focus indicators visible on all interactive elements
- [ ] Screen reader announces theme toggle state changes
- [ ] Heading hierarchy correct (h1 → h2 → h3, no skips)

### Content

- [ ] All text matches content JSON (no invented copy)
- [ ] Links work and open correctly
- [ ] Email address displays correctly
- [ ] Variants render with correct tilt content

### Responsive

- [ ] Mobile layout (320px - 768px)
- [ ] Tablet layout (768px - 1024px)
- [ ] Desktop layout (1024px+)

---

## Automated Testing

### Unit/Integration (Vitest or Jest)

```bash
npm install -D vitest @testing-library/react
```

Recommended tests:

- Component rendering (smoke tests)
- Theme toggle state management
- Variant route generation from tilts

### Accessibility (axe-core)

```bash
npm install -D @axe-core/react
```

Add to development mode for continuous feedback.

### E2E (Playwright)

```bash
npm install -D @playwright/test
```

Recommended flows:

- Homepage → CV navigation
- Theme toggle (light → dark → system)
- Print button triggers print dialog
- Keyboard-only navigation through entire site
- Variant routes return correct content or 404

### Visual Regression (Playwright screenshots)

Capture baseline screenshots for:

- `/` (light + dark, mobile + desktop)
- `/cv/` (light + dark, mobile + desktop)
- Print preview

---

## CI Integration

```yaml
# Example GitHub Actions
- name: Lint
  run: npm run lint

- name: Type check
  run: npx tsc --noEmit

- name: Build
  run: npm run build

- name: Playwright tests
  run: npx playwright test
```

Treat warnings as failures during initial hardening.
