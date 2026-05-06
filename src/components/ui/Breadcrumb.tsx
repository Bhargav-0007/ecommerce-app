import { Link } from 'react-router-dom';

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  crumbs: Crumb[];
}

export default function Breadcrumb({ crumbs }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 py-3">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-gray-300">/</span>}
          {crumb.href && i < crumbs.length - 1 ? (
            <Link to={crumb.href} className="hover:text-primary-600 transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className={i === crumbs.length - 1 ? 'text-gray-800 font-medium' : ''}>
              {crumb.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
