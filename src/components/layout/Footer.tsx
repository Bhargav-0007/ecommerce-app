import { Link } from 'react-router-dom';
import { SITE_NAME, ROUTES } from '../../constants/theme';

const footerLinks = {
  Shop: [
    { label: 'All Products', href: ROUTES.PRODUCTS },
    { label: 'Electronics',  href: `${ROUTES.PRODUCTS}?category=electronics` },
    { label: 'Fashion',      href: `${ROUTES.PRODUCTS}?category=fashion` },
    { label: 'Home & Living',href: `${ROUTES.PRODUCTS}?category=home-living` },
  ],
  Account: [
    { label: 'Sign In',     href: ROUTES.LOGIN },
    { label: 'Register',    href: ROUTES.REGISTER },
    { label: 'My Orders',   href: ROUTES.ORDERS },
    { label: 'My Account',  href: ROUTES.ACCOUNT },
  ],
  Company: [
    { label: 'About Us',     href: '#' },
    { label: 'Careers',      href: '#' },
    { label: 'Press',        href: '#' },
    { label: 'Contact Us',   href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="container-max py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to={ROUTES.HOME} className="text-xl font-extrabold text-white">
              {SITE_NAME}
            </Link>
            <p className="mt-3 text-sm text-gray-400 max-w-xs">
              Your trusted online marketplace for quality products at great prices.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {section}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
          <div className="flex gap-4 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
