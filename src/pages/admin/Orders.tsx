import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../store/authStore';
import { apiUrl, authHeaders } from '../../lib/api';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface AdminOrder {
  id: string;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  items: OrderItem[];
  status: string;
  total: number;
  shippingAddress: string | null;
  createdAt: string | null;
}

const STATUS_OPTIONS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const STATUS_BADGE: Record<string, string> = {
  PENDING:    'bg-yellow-50 text-yellow-700 border-yellow-200',
  PROCESSING: 'bg-blue-50 text-blue-700 border-blue-200',
  SHIPPED:    'bg-purple-50 text-purple-700 border-purple-200',
  DELIVERED:  'bg-green-50 text-green-700 border-green-200',
  CANCELLED:  'bg-red-50 text-red-700 border-red-200',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const token = useAuthStore((s) => s.token)!;

  const load = useCallback(() => {
    setLoading(true);
    fetch(apiUrl('/api/admin/orders'), { headers: authHeaders(token) })
      .then((r) => r.json())
      .then((d) => setOrders(d as AdminOrder[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (orderId: string, status: string) => {
    setUpdating(orderId);
    try {
      const res = await fetch(apiUrl(`/api/admin/orders/${orderId}/status`), {
        method: 'PUT',
        headers: authHeaders(token),
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json() as AdminOrder;
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      }
    } finally {
      setUpdating(null);
    }
  };

  const filtered = statusFilter
    ? orders.filter((o) => o.status === statusFilter)
    : orders;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">{orders.length} total</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center text-gray-400">
          <p className="font-medium">No orders yet</p>
          <p className="text-sm mt-1">Orders will appear here once customers checkout.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex flex-wrap items-center gap-4 px-5 py-4">
                {/* Order ID + customer */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-gray-400">#{order.id.slice(0, 8)}</span>
                    <span className={`badge px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_BADGE[order.status] ?? ''}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="font-medium text-gray-800 mt-0.5 truncate">
                    {order.userName ?? 'Guest'}
                    {order.userEmail && <span className="text-gray-400 font-normal text-sm ml-2">{order.userEmail}</span>}
                  </p>
                </div>

                {/* Total */}
                <div className="text-right shrink-0">
                  <p className="font-bold text-gray-900 text-lg">${order.total.toFixed(2)}</p>
                  <p className="text-xs text-gray-400">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    {order.createdAt && <> · {new Date(order.createdAt).toLocaleDateString()}</>}
                  </p>
                </div>

                {/* Status selector */}
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={order.status}
                    disabled={updating === order.id}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-white disabled:opacity-60"
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>

                  <button
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    title="View items"
                  >
                    <svg className={`w-4 h-4 transition-transform ${expanded === order.id ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Expanded items */}
              {expanded === order.id && (
                <div className="border-t border-gray-100 bg-gray-50 px-5 py-3">
                  {order.shippingAddress && (
                    <p className="text-xs text-gray-500 mb-3">
                      <span className="font-semibold">Ship to:</span> {order.shippingAddress}
                    </p>
                  )}
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-gray-400 uppercase">
                        <th className="text-left pb-2 font-semibold">Product</th>
                        <th className="text-center pb-2 font-semibold">Qty</th>
                        <th className="text-right pb-2 font-semibold">Price</th>
                        <th className="text-right pb-2 font-semibold">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {order.items.map((item, i) => (
                        <tr key={i}>
                          <td className="py-1.5 text-gray-700">{item.productName}</td>
                          <td className="py-1.5 text-center text-gray-500">{item.quantity}</td>
                          <td className="py-1.5 text-right text-gray-500">${item.price.toFixed(2)}</td>
                          <td className="py-1.5 text-right font-medium text-gray-800">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
