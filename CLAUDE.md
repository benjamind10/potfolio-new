# CLAUDE.md — Portfolio Project

Ben Duran's Industry 4.0 portfolio — a React 19 + TypeScript single-page application showcasing skills in Ignition, MQTT, and Unified Namespace (UNS). No backend, no router, no global state library. Single scrollable page with five sections.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 (class-based dark mode) |
| Animation | Framer Motion 12 |
| Icons | Lucide React |
| MQTT client | mqtt.js 5 |
| Data viz | D3 v7 (unused/dead code currently) |
| JSON rendering | react-json-view-lite |
| Scroll nav | react-scroll |
| Code quality | ESLint + TypeScript strict + Prettier |

---

## Directory Layout

```
src/
├── App.tsx                    Root component — imports and orders all sections
├── main.tsx                   React entry point
├── index.css                  Global CSS (Tailwind imports)
├── components/
│   ├── common/
│   │   └── FadeInWrapper.tsx  Framer Motion scroll-triggered fade-in wrapper
│   ├── Navbar.tsx             Sticky nav, theme toggle, mobile menu
│   ├── Hero.tsx               Landing section with animated MQTT log card
│   ├── About.tsx              Profile photo, bio, skills, resume download
│   ├── Experience.tsx         Work timeline (4 jobs, whileInView animation)
│   ├── Demos.tsx              Tab container for interactive demos
│   ├── MQTTExplorer.tsx       Dual-mode MQTT browser (simulated / live HiveMQ)
│   ├── UNSExplorer.tsx        Expandable UNS tree from unsData.ts
│   ├── ScriptProfilerDemo.tsx Screenshot gallery for Java module demo
│   ├── NamespaceExplorer.tsx  D3 SVG tree — UNUSED (commented out in Demos.tsx)
│   ├── LogSimulator.tsx       Log stream UI — UNUSED (commented out in Demos.tsx)
│   ├── Contact.tsx            Contact form + info (form submit is non-functional)
│   └── Footer.tsx             Branding and social links
├── hooks/
│   ├── useTheme.ts            Dark/light toggle with localStorage persistence
│   └── useMqtt.ts            Module-level MQTT client — UNUSED (not imported)
├── data/
│   ├── unsData.ts             UnsNode tree (fullPath + OEE payload) → UNSExplorer
│   └── unsTree.ts             Simple {name, children} tree → NamespaceExplorer (D3)
├── utils/
│   └── cn.ts                  Classname utility: filter(Boolean).join(' ')
└── assets/
    ├── profile_pic.jpg
    ├── script-profiler-1.png
    └── script-profiler-2.png
```

---

## Dev Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # tsc -b && vite build (type-checks first)
npm run lint      # ESLint on all .ts/.tsx files
npm run preview   # Serve the dist/ build locally
```

---

## Environment Setup

Create a `.env` file at the project root (already committed with default value):

```
VITE_MQTTBROKER=wss://broker.hivemq.com:8884/mqtt
```

This is required for `MQTTExplorer`'s live mode. The simulated mode works without it.

---

## Component Map

| Component | Purpose |
|-----------|---------|
| `App.tsx` | Assembles all sections in page order |
| `Navbar.tsx` | Sticky nav; only consumer of `useTheme` |
| `Hero.tsx` | Animated intro + cycling MQTT payload card (self-contained, no real MQTT) |
| `About.tsx` | Profile, skills, resume download link |
| `Experience.tsx` | Timeline with `motion.div whileInView` animations |
| `Demos.tsx` | Tab switcher — add demos here by appending to `TABS` array |
| `MQTTExplorer.tsx` | Live or simulated MQTT topic browser |
| `UNSExplorer.tsx` | Recursive click-to-expand UNS tree |
| `ScriptProfilerDemo.tsx` | Static image gallery |
| `Contact.tsx` | Contact info + non-functional form |
| `FadeInWrapper.tsx` | `whileInView` fade-in; wraps any content |

---

## Key Data Flows

### 1. Theme Toggle
```
User clicks Sun/Moon in Navbar
→ useTheme.toggle()
→ setTheme (React state)
→ useEffect: document.documentElement.classList toggle 'dark'/'light'
→ localStorage.setItem('theme', ...)
→ All dark: CSS classes respond
```

### 2. MQTT Explorer (Simulated / Live)
```
isSimulated=true (default):
  setInterval 2000ms → generateSimulatedMessage() → setMessages([...prev.slice(-49), msg])

isSimulated=false:
  mqtt.connect(VITE_MQTTBROKER) → subscribe('#') → on('message') → JSON.parse → setMessages
  cleanup: client.end()

UI: uniqueTopics list (left) ← click → selectedTopic → JsonView payload (right)
```

### 3. UNS Explorer
```
unsData (UnsNode tree with fullPath) → UNSExplorer
  → renderNode() recursive
  → expand state: Record<fullPath, boolean>
  → leaf nodes with payload → <pre> JSON block
```

---

## Coding Conventions

- **Prettier**: single quotes, 2-space indent, 80-char lines, ES5 trailing commas
- **Dark mode**: always pair light and dark variants — `text-gray-900 dark:text-white`
- **Accent color**: use `indigo-500` / `indigo-600` for interactive/highlight elements
- **Section divider**: `<div className="w-20 h-1 bg-indigo-500 rounded mb-8" />`
- **Max-width**: `max-w-6xl mx-auto` on all section containers
- **Scroll sections**: every `<section>` needs `id="..."` and `className="scroll-mt-24"`
- **Animations**: use `<FadeInWrapper>` for scroll-triggered; use `motion.div` with `initial/animate` for mount-triggered (Hero pattern)
- **Classnames**: use `cn()` from `src/utils/cn.ts` when conditionally joining classes

---

## Known Gotchas

1. **`useMqtt.ts` is not imported anywhere** — it connects at module scope if ever imported; do not import it without understanding the double-connection risk with `MQTTExplorer`
2. **`NamespaceExplorer` is dead code** — defined and works, but commented out in `Demos.tsx`; re-enable by adding it back to the `TABS` array
3. **Contact form does nothing** — no `onSubmit` handler; the Send button submits nothing
4. **`public/resume.pdf` must exist** — the About section has a hard-coded download link to `/resume.pdf`; if the file is missing, the button 404s silently

---

## Further Reading

- [docs/architecture.md](docs/architecture.md) — full component tree, MQTT flow diagrams, UNS data shapes, theming internals, dead code inventory
