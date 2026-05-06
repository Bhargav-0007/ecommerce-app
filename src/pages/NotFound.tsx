import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/theme';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 py-24 text-center px-4">
      <p className="text-8xl font-extrabold text-primary-200">404</p>
      <h1 className="mt-4 text-3xl font-bold text-gray-900">Page not found</h1>
      <p className="mt-3 text-gray-500 max-w-sm">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Link to={ROUTES.HOME} className="btn-primary mt-8 inline-block">
        ← Back to Home
      </Link>
    </div>
  );
}
