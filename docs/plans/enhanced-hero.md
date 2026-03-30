---
status: complete
checkpoint: done
ticket: docs/tickets/2026-03-29_feature_enhanced-hero.md
research: docs/research/2026-03-29_enhanced-hero.md
created: 2026-03-29T00:00:00Z
---

# Enhanced Hero Section Implementation Plan

## Overview

Redesign `src/components/Hero.tsx` from a single-card layout into a living industrial
dashboard: stacked animated data panels on the right (MQTT stream, OEE arc gauge, UNS
breadcrumb), a subtle animated SVG background, and an animated scroll indicator. All
using the existing Framer Motion + D3 stack — zero new npm dependencies required.

---

## Current State Analysis

- `Hero.tsx` is 104 lines: two-column `flex-col md:flex-row items-center` layout
- Right column: one cycling MQTT card (`bg-[#0e0f1a] text-green-400`), 3s `setInterval`
- Animations: mount-triggered `initial/animate` only — **must be preserved**
- `useTheme` must NOT be instantiated here (Navbar-only)
- `useMqtt.ts` must NOT be imported (module-level broker connection)
- `items-center` on the section flex row will break alignment when right column height grows
- D3 v7 is installed and dormant; suitable for OEE SVG arc
- `AnimatePresence` is not used anywhere yet; safe to introduce

---

## Desired End State

After implementation `Hero.tsx` contains:

1. **Left column** — refined copy, same CTAs, unchanged structure
2. **Right column** — `flex flex-col gap-4 max-w-sm` with three stacked cards:
   - **MQTT Stream Card**: rolling 3-message buffer, richer payloads, `AnimatePresence` entries
   - **OEE Gauge Card**: D3 SVG arc gauge cycling through `unsData` leaf nodes
   - **UNS Path Card**: animated breadcrumb cycling through all 10 `fullPath` values
3. **Background**: subtle animated SVG (floating dots + edges, Framer Motion, GPU-composited)
4. **Scroll indicator**: `ChevronDown` (lucide-react) bouncing loop at viewport bottom
5. **Accessibility**: `useReducedMotion()` disables/simplifies all looping animations
6. **Mobile**: MQTT card visible on all sizes; OEE + UNS cards hidden on mobile (`hidden md:flex`)

---

## What We Are Not Doing

- No changes to Navbar, About, Experience, Demos, Contact, Footer, or App.tsx
- No skills badges in Hero (duplication with About)
- No new npm dependencies (using existing Framer Motion 12, D3 v7, Lucide React)
- No routing, global state, or context
- No live MQTT connection in Hero (simulated only)
- No `useMqtt.ts` import
- No `useTheme` instantiation in Hero
- No changes to `unsData.ts` or any data files

---

## Implementation Approach

All changes are confined to `src/components/Hero.tsx`. The component will grow from ~104
lines to ~280–320 lines. No new files are required. Each phase produces a shippable state
that passes `npm run build` and `npm run lint`.

**Dependency choices (all zero-install):**
- Animations: Framer Motion `motion`, `AnimatePresence`, `useReducedMotion`
- OEE gauge: D3 `arc()` — import only `arc` from `d3-shape` (tree-shaken by Vite)
- Background: inline SVG + Framer Motion (no canvas, no tsparticles)
- Icons: `ChevronDown`, `Activity`, `GitBranch`, `Wifi` from `lucide-react`

---

## Phase 1: Layout Restructure + Left Column Polish + Scroll Indicator

**Goal**: Establish the new skeleton without touching data/animation logic. Build must pass.

### Changes Required

**File: `src/components/Hero.tsx`**

1. **Section flex row**: change `items-center` → `items-start` on the section className
   - Reason: prevents visual imbalance when right column becomes taller than left

2. **Right column wrapper**: change from single-card wrapper to:
   ```tsx
   <div className="md:w-1/2 mt-10 md:mt-0 md:pl-10 flex flex-col gap-4 w-full max-w-sm mx-auto md:mx-0">
     {/* cards will go here in subsequent phases */}
     {/* keep existing MQTT card for now */}
   </div>
   ```

