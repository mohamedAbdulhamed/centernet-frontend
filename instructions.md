# Frontend AI Agent Instructions

## CenterNet / Center Management SaaS Platform

### React Frontend Foundation Instructions

---

# 1. Project Context

You are building the frontend foundation for a modern SaaS platform used by Egyptian tutoring centers.

The platform manages:

* students,
* teachers,
* attendance,
* grades,
* groups/classes,
* and parent monitoring.

This is NOT a school LMS.

This is:

> an operational management platform for tutoring centers.

The frontend should feel:

* premium,
* calm,
* operational,
* modern,
* scalable,
* and highly usable.

The platform identity is:

> “Operational OS for tutoring centers.”

---

# 2. Technical Stack Requirements

The project MUST use the following stack.

---

# Core Stack

## Framework

* React
* TypeScript
* Vite

---

## Styling

* Tailwind CSS

---

## UI Components

* shadcn/ui

---

## Routing

* React Router DOM

---

## State Management

* Zustand

---

## Server State

* TanStack Query

---

## Forms

* React Hook Form

---

## Validation

* Zod

---

## Charts

* Recharts

---

## Icons

* Tabler Icons OR Lucide React

---

## Notifications

* Sonner

---

# 3. Architecture Requirements

The frontend MUST use:

* scalable architecture,
* reusable components,
* modular feature organization,
* and clean separation of concerns.

DO NOT create a messy beginner-level React structure.

---

# Required Architecture Style

Use:

* feature-based architecture,
* reusable design system,
* modular pages,
* and shared layouts.

---

# 4. Required Folder Structure

The AI agent MUST generate the following structure.

```text id="wnokj0"
src/
│
├── app/
│   ├── router/
│   ├── layouts/
│   ├── providers/
│   └── guards/
│
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── students/
│   ├── teachers/
│   ├── groups/
│   ├── attendance/
│   ├── grades/
│   ├── parents/
│   ├── notifications/
│   └── settings/
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── shared/
│   ├── charts/
│   ├── tables/
│   ├── forms/
│   └── feedback/
│
├── services/
│   ├── api/
│   ├── auth/
│   └── storage/
│
├── hooks/
│
├── theme/
│
├── types/
│
├── lib/
│
├── constants/
│
├── utils/
│
├── assets/
│
└── styles/
```

---

# 5. Theme Requirements

The platform uses a warm premium operational SaaS theme.

The frontend MUST implement a centralized design system.

---

# Required Theme Tokens

## Colors

```css id="13ym3m"
--color-primary-dark: #16162a;
--color-accent: #e8650a;
--color-success: #1e4d35;

--color-bg-main: #ede8e1;
--color-bg-card: #ffffff;
--color-surface-soft: #f5f0ea;

--color-text-primary: #16162a;
--color-text-secondary: #5a5060;
--color-text-muted: #a09080;
--color-text-soft: #c0b0a0;

--color-border: #ddd6ce;
--color-divider: #f0ece6;
```

---

# Typography

## Primary Font

* Outfit

## Data/Analytics Font

* Space Mono

---

# Radius Tokens

```css id="j6crx6"
--radius-sm: 6px;
--radius-md: 10px;
--radius-lg: 16px;
--radius-xl: 20px;
```

---

# Theme Rules

The UI MUST:

* feel calm,
* avoid strong gradients,
* avoid glassmorphism,
* avoid neon colors,
* avoid excessive shadows.

The UI should rely on:

* spacing,
* hierarchy,
* borders,
* typography,
* and subtle contrast.

---

# 6. Design System Requirements

The AI agent MUST create reusable base components.

---

# Required Base Components

Create reusable:

* Button
* Card
* MetricCard
* Badge
* AppTable
* EmptyState
* LoadingSkeleton
* SectionHeader
* Modal
* Drawer
* Input
* Select
* Textarea
* PageContainer
* DashboardWidget

---

# 7. Layout Requirements

The platform requires reusable layouts.

---

# Required Layouts

## Auth Layout

Used for:

* login,
* forgot password,
* reset password.

---

## Dashboard Layout

Contains:

* sidebar,
* top navigation,
* content area,
* responsive drawer behavior.

---

# Sidebar Requirements

Sidebar must support:

* active route highlighting,
* grouped navigation,
* icons,
* responsive collapse.

