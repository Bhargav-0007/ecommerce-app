export const SITE_NAME = 'Appkhila';
export const SITE_TAGLINE = 'Your one-stop shop for everything';

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT: '/products/:slug',
  CART: '/cart',
  CHECKOUT: '/checkout',
  LOGIN: '/login',
  REGISTER: '/register',
  ACCOUNT: '/account',
  ORDERS: '/account/orders',
  ADMIN: '/admin',
  NOT_FOUND: '*',
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

export const PRODUCTS_PER_PAGE = 12;

export const NAV_LINKS = [
  { label: 'Home',     href: ROUTES.HOME },
  { label: 'Products', href: ROUTES.PRODUCTS },
] as const;
