'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { FiLock, FiLogIn, FiMail, FiUser, FiUserPlus } from 'react-icons/fi';
import { api } from '@/lib/api';
import { ui } from '@/lib/ui';
import { useAuth } from '@/context/AuthContext';

export default function AuthForm({ register = false }) {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      const data = await api(register ? '/auth/register' : '/auth/login', { method: 'POST', body: form });
      login(data);
      toast.success(register ? 'Account created' : 'Welcome back');
      router.push('/');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  const field = (key, Icon, props) => (
    <div className="relative">
      <Icon className="absolute left-4 top-4 text-slate-400" />
      <input className={`${ui.input} pl-11`} required value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} {...props} />
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16">
      <form onSubmit={submit} className={`${ui.card} space-y-4 p-8`}>
        <div className="text-center">
          <h1 className="text-2xl font-bold">{register ? 'Create your account' : 'Welcome back'}</h1>
          <p className="text-sm text-slate-500">{register ? 'Start taking quizzes today' : 'Log in to continue'}</p>
        </div>
        {register && field('name', FiUser, { placeholder: 'Full name' })}
        {field('email', FiMail, { type: 'email', placeholder: 'Email address' })}
        {field('password', FiLock, { type: 'password', placeholder: 'Password (6+ characters)', minLength: 6 })}
        <button className={`${ui.btn} w-full`} disabled={busy}>
          {register ? <FiUserPlus /> : <FiLogIn />} {busy ? 'Please wait...' : register ? 'Sign up' : 'Log in'}
        </button>
        <p className="text-center text-sm text-slate-500">
          {register ? 'Already have an account?' : 'New here?'}{' '}
          <Link href={register ? '/login' : '/register'} className="font-semibold text-indigo-600">
            {register ? 'Log in' : 'Create an account'}
          </Link>
        </p>
      </form>
    </div>
  );
}
