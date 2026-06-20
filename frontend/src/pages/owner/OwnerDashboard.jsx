import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/StatCard';
import StarRating from '../../components/StarRating';
import { ownerApi } from '../../services/userApi';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    ownerApi
      .getDashboard()
      .then(setData)
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'));
  }, []);

  return (
    <DashboardLayout>
      <h1 className="mb-1 text-2xl font-bold text-gray-900">My Store</h1>
      <p className="mb-6 text-sm text-gray-500">Performance and customer feedback</p>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {data && data.stores.length === 0 && (
        <p className="text-gray-400">No store is currently assigned to your account.</p>
      )}

      {data && data.stores.length > 0 && (
        <>
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard label="Average Rating" value={data.averageRating ?? '—'} accent="amber" />
            <StatCard label="Total Ratings" value={data.totalRatings} accent="brand" />
          </div>

          {data.stores.map((store) => (
            <div key={store.id} className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{store.name}</h2>
                  <p className="text-sm text-gray-500">{store.address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StarRating value={Math.round(store.averageRating || 0)} size="md" />
                  <span className="font-semibold text-gray-700">{store.averageRating ?? '—'}</span>
                </div>
              </div>

              <table className="w-full text-sm">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      User
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Rating
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {store.raters.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="px-2 py-6 text-center text-gray-400">
                        No ratings yet.
                      </td>
                    </tr>
                  ) : (
                    store.raters.map((r) => (
                      <tr key={r.userId}>
                        <td className="px-2 py-2 text-gray-800">{r.name}</td>
                        <td className="px-2 py-2">
                          <span className="inline-flex items-center gap-1 text-gray-700">
                            <span className="text-amber-500">★</span> {r.rating}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ))}
        </>
      )}
    </DashboardLayout>
  );
}
