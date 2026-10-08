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