3. **Left column copy** — update tagline paragraph only:
   - Current: `"I specialize in building scalable systems around Unified Namespace (UNS), Ignition Perspective, and MQTT to unify industrial data."`
   - New: `"I build the data infrastructure behind smart factories — connecting machines, lines, and sites through MQTT, UNS, and Ignition Perspective into a single source of truth."`

4. **Scroll indicator** — add as the last child inside `<section>`, absolutely positioned:
   ```tsx
   {/* Scroll indicator */}
   <motion.div
     className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-400 dark:text-gray-500"
     initial={{ opacity: 0 }}
     animate={shouldAnimate ? { opacity: 1, y: [0, 6, 0] } : { opacity: 1 }}
     transition={{ delay: 1.2, duration: 1.5, repeat: shouldAnimate ? Infinity : 0 }}
   >
     <span className="text-xs font-mono tracking-widest uppercase">scroll</span>
     <ChevronDown size={16} />
   </motion.div>
   ```
   - Section must be `relative` for absolute positioning to work
   - `shouldAnimate` comes from `!useReducedMotion()` (introduced here)

5. **Imports to add**: `ChevronDown` from `lucide-react`, `useReducedMotion` from `framer-motion`

### Success Criteria

#### Automated Verification
- [x] `npm run build` exits 0
- [x] `npm run lint` exits 0
- [x] No TypeScript errors (`tsc --noEmit`)

#### Manual Verification
- [ ] Section renders with left + right columns side by side on desktop
- [ ] Right column aligns to top of section (not center)
- [ ] Updated tagline paragraph is visible
- [ ] Scroll indicator bounces at bottom of viewport
- [ ] Scroll indicator is hidden on `prefers-reduced-motion: reduce`

---

## Phase 2: Enhanced MQTT Stream Card

**Goal**: Evolve the existing MQTT card from single cycling payload to a rolling 3-message stream with `AnimatePresence`.

### Changes Required

**File: `src/components/Hero.tsx`**

1. **Replace `mqttStates` + `formatMqttPayload`** with richer simulated data:

   ```typescript
   // Topics pulled from MQTTExplorer's established topic list
   const MQTT_TOPICS = [
     'Enterprise/Richmond/Press/Line1/Machine1/state',
     'Enterprise/Richmond/Press/Line2/Machine1/state',
     'Enterprise/Richmond/Press/Line3/Machine2/state',
     'Enterprise/Richmond/Assembly/Line1/Station1/state',
     'Enterprise/Richmond/Assembly/Line2/Station1/state',
   ];

   type MqttMessage = {
     id: number;
     topic: string;
     state: 'RUNNING' | 'STOPPED' | 'IDLE' | 'ERROR';
     temp: number;
     cycleCount: number;
     ts: string;
   };

   const STATES = ['RUNNING', 'RUNNING', 'RUNNING', 'IDLE', 'STOPPED', 'ERROR'] as const;

   let msgIdCounter = 0;
   const generateMqttMessage = (): MqttMessage => ({
     id: ++msgIdCounter,
     topic: MQTT_TOPICS[Math.floor(Math.random() * MQTT_TOPICS.length)],
     state: STATES[Math.floor(Math.random() * STATES.length)],
     temp: Math.round(60 + Math.random() * 30),
     cycleCount: Math.floor(1000 + Math.random() * 9000),
     ts: new Date().toISOString().slice(11, 19), // HH:MM:SS only
   });
   ```
   Note: `RUNNING` appears 3x in `STATES` to simulate realistic production frequency.

2. **Replace `mqttState` useState** with a messages buffer:
   ```typescript
   const [messages, setMessages] = useState<MqttMessage[]>(() => [generateMqttMessage()]);

   useEffect(() => {
     const interval = setInterval(() => {
       setMessages(prev => [...prev.slice(-2), generateMqttMessage()]);
     }, 2500);
     return () => clearInterval(interval);
   }, []);
   ```

