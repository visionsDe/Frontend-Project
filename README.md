# Sample Marketplace Dashboard

A curated slice of a production **Next.js 15 + TypeScript + MUI 5 + Redux Toolkit**
admin dashboard, sanitized for sharing. Not a runnable product on its own —
pairs with [sample-marketplace-backend](../sample-marketplace-backend/) to form
a two-sided reference for how I structure a mobile-marketplace stack.

Written entirely in TypeScript, `strict: true`, no plain `.js` files in `src/`.

## Modules included

| # | Module | What it demonstrates | Key paths |
|---|---|---|---|
| **1** | **Multi-country payments admin** | Held-funds list, per-currency rollup chart, server-side pagination, filter chips, debounced search | `src/views/payments/`, `src/services/payments.ts` |
| **2** | **Subscription webhooks + Apple offer-code generator** | Audit-log table with outcome chips + provider filter, react-hook-form + valibot form in an MUI `<Dialog>` | `src/views/webhooks/`, `src/services/webhooks.ts` |
| **3** | **Real-time chat panel** | Socket.IO context provider, optimistic message append, `react-dropzone` file upload | `src/contexts/SocketContext.tsx`, `src/views/chat/`, `src/services/chat.ts` |
| **4** | **Reusable DataGrid** | Generic `<T>` wrapper around `@tanstack/react-table`, consumed by every list in the sample | `src/components/DataGrid.tsx` |
| **5** | **AI usage dashboard** | ECharts line chart, per-feature cost rollup table, sub-cent formatter | `src/views/ai-usage/`, `src/utils/formatters.ts` |

## Project layout

```
src/
├── app/[lang]/            Next.js App Router, locale segment
│   ├── (dashboard)/       Authenticated shell + per-module pages
│   └── login/             Public sign-in page
├── components/            Providers, AuthRedirect, DataGrid
├── config/                i18n config
├── contexts/              SocketContext
├── environments/          Endpoint catalogue
├── redux-store/           Typed store + slices (RTK createSlice)
├── services/              Axios-backed data layer, one file per module
├── types/                 Shared API envelope types
├── utils/                 Axios instance, formatters, datetime, string
└── views/                 Feature components, one folder per module
tests/                     Vitest + jsdom
```

## Patterns worth looking at

- **Type-safe axios client** — [src/utils/axiosInstance.ts](src/utils/axiosInstance.ts): request interceptor attaches a Bearer token, response interceptor funnels 401s into a global sign-out.
- **Services as the one place endpoints appear** — [src/services/payments.ts](src/services/payments.ts), [src/services/webhooks.ts](src/services/webhooks.ts): views import typed functions, not raw URLs.
- **Modern Redux Toolkit `createSlice`** — [src/redux-store/slices/chatModule.ts](src/redux-store/slices/chatModule.ts): no hand-written action-type strings, Immer-based reducers.
- **Typed selectors / dispatchers** — [src/redux-store/index.ts](src/redux-store/index.ts): `useAppSelector` / `useAppDispatch` so no feature code is typed as `any`.
- **Generic DataGrid** — [src/components/DataGrid.tsx](src/components/DataGrid.tsx): `<T>` generic so column accessors are compile-time checked against the row type.
- **Form with valibot + react-hook-form** — [src/views/webhooks/GenerateOfferCodeDialog.tsx](src/views/webhooks/GenerateOfferCodeDialog.tsx): resolver pattern, `<Controller>` wiring MUI inputs to form state.
- **Socket.IO context** — [src/contexts/SocketContext.tsx](src/contexts/SocketContext.tsx): single process-wide connection, incoming events filtered against active conversation and dispatched through Redux.

## How to run

```bash
cp .env.example .env.local
# point NEXT_PUBLIC_API_BASE_URL at the paired backend
npm install
npm run dev
```

Dashboard runs on `http://localhost:3000`.

## How to run the tests

```bash
npm install
npm test
```

Tests target the pure/stateless pieces — string/money formatters, cost-conversion
rounding, Redux slice reducers — so a reviewer can clone and get a green run
without provisioning the backend.

## What's deliberately not here

- Full MUI dashboard template chrome (sidebar, breadcrumbs, demo pages)
- Vendor template files (`@core/`, `@menu/`, `@layouts/`, iconify bundles)
- NextAuth / OAuth provider wiring
- Six-locale i18n dictionaries (shape is in place; only `en` is wired)
- Real client brand strings, bundle IDs, Firebase or push credentials
