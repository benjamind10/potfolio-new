# Ben Duran — Industry 4.0 Portfolio

A single-page portfolio built with React 19 + TypeScript showcasing Industry 4.0 engineering skills: Ignition, MQTT, Unified Namespace (UNS), and MES development.

**Live demos include:**
- UNS Explorer — interactive drill-down tree of a Unified Namespace hierarchy with OEE metrics
- MQTT Explorer — real-time topic browser with simulated mode and live HiveMQ connection
- Script Profiler Java Module — Ignition Gateway module for profiling Jython scripts

---

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 6** — build tool and dev server
- **Tailwind CSS v4** — utility-first styling with class-based dark mode
- **Framer Motion** — scroll-triggered and mount animations
- **mqtt.js** — WebSocket MQTT client
- **D3 v7** — data visualization
- **Lucide React** — icon library

---

## Prerequisites

- Node.js ≥ 18
- npm ≥ 9

---

## Setup

```bash
# 1. Clone the repo
git clone https://github.com/benjamind10/portfolio.git
cd portfolio

# 2. Install dependencies
npm install

# 3. Create environment file
echo "VITE_MQTTBROKER=wss://broker.hivemq.com:8884/mqtt" > .env

# 4. Start dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

> The `.env` file is already committed with the default HiveMQ public broker. The MQTT Explorer works in simulated mode without a broker connection.

---

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check + production build → `dist/` |
| `npm run lint` | Run ESLint |
| `npm run preview` | Serve the production build locally |

---

## Project Structure

```
src/
├── components/       React page sections and demo components
│   └── common/       Shared utility components (FadeInWrapper)
├── hooks/            Custom hooks (useTheme, useMqtt)
├── data/             Static UNS data structures
├── utils/            Utility functions (cn classname helper)
└── assets/           Images used in the app
public/
├── computer-chip.png Favicon
└── resume.pdf        Resume download (add manually if missing)
```

---

## Contact

- Email: ben.duran@proton.me
- GitHub: [benjamind10](https://github.com/benjamind10)
- LinkedIn: [benjamin-duran](https://www.linkedin.com/in/benjamin-duran-3a880a1b9/)
