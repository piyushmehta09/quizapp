import { useState } from 'react';
import { toast } from 'react-toastify';
import { FiCheckCircle, FiEdit2, FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import useFetch from '../hooks/useFetch';
import { api } from '../lib/api';
import { ask } from '../lib/ask';
import Spinner from './Spinner';
import { ui } from '../ui';

const blank = () => ({ text: '', options: ['', '', '', ''], correct: 0, explanation: '', points: 1 });

export default function QuestionManager({ quizId }) {
  const { data, loading, reload } = useFetch(`/admin/quizzes/${quizId}/questions`);
  const [form, setForm] = useState(null);

  const save = async (event) => {
    event.preventDefault();
    if (form.options.some((option) => !option.trim())) return toast.error('Fill in every option');
    const body = { ...form, points: Number(form.points) };
    try {
      if (form._id) await api(`/admin/questions/${form._id}`, { method: 'PUT', body });
      else await api(`/admin/quizzes/${quizId}/questions`, { method: 'POST', body });
      toast.success('Question saved');
      setForm(null);
      reload();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const remove = (question) =>
    ask('Delete this question?', async () => {
      await api(`/admin/questions/${question._id}`, { method: 'DELETE' });
      toast.success('Question deleted');
      reload();
    });

  const setOption = (index, value) =>
    setForm({ ...form, options: form.options.map((option, i) => (i === index ? value : option)) });

  const removeOption = (index) =>
    setForm({
      ...form,
      options: form.options.filter((_, i) => i !== index),
      correct: form.correct === index ? 0 : form.correct > index ? form.correct - 1 : form.correct,
    });

  return (
    <div className={ui.card}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Questions {data && `(${data.length})`}</h2>
        {!form && (
          <button className={ui.btn} onClick={() => setForm(blank())}>
            <FiPlus /> Add question
          </button>
        )}
      </div>

      {form && (
        <form onSubmit={save} className="mb-5 space-y-3 rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
          <div>
            <label className={ui.label}>Question</label>
            <input className={ui.input} required value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
          </div>
          <div>
            <label className={ui.label}>Options (select the correct one)</label>
            <div className="space-y-2">
              {form.options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input type="radio" className="h-4 w-4 accent-emerald-600" checked={form.correct === index} onChange={() => setForm({ ...form, correct: index })} />
                  <input className={ui.input} placeholder={`Option ${index + 1}`} value={option} onChange={(e) => setOption(index, e.target.value)} />
                  {form.options.length > 2 && (
                    <button type="button" className={ui.icon} onClick={() => removeOption(index)}>
                      <FiX />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {form.options.length < 6 && (
              <button type="button" className="mt-2 text-sm font-semibold text-indigo-600" onClick={() => setForm({ ...form, options: [...form.options, ''] })}>
                + Add option
              </button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="sm:col-span-3">
              <label className={ui.label}>Explanation (shown after submission)</label>
              <input className={ui.input} value={form.explanation || ''} onChange={(e) => setForm({ ...form, explanation: e.target.value })} />
            </div>
            <div>
              <label className={ui.label}>Points</label>
              <input className={ui.input} type="number" min="1" value={form.points} onChange={(e) => setForm({ ...form, points: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-2">
            <button className={ui.btn}>Save question</button>
            <button type="button" className={ui.ghost} onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      )}

      {loading || !data ? (
        <Spinner />
      ) : (
        <ol className="space-y-3">
          {data.map((question, index) => (
            <li key={question._id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium">
                  {index + 1}. {question.text}
                </p>
                <div className="flex shrink-0">
                  <button className={ui.icon} onClick={() => setForm(question)}>
                    <FiEdit2 />
                  </button>
                  <button className={ui.icon} onClick={() => remove(question)}>
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <ul className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
                {question.options.map((option, i) => (
                  <li key={i} className={`flex items-center gap-2 ${i === question.correct ? 'font-semibold text-emerald-600' : 'text-slate-500'}`}>
                    {i === question.correct && <FiCheckCircle />} {option}
                  </li>
                ))}
              </ul>
            </li>
          ))}
          {data.length === 0 && <p className="py-6 text-center text-sm text-slate-400">No questions yet</p>}
        </ol>
      )}
    </div>
  );
}
