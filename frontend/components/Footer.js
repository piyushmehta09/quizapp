import { FaHeart } from 'react-icons/fa';
import { PORTFOLIO_URL } from '@/lib/config';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/70 px-4 py-6 text-center text-sm text-slate-500">
      <p>Copy Right 2026 ©, All Rights Reserved.</p>
      <p className="mt-1 flex items-center justify-center gap-1.5">
        Handcrafted with <FaHeart className="text-rose-500" /> by
        <a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-indigo-600 hover:underline">
          PIYUSH MEHTA
        </a>
      </p>
    </footer>
  );
}
