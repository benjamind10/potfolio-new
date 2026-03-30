# Architecture Reference

Deep-reference document for the portfolio SPA. See [CLAUDE.md](../CLAUDE.md) for the quick-start overview.

---

## Component Tree

```
index.html
└── src/main.tsx
    └── <App />                          src/App.tsx
        ├── <Navbar />                   src/components/Navbar.tsx
        └── <main>
            ├── <Hero />                 src/components/Hero.tsx
            ├── <About />                src/components/About.tsx
            ├── <Experience />           src/components/Experience.tsx
            ├── <Demos />                src/components/Demos.tsx
            │   ├── <UNSExplorer />      src/components/UNSExplorer.tsx
            │   ├── <MQTTExplorer />     src/components/MQTTExplorer.tsx
            │   └── <ScriptProfilerDemo /> src/components/ScriptProfilerDemo.tsx
            └── <Contact />              src/components/Contact.tsx
        └── <Footer />                   src/components/Footer.tsx
```

**Shared utilities:**
- `src/components/common/FadeInWrapper.tsx` — Framer Motion scroll-in animation wrapper
- `src/utils/cn.ts` — classname helper (`...classes.filter(Boolean).join(' ')`)

**Dead code (defined, not used):**
- `src/components/NamespaceExplorer.tsx` — D3 SVG tree (commented out in Demos.tsx)
- `src/components/LogSimulator.tsx` — log stream UI (commented out in Demos.tsx)

---

## Page Sections

| Section | File | `id` | scroll-mt / offset |
|---------|------|------|--------------------|
| Hero | `Hero.tsx` | `hero` | `offset={-96}` |
| About | `About.tsx` | `about` | `scroll-mt-24` + `offset={-96}` |
| Experience | `Experience.tsx` | `experience` | `scroll-mt-24` + `offset={-96}` |
| Demos | `Demos.tsx` | `demos` | `scroll-mt-24` + `offset={-96}` |
| Contact | `Contact.tsx` | `contact` | `scroll-mt-24` + `offset={-96}` |

Navbar uses `react-scroll` `<Link>` with `smooth={true}`, `offset={-96}`, `duration={500}`.

---

## Theming System

**Hook**: `src/hooks/useTheme.ts`

```
localStorage.getItem('theme')
  → found: use stored value ('light' | 'dark')
  → not found: check window.matchMedia('prefers-color-scheme: dark')
       → match: 'dark'
       → no match: 'light'

useEffect on [theme]:
  document.documentElement.classList.add('dark')   // or 'light'
  document.documentElement.classList.remove(other)
  localStorage.setItem('theme', theme)
```

**Consumer**: `useTheme` is called only in `src/components/Navbar.tsx:7`. The `toggle` function is wired to Sun/Moon icon buttons (desktop + mobile).

**Tailwind integration**: Tailwind v4 class-based dark mode — `dark:` prefixed classes throughout. The root `<div>` in `App.tsx:11` sets base colors:
```
bg-white text-gray-900 dark:bg-gray-900 dark:text-white
```

**Gotcha**: `useTheme` must only be instantiated once. Do not call it in multiple components — it creates independent state. Pass `toggle` as a prop if other components need it.

---

## MQTT Integration

### Module-level client (unused): `src/hooks/useMqtt.ts`
Connects at import time using `VITE_MQTTBROKER`. Subscribes to `#`. Logs all messages to console. **Not imported anywhere in the component tree** — effectively dead code or a future integration stub.

### MQTTExplorer component: `src/components/MQTTExplorer.tsx`
Self-contained dual-mode MQTT client managed in `useEffect`:

```
isSimulated = true (default)
  → setInterval 2000ms
  → generates random { topic, timestamp, payload } from simulatedTopics[]
  → cleanup: clearInterval

isSimulated = false (live)
  → mqtt.connect(VITE_MQTTBROKER)
  → subscribe('#')
  → on('message'): JSON.parse payload → append to messages[]
  → cleanup: client.end()
```

**Message buffer**: capped at 50 — `prev.slice(-49)` pattern.

**Layout**: 2-column grid — left panel lists unique topics (sorted), right panel shows `<JsonView>` for selected topic's latest message.

**Env var required**: `VITE_MQTTBROKER=wss://broker.hivemq.com:8884/mqtt` in `.env`

---

## UNS Data Structures

