# Loomline ERP — Frontend (React + Vite + TypeScript + Tailwind)

A "blueprint / industrial control room" themed UI for a garment manufacturing ERP — dark navy panels, amber & teal accents, monospace technical type, and a faint grid backdrop that evokes a factory floor planning board.

## Setup

```bash
cd frontend
cp .env.example .env   # point VITE_API_URL at your backend
npm install
npm run dev              # http://localhost:5173
```

Login with the seeded backend admin: `admin@garmenterp.com` / `Admin@123`

## Stack
- React 18 + TypeScript + Vite
- Tailwind CSS (custom "ink/amber/teal" design tokens, see `tailwind.config.js`)
- Redux Toolkit + RTK Query for state & API data fetching/caching
- React Router v6
- Recharts for dashboard/report visualizations

## Structure
- `src/layout` — app shell (sidebar nav), protected route wrapper
- `src/pages` — one page per ERP module (Dashboard, Orders, Design & Sampling, Procurement, Inventory, Production, Quality, Costing, Dispatch, Invoicing, Reports, Settings)
- `src/components` — shared UI (KPI cards, status badges, modals) + per-module form modals
- `src/api` — RTK Query endpoint definitions per module
- `src/features/authSlice.ts` — auth/session state (JWT persisted to localStorage)
