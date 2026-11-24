# BloodBridge

A premium, animated React frontend for a blood-availability platform connecting
patients with verified hospitals in real time.

## Stack
- React 19 + Vite
- Tailwind CSS v4
- Framer Motion
- React Router
- lucide-react icons

## Design system
- **Palette** — blood reds (`#DC2626` / `#EF4444`) on a warm off-white paper background,
  deep ink text, soft glass surfaces. See `--color-*` tokens in `src/index.css`.
- **Type** — Fraunces (display/headlines), Inter (UI/body), JetBrains Mono (stats, data).
- **Signature motif** — the "Vital Line," an animated heartbeat waveform that threads
  through the hero and about page (`src/components/ui/VitalLine.jsx`).

## Run locally
```bash
npm install
npm run dev
```

## Build for production
```bash
npm run build
```
Output is written to `dist/`.

## Structure
```
src/
  components/
    layout/   Navbar, Footer, EmergencyButton, DashboardShell
    sections/ Hero, Stats, Features, HowItWorks, Testimonials, CTABanner
    ui/       Button, GlassCard, StatCounter, VitalLine, DropletField,
              StatusPill, HospitalCard, BarChart
  pages/      Home, FindBlood, Hospitals, About, Contact, Login, Register,
              PatientDashboard, HospitalDashboard, NotFound
  lib/data.js Mock data (hospitals, stats, testimonials, notifications)
```

## Pages
- `/` — landing page
- `/find-blood` — public search with blood-group filter + distance slider
- `/hospitals` — hospital directory
- `/about`, `/contact`
- `/login`, `/register` — role toggle (patient / hospital)
- `/dashboard` — patient portal
- `/hospital-dashboard` — hospital admin (inventory CRUD, stock chart, notifications)
- `*` — 404
