---
date: 2026-03-29T00:00:00Z
git_commit: 38c1c63
branch: main
repository: portfolio
topic: "UI/UX Polish & Feature Enhancements"
tags: research, ui, contact, emailjs, navbar, uns, mqtt, polish
last_updated: 2026-03-29T00:00:00Z
---

## Ticket Synopsis
Five targeted enhancements: (1) UNS Explorer image integration with placeholder URLs, (2) EmailJS contact form wiring, (3) general UI polish, (4) richer UNS/MQTT data, (5) navbar active-section highlighting via react-scroll spy.

## Summary
All five changes are self-contained and low-risk. No new layout changes are needed. The biggest integration effort is EmailJS (new dependency + env vars). Navbar spy is a 2-line change per Link. UNS data expansion and image integration are data-only changes to `unsData.ts` + a small render addition in `UNSExplorer.tsx`. UI polish is purely Tailwind class additions. Contact form needs to become a controlled component before EmailJS can work.

---

## Detailed Findings

### 1. Contact Form — EmailJS Wiring

**Current state** (`src/components/Contact.tsx`):
- `<form>` at line 84 has no `onSubmit` handler
- All four inputs (`name`, `email`, `subject`, `message`) are uncontrolled — no `value`/`onChange`
- Submit button at line 130 is `type="submit"` but fires nothing
- Component is a plain function (no `useState`)
- `Contact` is wrapped in `FadeInWrapper` at lines 12, 26, 83

**What needs to change:**
- Convert to controlled component: add `useState` for `{ name, email, subject, message }`
- Add `onSubmit` handler calling `emailjs.sendForm()` or `emailjs.send()`
- Add `status` state: `'idle' | 'sending' | 'success' | 'error'`
- Show inline feedback below submit button
- Disable button while sending
- EmailJS is **not installed** — `npm install @emailjs/browser` required
- Three env vars needed: `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`

**EmailJS send pattern:**
```ts
import emailjs from '@emailjs/browser';
emailjs.send(
  import.meta.env.VITE_EMAILJS_SERVICE_ID,
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  { from_name, from_email, subject, message },
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY
)
```

---

### 2. Navbar — Active Section Highlighting

**Current state** (`src/components/Navbar.tsx`):
- `Link` from `react-scroll` used at lines 21, 34, 78
- All `Link` components use `smooth`, `offset`, `duration` — no `spy` or `activeClass`
- Current className: `"text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-500 dark:hover:text-indigo-400 cursor-pointer transition"` (lines 40, 85)
- `react-scroll` already installed — no new dependency needed

**What needs to change:**
- Add `spy={true}` and `activeClass="text-indigo-500 dark:text-indigo-400"` to each desktop and mobile `Link`
- `react-scroll` `Link` applies `activeClass` automatically when that section is in viewport
- **Gotcha**: `activeClass` must not conflict with the base class. Since base already has `text-gray-700`, the active class will override it. Works correctly.
- Mobile links (line 78) need the same `spy` + `activeClass` treatment

---

### 3. UNS Data Expansion + Image Integration

**Current state** (`src/data/unsData.ts`):
- `UnsNode` type: `{ name, fullPath, payload?, children? }` — line 1
- Single path: `Enterprise → Richmond → Press → Line1` (4 OEE metrics at leaf)
- No `imageUrl` field on type

**`UNSExplorer.tsx` render logic** (`src/components/UNSExplorer.tsx`):
- `renderNode` at line 15: recurse children, show `<pre>` JSON at leaf nodes (line 44)
- Image integration point: after the `<pre>` payload block, add conditional `<img>` if `node.imageUrl` exists
- The leaf-node block at lines 43-50 is the insertion point

**What needs to change to `unsData.ts`:**
1. Add `imageUrl?: string` to `UnsNode` type
2. Expand tree to at least 3 lines × 2 machines each, realistic OEE payloads
3. Use `https://placehold.co/400x200?text=Line1+Machine1` pattern for placeholder images

**Proposed expanded structure:**
```
Enterprise
└── Richmond
    ├── Press
    │   ├── Line1
    │   │   ├── Machine1 (OEE payload + imageUrl)
    │   │   └── Machine2 (OEE payload + imageUrl)
    │   ├── Line2
    │   │   ├── Machine1
    │   │   └── Machine2
    │   └── Line3
    │       ├── Machine1
    │       └── Machine2
    └── Assembly
        ├── Line1
        │   ├── Station1
        │   └── Station2
        └── Line2
            ├── Station1
            └── Station2
```

**Image display in `UNSExplorer.tsx`:** add after payload `<pre>`:
```tsx
{node.imageUrl && (
  <img src={node.imageUrl} alt={node.name}
    className="mt-2 ml-6 rounded border border-gray-700 max-w-xs" />
)}
```

---

### 4. MQTT Explorer — Expanded Simulated Topics

