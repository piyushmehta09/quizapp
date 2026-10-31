'use client';

import Link from 'next/link';
import { FiAward, FiBookOpen, FiLogIn, FiLogOut, FiUser, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { ui } from '@/lib/ui';

const linkClass = 'flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-indigo-600';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3.5">
        <Link href="/" className="mr-auto bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-2xl font-extrabold text-transparent">
          Quizly
        </Link>
        <Link href="/" className={linkClass}>
          <FiBookOpen /> Quizzes
        </Link>
        <Link href="/leaderboard" className={linkClass}>
          <FiAward /> Leaderboard
        </Link>
        {user ? (
          <>
            <Link href="/dashboard" className={linkClass}>
              <FiUser /> {user.name}
            </Link>
            <button onClick={logout} className={linkClass}>
              <FiLogOut /> Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className={linkClass}>
              <FiLogIn /> Login
            </Link>
            <Link href="/register" className={`${ui.btn} !px-4 !py-2 text-sm`}>
              <FiUserPlus /> Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