3. **State color helper**:
   ```typescript
   const stateColor = (s: string) =>
     s === 'RUNNING' ? 'text-green-400'
     : s === 'ERROR'   ? 'text-red-400'
     : s === 'STOPPED' ? 'text-yellow-400'
     : 'text-gray-400'; // IDLE
   ```

4. **Card JSX** — replace the existing `<pre>` block with:
   ```tsx
   <div className="bg-[#0e0f1a] rounded-xl border border-gray-700 dark:border-gray-600 p-4 font-mono text-xs shadow-lg shadow-indigo-500/10">
     {/* Terminal header */}
     <div className="flex items-center justify-between mb-3 text-gray-500">
       <div className="flex gap-1">
         <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
         <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
         <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
       </div>
       <div className="flex items-center gap-1.5 text-indigo-400">
         <Wifi size={11} />
         <span>mqtt.stream</span>
       </div>
     </div>
     {/* Message stream */}
     <div className="flex flex-col gap-1.5 min-h-[96px]">
       <AnimatePresence initial={false}>
         {messages.map(msg => (
           <motion.div
             key={msg.id}
             initial={{ opacity: 0, y: -8 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, height: 0 }}
             transition={{ duration: shouldAnimate ? 0.3 : 0 }}
             className="flex flex-col gap-0.5"
           >
             <span className="text-gray-500">{msg.ts} · <span className="text-indigo-300">{msg.topic.split('/').slice(-2).join('/')}</span></span>
             <span className="pl-2">
               state: <span className={stateColor(msg.state)}>{msg.state}</span>
               <span className="text-gray-500"> · temp: <span className="text-cyan-400">{msg.temp}°C</span> · cycles: <span className="text-gray-300">{msg.cycleCount}</span></span>
             </span>
           </motion.div>
         ))}
       </AnimatePresence>
     </div>
   </div>
   ```

5. **Imports to add**: `AnimatePresence` from `framer-motion`, `Wifi` from `lucide-react`

6. **Keep `whileHover` spring** on the outer `motion.div` wrapper (unchanged from current)

### Success Criteria

#### Automated Verification
- [x] `npm run build` exits 0
- [x] `npm run lint` exits 0

#### Manual Verification
- [ ] Card shows 1–3 messages streaming every ~2.5 seconds
- [ ] New messages animate in from top; old messages fade/collapse out
- [ ] `RUNNING` state shows green, `ERROR` red, `STOPPED` yellow, `IDLE` gray
- [ ] Topic shows as last two path segments (e.g., `Machine1/state`)
- [ ] Temperature and cycle count values are visible
- [ ] Card does not overflow its container
- [ ] With `prefers-reduced-motion`: messages still update but without slide animation

---

## Phase 3: OEE Gauge Card

**Goal**: Add an animated D3 SVG arc gauge that cycles through `unsData` leaf nodes, displaying OEE, Availability, Quality, and Performance.

### Changes Required

**File: `src/components/Hero.tsx`**

1. **Extract leaf nodes from unsData** (pure derivation, no mutation):
   ```typescript
   import { unsData, type UnsNode } from '../data/unsData';

   const getLeaves = (node: UnsNode): UnsNode[] =>
     node.children ? node.children.flatMap(getLeaves) : [node];

   const OEE_NODES = getLeaves(unsData); // 10 nodes
   ```

2. **OEE node cycling state**:
   ```typescript
   const [oeeIndex, setOeeIndex] = useState(0);

   useEffect(() => {
     const interval = setInterval(() => {
       setOeeIndex(i => (i + 1) % OEE_NODES.length);
     }, 4000);
     return () => clearInterval(interval);
   }, []);

   const currentNode = OEE_NODES[oeeIndex];
   ```

