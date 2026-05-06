# Appkhila — Full-Stack E-Commerce Website

A modern, full-featured e-commerce web application built with React, TypeScript, and Tailwind CSS.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 |
| State Management | Zustand |
| Backend *(Step 8)* | Node.js + Express |
| Database *(Step 8)* | SQLite |

---

## Features

- Responsive Home page with Hero, Categories, and Promotions
- Product catalog with filters and search
- Product detail pages with image gallery
- Shopping cart with real-time updates
- User authentication (register / login)
- Full checkout flow
- Order history & tracking
- Admin dashboard

---

## Project Roadmap

| Step | Progress | What's Built |
|---|---|---|
| 1 | ✅ Done | Project setup, routing, Home page |
| 2 | 🔜 Next | Header, Footer, responsive navigation |
| 3 | ⬜ | Product catalog, filters, search |
| 4 | ⬜ | Product detail page, reviews |
| 5 | ⬜ | Shopping cart |
| 6 | ⬜ | User authentication |
| 7 | ⬜ | Checkout flow |
| 8 | ⬜ | Backend API + database |
| 9 | ⬜ | Order management, admin panel |
| 10 | ⬜ | Polish, SEO, deployment |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/Bhargav/appkhila.git
cd appkhila

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

```bash
npm run dev      # Start dev server with hot-reload
npm run build    # Production build → dist/
npm run preview  # Preview the production build locally
```

---

## Folder Structure

```
src/
├── components/
│   └── layout/       # Header, Footer, Layout wrapper
├── constants/        # ROUTES, SITE_NAME, theme values
├── data/             # Mock data (categories, products)
├── pages/            # One file per route
├── store/            # Zustand global state
├── types/            # TypeScript interfaces
└── hooks/            # Custom React hooks
```

---

## License

MIT
