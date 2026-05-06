import { useSearchParams } from 'react-router-dom';
import Breadcrumb from '../components/ui/Breadcrumb';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import ProductCard from '../components/product/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { PRODUCTS_PER_PAGE } from '../constants/theme';

const SORT_OPTIONS = [
  { label: 'Name: A–Z',       value: 'name__asc'   },
  { label: 'Name: Z–A',       value: 'name__desc'  },
  { label: 'Price: Low–High', value: 'price__asc'  },
  { label: 'Price: High–Low', value: 'price__desc' },
  { label: 'Rating: Best',    value: 'rating__desc'},
] as const;

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q        = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? '';
  const page     = parseInt(searchParams.get('page') ?? '0', 10);
  const sortBy   = searchParams.get('sortBy') ?? 'name';
  const sortDir  = searchParams.get('sortDir') ?? 'asc';

  const { data, loading, error } = useProducts({ category, q, page, sortBy, sortDir });
  const { categories } = useCategories();

  const activeCategory = categories.find((c) => c.slug === category);

  const setParam = (key: string, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      if (key !== 'page') next.delete('page');
      return next;
    });
  };

  const handleSort = (val: string) => {
    const [by, dir] = val.split('__');
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('sortBy', by);
      next.set('sortDir', dir);
      next.delete('page');
      return next;
    });
  };

  const crumbLabel = q
    ? `Search: "${q}"`
    : activeCategory?.name ?? 'All Products';

  const crumbs = [
    { label: 'Home', href: '/' },
    { label: crumbLabel },
  ];

  const pageNumbers = data ? Array.from({ length: data.totalPages }, (_, i) => i) : [];

  return (
    <div className="container-max py-6">
      <Breadcrumb crumbs={crumbs} />

      <div className="flex flex-col lg:flex-row gap-8 mt-2">
        {/* ── Sidebar ── */}
        <aside className="w-full lg:w-52 shrink-0">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 px-1">
            Categories
          </h3>
          <ul className="space-y-0.5">
            <li>
              <button
                onClick={() => setParam('category', '')}
                className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                  !category
                    ? 'bg-primary-50 text-primary-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All Products
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.slug}>
                <button
                  onClick={() => setParam('category', cat.slug)}
                  className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                    category === cat.slug
                      ? 'bg-primary-50 text-primary-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-xs text-gray-400 font-normal">{cat.productCount}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* ── Main ── */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <p className="text-sm text-gray-500 min-h-[1.25rem]">
              {!loading && data && (
                <>
                  <span className="font-semibold text-gray-900">{data.totalElements}</span>{' '}
                  {data.totalElements === 1 ? 'product' : 'products'}
                  {q && (
                    <>
                      {' '}for{' '}
                      <span className="font-medium text-gray-700">"{q}"</span>
                    </>
                  )}
                </>
              )}
            </p>

            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-gray-500 whitespace-nowrap">
                Sort by:
              </label>
              <select
                id="sort"
                value={`${sortBy}__${sortDir}`}
                onChange={(e) => handleSort(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active search/category tag */}
          {(q || category) && (
            <div className="flex flex-wrap gap-2 mb-5">
              {q && (
                <span className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-700 text-xs font-medium px-3 py-1.5 rounded-full">
                  Search: "{q}"
                  <button onClick={() => setParam('q', '')} aria-label="Clear search" className="hover:text-primary-900">
                    ×
                  </button>
                </span>
              )}
              {category && activeCategory && (
                <span className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-700 text-xs font-medium px-3 py-1.5 rounded-full">
                  {activeCategory.name}
                  <button onClick={() => setParam('category', '')} aria-label="Clear category" className="hover:text-primary-900">
                    ×
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Product grid */}
          {loading ? (
            <ProductGridSkeleton count={PRODUCTS_PER_PAGE} />
          ) : error ? (
            <EmptyState
              icon="error"
              title="Failed to load products"
              subtitle="Make sure the backend server is running on port 3001"
            />
          ) : data?.content.length === 0 ? (
            <EmptyState
              icon="empty"
              title="No products found"
              subtitle={
                q || category
                  ? 'Try a different search term or category'
                  : 'No products are available right now'
              }
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {data!.content.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <nav className="flex items-center justify-center gap-1.5 mt-10" aria-label="Pagination">
              <PaginationBtn
                onClick={() => setParam('page', String(page - 1))}
                disabled={page === 0}
              >
                ← Prev
              </PaginationBtn>

              {pageNumbers.map((p) => (
                <button
                  key={p}
                  onClick={() => setParam('page', String(p))}
                  aria-current={p === page ? 'page' : undefined}
                  className={`w-9 h-9 text-sm font-medium rounded-lg transition-colors ${
                    p === page
                      ? 'bg-primary-600 text-white'
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {p + 1}
                </button>
              ))}

              <PaginationBtn
                onClick={() => setParam('page', String(page + 1))}
                disabled={page === data.totalPages - 1}
              >
                Next →
              </PaginationBtn>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

function PaginationBtn({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      {children}
    </button>
  );
}

function EmptyState({
  icon,
  title,
  subtitle,
}: {
  icon: 'error' | 'empty';
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      {icon === 'error' ? (
        <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ) : (
        <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      <div>
        <p className="font-semibold text-gray-700">{title}</p>
        <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}