3. **D3 arc gauge helper** (pure function, no D3 DOM manipulation — just path string):
   ```typescript
   import { arc } from 'd3-shape';

   const buildArcPath = (value: number, outerR = 44, innerR = 32) => {
     const startAngle = -Math.PI * 0.75;
     const endAngle = startAngle + Math.PI * 1.5 * value;
     return arc()({ innerRadius: innerR, outerRadius: outerR, startAngle, endAngle }) ?? '';
   };

   const buildTrackPath = (outerR = 44, innerR = 32) => {
     const startAngle = -Math.PI * 0.75;
     const endAngle = startAngle + Math.PI * 1.5;
     return arc()({ innerRadius: innerR, outerRadius: outerR, startAngle, endAngle }) ?? '';
   };
   ```

4. **OEE color helper**:
   ```typescript
   const oeeColor = (v: number) =>
     v >= 0.85 ? '#6366f1' : v >= 0.75 ? '#f59e0b' : '#ef4444';
   ```

5. **Card JSX** — inserted as second card in right column:
   ```tsx
   <motion.div
     className="hidden md:block bg-[#0e0f1a] rounded-xl border border-gray-700 dark:border-gray-600 p-4 shadow-lg shadow-indigo-500/10"
     initial={{ opacity: 0, x: 40 }}
     animate={{ opacity: 1, x: 0 }}
     transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
     whileHover={{ y: -4, scale: 1.01, transition: { type: 'spring', stiffness: 220, damping: 18 } }}
   >
     {/* Card header */}
     <div className="flex items-center justify-between mb-3">
       <div className="flex items-center gap-1.5 text-indigo-400 font-mono text-xs">
         <Activity size={11} />
         <span>oee.live</span>
       </div>
       <span className="text-gray-500 font-mono text-xs">Richmond / Press</span>
     </div>
     {/* Body: gauge left, metrics right */}
     <div className="flex items-center gap-4">
       {/* SVG gauge */}
       <div className="relative flex-shrink-0">
         <AnimatePresence mode="wait">
           <motion.svg
             key={currentNode.fullPath}
             width={96} height={96}
             viewBox="-50 -50 100 100"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             transition={{ duration: shouldAnimate ? 0.4 : 0 }}
           >
             {/* Track arc */}
             <path d={buildTrackPath()} fill="#1f2937" />
             {/* Value arc */}
             <path d={buildArcPath(currentNode.payload.OEE)} fill={oeeColor(currentNode.payload.OEE)} />
             {/* Center label */}
             <text textAnchor="middle" dominantBaseline="middle" fontSize={14} fontWeight="bold" fill="white">
               {Math.round(currentNode.payload.OEE * 100)}%
             </text>
             <text textAnchor="middle" dominantBaseline="middle" fontSize={6} fill="#9ca3af" y={14}>
               OEE
             </text>
           </motion.svg>
         </AnimatePresence>
       </div>
       {/* Metric rows */}
       <div className="flex flex-col gap-1.5 font-mono text-xs flex-1">
         {(['Availability', 'Quality', 'Performance'] as const).map(key => (
           <div key={key} className="flex items-center justify-between gap-2">
             <span className="text-gray-500">{key.slice(0, 5)}</span>
             <div className="flex-1 h-1 rounded-full bg-gray-700 overflow-hidden">
               <motion.div
                 className="h-full rounded-full bg-indigo-500"
                 initial={{ width: 0 }}
                 animate={{ width: `${Math.round((currentNode.payload[key]) * 100)}%` }}
                 transition={{ duration: shouldAnimate ? 0.6 : 0, ease: 'easeOut' }}
               />
             </div>
             <span className="text-gray-300 w-8 text-right">
               {Math.round((currentNode.payload[key]) * 100)}%
             </span>
           </div>
         ))}
         <div className="mt-1 text-indigo-400 text-[10px] truncate">
           {currentNode.fullPath.split('/').slice(-2).join(' › ')}
         </div>
       </div>
     </div>
   </motion.div>
   ```

