# Cloud Sub-Plan 05: SiteHeader — Data-Driven Navigation

**Parent plan:** [component-audit.plan.md](../component-audit.plan.md) — Part 5
**Dependencies:** [01-rtl-setup](01-rtl-setup.plan.md) must be complete (RTL available for tests)
**Enables:** [07-root-layout-shell](07-root-layout-shell.plan.md) (header should be clean before moving to root layout)

## Goal

Replace the hardcoded inline navigation in `SiteHeader` with a data-driven nav array. Add an RTL integration test.

## Intended Impact

Adding or removing a navigation link becomes a data change, not a JSX restructuring. The active-state logic is consolidated.

## Context

### Current state of `components/site-header.tsx`

The component is a client component (`"use client"`) that uses `usePathname()` to determine active state. Navigation is hardcoded to Home and CV with inline conditional rendering:

```tsx
{
  isHome ? (
    <span className="font-medium underline" aria-current="page">
      Home
    </span>
  ) : (
    <Link href="/" className="opacity-70 hover:opacity-100 transition-opacity">
      Home
    </Link>
  );
}
<span className="mx-2 opacity-50" aria-hidden="true">
  ·
</span>;
{
  isCV ? (
    <span className="font-medium underline" aria-current="page">
      CV
    </span>
  ) : (
    <Link href="/cv/" className="opacity-70 hover:opacity-100 transition-opacity">
      CV
    </Link>
  );
}
```

This works for two items but does not scale. The pattern (active = `<span>`, inactive = `<Link>`) is repeated with identical className strings.

### Props interface

```tsx
interface SiteHeaderProps {
  actions?: ReactNode;
}
```

The `actions` slot is used by CV pages to render the `<DownloadPdfLink />`.

## Steps

### 1. Define a nav items array

Add a typed array within the component (or in a `const` above it):

```tsx
const navItems = [
  { label: "Home", href: "/", match: (path: string) => path === "/" },
  { label: "CV", href: "/cv/", match: (path: string) => path.startsWith("/cv") },
];
```

**Note:** `/cv/timeline` sitting under `/cv` means the "CV" nav item will be active for the timeline page. This is correct — the timeline is part of the CV section.

### 2. Replace inline nav with a loop

The nav renders from the array with separators between items. The active/inactive pattern remains the same — this is a structural refactor, not a behavioural change.

```tsx
<nav aria-label="Main navigation" className="flex items-center font-sans text-sm print-hidden">
  {navItems.map((item, index) => (
    <Fragment key={item.href}>
      {index > 0 && (
        <span className="mx-2 opacity-50" aria-hidden="true">
          ·
        </span>
      )}
      {item.match(pathname) ? (
        <span className="font-medium underline" aria-current="page">
          {item.label}
        </span>
      ) : (
        <Link href={item.href} className="opacity-70 hover:opacity-100 transition-opacity">
          {item.label}
        </Link>
      )}
    </Fragment>
  ))}
</nav>
```

### 3. Preserve all existing behaviour

- `actions` slot still renders when provided
- Logo link, separator, theme toggle — all unchanged
- `print-hidden` classes preserved
- `aria-current="page"` on active item
- Separator dot between nav items

### 4. Write RTL integration test

Create `components/site-header.integration.test.tsx` with `// @vitest-environment jsdom`.

**Mocking `usePathname`:** This is one of the few justified mocks in the project. The component is a client component that reads from Next.js navigation.

```tsx
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));
```

**Test cases:**

- Renders "Home" and "CV" nav links
- Marks "Home" as active (`aria-current="page"`) when pathname is `/`
- Marks "CV" as active when pathname starts with `/cv`
- Active item is a `<span>`, not a `<Link>`
- Inactive items are links with correct `href`
- Renders actions slot when provided
- Does not render actions separator when actions not provided

**Note on mocking:** The `usePathname` mock is the only mock. `ThemeToggle` and `Logo` are real components — RTL will render them. If `ThemeToggle` causes issues in jsdom (it uses `next-themes`), a lightweight mock for `next-themes` may be needed, but try without first.

### 5. Run quality gates

```bash
pnpm format
pnpm lint
pnpm type-check
pnpm test
```

## Acceptance Criteria

- [ ] Navigation is data-driven — items come from an array, not inline JSX
- [ ] Adding a nav item requires only adding an entry to the array
- [ ] Active state logic uses the `match` function from the nav item
- [ ] All existing behaviour is preserved (actions slot, logo, separator, print classes, aria)
- [ ] `components/site-header.integration.test.tsx` exists and passes
- [ ] Tests verify: nav link rendering, active state for `/`, active state for `/cv/*`, actions slot
- [ ] `usePathname` is the only mock
- [ ] `pnpm check` passes

## Files Affected

| File                                          | Changes                                     |
| --------------------------------------------- | ------------------------------------------- |
| `components/site-header.tsx`                  | Data-driven nav, may need `Fragment` import |
| `components/site-header.integration.test.tsx` | New — RTL test                              |
