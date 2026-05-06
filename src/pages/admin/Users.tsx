import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../store/authStore';
import { apiUrl, authHeaders } from '../../lib/api';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string | null;
}

interface UserForm {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'CUSTOMER';
}

const EMPTY_FORM: UserForm = { name: '', email: '', password: '', role: 'CUSTOMER' };

const ROLE_BADGE: Record<string, string> = {
  ADMIN: 'bg-red-50 text-red-700',
  CUSTOMER: 'bg-gray-100 text-gray-600',
};

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<UserForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const token = useAuthStore((s) => s.token)!;
  const currentUserId = useAuthStore((s) => s.user?.id);

  const load = useCallback(() => {
    setLoading(true);
    fetch(apiUrl('/api/admin/users'), { headers: authHeaders(token) })
      .then((r) => r.json())
      .then((d) => setUsers(d as AdminUser[]))
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

  const openEdit = (u: AdminUser) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email, password: '', role: u.role as 'ADMIN' | 'CUSTOMER' });
    setError('');
    setModalOpen(true);
  };

  const handleDelete = async (u: AdminUser) => {
    if (u.id === currentUserId) { alert("You can't delete your own account."); return; }
    if (!confirm(`Delete user "${u.name}"?`)) return;
    await fetch(apiUrl(`/api/admin/users/${u.id}`), { method: 'DELETE', headers: authHeaders(token) });
    setUsers((prev) => prev.filter((x) => x.id !== u.id));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing && !form.password) { setError('Password is required for new users'); return; }
    setSaving(true);
    setError('');
    const body: Record<string, string> = { name: form.name, email: form.email, role: form.role };
    if (form.password) body.password = form.password;
    try {
      const url = editing ? apiUrl(`/api/admin/users/${editing.id}`) : apiUrl('/api/admin/users');
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: authHeaders(token),
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(err.error ?? 'Save failed');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const f = (key: keyof UserForm, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">{users.length} total</p>
        </div>
        <div className="flex gap-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 w-44" />
          <button onClick={openAdd} className="btn-primary whitespace-nowrap">+ Add User</button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">Loading…</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Role</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Joined</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold shrink-0">
                          {u.name[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">{u.name}</span>
                        {u.id === currentUserId && (
                          <span className="text-xs text-gray-400">(you)</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`badge px-2.5 py-0.5 rounded-full text-xs font-semibold ${ROLE_BADGE[u.role] ?? ''}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(u)}
                          className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Edit">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => handleDelete(u)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
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
                  <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400">No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">{editing ? 'Edit User' : 'Add User'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSave} className="px-6 py-4 space-y-4">
              <Field label="Full Name *">
                <input required value={form.name} onChange={(e) => f('name', e.target.value)}
                  className={inputCls} placeholder="John Doe" />
              </Field>
              <Field label="Email *">
                <input required type="email" value={form.email} onChange={(e) => f('email', e.target.value)}
                  className={inputCls} placeholder="john@example.com" />
              </Field>
              <Field label={editing ? 'New Password (leave blank to keep)' : 'Password *'}>
                <input type="password" value={form.password} onChange={(e) => f('password', e.target.value)}
                  className={inputCls} placeholder="••••••••" />
              </Field>
              <Field label="Role *">
                <select value={form.role} onChange={(e) => f('role', e.target.value)} className={inputCls}>
                  <option value="CUSTOMER">Customer</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </Field>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 btn-secondary">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 btn-primary disabled:opacity-60">
                  {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add User'}
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