6. **Import**: `arc` from `'d3-shape'` (sub-package of d3, tree-shaken by Vite)

> Note: `hidden md:block` ensures this card is desktop-only on mobile.

### Success Criteria

#### Automated Verification
- [x] `npm run build` exits 0 (D3 arc type-checks correctly)
- [x] `npm run lint` exits 0

#### Manual Verification
- [ ] Gauge arc renders correctly for all 10 OEE values (0.76–0.91)
- [ ] Arc color is indigo (≥85%), amber (≥75%), red (<75%)
- [ ] OEE % label in center updates when node cycles
- [ ] Availability/Quality/Performance bars animate width on transition
- [ ] Node name appears in footer of card (last 2 path segments)
- [ ] Card cycles to next node every 4 seconds
- [ ] Card is hidden on mobile (375px viewport)
- [ ] Card is visible at 768px+
- [ ] With `prefers-reduced-motion`: bars and gauge appear instantly (no width animation)

---

## Phase 4: UNS Path Card

**Goal**: Add a compact animated breadcrumb card that cycles through all 10 UNS `fullPath` values, decomposing the path into animated segments.

### Changes Required

**File: `src/components/Hero.tsx`**

1. **UNS path cycling state** (independent index from OEE, offset by 2 to show different node):
   ```typescript
   const [unsIndex, setUnsIndex] = useState(2);

   useEffect(() => {
     const interval = setInterval(() => {
       setUnsIndex(i => (i + 1) % OEE_NODES.length);
     }, 3500);
     return () => clearInterval(interval);
   }, []);

   const currentUnsNode = OEE_NODES[unsIndex];
   const pathSegments = currentUnsNode.fullPath.split('/');
   ```

2. **Card JSX** — inserted as third card in right column:
   ```tsx
   <motion.div
     className="hidden md:flex bg-[#0e0f1a] rounded-xl border border-gray-700 dark:border-gray-600 p-4 shadow-lg shadow-indigo-500/10 flex-col gap-2"
     initial={{ opacity: 0, x: 40 }}
     animate={{ opacity: 1, x: 0 }}
     transition={{ duration: 0.6, ease: 'easeOut', delay: 0.6 }}
     whileHover={{ y: -4, scale: 1.01, transition: { type: 'spring', stiffness: 220, damping: 18 } }}
   >
     {/* Header */}
     <div className="flex items-center gap-1.5 text-indigo-400 font-mono text-xs">
       <GitBranch size={11} />
       <span>uns.path</span>
     </div>
     {/* Animated breadcrumb */}
     <AnimatePresence mode="wait">
       <motion.div
         key={currentUnsNode.fullPath}
         className="flex flex-wrap items-center gap-1 font-mono text-xs"
         initial={{ opacity: 0, y: 4 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -4 }}
         transition={{ duration: shouldAnimate ? 0.35 : 0 }}
       >
         {pathSegments.map((seg, i) => (
           <React.Fragment key={i}>
             <span className={i === pathSegments.length - 1 ? 'text-indigo-300 font-semibold' : 'text-gray-400'}>
               {seg}
             </span>
             {i < pathSegments.length - 1 && (
               <span className="text-gray-600">/</span>
             )}
           </React.Fragment>
         ))}
       </motion.div>
     </AnimatePresence>
     {/* OEE payload preview */}
     <div className="flex gap-3 font-mono text-[10px] text-gray-500 mt-1">
       <span>OEE <span className="text-indigo-400">{Math.round(currentUnsNode.payload.OEE * 100)}%</span></span>
       <span>Avail <span className="text-gray-300">{Math.round(currentUnsNode.payload.Availability * 100)}%</span></span>
       <span>Qual <span className="text-gray-300">{Math.round(currentUnsNode.payload.Quality * 100)}%</span></span>
     </div>
   </motion.div>
   ```

