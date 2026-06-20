import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import FormField from '../../components/FormField';
import { authApi } from '../../services/authApi';

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const { newPassword } = form;
    if (newPassword.length < 8 || newPassword.length > 16) {
      return 'New password must be 8-16 characters';
    }
    if (!/[A-Z]/.test(newPassword)) return 'New password must contain an uppercase letter';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      return 'New password must contain a special character';
    }
    return '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    const clientError = validate();
    if (clientError) {
      setError(clientError);
      return;
    }
    setSubmitting(true);
    try {
      await authApi.changePassword(form);
      setSuccess('Password updated successfully.');
      setForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Change Password</h1>

      <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
        <FormField
          label="Current password"
          type="password"
          value={form.currentPassword}
          onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
        />
        <FormField
          label="New password"
          type="password"
          placeholder="8-16 chars, 1 uppercase, 1 special"
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-emerald-600">{success}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </DashboardLayout>
  );
}
