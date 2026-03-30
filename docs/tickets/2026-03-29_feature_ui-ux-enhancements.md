---
type: feature
priority: high
created: 2026-03-29T00:00:00Z
status: reviewed
tags: portfolio, ui, ux, demos, contact, navbar, uns, mqtt
keywords: UNSExplorer, MQTTExplorer, Contact, Navbar, unsData, useTheme, FadeInWrapper, react-scroll, active section, email submission, node expansion
patterns: scroll spy active link, form submission handler, UNS tree data expansion, image integration in UNS, navbar scroll state, contact emailjs or mailto
---

# FEATURE-002: UI/UX Polish & Feature Enhancements

## Description
Enhance the portfolio's existing UI/UX with richer content, wired-up interactions, and a more polished modern feel — without redesigning the layout or changing the color system. Five targeted improvements: UNS Explorer image integration, contact form email submission, general UI polish, richer UNS/MQTT data, and navbar active-section highlighting.

## Context
The portfolio is functionally complete but several areas are thin or non-functional. The contact form submits nothing, the UNS Explorer has minimal nodes with no visual richness, the navbar has no scroll-position awareness, and some sections feel sparse. These enhancements will make the portfolio feel production-quality and more impressive to viewers.

## In Scope
1. **UNS Explorer — image integration**: User will provide images; integrate them into the UNS node tree (e.g., as node thumbnails, panel previews, or facility/equipment imagery alongside OEE data)
2. **Contact form — email submission**: Wire up the Send button to actually deliver the message (EmailJS recommended — no backend required, free tier sufficient)
3. **UI polish**: Improve spacing, hover states, transitions, card elevation, and visual hierarchy across all sections — keep indigo accent and dark/light theme
4. **UNS/MQTT Explorer — richer data**: Expand `unsData.ts` with more nodes (multiple lines, machines, metrics); expand `MQTTExplorer` simulated topics to match
5. **Navbar — active section highlighting**: Highlight the current nav link as user scrolls through sections

## Out of Scope
- No layout or structural redesign (section order, grid, page flow stays the same)
- No new page sections or routes
- No backend server or database
- No re-enabling `LogSimulator` (unless trivial)
- No typography or color palette changes
- No changes to `NamespaceExplorer` D3 component (keep commented out)
- No authentication or user accounts
- No analytics or tracking

## Requirements

### Functional
- Contact form: name, email, subject, message fields POST to EmailJS and show success/error feedback to user
- UNS Explorer: nodes expand to show user-provided images alongside existing payload data
- UNS data: at least 3 production lines, 2+ machines per line, with OEE + sub-metrics per node
- MQTT simulated topics: match the expanded UNS structure (factory/lineN/machineN/metric)
- Navbar: active link visually distinguishes which section is currently in viewport (using react-scroll or IntersectionObserver)
- All existing functionality remains working (dark/light toggle, demo tabs, smooth scroll)

### Non-Functional
- No new heavy dependencies — prefer EmailJS (already a known no-backend solution) for email
- UI polish changes must not break existing Tailwind dark mode (`dark:` class pairs)
- Animations must remain subtle — no jarring layout shifts
- `npm run build` and `npm run lint` must pass after all changes

## Current State
- `Contact.tsx`: form renders but submit button has no handler; no feedback to user
- `unsData.ts`: single path `Enterprise → Richmond → Press → Line1` with 4 OEE metrics
- `MQTTExplorer.tsx`: 3 hardcoded simulated topics (`factory/line1/machineA/B/C`)
- `Navbar.tsx`: nav links use `react-scroll` but no active-state tracking
- General UI: functional but some sections lack hover polish, card depth, and visual breathing room

## Desired State
- Contact form submits email via EmailJS; shows "Message sent!" or error inline
- UNS Explorer displays expanded tree with images integrated at relevant nodes
- `unsData.ts` has a multi-line, multi-machine hierarchy with realistic payloads
- MQTT simulated topics align with expanded UNS node names
- Navbar link for the current viewport section is visually active (color/underline/indicator)
- Sections feel polished: smooth hover states, consistent card shadows, refined spacing

## Research Context

### Keywords to Search
- `Contact.tsx` — form structure, input names, submit button
- `unsData.ts` — current UnsNode shape, payload structure
- `MQTTExplorer.tsx` — simulatedTopics array, generateSimulatedMessage function
- `Navbar.tsx` — Link components, react-scroll usage, theme toggle placement
- `UNSExplorer.tsx` — renderNode function, payload rendering, image integration point
- `FadeInWrapper.tsx` — animation props for polish consistency
- `package.json` — check if emailjs-com or @emailjs/browser already installed

### Patterns to Investigate
- EmailJS integration pattern (no-backend form submission with env vars for service/template/public key)
- react-scroll `onSetActive` / `spy` prop for active link detection
- UNS image node pattern: where in UnsNode type to add optional `imageUrl` field
- Tailwind hover/transition patterns used in existing components for consistency
- MQTT topic naming convention in existing simulatedTopics (factory/lineN/machineN/state)

### Decisions Already Made
- Keep EmailJS (no backend — solo project constraint)
- Keep `react-scroll` for nav (already installed, no new dep)
- Keep `UnsNode` type shape — extend with optional `imageUrl?: string` field only
- Indigo accent (`indigo-500`/`indigo-600`) stays as the active/highlight color
- Images for UNS will be provided by user before implementation — placeholder needed until received

## Success Criteria

### Automated Verification
- [ ] `npm run build` exits 0
- [ ] `npm run lint` exits 0

### Manual Verification
- [ ] Submitting the contact form with valid data delivers an email (or console confirms EmailJS call in dev)
- [ ] Contact form shows visible success/error state after submit
- [ ] UNS Explorer tree expands to show at least 3 lines × 2 machines
- [ ] UNS nodes with images display them alongside the payload
- [ ] MQTT Explorer simulated mode cycles through topics matching the expanded UNS structure
- [ ] Scrolling through the page causes the correct navbar link to appear active
- [ ] Dark mode still works correctly on all modified components
- [ ] All demo tabs (UNS, MQTT, ScriptProfiler) still function

## Notes
- EmailJS requires a free account + service ID + template ID + public key — store in `.env` as `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`
- User will provide images for UNS nodes — research phase should prepare the `imageUrl` integration point in `UnsNode` type; execution waits for asset delivery
- If user provides images before execution, add to `src/assets/` and reference in `unsData.ts`
- `react-scroll` `<Link>` supports `spy={true}` and `activeClass` props natively — no IntersectionObserver needed
