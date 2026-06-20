import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/StatCard';
import { adminApi } from '../../services/adminApi';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi
      .getDashboard()
      .then(setStats)
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'));
  }, []);

  return (
    <DashboardLayout>
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      <p className="mb-6 text-sm text-gray-500">Platform-wide overview</p>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {stats && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Total Users" value={stats.totalUsers} accent="brand" />
          <StatCard label="Total Stores" value={stats.totalStores} accent="amber" />
          <StatCard label="Total Ratings" value={stats.totalRatings} accent="emerald" />
        </div>
      )}
    </DashboardLayout>
  );
}