**Current state** (`src/components/MQTTExplorer.tsx`):
- `simulatedTopics` at line 13: 3 topics, all `factory/line1/machineX`
- `sampleValues` at line 19: `['RUNNING', 'STOPPED', 'IDLE', 'ERROR']`
- `generateSimulatedMessage` at line 21 picks random topic + value
- Message buffer capped at 50 (`slice(-49)`)

**What needs to change:**
- Expand `simulatedTopics` to match the UNS data structure (Richmond/Press/Line1-3/Machine1-2)
- Add more realistic metric values per topic type (OEE, state, infeed rate)
- Keep the same `generateSimulatedMessage` function shape — just extend the arrays

**Expanded topics example:**
```ts
const simulatedTopics = [
  'Enterprise/Richmond/Press/Line1/Machine1/state',
  'Enterprise/Richmond/Press/Line1/Machine2/state',
  'Enterprise/Richmond/Press/Line2/Machine1/OEE',
  'Enterprise/Richmond/Press/Line2/Machine2/state',
  'Enterprise/Richmond/Press/Line3/Machine1/infeed',
  'Enterprise/Richmond/Assembly/Line1/Station1/state',
  // ...
];
```

---

### 5. UI Polish — Existing Pattern Inventory

**Hero** (`src/components/Hero.tsx`):
- MQTT card at line 83: `shadow-lg` — could add `shadow-indigo-500/10` glow
- CTA buttons use `hover:bg-indigo-700` — solid, good pattern
- No `transition-all` on card hover beyond the existing `whileHover`

**About** (`src/components/About.tsx`):
- Skill badges at line 56: `bg-indigo-100 dark:bg-indigo-800` — could add `hover:scale-105 transition-transform cursor-default`
- Profile photo border: `border-2 border-indigo-500` — could add `shadow-md shadow-indigo-500/20`
- Resume button: already has `hover:bg-indigo-700 transition` — good

**Experience** (`src/components/Experience.tsx`):
- Card wrapper at line 43: `border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow` — could add `shadow-lg hover:shadow-xl transition-shadow`
- Timeline dots at line 59: `bg-indigo-500 rounded-full` — could pulse on hover
- `tags` field (line 69): just a string like `"Ignition, MQTT, +13 skills"` — opportunity to render as actual tag badges

**Demos** (`src/components/Demos.tsx`):
- Tab buttons at line 39: `bg-gray-800 text-gray-300 hover:bg-gray-700` — could add `border border-transparent hover:border-indigo-500/30 transition-all`
- Active tab: `bg-indigo-600 text-white` — add `shadow-md shadow-indigo-500/30` for elevation

**Contact** (`src/components/Contact.tsx`):
- Social icon buttons at line 59, 67, 73: `bg-gray-800` — could add `hover:scale-110 transition-transform`
- Form card at line 84: `border-gray-700 bg-gray-900` — could add `shadow-xl` for more depth

---

## Architecture Insights

1. **EmailJS is the only new dependency** — lightweight, no backend needed, matches solo project constraint
2. **react-scroll `spy` is zero-effort** — already used, just add two props per Link
3. **UNS image integration is purely additive** — optional `imageUrl` field means no existing code breaks
4. **Contact form needs to become controlled** before EmailJS wiring — currently all inputs are uncontrolled
5. **Experience `tags` is a plain string** — rendering as actual badges requires changing the data shape from `string` to `string[]`; worth doing for polish
6. **Hero CTA buttons use native `<a href="#">`** not `react-scroll` Link — they will still work but won't have smooth scroll. Minor, but note for polish pass.

---

## Historical Context (from documentation)
- `docs/architecture.md` — confirms Contact form is non-functional, `useMqtt.ts` is unused, indigo accent system
- `docs/research/2026-03-29_claude-md-and-project-docs.md` — confirms no tests exist, EmailJS not installed

---

## Open Questions
- EmailJS account/credentials: user needs to create an account and provide `SERVICE_ID`, `TEMPLATE_ID`, `PUBLIC_KEY` before the contact form can be fully tested end-to-end
- Placeholder image service: `placehold.co` vs `via.placeholder.com` vs `picsum.photos` — any preference?

## Confirmed Decisions
- Experience `tags` field: **expand to `string[]`** — confirmed by user
- Core skills to highlight across Experience entries: **Ignition, MQTT, Python, JavaScript, Agentic Workflows**
- Per-job skill breakdowns (to replace generic "+N skills" strings):
  - **Fortune Brands (MES Engineer):** Ignition, Python, MQTT, MSSQL, UNS, Industry 4.0, MES
  - **Fuuz (Software Engineer II):** TypeScript, React, JavaScript, MES, REST APIs
  - **GPA MI Solutions Specialist:** Ignition, MQTT, Python, MSSQL, UNS, Node.js, OPC-UA, Historian, PLC Integration, Modbus, REST APIs, SQL Server, Perspective, Scripting
  - **GPA Full Stack Developer:** Python, Node.js, JavaScript, Ignition, SQL, MES, REST APIs, Git, Linux, Docker
