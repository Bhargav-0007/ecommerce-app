import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/theme';
import { categories } from '../data/categories';

const features = [
  {
    icon: '🚚',
    title: 'Free Shipping',
    description: 'On all orders over $50. Fast delivery to your door.',
  },
  {
    icon: '🔄',
    title: 'Easy Returns',
    description: '30-day hassle-free return policy. No questions asked.',
  },
  {
    icon: '🔒',
    title: 'Secure Payments',
    description: 'Your payment info is always encrypted and safe.',
  },
  {
    icon: '💬',
    title: '24/7 Support',
    description: 'Our team is here to help you around the clock.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* ── Hero Section ── */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white rounded-full" />
        </div>

        <div className="container-max relative z-10 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — text */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium">
                <span>🎉</span>
                <span>New arrivals every week!</span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight">
                Shop Smarter,
                <br />
                <span className="text-accent-400">Live Better</span>
              </h1>

              <p className="text-lg text-primary-100 max-w-md">
                Discover thousands of products across every category — curated
                for quality, priced for everyone.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to={ROUTES.PRODUCTS} className="btn-accent text-base">
                  Shop Now →
                </Link>
                <a
                  href="#categories"
                  className="btn-secondary bg-transparent text-white border-white hover:bg-white/10 text-base"
                >
                  Browse Categories
                </a>
              </div>

              {/* Quick stats */}
              <div className="flex gap-8 pt-4">
                {[
                  { value: '50K+', label: 'Products' },
                  { value: '1M+', label: 'Customers' },
                  { value: '4.9★', label: 'Rating' },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-primary-200 text-sm">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — decorative image grid */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80',
                'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&q=80',
                'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300&q=80',
                'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80',
              ].map((src, i) => (
                <div
                  key={i}
                  className={`card overflow-hidden ${i === 1 ? 'mt-6' : ''} ${i === 3 ? '-mt-6' : ''}`}
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-40 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Bar ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-max py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-primary-50 transition-colors duration-200"
              >
                <span className="text-3xl">{f.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{f.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories Section ── */}
      <section id="categories" className="py-16 lg:py-24 bg-gray-50">
        <div className="container-max">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">
            Find exactly what you're looking for
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-10">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`${ROUTES.PRODUCTS}?category=${cat.slug}`}
                className="group card p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow duration-200"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden mb-3 ring-2 ring-transparent group-hover:ring-primary-400 transition-all duration-200">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm">{cat.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{cat.productCount} items</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Promotional Banner ── */}
      <section className="py-16 bg-white">
        <div className="container-max">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white flex flex-col justify-between min-h-[200px]">
              <div>
                <span className="badge bg-white/20 text-white mb-3">Limited time</span>
                <h3 className="text-2xl font-bold mt-2">Up to 50% off</h3>
                <p className="text-purple-200 mt-1">On all Electronics this week</p>
              </div>
              <Link
                to={`${ROUTES.PRODUCTS}?category=electronics`}
                className="mt-4 inline-flex items-center font-semibold text-white hover:gap-2 gap-1 transition-all duration-200"
              >
                Shop Electronics <span>→</span>
              </Link>
            </div>

            <div className="rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 p-8 text-white flex flex-col justify-between min-h-[200px]">
              <div>
                <span className="badge bg-white/20 text-white mb-3">New season</span>
                <h3 className="text-2xl font-bold mt-2">Fresh Fashion Drops</h3>
                <p className="text-rose-200 mt-1">The latest styles are here</p>
              </div>
              <Link
                to={`${ROUTES.PRODUCTS}?category=fashion`}
                className="mt-4 inline-flex items-center font-semibold text-white hover:gap-2 gap-1 transition-all duration-200"
              >
                Shop Fashion <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container-max text-center">
          <h2 className="text-3xl font-bold">Stay in the loop</h2>
          <p className="text-primary-300 mt-3 max-w-md mx-auto">
            Subscribe to get exclusive deals, early access to sales, and curated picks.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-400"
            />
            <button type="submit" className="btn-accent whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
