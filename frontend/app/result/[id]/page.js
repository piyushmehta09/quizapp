'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { FiAward, FiCheckCircle, FiMinusCircle, FiRefreshCw, FiXCircle } from 'react-icons/fi';
import { api } from '@/lib/api';
import { ui } from '@/lib/ui';
import Spinner from '@/components/Spinner';

export default function ResultPage() {
  const { id } = useParams();
  const [attempt, setAttempt] = useState(null);

  useEffect(() => {
    api(`/attempts/${id}`).then(setAttempt).catch((error) => toast.error(error.message));
  }, [id]);

  if (!attempt) return <Spinner />;

  const color = attempt.passed ? '#16a34a' : '#e11d48';
  const stats = [
    { label: 'Correct', value: attempt.correctCount, icon: FiCheckCircle, tone: 'bg-emerald-50 text-emerald-600' },
    { label: 'Incorrect', value: attempt.incorrectCount, icon: FiXCircle, tone: 'bg-rose-50 text-rose-600' },
    { label: 'Skipped', value: attempt.unanswered, icon: FiMinusCircle, tone: 'bg-slate-100 text-slate-500' },
    { label: 'Score', value: `${attempt.percent}%`, icon: FiAward, tone: 'bg-indigo-50 text-indigo-600' },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className={`${ui.card} p-8 text-center`}>
        <div className="mx-auto mb-4 grid h-40 w-40 place-items-center rounded-full" style={{ background: `conic-gradient(${color} ${attempt.percent * 3.6}deg, #e2e8f0 0)` }}>
          <span className="grid h-32 w-32 place-items-center rounded-full bg-white text-4xl font-extrabold">{attempt.percent}%</span>
        </div>
        <h1 className="text-2xl font-bold">{attempt.passed ? 'You passed!' : 'Keep practicing!'}</h1>
        <p className="text-slate-500">
          {attempt.quiz?.title} · {attempt.score}/{attempt.total} points · {attempt.timeTaken}s
        </p>
        <div className="my-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, tone }) => (
            <div key={label} className={`rounded-xl p-4 ${tone}`}>
              <Icon className="mx-auto mb-1" size={22} />
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs font-medium">{label}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href={`/quiz/${attempt.quiz?._id}`} className={ui.btn}>
            <FiRefreshCw /> Retake
          </Link>
          <Link href="/leaderboard" className={ui.ghost}>Leaderboard</Link>
        </div>
      </div>

      <h2 className="mb-4 mt-8 text-xl font-bold">Answer review</h2>
      <div className="space-y-4">
        {attempt.answers.map(({ question, selected }, index) =>
          question ? (
            <div key={question._id} className={ui.card}>
              <p className="font-semibold">
                {index + 1}. {question.text}
              </p>
              <div className="mt-3 space-y-2">
                {question.options.map((option, optionIndex) => {
                  const correct = optionIndex === question.correct;
                  const wrong = optionIndex === selected && !correct;
                  return (
                    <div
                      key={optionIndex}
                      className={`flex items-center gap-3 rounded-xl border-2 p-3 text-sm ${correct ? 'border-emerald-500 bg-emerald-50' : wrong ? 'border-rose-500 bg-rose-50' : 'border-slate-200'}`}
                    >
                      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold ${correct ? 'bg-emerald-500 text-white' : wrong ? 'bg-rose-500 text-white' : 'bg-slate-100'}`}>
                        {'ABCDEF'[optionIndex]}
                      </span>
                      {option}
                    </div>
                  );
                })}
              </div>
              {question.explanation && <p className="mt-3 text-sm text-slate-500">💡 {question.explanation}</p>}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
