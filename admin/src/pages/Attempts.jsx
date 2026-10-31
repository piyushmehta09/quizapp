import { useState } from 'react';
import useFetch from '../hooks/useFetch';
import PageHeader from '../components/PageHeader';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';
import { ui } from '../ui';

export default function Attempts() {
  const [quiz, setQuiz] = useState('');
  const [page, setPage] = useState(1);
  const { data: quizzes } = useFetch('/admin/quizzes');
  const { data, loading } = useFetch(`/admin/attempts?page=${page}${quiz ? `&quiz=${quiz}` : ''}`);

  return (
    <>
      <PageHeader title="Reports" subtitle="User attempts and quiz results">
        <select
          className={`${ui.input} w-64`}
          value={quiz}
          onChange={(e) => {
            setQuiz(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All quizzes</option>
          {(quizzes || []).map((item) => (
            <option key={item._id} value={item._id}>{item.title}</option>
          ))}
        </select>
      </PageHeader>
      {loading || !data ? (
        <Spinner />
      ) : (
        <>
          <div className={`${ui.card} overflow-x-auto p-0`}>
            <table className="w-full">
              <thead>
                <tr>
                  {['User', 'Quiz', 'Correct', 'Incorrect', 'Skipped', 'Score', 'Time', 'Result', 'Date'].map((head) => (
                    <th key={head} className={ui.th}>{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.items.map((attempt) => (
                  <tr key={attempt._id}>
                    <td className={ui.td}>
                      <p className="font-medium">{attempt.user?.name}</p>
                      <p className="text-xs text-slate-400">{attempt.user?.email}</p>
                    </td>
                    <td className={ui.td}>{attempt.quiz?.title}</td>
                    <td className={`${ui.td} font-semibold text-emerald-600`}>{attempt.correctCount}</td>
                    <td className={`${ui.td} font-semibold text-rose-600`}>{attempt.incorrectCount}</td>
                    <td className={ui.td}>{attempt.unanswered}</td>
                    <td className={`${ui.td} font-semibold`}>{attempt.percent}%</td>
                    <td className={ui.td}>{attempt.timeTaken}s</td>
                    <td className={ui.td}>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${attempt.passed ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {attempt.passed ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                    <td className={`${ui.td} whitespace-nowrap`}>{new Date(attempt.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {data.items.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-10 text-center text-sm text-slate-400">No attempts found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination page={data.page} pages={data.pages} onChange={setPage} />
        </>
      )}
    </>
  );
}