3. **Imports to add**: `GitBranch` from `lucide-react`

### Success Criteria

#### Automated Verification
- [x] `npm run build` exits 0
- [x] `npm run lint` exits 0

#### Manual Verification
- [ ] Breadcrumb path segments render and update every 3.5s
- [ ] Last path segment (node name) is highlighted in indigo
- [ ] OEE/Avail/Qual values shown in footer of card match displayed node
- [ ] Path transitions smoothly (fade + slight vertical shift)
- [ ] Card is hidden on mobile, visible at 768px+
- [ ] All 10 node paths eventually displayed (cycle through unsIndex)

---

## Phase 5: Animated Background

**Goal**: Add a subtle animated SVG background of floating nodes and connection lines that reinforces the "connected systems" theme. Pure Framer Motion — no new dependencies.

### Changes Required

**File: `src/components/Hero.tsx`**

1. **Background component** — pure presentational, defined outside `Hero`:

   ```typescript
   // Deterministic node positions (not random on every render)
   const BG_NODES = [
     { x: 10, y: 15 }, { x: 30, y: 70 }, { x: 50, y: 25 },
     { x: 70, y: 80 }, { x: 85, y: 20 }, { x: 20, y: 45 },
     { x: 60, y: 55 }, { x: 90, y: 60 }, { x: 40, y: 90 },
     { x: 75, y: 40 },
   ]; // coordinates as viewport %

   const BG_EDGES = [
     [0, 2], [2, 4], [1, 5], [5, 6], [6, 3], [7, 4],
     [8, 3], [9, 6], [2, 5], [7, 9],
   ]; // index pairs into BG_NODES
   ```

2. **Render background SVG** — absolutely positioned behind section content:
   ```tsx
   {/* Animated background */}
   {shouldAnimate && (
     <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
       <svg className="w-full h-full opacity-[0.07] dark:opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
         {BG_EDGES.map(([a, b], i) => (
           <motion.line
             key={i}
             x1={`${BG_NODES[a].x}%`} y1={`${BG_NODES[a].y}%`}
             x2={`${BG_NODES[b].x}%`} y2={`${BG_NODES[b].y}%`}
             stroke="#6366f1"
             strokeWidth={1}
             initial={{ pathLength: 0, opacity: 0 }}
             animate={{ pathLength: 1, opacity: 1 }}
             transition={{ duration: 1.5, delay: i * 0.12, ease: 'easeOut' }}
           />
         ))}
         {BG_NODES.map((node, i) => (
           <motion.circle
             key={i}
             cx={`${node.x}%`}
             cy={`${node.y}%`}
             r={3}
             fill="#6366f1"
             initial={{ scale: 0, opacity: 0 }}
             animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
             transition={{ delay: 0.5 + i * 0.08, duration: 3, repeat: Infinity, ease: 'easeInOut' }}
           />
         ))}
       </svg>
     </div>
   )}
   ```

3. **Section must be `relative`** — already set in Phase 1. The background div uses `absolute inset-0`.

4. **Opacity is kept very low**: `opacity-[0.07]` light / `dark:opacity-[0.06]` dark — visible but non-distracting.

5. **`shouldAnimate` guard**: entire background is omitted when `prefers-reduced-motion` is set.

### Success Criteria

#### Automated Verification
- [x] `npm run build` exits 0
- [x] `npm run lint` exits 0

