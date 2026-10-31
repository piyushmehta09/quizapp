import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiLock, FiLogIn, FiMail } from 'react-icons/fi';
import { api } from '../lib/api';
import { ui } from '../ui';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);

  if (localStorage.getItem('adminToken')) return <Navigate to="/" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      const data = await api('/auth/login', { method: 'POST', body: form });
      if (data.user.role !== 'admin') throw new Error('Admin access required');
      localStorage.setItem('adminToken', data.token);
      toast.success('Welcome back');
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-indigo-50 via-slate-50 to-violet-50 p-4">
      <form onSubmit={submit} className={`${ui.card} w-full max-w-sm space-y-4 p-8 text-center`}>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-2xl font-extrabold text-white">Q</div>
        <div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-slate-500">Sign in to Quizly Admin</p>
        </div>
        <div className="relative">
          <FiMail className="absolute left-3.5 top-3.5 text-slate-400" />
          <input className={`${ui.input} pl-10`} type="email" placeholder="Email" required onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="relative">
          <FiLock className="absolute left-3.5 top-3.5 text-slate-400" />
          <input className={`${ui.input} pl-10`} type="password" placeholder="Password" required onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button className={`${ui.btn} w-full`} disabled={busy}>
          <FiLogIn /> {busy ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
