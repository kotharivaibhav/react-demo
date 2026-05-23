# React Demo — Phase 1 Boilerplate

Production-ready React fundamentals boilerplate with Vite, TypeScript, routing, and reusable UI components.

## Tech Stack

- **Vite** + **React 19** + **TypeScript**
- **React Router v7** — public, private, dynamic, and nested routes
- **ESLint** + **Prettier** + **Husky** + **lint-staged**
- **Absolute imports** via `@/` alias

## Project Structure

```
src/
├── api/              # Mock data & API helpers
├── assets/           # Static assets
├── components/
│   ├── common/       # Header, shared layout pieces
│   ├── ui/           # Button, Input, Modal, Table, Loader, Toast, Pagination
│   └── forms/        # LoginForm
├── config/           # Environment config
├── constants/        # Routes, app constants
├── context/          # Auth & Toast providers
├── features/         # Feature modules (Phase 2)
├── hooks/            # usePagination, etc.
├── layouts/          # MainLayout, AuthLayout, AccountLayout
├── pages/            # Route pages
├── redux/            # Redux store (Phase 2)
├── routes/           # Router, guards
├── services/         # API services
├── styles/           # Global CSS
├── types/            # Shared TypeScript types
├── utils/            # Helpers
├── validations/      # Form validation
└── main.tsx
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Demo Login

Use any valid email and a password with 6+ characters to sign in.

## Scripts

| Command            | Description                   |
| ------------------ | ----------------------------- |
| `npm run dev`      | Start dev server              |
| `npm run build`    | Type-check + production build |
| `npm run lint`     | Run ESLint                    |
| `npm run lint:fix` | Fix ESLint issues             |
| `npm run format`   | Format with Prettier          |
| `npm run preview`  | Preview production build      |

## Phase 1 Features

### Routing

| Route                  | Type    | Page            |
| ---------------------- | ------- | --------------- |
| `/`                    | Public  | Home (products) |
| `/products/:productId` | Dynamic | Product Details |
| `/login`               | Guest   | Login           |
| `/cart`                | Private | Cart            |
| `/account/profile`     | Nested  | Profile         |
| `/account/settings`    | Nested  | Settings        |

### UI Components

- `Button` — variants, sizes, loading state
- `Input` — controlled, label, error
- `Modal` — composition, escape/overlay close
- `Table` — generic columns with custom render
- `Loader` — inline and fullscreen
- `Toast` — context-based notifications
- `Pagination` — page numbers with ellipsis

## Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

## Phase 2 — Advanced React

### Custom Hooks (`src/hooks/`)

| Hook                | Purpose                                |
| ------------------- | -------------------------------------- |
| `useDebounce`       | Delays search input before API call    |
| `useInfiniteScroll` | `IntersectionObserver` loads next page |
| `useLocalStorage`   | State synced with `localStorage`       |

### Redux Toolkit (`src/redux/`, `src/features/`)

| Slice / API    | Responsibility                    |
| -------------- | --------------------------------- |
| `authSlice`    | Login/logout thunks, tokens, user |
| `cartSlice`    | Add/remove/qty, persisted cart    |
| `productSlice` | Infinite list + async thunks      |
| `productsApi`  | RTK Query for product detail      |

### API Layer (`src/api/`)

- **`apiClient`** — Axios instance with **mock adapter** (fake data, real call pattern)
- **Request interceptor** — attaches `Bearer` access token
- **Response interceptor** — **401 → refresh token → retry**, 5xx retry
- **`authApi` / `productApi`** — typed service functions

To connect a real backend: remove `adapter: mockAdapter` from `src/api/client.ts`.

## Phase 3 — Production Features

### Authentication

- **Login / Signup** with React Hook Form + Zod
- **JWT** access + refresh tokens (`src/utils/jwt.ts`)
- **Google login** (mock OAuth)
- **Session validation** on app load (`validateSessionThunk`)

Demo accounts:
| Email | Password | Role |
|-------|----------|------|
| admin@test.com | admin123 | Admin |
| vendor@test.com | vendor123 | Vendor |
| demo@test.com | demo123 | User |

### Forms (RHF + Zod)

- **Checkout** — `/checkout` (address + dynamic card fields)
- **Profile update** — `/account/profile`
- Reusable **AddressFormFields** (nested dynamic form)

### Role-based access

- Roles: `admin`, `vendor`, `user`
- `RoleRoute` — route guards
- `PermissionGate` — conditional UI
- `/admin` and `/vendor` dashboards

### Search & filtering

- URL query params: `?q=&category=&sortBy=&sortOrder=&page=`
- Debounced search
- Category filter, sort, pagination

## Phase 4 — Performance

| Feature               | Implementation                                                       |
| --------------------- | -------------------------------------------------------------------- |
| **Lazy loading**      | `React.lazy` + `Suspense` per route (`src/routes/lazyPages.tsx`)     |
| **Code splitting**    | Vite `manualChunks` for react, router, redux, forms, virtual, socket |
| **Memoization**       | `memo` on `ProductCard`, `VirtualProductGrid`, `NotificationBell`    |
| **Virtual scrolling** | `@tanstack/react-virtual` — toggle on Home page                      |
| **RTK Query cache**   | `keepUnusedDataFor`, `serializeQueryArgs`, tag invalidation          |
| **Redis mock cache**  | `src/api/cache/redisCache.ts` — TTL cache in mock API handlers       |

## Phase 5 — Realtime (Socket.io)

| Feature              | Implementation                                       |
| -------------------- | ---------------------------------------------------- |
| **Socket.io client** | `socket.io-client` + mock event emitter (default)    |
| **Notifications**    | Bell icon in header, Redux `notificationsSlice`      |
| **Order updates**    | Live panel + emitted on checkout                     |
| **Live stock**       | `stock:update` events + `LiveStockBadge` on products |

Mock socket emits events every ~8s. Set `VITE_SOCKET_URL` to connect a real server.

### Try Phase 2

1. **Home** — type in search (debounced), scroll down (infinite load)
2. **Add to cart** — badge updates in header
3. **Product detail** — RTK Query cached fetch
4. **Login** — Redux auth + tokens in `localStorage`