#### Manual Verification
- [ ] Background edges draw in sequentially on load
- [ ] Node dots pulse softly with an infinite scale animation
- [ ] Background is clearly visible but does not obscure any text or cards
- [ ] In light mode: visible at low opacity (0.07)
- [ ] In dark mode: visible at low opacity (0.06)
- [ ] With `prefers-reduced-motion`: background is entirely absent (no SVG rendered)
- [ ] Mobile: background renders (it's full-width SVG, no layout impact)

---

## Phase 6: Polish, Accessibility, and Final Verification

**Goal**: Unify delays, verify full prefers-reduced-motion behavior, test mobile layout, and ensure the complete hero composes correctly at all breakpoints.

### Changes Required

**File: `src/components/Hero.tsx`**

1. **Stagger timing audit** — verify all `delay` values form a coherent sequence:
   - Left column: `delay: 0` (unchanged)
   - MQTT card outer `motion.div`: `delay: 0.2` (unchanged)
   - OEE card: `delay: 0.4`
   - UNS card: `delay: 0.6`
   - Scroll indicator: `delay: 1.2`

2. **Mobile layout verification** — at 375px:
   - Left column: full width, readable
   - MQTT stream card: full width, max 3 messages, no horizontal overflow
   - OEE card: `hidden md:block` — invisible
   - UNS card: `hidden md:flex` — invisible
   - Scroll indicator: visible

3. **Verify `useReducedMotion` gates**:
   - `shouldAnimate = !useReducedMotion()`
   - Gates: background SVG (omitted), `AnimatePresence` transitions (duration: 0), interval still runs (data still updates), scroll indicator bounce loop (omitted)
   - Note: `initial/animate` mount animations still run even with reduced motion — this is intentional and standard

4. **Import cleanup** — ensure all added imports are used; remove any unused ones

5. **Final import block** should be:
   ```typescript
   import React, { useEffect, useState } from 'react';
   import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
   import { ChevronDown, Wifi, Activity, GitBranch } from 'lucide-react';
   import { arc } from 'd3-shape';
   import { unsData, type UnsNode } from '../data/unsData';
   ```

### Success Criteria

#### Automated Verification
- [ ] `npm run build` exits 0 with no warnings
- [ ] `npm run lint` exits 0 with no warnings
- [ ] `tsc --noEmit` clean

#### Manual Verification
- [ ] All 3 data cards visible and animated on desktop (Chrome + Firefox)
- [ ] All cards animate in with staggered delays (0.2, 0.4, 0.6)
- [ ] MQTT stream: messages cycle, colors correct, AnimatePresence transitions smooth
- [ ] OEE gauge: arc renders, width bars animate, node cycles every 4s
- [ ] UNS card: path cycles, last segment highlighted, payload values match node
- [ ] Background: network visible, non-distracting
- [ ] Scroll indicator: bouncing chevron at viewport bottom
- [ ] Dark mode: all cards, text, and borders correct
- [ ] Light mode: all cards, text, and borders correct
- [ ] Mobile 375px: only MQTT card + scroll indicator visible, no overflow
- [ ] Tablet 768px: all 3 cards visible, layout correct
- [ ] "View Demos" and "Contact" anchor links work (scroll to sections)
- [ ] `prefers-reduced-motion`: no looping animations, no background SVG, data still updates

---

## Testing Strategy

This project has no automated test suite. Verification is build + lint + manual browser testing.

- **Build check**: `npm run build` (runs `tsc -b` then `vite build`)
- **Lint check**: `npm run lint`
- **Dev preview**: `npm run dev` then open `http://localhost:5173`
- **Reduced motion**: DevTools → Rendering → Emulate CSS media → prefers-reduced-motion: reduce
- **Mobile**: DevTools → Toggle device toolbar → iPhone SE (375px)
- **Dark mode**: Click sun/moon in Navbar
- **Production preview**: `npm run preview` after build

---

## Rollback / Mitigation Notes

- All changes are in a single file (`Hero.tsx`). Rolling back means restoring the original 104-line file.
- The original Hero.tsx is tracked in git (`38c1c63`). Full rollback: `git checkout 38c1c63 -- src/components/Hero.tsx`
- Each phase is independently buildable — if Phase 3 (OEE/D3) causes issues, it can be removed without affecting Phase 2 (MQTT stream).
- D3 sub-package import (`d3-shape`) is tree-shaken by Vite — no bundle size concern even if the arc() call is later removed.
- No other files are modified by this plan. All other components remain unchanged.
