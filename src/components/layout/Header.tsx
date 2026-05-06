import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { SITE_NAME, NAV_LINKS, ROUTES } from '../../constants/theme';
import { useCartStore } from '../../store/cartStore';
import { useUiStore } from '../../store/uiStore';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const itemCount = useCartStore((s) => s.itemCount());
  const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUiStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${ROUTES.PRODUCTS}?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <>
      <header
        className={`bg-white sticky top-0 z-50 transition-shadow duration-200 ${
          scrolled ? 'shadow-md' : 'shadow-sm'
        }`}
      >
        <div className="container-max flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link
            to={ROUTES.HOME}
            onClick={closeMobileMenu}
            className="text-xl font-extrabold text-primary-600 tracking-tight shrink-0"
          >
            {SITE_NAME}
          </Link>

          {/* Desktop Nav */}
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

          {/* Search bar — desktop inline */}
          <form
            onSubmit={handleSearch}
            className={`hidden md:flex items-center flex-1 max-w-sm transition-all duration-200`}
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-gray-50"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile search toggle */}
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart */}
            <Link
              to={ROUTES.CART}
              className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
              aria-label={`Cart (${itemCount} items)`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-accent-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* Sign In — hidden on mobile */}
            <Link to={ROUTES.LOGIN} className="hidden sm:block btn-primary text-sm py-2 px-4">
              Sign In
            </Link>

            {/* Hamburger */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        {searchOpen && (
          <div className="md:hidden px-4 pb-3 border-t border-gray-100">
            <form onSubmit={handleSearch} className="relative mt-3">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-400 bg-gray-50"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />
          {/* Drawer */}
          <nav className="relative ml-auto w-72 h-full bg-white shadow-2xl flex flex-col p-6 gap-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-extrabold text-primary-600">{SITE_NAME}</span>
              <button onClick={closeMobileMenu} className="p-1 text-gray-500 hover:text-gray-800">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                end={link.href === '/'}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `text-base font-medium py-2 border-b border-gray-100 transition-colors ${
                    isActive ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="mt-auto space-y-3">
              <Link
                to={ROUTES.LOGIN}
                onClick={closeMobileMenu}
                className="btn-primary block text-center"
              >
                Sign In
              </Link>
              <Link
                to={ROUTES.REGISTER}
                onClick={closeMobileMenu}
                className="btn-secondary block text-center"
              >
                Create Account
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