Two separate files, two separate consumers — do not interchange them.

### `src/data/unsData.ts` → `UNSExplorer.tsx`

```typescript
type UnsNode = {
  name: string;
  fullPath: string;   // e.g. "Enterprise/Richmond/Press/Line1"
  payload?: any;      // leaf-node data (OEE metrics)
  children?: UnsNode[];
};
```

Tree: `Enterprise → Richmond → Press → Line1 (OEE payload)`

`UNSExplorer` walks this recursively, toggling `Record<string, boolean>` expand state keyed by `fullPath`. Leaf nodes with `payload` render a `<pre>` JSON block.

### `src/data/unsTree.ts` → `NamespaceExplorer.tsx` (currently unused)

```typescript
{ name: string; children?: { name, children? }[] }
```

Simpler shape — no `fullPath`, no `payload`. Used only by D3's `d3.hierarchy()` which walks `children` arrays natively.

Tree: `factory → line1 → machine1/{state,infeed,outfeed}, machine2/state`

---

## Demos Tab System

**File**: `src/components/Demos.tsx`

`TABS` array drives the tab list. To add a demo:
1. Import the component at the top of `Demos.tsx`
2. Add `{ key: 'yourkey', label: 'Tab Label', component: <YourComponent /> }` to the `TABS` array
3. Give the component an `id` if it needs independent scroll behavior

Default active tab: `'mqtt'` (line 19).

---

## Animation Pattern

### `FadeInWrapper` — `src/components/common/FadeInWrapper.tsx`
Scroll-triggered fade-in via Framer Motion `whileInView`. Re-triggers on scroll back (`once: false`).

```tsx
<FadeInWrapper delay={0.1} yOffset={30}>
  {children}
</FadeInWrapper>
```

Props: `delay` (default `0`), `yOffset` (default `20`), `className` (default `''`).

Used in: `About.tsx`, `Contact.tsx`.

### Inline `motion.div` — `Hero.tsx`, `Experience.tsx`
- **Hero**: uses `initial/animate` (plays immediately on mount, not scroll-triggered)
- **Experience**: uses `whileInView` directly with `viewport={{ once: true }}` (plays once, does not re-trigger)

---

## Styling Conventions

| Convention | Detail |
|------------|--------|
| CSS framework | Tailwind CSS v4 via `@tailwindcss/vite` plugin |
| Dark mode | Class-based: `dark:` prefix; toggled on `<html>` element |
| Accent color | `indigo-500` / `indigo-600` for interactive elements |
| Section divider | `<div className="w-20 h-1 bg-indigo-500 rounded mb-8" />` |
| Max-width | `max-w-6xl mx-auto` on all section wrappers |
| `cn()` utility | `src/utils/cn.ts` — simple filter+join; not clsx or shadcn/ui |
| Quotes | Single quotes (Prettier) |
| Indent | 2 spaces (Prettier) |
| Line width | 80 chars (Prettier) |
| Trailing commas | ES5 style (Prettier) |

---

## Assets

| File | Location | Purpose |
|------|----------|---------|
| Profile photo | `src/assets/profile_pic.jpg` | About section avatar |
| Profiler screenshot 1 | `src/assets/script-profiler-1.png` | ScriptProfilerDemo tab |
| Profiler screenshot 2 | `src/assets/script-profiler-2.png` | ScriptProfilerDemo tab |
| Favicon | `public/computer-chip.png` | Browser tab icon |
| Resume | `public/resume.pdf` | Download link in About section |

> **Note**: `public/resume.pdf` must exist or the download link in `About.tsx:66` will 404.

---

## Known Gaps & Dead Code

| Item | File | Status | Notes |
|------|------|--------|-------|
| `NamespaceExplorer` | `src/components/NamespaceExplorer.tsx` | Unused | D3 SVG tree; import commented out in Demos.tsx |
| `LogSimulator` | `src/components/LogSimulator.tsx` | Unused | Log stream; import commented out in Demos.tsx |
| `useMqtt.ts` | `src/hooks/useMqtt.ts` | Unused | Module-level MQTT client; not imported anywhere |
| Contact form submit | `src/components/Contact.tsx:130` | Non-functional | No `onSubmit` handler; button does nothing |
| `resume.pdf` | `public/resume.pdf` | Runtime dep | Must be placed manually; not tracked in git |
