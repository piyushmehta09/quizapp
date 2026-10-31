import Link from 'next/link';
import { FiArrowRight, FiClock, FiHelpCircle } from 'react-icons/fi';
import { ui } from '@/lib/ui';

const emoji = { easy: '🌱', medium: '🔥', hard: '🚀' };

export default function QuizCard({ quiz }) {
  return (
    <Link
      href={`/quiz/${quiz._id}`}
      className={`${ui.card} group block transition hover:-translate-y-1 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-100`}
    >
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 text-2xl">
        {emoji[quiz.difficulty] || '🧠'}
      </div>
      <div className="flex gap-2">
        <span className={ui.tag}>{quiz.category?.name || 'General'}</span>
        <span className={ui.tag}>{quiz.difficulty}</span>
      </div>
      <h3 className="mt-3 text-lg font-bold">{quiz.title}</h3>
      <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm text-slate-500">{quiz.description}</p>
      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <FiHelpCircle /> {quiz.questionLimit > 0 ? Math.min(quiz.questionLimit, quiz.questionCount) : quiz.questionCount}
          </span>
          <span className="flex items-center gap-1">
            <FiClock /> {quiz.timeLimit} min
          </span>
        </span>
        <span className="flex items-center gap-1 font-semibold text-indigo-600 transition group-hover:gap-2">
          Start <FiArrowRight />
        </span>
      </div>
    </Link>
  );
}
