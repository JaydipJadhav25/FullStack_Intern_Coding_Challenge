import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import SortableHeader from '../../components/SortableHeader';
import Modal from '../../components/Modal';
import FormField from '../../components/FormField';
import { adminApi } from '../../services/adminApi';

const emptyForm = { name: '', email: '', address: '', ownerId: '' };

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [owners, setOwners] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function loadStores() {
    setLoading(true);
    try {
      const data = await adminApi.getStores({ search: search || undefined, sortBy, sortOrder });
      setStores(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stores');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(loadStores, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sortBy, sortOrder]);

  function handleSort(field) {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  }

  async function openCreateModal() {
    setModalOpen(true);
    try {
      const allUsers = await adminApi.getUsers({});
      setOwners(allUsers.filter((u) => u.role === 'STORE_OWNER'));
    } catch {
      setOwners([]);
    }
  }

  function validateForm() {
    const errs = {};
    if (!form.name.trim() || form.name.length > 60) errs.name = 'Required, max 60 characters';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.address.trim() || form.address.length > 400) errs.address = 'Required, max 400 characters';
    return errs;
  }

  async function handleCreateStore(e) {
    e.preventDefault();
    const errs = validateForm();
    setFormErrors(errs);
    setSubmitError('');
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      await adminApi.createStore({ ...form, ownerId: form.ownerId || undefined });
      setModalOpen(false);
      setForm(emptyForm);
      loadStores();
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to create store');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stores</h1>
          <p className="text-sm text-gray-500">{stores.length} total</p>
        </div>
        <button
          onClick={openCreateModal}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          + Add Store
        </button>
      </div>

      <input
        placeholder="Search by name, email, or address..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-72 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      />

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <SortableHeader label="Name" field="name" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
              <SortableHeader label="Email" field="email" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
              <SortableHeader label="Address" field="address" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
              <SortableHeader label="Rating" field="rating" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">Loading...</td>
              </tr>
            ) : stores.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">No stores match your search.</td>
              </tr>
            ) : (
              stores.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                  <td className="px-4 py-3 text-gray-600">{s.email}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-gray-600">{s.address}</td>
                  <td className="px-4 py-3">
                    {s.avgRating != null ? (
                      <span className="inline-flex items-center gap-1 text-gray-700">
                        <span className="text-amber-500">★</span> {s.avgRating}
                        <span className="text-xs text-gray-400">({s.totalRatings})</span>
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">No ratings yet</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} title="Add new store" onClose={() => setModalOpen(false)}>
        <form onSubmit={handleCreateStore} className="space-y-4">
          <FormField
            label="Store name"
            error={formErrors.name}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <FormField
            label="Email"
            type="email"
            error={formErrors.email}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <FormField
            label="Address"
            error={formErrors.address}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Owner (optional)</label>
            <select
              value={form.ownerId}
              onChange={(e) => setForm({ ...form, ownerId: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            >
              <option value="">No owner assigned</option>
              {owners.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} ({o.email})
                </option>
              ))}
            </select>
          </div>

          {submitError && <p className="text-sm text-red-600">{submitError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {submitting ? 'Creating...' : 'Create store'}
          </button>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
