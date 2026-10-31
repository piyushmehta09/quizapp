import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { ui } from '../ui';

export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-center gap-3">
      <button className={ui.ghost} disabled={page <= 1} onClick={() => onChange(page - 1)}>
        <FiChevronLeft /> Prev
      </button>
      <span className="text-sm text-slate-500">
        {page} / {pages}
      </span>
      <button className={ui.ghost} disabled={page >= pages} onClick={() => onChange(page + 1)}>
        Next <FiChevronRight />
      </button>
    </div>
  );
}
