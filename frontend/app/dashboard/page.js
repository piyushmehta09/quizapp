'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiCheckCircle, FiFileText, FiTrendingUp } from 'react-icons/fi';
import { api } from '@/lib/api';
import { ui } from '@/lib/ui';
import { useAuth } from '@/context/AuthContext';
import Spinner from '@/components/Spinner';

export default function DashboardPage() {
  const { user, ready } = useAuth();
  const [attempts, setAttempts] = useState(null);

  useEffect(() => {
    if (user) api('/attempts/me').then(setAttempts).catch(() => setAttempts([]));
  }, [user]);

  if (!ready) return <Spinner />;
  if (!user) {
    return (
      <div className={`${ui.container} text-center`}>
        <Link href="/login" className={ui.btn}>Log in to see your progress</Link>
      </div>
    );
  }
  if (!attempts) return <Spinner />;

  const average = attempts.length ? Math.round(attempts.reduce((sum, item) => sum + item.percent, 0) / attempts.length) : 0;
  const stats = [
    { label: 'Quizzes taken', value: attempts.length, icon: FiFileText },
    { label: 'Average score', value: `${average}%`, icon: FiTrendingUp },
    { label: 'Quizzes passed', value: attempts.filter((item) => item.passed).length, icon: FiCheckCircle },
  ];

  return (
    <div className={ui.container}>
      <h1 className="mb-6 text-3xl font-extrabold">Hi {user.name} 👋</h1>
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className={ui.card}>
            <span className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
              <Icon size={22} />
            </span>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-3 text-xl font-bold">History</h2>
      <div className={`${ui.card} overflow-x-auto p-0`}>
        <table className="w-full text-left text-sm">
          <tbody>
            {attempts.map((attempt) => (
              <tr key={attempt._id} className="border-t border-slate-100 first:border-0">
                <td className="px-5 py-4 font-semibold">{attempt.quiz?.title}</td>
                <td className="px-5 py-4">{attempt.correctCount} correct · {attempt.incorrectCount} wrong</td>
                <td className="px-5 py-4 font-bold">{attempt.percent}%</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${attempt.passed ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {attempt.passed ? 'Passed' : 'Failed'}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-500">{new Date(attempt.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-4">
                  <Link href={`/result/${attempt._id}`} className="font-semibold text-indigo-600">Review</Link>
                </td>
              </tr>
            ))}
            {attempts.length === 0 && (
              <tr>
                <td className="px-5 py-12 text-center text-slate-400">You have not taken any quiz yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
