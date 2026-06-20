export default function StatCard({ label, value, accent = 'brand' }) {
  const accents = {
    brand: 'border-brand-500 text-brand-700',
    amber: 'border-amber-500 text-amber-700',
    emerald: 'border-emerald-500 text-emerald-700',
  };

  return (
    <div className={`rounded-xl border-t-4 bg-white p-5 shadow-sm ${accents[accent]}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
