/**
 * Clickable column header that toggles asc/desc and shows the active arrow.
 */
export default function SortableHeader({ label, field, sortBy, sortOrder, onSort }) {
  const active = sortBy === field;
  return (
    <th
      onClick={() => onSort(field)}
      className="cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 hover:text-gray-800"
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <span className={`text-[10px] ${active ? 'text-brand-600' : 'text-gray-300'}`}>
          {active ? (sortOrder === 'asc' ? '▲' : '▼') : '▲▼'}
        </span>
      </span>
    </th>
  );
}