---

# 8. Routing Requirements

The app MUST use:

* role-based routes,
* protected routes,
* nested layouts.

---

# Required Route Groups

```text id="qlh6g2"
/login

/admin
/admin/dashboard
/admin/students
/admin/students/:id
/admin/teachers
/admin/groups
/admin/attendance
/admin/grades
/admin/parents
/admin/settings

/teacher
/teacher/dashboard
/teacher/groups
/teacher/attendance
/teacher/grades

/parent
/parent/dashboard
/parent/attendance
/parent/grades
```

---

# 9. Authentication Requirements

Implement JWT-ready architecture.

DO NOT hardcode auth logic.

---

# Required Auth Features

* Protected routes
* Role-based access
* Auth store using Zustand
* Axios interceptor support
* Token persistence layer
* Future refresh-token support

---

# 10. API Layer Requirements

The frontend MUST implement centralized API architecture.

---

# Required API Setup

Create:

* Axios client
* Request interceptors
* Response interceptors
* Error handling layer
* Query hooks architecture

---

# Required Structure

```text id="jlwmj9"
services/
  api/
    client.ts
    endpoints.ts
    interceptors.ts
```

---

# 11. State Management Rules

Use:

* Zustand for global app state
* TanStack Query for async/server state

DO NOT:

* use Redux
* duplicate API state in Zustand
* use Context API for everything

---

# 12. Dashboard Requirements

The dashboard must feel:

* operational,
* analytical,
* premium.

---

# Dashboard Widgets

Create reusable widgets for:

* metrics
* attendance
* grades
* teacher performance
* alerts
* activity feed

---

# Dashboard Design Rules

Use:

* grid layouts
* cards
* soft borders
* compact analytics
* glanceable data

DO NOT:

* overcrowd dashboards
* use excessive charts
* create noisy interfaces

---

# 13. Responsiveness Requirements

The app MUST be responsive.

---

# Responsive Rules

## Desktop

* full sidebar
* multi-column dashboards

---

## Tablet

* collapsible sidebar
* reduced spacing

---

## Mobile

* drawer sidebar
* stacked cards
* simplified layouts

---

# 14. Code Quality Rules

The AI agent MUST:

* use TypeScript strictly,
* avoid any unnecessary `any`,
* use reusable abstractions,
* separate business logic from UI,
* avoid giant components.

---

# Required Practices

* feature isolation
* reusable hooks
* typed DTOs
* reusable table system
* centralized constants
* clean imports

---

# 15. What NOT To Do

DO NOT:

* use Redux
* use CSS modules
* use inline hardcoded colors everywhere
* use random folder organization
* use deeply nested prop drilling
* create huge monolithic pages
* overengineer microfrontends
* use Next.js SSR
* add unnecessary animations
* create childish educational UI

---

# 16. Initial Pages To Build

The AI agent should ONLY build foundational MVP pages initially.

---

# Initial Screens

## Auth

* Login page

---

## Admin

* Dashboard
* Students list
* Student details
* Teachers list
* Groups list

---

## Teacher

* Dashboard
* Attendance session page

---

## Parent

* Dashboard
* Grades page
* Attendance page

---

# 17. Development Priorities

The AI agent should build in this order.

---

# Phase 1

* Project setup
* Tailwind
* shadcn
* routing
* layouts
* theme system

---

# Phase 2

* reusable components
* dashboard widgets
* table system
* forms

---

# Phase 3

* auth architecture
* protected routes
* Zustand store

---

# Phase 4

* admin dashboard
* students module
* teachers module

---

# Phase 5

* attendance workflow
* grades workflow
* parent portal

---

# 18. UX Philosophy

The frontend should optimize for:

* operational speed,
* clarity,
* low cognitive load,
* fast workflows.

Teachers and center admins are NOT highly technical users.

The UI should feel:

* efficient,
* professional,
* calm,
* and trustworthy.

---

# 19. Final Objective

The final frontend foundation should resemble:

* a modern SaaS dashboard,
* scalable enterprise-grade architecture,
* and a production-ready React codebase.

The result should NOT feel like:

* a student project,
* a beginner React app,
* or a random admin template.

The codebase must be:

* scalable,
* maintainable,
* reusable,
* and clean enough for long-term development.

---
