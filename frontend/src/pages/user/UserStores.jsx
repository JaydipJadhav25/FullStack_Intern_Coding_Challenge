import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import StarRating from '../../components/StarRating';
import { userApi } from '../../services/userApi';

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState(null);

  async function loadStores() {
    setLoading(true);
    try {
      const data = await userApi.getStores({ search: search || undefined });
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
  }, [search]);

  async function handleRate(store, rating) {
    setSavingId(store.id);
    try {
      if (store.myRating == null) {
        await userApi.submitRating({ storeId: store.id, rating });
      } else {
        await userApi.updateRating(store.id, rating);
      }
      await loadStores();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save rating');
    } finally {
      setSavingId(null);
    }
  }

  return (
    <DashboardLayout>
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Browse Stores</h1>
      <p className="mb-6 text-sm text-gray-500">Rate the restaurants you've visited</p>

      <input
        placeholder="Search by name or address..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-72 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      />

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : stores.length === 0 ? (
        <p className="text-gray-400">No stores match your search.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <div key={store.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">{store.name}</h3>
              <p className="mt-0.5 text-sm text-gray-500">{store.address}</p>

              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-gray-600">Overall rating</span>
                <span className="inline-flex items-center gap-1 font-medium text-gray-800">
                  {store.overallRating != null ? (
                    <>
                      <span className="text-amber-500">★</span> {store.overallRating}
                      <span className="text-xs text-gray-400">({store.totalRatings})</span>
                    </>
                  ) : (
                    <span className="text-xs text-gray-400">No ratings yet</span>
                  )}
                </span>
              </div>

              <div className="mt-4 border-t border-gray-100 pt-4">
                <p className="mb-1 text-xs font-medium text-gray-500">
                  {store.myRating != null ? 'Your rating' : 'Rate this store'}
                </p>
                <StarRating
                  value={store.myRating || 0}
                  onChange={(val) => handleRate(store, val)}
                />
                {savingId === store.id && <p className="mt-1 text-xs text-gray-400">Saving...</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
