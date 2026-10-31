import { useState } from 'react';
import { toast } from 'react-toastify';
import { FiPlus, FiTag, FiTrash2 } from 'react-icons/fi';
import useFetch from '../hooks/useFetch';
import { api } from '../lib/api';
import { ask } from '../lib/ask';
import PageHeader from '../components/PageHeader';
import Spinner from '../components/Spinner';
import { ui } from '../ui';

export default function Categories() {
  const { data, loading, reload } = useFetch('/admin/categories');
  const [name, setName] = useState('');

  const add = async (event) => {
    event.preventDefault();
    try {
      await api('/admin/categories', { method: 'POST', body: { name } });
      toast.success('Category added');
      setName('');
      reload();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const remove = (category) =>
    ask(`Delete "${category.name}"?`, async () => {
      await api(`/admin/categories/${category._id}`, { method: 'DELETE' });
      toast.success('Category deleted');
      reload();
    });

  return (
    <>
      <PageHeader title="Categories" subtitle="Group quizzes by topic" />
      <form onSubmit={add} className={`${ui.card} mb-5 flex gap-3`}>
        <input className={ui.input} placeholder="New category name" required value={name} onChange={(e) => setName(e.target.value)} />
        <button className={ui.btn}>
          <FiPlus /> Add
        </button>
      </form>
      {loading || !data ? (
        <Spinner />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((category) => (
            <div key={category._id} className={`${ui.card} flex items-center justify-between`}>
              <span className="flex items-center gap-2 font-medium">
                <FiTag className="text-indigo-500" /> {category.name}
              </span>
              <button className={ui.icon} onClick={() => remove(category)}>
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
