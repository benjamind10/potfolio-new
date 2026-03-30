# UI/UX Polish & Feature Enhancements — Implementation Plan

## Overview
Five targeted improvements to the portfolio: richer UNS/MQTT data with image placeholders, navbar active-section highlighting, expanded Experience skill badges, wired-up EmailJS contact form, and a general UI polish pass. No layout restructuring — all changes are additive or in-place enhancements.

## Current State Analysis
- `unsData.ts`: 1 branch, 1 leaf node, no `imageUrl` field on `UnsNode` type
- `MQTTExplorer.tsx`: 3 hardcoded simulated topics (`factory/line1/machineA/B/C`)
- `Navbar.tsx`: `react-scroll` Links have no `spy` or `activeClass` — no scroll-aware highlighting
- `Experience.tsx`: `tags` field is a plain `string` like `"Ignition, MQTT, +13 skills"` — not badges
- `Contact.tsx`: fully uncontrolled form, no submit handler, no user feedback
- UI: functional but missing hover transitions, card shadows, and depth cues

## Desired End State
- UNS Explorer: multi-line, multi-machine tree with OEE payloads and placeholder images at leaf nodes
- MQTT Explorer: simulated topics match expanded UNS hierarchy
- Navbar: active link highlighted as user scrolls between sections
- Experience: skill tags rendered as indigo badge chips with real skill names
- Contact form: controlled inputs, EmailJS submission, inline success/error feedback
- UI: polished hover states, card elevation, and transition consistency across all sections

## What We Are Not Doing
- No layout or section order changes
- No new page sections or routing
- No changes to `NamespaceExplorer` (D3, stays commented out)
- No re-enabling `LogSimulator`
- No backend, auth, or analytics
- No typography or color palette changes

## Implementation Approach
Phases ordered by risk (lowest first). Data-only changes first, then small component changes, then the one new dependency (EmailJS), and polish last so it doesn't interfere with functional testing.

---

## Phase 1: Expand UNS Data + MQTT Simulated Topics

Pure data changes — no component logic touched.

### Changes Required

**File: `src/data/unsData.ts`**
- Add `imageUrl?: string` to `UnsNode` type
- Replace the single-leaf tree with a multi-site hierarchy:
  ```
  Enterprise
  └── Richmond
      ├── Press
      │   ├── Line1 → Machine1, Machine2 (OEE payload + placeholder imageUrl)
      │   ├── Line2 → Machine1, Machine2
      │   └── Line3 → Machine1, Machine2
      └── Assembly
          ├── Line1 → Station1, Station2
          └── Line2 → Station1, Station2
  ```
- Each leaf node: `OEE`, `Availability`, `Quality`, `Performance` metrics (realistic values, varied per node)
- Placeholder `imageUrl`: use `https://placehold.co/400x200/1f2937/6366f1?text=Line1+Machine1` pattern (dark bg, indigo text — matches app palette)

**File: `src/components/MQTTExplorer.tsx`**
- Replace `simulatedTopics` array (line 13) with topics matching the expanded UNS paths:
  ```ts
  'Enterprise/Richmond/Press/Line1/Machine1/state',
  'Enterprise/Richmond/Press/Line1/Machine2/OEE',
  'Enterprise/Richmond/Press/Line2/Machine1/state',
  'Enterprise/Richmond/Press/Line2/Machine2/infeed',
  'Enterprise/Richmond/Press/Line3/Machine1/state',
  'Enterprise/Richmond/Press/Line3/Machine2/outfeed',
  'Enterprise/Richmond/Assembly/Line1/Station1/state',
  'Enterprise/Richmond/Assembly/Line1/Station2/cycle_time',
  'Enterprise/Richmond/Assembly/Line2/Station1/state',
  'Enterprise/Richmond/Assembly/Line2/Station2/OEE',
  ```
- Expand `sampleValues` to include numeric values for OEE topics: `['RUNNING', 'STOPPED', 'IDLE', 'ERROR', 0.91, 0.87, 0.94, 0.78]`

### Success Criteria
#### Automated Verification
- [x] `npm run build` exits 0 (TypeScript validates new `UnsNode` shape)
- [x] `npm run lint` exits 0

#### Manual Verification
- [ ] UNS Explorer tree shows Enterprise → Richmond → Press/Assembly branches
- [ ] MQTT Explorer simulated mode shows 10 topics in the topic list

---

## Phase 2: UNS Explorer Image Display + Navbar Active Highlighting ✅

Two small, independent component changes in one phase.

### Changes Required

**File: `src/components/UNSExplorer.tsx`**
- After the existing payload `<pre>` block (line 44–50), add conditional image render:
  ```tsx
  {node.imageUrl && !hasChildren && (
    <img
      src={node.imageUrl}
      alt={node.name}
      className="mt-2 ml-6 rounded border border-gray-700 max-w-xs opacity-80 hover:opacity-100 transition-opacity"
    />
  )}
  ```
- No type import changes needed — `imageUrl` is already on `UnsNode` after Phase 1

**File: `src/components/Navbar.tsx`**
- Add `spy={true}` and `activeClass="!text-indigo-500 dark:!text-indigo-400"` to every desktop `Link` (line 34 map)
- Add same props to every mobile `Link` (line 78 map)
- No new imports or state needed — `react-scroll` supports this natively

### Success Criteria
#### Automated Verification
- [x] `npm run build` exits 0
- [x] `npm run lint` exits 0

#### Manual Verification
- [ ] Expanding a UNS leaf node shows the placeholder image below the JSON payload
- [ ] Scrolling to the About section highlights the "About" nav link in indigo
- [ ] Scrolling to Demos highlights "Demos", etc.
- [ ] Mobile nav links also highlight correctly

---

## Phase 3: Experience Skill Badges ✅

