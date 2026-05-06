import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../store/authStore';
import { apiUrl, authHeaders } from '../../lib/api';
import type { ApiProduct } from '../../hooks/useProducts';
import type { ApiCategoryFull } from '../../hooks/useCategories';

interface ProductForm {
  name: string;
  description: string;
  categorySlug: string;
  brand: string;
  price: string;
  originalPrice: string;
  stock: string;
  images: string;
  featured: boolean;
}

const EMPTY_FORM: ProductForm = {
  name: '', description: '', categorySlug: '', brand: '',
  price: '', originalPrice: '', stock: '', images: '', featured: false,
};

export default function AdminProducts() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategoryFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ApiProduct | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const token = useAuthStore((s) => s.token)!;

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetch(apiUrl('/api/admin/products'), { headers: authHeaders(token) }).then((r) => r.json()),
      fetch(apiUrl('/api/categories')).then((r) => r.json()),
    ])
      .then(([prods, cats]) => {
        setProducts(prods as ApiProduct[]);
        setCategories(cats as ApiCategoryFull[]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (p: ApiProduct) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description,
      categorySlug: p.category.slug,
      brand: p.brand,
      price: String(p.price),
      originalPrice: p.originalPrice != null ? String(p.originalPrice) : '',
      stock: String(p.stock),
      images: p.images.join(','),
      featured: p.featured,
    });
    setError('');
    setModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    await fetch(apiUrl(`/api/admin/products/${id}`), {
      method: 'DELETE', headers: authHeaders(token),
    });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const body = {
      name: form.name,
      description: form.description,
      categorySlug: form.categorySlug,
      brand: form.brand,
      price: parseFloat(form.price),
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
      stock: parseInt(form.stock, 10),
      images: form.images,
      featured: form.featured,
    };
    try {
      const url = editing
        ? apiUrl(`/api/admin/products/${editing.id}`)
        : apiUrl('/api/admin/products');
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: authHeaders(token),
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed to save product');
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const f = (key: keyof ProductForm, val: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">{products.length} total</p>
        </div>
        <div className="flex gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 w-44"
          />
          <button onClick={openAdd} className="btn-primary whitespace-nowrap">
            + Add Product
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
          Loading…
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Product</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Price</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Stock</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Featured</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.images[0] && (
                          <img src={p.images[0]} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 truncate max-w-[180px]">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{p.category.name}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-gray-900">${p.price.toFixed(2)}</span>
                      {p.originalPrice && (
                        <span className="text-xs text-gray-400 line-through ml-1">${p.originalPrice.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`font-medium ${p.stock === 0 ? 'text-red-500' : p.stock <= 10 ? 'text-orange-500' : 'text-gray-700'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {p.featured ? (
                        <span className="badge bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full text-xs">Yes</span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                {editing ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSave} className="px-6 py-4 space-y-4">
              <Field label="Name *">
                <input required value={form.name} onChange={(e) => f('name', e.target.value)}
                  className={inputCls} placeholder="Product name" />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Category *">
                  <select required value={form.categorySlug} onChange={(e) => f('categorySlug', e.target.value)}
                    className={inputCls}>
                    <option value="">Select…</option>
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Brand *">
                  <input required value={form.brand} onChange={(e) => f('brand', e.target.value)}
                    className={inputCls} placeholder="Brand" />
                </Field>
              </div>

              <Field label="Description *">
                <textarea required value={form.description} onChange={(e) => f('description', e.target.value)}
                  className={`${inputCls} resize-none`} rows={3} placeholder="Product description" />
              </Field>

              <div className="grid grid-cols-3 gap-3">
                <Field label="Price *">
                  <input required type="number" step="0.01" min="0" value={form.price}
                    onChange={(e) => f('price', e.target.value)} className={inputCls} placeholder="0.00" />
                </Field>
                <Field label="Original Price">
                  <input type="number" step="0.01" min="0" value={form.originalPrice}
                    onChange={(e) => f('originalPrice', e.target.value)} className={inputCls} placeholder="0.00" />
                </Field>
                <Field label="Stock *">
                  <input required type="number" min="0" value={form.stock}
                    onChange={(e) => f('stock', e.target.value)} className={inputCls} placeholder="0" />
                </Field>
              </div>

              <Field label="Image URL">
                <input value={form.images} onChange={(e) => f('images', e.target.value)}
                  className={inputCls} placeholder="https://..." />
              </Field>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured}
                  onChange={(e) => f('featured', e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded" />
                <span className="text-sm font-medium text-gray-700">Featured product</span>
              </label>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)}
                  className="flex-1 btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 btn-primary disabled:opacity-60">
                  {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-gray-50';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}
