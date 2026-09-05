# CenterNet (سنتر نت)

A bilingual-oriented (Arabic RTL) admin dashboard for managing tutor centers. CenterNet is a responsive, role-based school management UI built around the "Elite Educational Center" (مركز النخبة التعليمي) demo dataset — teachers, students, groups, attendance, and grades.

> **Status:** Frontend preview. All data and authentication are currently mocked client-side. A real backend/API can be wired in later through the existing service layer.

## Features

- **Role-based dashboards** — Admin, Teacher, and Parent views with role-guarded routes
- **Tutor center operations** — Students, teachers, groups, parents, and parent–center messages
- **Attendance tracking** — Admin summaries, per-group teacher entry workspaces (present / late / absent), and parent views
- **Grade book** — Assessment entry & editing dialogs (quiz / monthly / final), filters, search, and per-student grade history panels
- **Dashboard widgets** — KPIs, activity feeds, alerts, attendance & grade overviews, teacher performance
- **RTL Arabic UI** — Full `dir="rtl"` layout with Arabic locale formatting and the IBM Plex Sans Arabic font
- **Mock auth** — Instant preview login as Admin, Teacher, or Parent (no backend needed)

## Tech Stack

| Layer | Library |
| --- | --- |
| Build | [Vite](https://vitejs.dev/) + TypeScript |
| UI | [React 19](https://react.dev/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first theme) + [shadcn/ui](https://ui.shadcn.com/) components |
| Routing | [React Router v7](https://reactrouter.com/) |
| Data | [TanStack Query](https://tanstack.com/query) + a mock service layer (Axios-ready) |
| State | [Zustand](https://github.com/pmndrs/zustand) (auth session) |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Charts | [Recharts](https://recharts.org/) |
| Icons | [Tabler Icons](https://tabler.io/icons) |
| Extras | [Radix UI](https://www.radix-ui.com/), [Vaul](https://vaul.emilkowal.ski/), [Sonner](https://sonner.emilkowal.ski/) toasts |

## Getting Started

> Requires **Node.js 20+** and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (http://localhost:5173)
npm run dev
```

### Preview login

Credentials are mock — any password works, but use these for convenience:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@centernet.app` | `Preview123!` |
| Teacher | (see `src/features/auth/constants/preview-sessions.ts`) | `Preview123!` |
| Parent | (see `src/features/auth/constants/preview-sessions.ts`) | `Preview123!` |

Sessions are stored in `localStorage` under `centernet.auth.session`.

### Environment variables

Optional. The app works without any:

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `/api` | Base URL used by the API client when a real backend is connected |

See `src/.env.example`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check then build for production (`tsc -b && vite build`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Type-check without emitting (`tsc --noEmit -p tsconfig.app.json`) |

## Project Structure

```
frontend/
├── public/                  # Static assets (favicon, icons)
├── src/
│   ├── app/                 # Router, providers, layouts, route guards
│   ├── components/          # Layout, shared, and shadcn/ui primitives
│   ├── features/            # Feature modules: auth, attendance, grades,
│   │                        #   groups, parents, settings, students, teachers, dashboard
│   ├── mocks/               # In-memory database + mock service layer
│   ├── services/            # API client, query keys, auth/role + storage helpers
│   ├── theme/               # Design tokens (colors, spacing, typography, radius)
│   ├── types/               # Shared domain types
│   ├── constants/           # App config and navigation definition
│   ├── hooks/               # Shared hooks
│   ├── lib/                 # Utils and environment access
│   └── styles/              # Global CSS / Tailwind theme
```

## Deployment

The project is deployed on Vercel as `centernet-frontend`.

```bash
# Production
vercel --prod

# Preview
vercel
```

`index.html` is preconfigured for a root-level static deployment; no base path or server rewrites are required. Since all features are mocked, no server-side configuration is needed to run it.