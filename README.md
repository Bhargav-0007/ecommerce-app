# Appkhila — Full-Stack E-Commerce Platform

A modern, production-ready e-commerce web application built with React + TypeScript on the frontend and Java Spring Boot on the backend.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v3 |
| Routing | React Router v7 |
| State Management | Zustand (persisted) |
| Backend | Java 17 + Spring Boot 3.3 |
| Auth | Spring Security 6 + JWT (JJWT 0.12) |
| ORM | Spring Data JPA + Hibernate |
| Database (dev) | H2 (file-based) |
| Database (prod) | PostgreSQL |
| Deployment | Vercel (frontend) + Railway (backend) |

---

## Features

### Store (Public)
- Responsive home page — hero, featured products, categories, promotions, newsletter
- Product catalog with category sidebar, sort controls, and URL-based pagination
- Product detail page — image viewer, quantity picker, stock status
- Add to cart with toast notifications, cart badge in header
- Mobile-friendly header with slide-out drawer, search bar

### Admin Panel (`/admin`)
- Secure JWT-based login — admin auto-redirected on sign in
- **Dashboard** — live stats: revenue, orders, products, users
- **Product management** — add, edit, delete products with image, pricing, stock, category
- **Order management** — view all orders, update status (Pending → Processing → Shipped → Delivered → Cancelled), expand to see order items
- **User management** — list, add, edit, delete users; promote to Admin or demote to Customer

---

## Getting Started

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | 18+ |
| Java | 17 |
| Maven | 3.9+ (bundled via wrapper) |

### 1. Install frontend dependencies

```bash
npm install
```

### 2. Start both servers

**Option A — two separate terminals:**

```bash
# Terminal 1: Frontend (http://localhost:5173)
npm run dev

# Terminal 2: Backend API (http://localhost:3001)
npm run dev:server
```

**Option B — single command:**

```bash
npm run dev:all
```

### 3. Open the app

| URL | What |
|---|---|
| http://localhost:5173 | Store (public) |
| http://localhost:5173/login | Sign in |
| http://localhost:5173/admin | Admin panel |

### Default Admin Credentials

```
Email:    admin@appkhila.com
Password: admin123
```

> Change these immediately after first login via the Users page in the admin panel.

---

## Project Structure

```
ecommerce-app/
├── src/                          # React frontend
│   ├── components/
│   │   ├── layout/               # Header, Footer, Layout
│   │   ├── product/              # ProductCard
│   │   └── ui/                   # Toast, Skeleton, Breadcrumb, ScrollToTop
│   ├── constants/                # Routes, theme values, site name
│   ├── hooks/                    # useProducts, useCategories API hooks
│   ├── lib/                      # apiUrl(), authHeaders() utilities
│   ├── pages/
│   │   ├── admin/                # AdminLayout, Dashboard, Products, Orders, Users
│   │   ├── Home.tsx
│   │   ├── Products.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Login.tsx
│   │   ├── Cart.tsx
│   │   └── Register.tsx
│   ├── store/                    # cartStore, authStore, uiStore (Zustand)
│   └── types/                    # TypeScript interfaces
│
└── server/                       # Spring Boot backend
    └── src/main/java/com/appkhila/server/
        ├── controller/           # ProductController, CategoryController,
        │                         # AuthController, Admin*Controllers
        ├── model/                # Product, Category, User, Order, OrderItem
        ├── repository/           # JPA repositories
        ├── dto/                  # Request/response DTOs
        ├── security/             # JwtUtil, JwtFilter, SecurityConfig
        └── DataSeeder.java       # Seeds categories, products, default admin
```

---

## API Endpoints

### Public
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Paginated product list (filter, sort, search) |
| GET | `/api/products/featured` | Featured products |
| GET | `/api/products/:slug` | Single product |
| GET | `/api/categories` | All categories |
| GET | `/api/categories/:slug` | Single category |
| POST | `/api/auth/login` | Login — returns JWT + user |

### Admin (requires `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/stats` | Dashboard metrics |
| GET/POST/PUT/DELETE | `/api/admin/products` | Product CRUD |
| GET/POST/PUT/DELETE | `/api/admin/users` | User management |
| GET | `/api/admin/orders` | All orders |
| PUT | `/api/admin/orders/:id/status` | Update order status |

---

## Environment Variables

### Frontend (Vercel)
| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Railway backend URL (e.g. `https://your-app.up.railway.app`) |

### Backend (Railway)
| Variable | Description |
|---|---|
| `SPRING_PROFILES_ACTIVE` | Set to `prod` to use PostgreSQL |
| `PGHOST` / `PGPORT` / `PGDATABASE` / `PGUSER` / `PGPASSWORD` | Auto-set by Railway PostgreSQL plugin |
| `ALLOWED_ORIGINS` | Comma-separated allowed CORS origins (e.g. `https://appkhila.vercel.app`) |
| `JWT_SECRET` | Secret key for signing JWTs (min 32 characters) |

---

## Deployment

### Backend → Railway
1. New project → Deploy from GitHub → set **Root Directory** to `/server`
2. Add **PostgreSQL** plugin (env vars injected automatically)
3. Set env vars: `SPRING_PROFILES_ACTIVE=prod`, `ALLOWED_ORIGINS=<vercel-url>`, `JWT_SECRET=<secret>`

### Frontend → Vercel
1. New project → Import GitHub repo (root directory stays `/`)
2. Set env var: `VITE_API_BASE_URL=<railway-url>`
3. Deploy

---

## Roadmap

| Step | Status | Description |
|---|---|---|
| 1 | ✅ Done | Vite + React scaffold, routing, Home page |
| 2 | ✅ Done | Spring Boot API, Header, Footer, Zustand stores, Toast system |
| 3 | ✅ Done | Product catalog, filters, sort, pagination, Product detail page |
| 4 | ✅ Done | Admin panel — auth (JWT), product/user/order management |
| 5 | 🔜 Next | Shopping cart page + full checkout flow |
| 6 | ⬜ | Customer auth (register, login, account page) |
| 7 | ⬜ | Order history + tracking for customers |
| 8 | ⬜ | Reviews & ratings |
| 9 | ⬜ | Search improvements, SEO, performance |
| 10 | ⬜ | Final polish + production hardening |

---

## License

MIT
