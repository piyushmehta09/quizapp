import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiSave } from 'react-icons/fi';
import { api } from '../lib/api';
import useFetch from '../hooks/useFetch';
import PageHeader from '../components/PageHeader';
import QuestionManager from '../components/QuestionManager';
import Spinner from '../components/Spinner';
import { ui } from '../ui';

const blank = { title: '', description: '', category: '', difficulty: 'medium', timeLimit: 10, passScore: 60, questionLimit: 0, published: false };

export default function QuizEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const { data: categories } = useFetch('/admin/categories');
  const [form, setForm] = useState(blank);
  const [loading, setLoading] = useState(!isNew);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isNew) {
      setForm(blank);
      return;
    }
    api(`/admin/quizzes/${id}`)
      .then((quiz) => setForm({ ...quiz, category: quiz.category || '' }))
      .catch((error) => toast.error(error.message))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const set = (key) => (event) => {
    const { type, checked, value } = event.target;
    setForm({ ...form, [key]: type === 'checkbox' ? checked : value });
  };

  const save = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      const body = {
        ...form,
        timeLimit: Number(form.timeLimit),
        passScore: Number(form.passScore),
        questionLimit: Number(form.questionLimit),
      };
      const saved = await api(isNew ? '/admin/quizzes' : `/admin/quizzes/${id}`, { method: isNew ? 'POST' : 'PUT', body });
      toast.success('Quiz saved');
      if (isNew) navigate(`/quizzes/${saved._id}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <>
      <PageHeader title={isNew ? 'New quiz' : 'Edit quiz'} subtitle={isNew ? 'Save the quiz first, then add questions' : form.title} />
      <form onSubmit={save} className={`${ui.card} mb-6 space-y-4`}>
        <div>
          <label className={ui.label}>Title</label>
          <input className={ui.input} required value={form.title} onChange={set('title')} />
        </div>
        <div>
          <label className={ui.label}>Description</label>
          <textarea className={ui.input} rows={2} value={form.description || ''} onChange={set('description')} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className={ui.label}>Category</label>
            <select className={ui.input} value={form.category} onChange={set('category')}>
              <option value="">None</option>
              {(categories || []).map((category) => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={ui.label}>Difficulty</label>
            <select className={ui.input} value={form.difficulty} onChange={set('difficulty')}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label className={ui.label}>Time (min)</label>
            <input className={ui.input} type="number" min="1" value={form.timeLimit} onChange={set('timeLimit')} />
          </div>
          <div>
            <label className={ui.label}>Pass score (%)</label>
            <input className={ui.input} type="number" min="1" max="100" value={form.passScore} onChange={set('passScore')} />
          </div>
          <div>
            <label className={ui.label}>Random questions (0 = all)</label>
            <input className={ui.input} type="number" min="0" value={form.questionLimit} onChange={set('questionLimit')} />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" className="h-4 w-4 accent-indigo-600" checked={form.published} onChange={set('published')} />
            Published
          </label>
          <button className={ui.btn} disabled={busy}>
            <FiSave /> {busy ? 'Saving...' : 'Save quiz'}
          </button>
        </div>
      </form>
      {!isNew && <QuestionManager quizId={id} />}
    </>
  );
}