Change `tags` from a plain string to `string[]` and render as badge chips.

### Changes Required

**File: `src/components/Experience.tsx`**
- Update `jobs` array type: change `tags: string` → `tags: string[]`
- Replace the four `tags` string values with real skill arrays:
  ```ts
  // Fortune Brands
  tags: ['Ignition', 'Python', 'MQTT', 'MSSQL', 'UNS', 'Industry 4.0', 'MES'],
  // Fuuz
  tags: ['TypeScript', 'React', 'JavaScript', 'MES', 'REST APIs'],
  // GPA MI Solutions Specialist
  tags: ['Ignition', 'MQTT', 'Python', 'MSSQL', 'UNS', 'Node.js', 'OPC-UA', 'Historian', 'PLC Integration', 'Modbus', 'SQL Server', 'Perspective'],
  // GPA Full Stack Developer
  tags: ['Python', 'Node.js', 'JavaScript', 'Ignition', 'SQL', 'MES', 'REST APIs', 'Git', 'Linux', 'Docker'],
  ```
- Replace the single `<p>` tag rendering `{job.tags}` with a flex-wrap badge list:
  ```tsx
  <div className="flex flex-wrap gap-1 mt-2">
    {job.tags.map(tag => (
      <span
        key={tag}
        className="px-2 py-0.5 rounded-full bg-indigo-900/50 text-indigo-300 text-xs font-medium border border-indigo-700/40"
      >
        {tag}
      </span>
    ))}
  </div>
  ```

### Success Criteria
#### Automated Verification
- [x] `npm run build` exits 0
- [x] `npm run lint` exits 0

#### Manual Verification
- [ ] Each Experience entry shows skill badges instead of a single line of text
- [ ] Badge colors are consistent with the indigo theme, readable in both light and dark mode
- [ ] No layout overflow or wrapping issues on mobile

---

## Phase 4: Contact Form — EmailJS Wiring ✅

The only phase requiring a new dependency. Most code-intensive change.

### Changes Required

**Install dependency:**
```bash
npm install @emailjs/browser
```

**Update `.env`** — add three new vars (user must supply real values from EmailJS dashboard):
```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

**File: `src/components/Contact.tsx`**
- Convert from function component to component with state:
  - Add `import { useState, FormEvent } from 'react'`
  - Add `import emailjs from '@emailjs/browser'`
  - Add controlled state:
    ```ts
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    ```
  - Wire `value` and `onChange` to each input/textarea
  - Add `onSubmit` to `<form>`:
    ```ts
    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      setStatus('sending');
      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          { from_name: form.name, from_email: form.email, subject: form.subject, message: form.message },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
      } catch {
        setStatus('error');
      }
    };
    ```
  - Add feedback below submit button:
    ```tsx
    {status === 'success' && <p className="text-green-400 text-sm text-center">Message sent!</p>}
    {status === 'error' && <p className="text-red-400 text-sm text-center">Something went wrong. Try again.</p>}
    ```
  - Disable submit button and show loading text while `status === 'sending'`

### Success Criteria
#### Automated Verification
- [x] `npm run build` exits 0
- [x] `npm run lint` exits 0

#### Manual Verification
- [ ] Submit button is disabled and shows "Sending..." while in-flight
- [ ] Success message appears after successful send (requires real EmailJS credentials)
- [ ] Error message appears on failure
- [ ] Form clears after successful submission
- [ ] In dev without real credentials: `emailjs.send` rejects → error state shown

---

## Phase 5: UI Polish Pass ✅

Additive Tailwind class improvements only — no structural changes.

### Changes Required

**`src/components/Hero.tsx`**
- MQTT card (line 83): add `shadow-indigo-500/10` to `shadow-lg` → `shadow-lg shadow-indigo-500/10`
- CTA buttons: add `active:scale-95` for tactile press feel

**`src/components/About.tsx`**
- Profile photo wrapper: add `shadow-lg shadow-indigo-500/20` to existing border
- Skill badges: add `hover:scale-105 transition-transform cursor-default` to each `<span>`
- Resume button: add `active:scale-95`

**`src/components/Experience.tsx`**
- Card wrapper (line 43): upgrade `shadow` → `shadow-lg hover:shadow-xl transition-shadow duration-300`
- Timeline dot (line 59): add `ring-2 ring-indigo-500/20` for subtle glow

**`src/components/Demos.tsx`**
- Inactive tab buttons: add `border border-transparent hover:border-indigo-500/30`
- Active tab: add `shadow-md shadow-indigo-500/30`

**`src/components/Contact.tsx`**
- Social icon buttons: add `hover:scale-110 transition-transform` to each `<a>`
- Form card: upgrade `shadow` → `shadow-xl`

### Success Criteria
#### Automated Verification
- [x] `npm run build` exits 0
- [x] `npm run lint` exits 0

#### Manual Verification
- [ ] Hover over skill badges in About — they scale up slightly
- [ ] Experience card has elevated shadow on hover
- [ ] Social icon links in Contact scale on hover
- [ ] Active demo tab has visible shadow/elevation vs inactive tabs
- [ ] Dark mode still correct on all modified elements

---

## Testing Strategy
- No unit or integration tests (no test suite exists)
- Each phase: `npm run build` + `npm run lint` after changes
- Manual smoke test after each phase: open dev server, verify the changed component visually
- Final full-page review after Phase 5

## Rollback/Mitigation Notes
- **Phases 1–3, 5**: pure data/Tailwind changes — git revert per file if needed
- **Phase 4 (EmailJS)**: if EmailJS breaks build, `npm uninstall @emailjs/browser` and revert `Contact.tsx`; the form degrades gracefully to non-functional (original state)
- No database, no migrations, no shared state — all changes are file-local
