'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiAward, FiCheckCircle, FiClock, FiInbox, FiSearch, FiTrendingUp } from 'react-icons/fi';
import { api } from '@/lib/api';
import { ui } from '@/lib/ui';
import { useAuth } from '@/context/AuthContext';
import QuizCard from '@/components/QuizCard';
import Spinner from '@/components/Spinner';

const features = [
  { icon: FiClock, title: 'Timed challenges', text: 'Race the clock. Quizzes auto-submit when time is up.' },
  { icon: FiCheckCircle, title: 'Instant results', text: 'Get your score with a full answer review and explanations.' },
  { icon: FiAward, title: 'Live leaderboard', text: 'Compete with other learners and climb the ranks.' },
  { icon: FiTrendingUp, title: 'Track progress', text: 'See your history, averages and pass rate in one place.' },
];

const steps = [
  { title: 'Create a free account', text: 'Sign up in seconds, no credit card needed.' },
  { title: 'Pick a quiz', text: 'Filter by category and difficulty to find your match.' },
  { title: 'Learn and compete', text: 'Finish, review your answers and beat your best score.' },
];

const chips = ['Multiple categories', 'Randomised questions', 'Instant grading', 'Works on every device'];

export default function HomePage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ search: '', category: '', difficulty: '', page: 1 });
  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api('/categories').then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      api(`/quizzes?${new URLSearchParams(filters)}`)
        .then(setData)
        .catch(() => setData({ items: [], pages: 0 }));
    }, 250);
    return () => clearTimeout(timer);
  }, [filters]);

  const change = (key) => (event) => setFilters({ ...filters, [key]: event.target.value, page: 1 });

  return (
    <>
      <div className={ui.container}>
        <section className="py-10 text-center">
          <span className="inline-block rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-indigo-600 shadow-sm">
            Learn · Compete · Grow
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-6xl">Test your knowledge 🧠</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-500">Pick a quiz, beat the clock and climb the leaderboard.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href="#quizzes" className={ui.btn}>Browse quizzes</a>
            {!user && <Link href="/register" className={ui.ghost}>Create free account</Link>}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            {chips.map((chip) => (
              <span key={chip} className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm text-slate-500">{chip}</span>
            ))}
          </div>
        </section>

        <h2 id="quizzes" className="mb-5 scroll-mt-24 text-2xl font-bold">Explore quizzes</h2>
        <div className="mb-6 grid gap-3 sm:grid-cols-4">
          <div className="relative sm:col-span-2">
            <FiSearch className="absolute left-4 top-4 text-slate-400" />
            <input className={`${ui.input} pl-11`} placeholder="Search quizzes..." onChange={change('search')} />
          </div>
          <select className={ui.input} onChange={change('category')}>
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
          <select className={ui.input} onChange={change('difficulty')}>
            <option value="">Any level</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {!data ? (
          <Spinner />
        ) : data.items.length === 0 ? (
          <div className={`${ui.card} py-14 text-center`}>
            <FiInbox className="mx-auto text-slate-300" size={48} />
            <h3 className="mt-3 text-lg font-bold">No quizzes found</h3>
            <p className="text-slate-500">Try a different search, or check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((quiz) => <QuizCard key={quiz._id} quiz={quiz} />)}
          </div>
        )}

        {data?.pages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button className={ui.ghost} disabled={filters.page < 2} onClick={() => setFilters({ ...filters, page: filters.page - 1 })}>Prev</button>
            <span className="text-sm text-slate-500">{filters.page} / {data.pages}</span>
            <button className={ui.ghost} disabled={filters.page >= data.pages} onClick={() => setFilters({ ...filters, page: filters.page + 1 })}>Next</button>
          </div>
        )}
      </div>

      <section className="border-y border-slate-200 bg-white/70">
        <div className={ui.container}>
          <h2 className="mb-8 text-center text-3xl font-bold">Why learners love Quizly</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title} className={`${ui.card} text-center`}>
                <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Icon size={24} />
                </span>
                <h3 className="font-bold">{title}</h3>
                <p className="mt-1 text-sm text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={ui.container}>
        <h2 className="mb-8 text-center text-3xl font-bold">How it works</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className={`${ui.card} text-center`}>
              <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xl font-extrabold text-white">
                {index + 1}
              </span>
              <h3 className="font-bold">{step.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-14">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-500 px-6 py-12 text-center text-white shadow-2xl shadow-indigo-500/30">
          <h2 className="text-3xl font-bold">Ready to challenge yourself?</h2>
          <p className="mb-6 mt-2 opacity-90">Join now and take your first quiz in under a minute.</p>
          <Link href={user ? '/#quizzes' : '/register'} className={ui.white}>
            {user ? 'Pick a quiz' : 'Get started free'}
          </Link>
        </div>
      </section>
    </>
  );
}
