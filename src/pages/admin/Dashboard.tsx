import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { apiUrl, authHeaders } from '../../lib/api';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  pendingOrders: number;
}

const STAT_CARDS = (s: Stats) => [
  {
    label: 'Total Revenue',
    value: `$${s.totalRevenue.toFixed(2)}`,
    sub: 'Excluding cancelled orders',
    color: 'bg-green-50 text-green-700',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    link: '/admin/orders',
  },
  {
    label: 'Total Orders',
    value: s.totalOrders,
    sub: `${s.pendingOrders} pending`,
    color: 'bg-blue-50 text-blue-700',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    link: '/admin/orders',
  },
  {
    label: 'Products',
    value: s.totalProducts,
    sub: 'In catalogue',
    color: 'bg-purple-50 text-purple-700',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
      </svg>
    ),
    link: '/admin/products',
  },
  {
    label: 'Users',
    value: s.totalUsers,
    sub: 'Registered accounts',
    color: 'bg-orange-50 text-orange-700',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
      </svg>
    ),
    link: '/admin/users',
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const token = useAuthStore((s) => s.token)!;
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    fetch(apiUrl('/api/admin/stats'), { headers: authHeaders(token) })
      .then((r) => r.json())
      .then((d) => setStats(d as Stats))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
        <p className="text-gray-500 text-sm mt-1">Here's what's happening in your store.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse h-32" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {STAT_CARDS(stats).map((card) => (
            <Link
              key={card.label}
              to={card.link}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{card.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
                </div>
                <div className={`p-3 rounded-xl ${card.color}`}>{card.icon}</div>
              </div>
            </Link>
          ))}
        </div>
      ) : null}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { to: '/admin/products', label: 'Add Product', desc: 'Add a new item to the catalogue' },
          { to: '/admin/orders', label: 'View Orders', desc: 'Process and update order statuses' },
          { to: '/admin/users', label: 'Manage Users', desc: 'Edit roles, add or remove users' },
        ].map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all group"
          >
            <p className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
              {action.label} →
            </p>
            <p className="text-sm text-gray-400 mt-1">{action.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
