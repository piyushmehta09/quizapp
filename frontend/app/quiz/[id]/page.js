'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { FiAward, FiChevronLeft, FiChevronRight, FiClock, FiHelpCircle, FiSend } from 'react-icons/fi';
import { api } from '@/lib/api';
import { ask } from '@/lib/ask';
import { ui } from '@/lib/ui';
import { useAuth } from '@/context/AuthContext';
import Spinner from '@/components/Spinner';

const format = (seconds) =>
  `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

export default function QuizPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, ready } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [session, setSession] = useState(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [left, setLeft] = useState(0);
  const [busy, setBusy] = useState(false);
  const deadline = useRef(0);
  const sent = useRef(false);
  const submitRef = useRef(null);

  useEffect(() => {
    api(`/quizzes/${id}`).then(setQuiz).catch((error) => toast.error(error.message));
  }, [id]);

  const start = async () => {
    try {
      const data = await api(`/quizzes/${id}/start`);
      deadline.current = Date.now() + data.quiz.timeLimit * 60 * 1000;
      setLeft(data.quiz.timeLimit * 60);
      setSession(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const submit = useCallback(async () => {
    if (sent.current || !session) return;
    sent.current = true;
    setBusy(true);
    try {
      const data = await api(`/quizzes/${id}/submit`, {
        method: 'POST',
        body: {
          answers: session.questions.map((question) => ({ question: question._id, selected: answers[question._id] ?? -1 })),
          timeTaken: session.quiz.timeLimit * 60 - left,
        },
      });
      router.push(`/result/${data.id}`);
    } catch (error) {
      sent.current = false;
      setBusy(false);
      toast.error(error.message);
    }
  }, [session, answers, left, id, router]);

  submitRef.current = submit;

  useEffect(() => {
    if (!session) return undefined;
    const timer = setInterval(() => setLeft(Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000))), 500);
    return () => clearInterval(timer);
  }, [session]);

  useEffect(() => {
    if (session && left <= 0) {
      toast.info("Time's up! Submitting your answers");
      submitRef.current();
    }
  }, [session, left]);

  if (!quiz || !ready) return <Spinner />;

  if (!session) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className={`${ui.card} p-8 text-center`}>
          <h1 className="text-3xl font-extrabold">{quiz.title}</h1>
          <p className="mt-2 text-slate-500">{quiz.description}</p>
          <div className="my-6 grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-xl bg-indigo-50 p-3">
              <FiHelpCircle className="mx-auto mb-1 text-indigo-600" size={20} />
              <b>{quiz.questionLimit > 0 ? Math.min(quiz.questionLimit, quiz.questionCount) : quiz.questionCount}</b> questions
            </div>
            <div className="rounded-xl bg-indigo-50 p-3">
              <FiClock className="mx-auto mb-1 text-indigo-600" size={20} />
              <b>{quiz.timeLimit}</b> minutes
            </div>
            <div className="rounded-xl bg-indigo-50 p-3">
              <FiAward className="mx-auto mb-1 text-indigo-600" size={20} />
              Pass at <b>{quiz.passScore}%</b>
            </div>
          </div>
          {user ? (
            <button className={ui.btn} onClick={start}>Start quiz</button>
          ) : (
            <Link href="/login" className={ui.btn}>Log in to start</Link>
          )}
        </div>
      </div>
    );
  }

  const question = session.questions[index];
  const total = session.questions.length;
  const unanswered = total - Object.keys(answers).length;
  const isLast = index === total - 1;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between text-sm font-semibold">
        <span>Question {index + 1} of {total}</span>
        <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 ${left < 30 ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
          <FiClock /> {format(left)}
        </span>
      </div>
      <div className="my-4 h-2.5 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>

      <div className={ui.card}>
        <h2 className="mb-4 text-xl font-bold">{question.text}</h2>
        <div className="space-y-3">
          {question.options.map((option, optionIndex) => {
            const selected = answers[question._id] === optionIndex;
            return (
              <button
                key={optionIndex}
                onClick={() => setAnswers({ ...answers, [question._id]: optionIndex })}
                className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition ${selected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white hover:border-indigo-300'}`}
              >
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm font-bold ${selected ? 'bg-indigo-500 text-white' : 'bg-slate-100'}`}>
                  {'ABCDEF'[optionIndex]}
                </span>
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <button className={ui.ghost} disabled={index === 0} onClick={() => setIndex(index - 1)}>
          <FiChevronLeft /> Back
        </button>
        {isLast ? (
          <button className={ui.btn} disabled={busy} onClick={() => ask(`Submit your answers? ${unanswered} unanswered.`, submit)}>
            <FiSend /> Submit
          </button>
        ) : (
          <button className={ui.btn} onClick={() => setIndex(index + 1)}>
            Next <FiChevronRight />
          </button>
        )}
      </div>
    </div>
  );
}
