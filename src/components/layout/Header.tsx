import { Link, NavLink } from 'react-router-dom';
import { SITE_NAME, NAV_LINKS, ROUTES } from '../../constants/theme';

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-max flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          to={ROUTES.HOME}
          className="text-xl font-extrabold text-primary-600 tracking-tight"
        >
          {SITE_NAME}
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === '/'}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'text-primary-600'
                    : 'text-gray-600 hover:text-primary-600'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.CART}
            className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
            aria-label="Cart"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </Link>

          <Link to={ROUTES.LOGIN} className="btn-primary text-sm py-2 px-4">
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
