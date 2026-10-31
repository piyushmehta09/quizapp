'use client';

import { useEffect, useState } from 'react';
import { FiAward } from 'react-icons/fi';
import { api } from '@/lib/api';
import { ui } from '@/lib/ui';
import Spinner from '@/components/Spinner';

const medals = ['🥇', '🥈', '🥉'];

export default function LeaderboardPage() {
  const [rows, setRows] = useState(null);

  useEffect(() => {
    api('/attempts/leaderboard').then(setRows).catch(() => setRows([]));
  }, []);

  return (
    <div className={ui.container}>
      <h1 className="mb-6 flex items-center gap-3 text-3xl font-extrabold">
        <FiAward className="text-indigo-500" /> Leaderboard
      </h1>
      {!rows ? (
        <Spinner />
      ) : (
        <div className={`${ui.card} overflow-x-auto p-0`}>
          <table className="w-full text-left">
            <thead className="text-sm text-slate-500">
              <tr>
                {['Rank', 'Player', 'Best', 'Average', 'Attempts'].map((head) => (
                  <th key={head} className="px-5 py-4 font-medium">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row._id} className="border-t border-slate-100 transition hover:bg-indigo-50/40">
                  <td className="px-5 py-4 text-lg">{medals[index] || index + 1}</td>
                  <td className="px-5 py-4 font-semibold">{row.name}</td>
                  <td className="px-5 py-4 font-bold text-indigo-600">{row.best}%</td>
                  <td className="px-5 py-4">{row.avg}%</td>
                  <td className="px-5 py-4">{row.attempts}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-400">No results yet. Be the first!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
