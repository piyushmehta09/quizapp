import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import useFetch from '../hooks/useFetch';
import { api } from '../lib/api';
import { ask } from '../lib/ask';
import PageHeader from '../components/PageHeader';
import Spinner from '../components/Spinner';
import { ui } from '../ui';

export default function Quizzes() {
  const { data, loading, reload } = useFetch('/admin/quizzes');

  const remove = (quiz) =>
    ask(`Delete "${quiz.title}" with all its questions and attempts?`, async () => {
      await api(`/admin/quizzes/${quiz._id}`, { method: 'DELETE' });
      toast.success('Quiz deleted');
      reload();
    });

  return (
    <>
      <PageHeader title="Quizzes" subtitle="Create and manage quizzes">
        <Link to="/quizzes/new" className={ui.btn}>
          <FiPlus /> New quiz
        </Link>
      </PageHeader>
      {loading || !data ? (
        <Spinner />
      ) : (
        <div className={`${ui.card} overflow-x-auto p-0`}>
          <table className="w-full">
            <thead>
              <tr>
                {['Title', 'Category', 'Level', 'Questions', 'Status', ''].map((head) => (
                  <th key={head} className={ui.th}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((quiz) => (
                <tr key={quiz._id}>
                  <td className={`${ui.td} font-medium`}>{quiz.title}</td>
                  <td className={ui.td}>{quiz.category?.name || '-'}</td>
                  <td className={`${ui.td} capitalize`}>{quiz.difficulty}</td>
                  <td className={ui.td}>{quiz.questionCount}</td>
                  <td className={ui.td}>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${quiz.published ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                      {quiz.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className={`${ui.td} whitespace-nowrap text-right`}>
                    <Link to={`/quizzes/${quiz._id}`} className={ui.icon} title="Edit">
                      <FiEdit2 />
                    </Link>
                    <button className={ui.icon} title="Delete" onClick={() => remove(quiz)}>
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">No quizzes yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
