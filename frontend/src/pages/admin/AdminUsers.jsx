import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import SortableHeader from '../../components/SortableHeader';
import Modal from '../../components/Modal';
import FormField from '../../components/FormField';
import { adminApi } from '../../services/adminApi';

const ROLE_BADGE = {
  ADMIN: 'bg-purple-100 text-purple-700',
  USER: 'bg-blue-100 text-blue-700',
  STORE_OWNER: 'bg-amber-100 text-amber-700',
};

const emptyForm = { name: '', email: '', address: '', password: '', role: 'USER' };

function validateForm(form) {
  const errors = {};
  if (form.name.trim().length < 20 || form.name.trim().length > 60) {
    errors.name = 'Name must be 20-60 characters';
  }
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email';
  if (form.address.trim().length === 0 || form.address.length > 400) {
    errors.address = 'Address required, max 400 characters';
  }
  if (form.password.length < 8 || form.password.length > 16) {
    errors.password = 'Password must be 8-16 characters';
  } else if (!/[A-Z]/.test(form.password)) {
    errors.password = 'Must contain an uppercase letter';
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) {
    errors.password = 'Must contain a special character';
  }
  return errors;
}

export default function AdminUsers() {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await adminApi.getUsers({
        search: search || undefined,
        role: roleFilter || undefined,
        sortBy,
        sortOrder,
      });
      setUsers(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(loadUsers, 300); 
    return () => clearTimeout(timeout);
    
  }, [search, roleFilter, sortBy, sortOrder]);

  function handleSort(field) {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  }

  async function handleCreateUser(e) {
    e.preventDefault();
    const errs = validateForm(form);
    setFormErrors(errs);
    setSubmitError('');
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      await adminApi.createUser(form);
      setModalOpen(false);
      setForm(emptyForm);
      loadUsers();
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500">{users.length} total</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          + Add User
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          placeholder="Search by name, email, or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        >
          <option value="">All roles</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">User</option>
          <option value="STORE_OWNER">Store Owner</option>
        </select>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <SortableHeader label="Name" field="name" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
              <SortableHeader label="Email" field="email" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
              <SortableHeader label="Address" field="address" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
              <SortableHeader label="Role" field="role" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  No users match your search.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-gray-600">{u.address}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_BADGE[u.role]}`}>
                      {u.role.replace('_', ' ')}
                    </span>
                    {u.role === 'STORE_OWNER' && u.storeRating != null && (
                      <span className="ml-2 text-xs text-amber-600">★ {u.storeRating}</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} title="Add new user" onClose={() => setModalOpen(false)}>
        <form onSubmit={handleCreateUser} className="space-y-4">
          <FormField
            label="Full name"
            placeholder="At least 20 characters"
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
          <FormField
            label="Password"
            type="password"
            placeholder="8-16 chars, 1 uppercase, 1 special"
            error={formErrors.password}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            >
              <option value="USER">User</option>
              <option value="STORE_OWNER">Store Owner</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {submitError && <p className="text-sm text-red-600">{submitError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {submitting ? 'Creating...' : 'Create user'}
          </button>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
