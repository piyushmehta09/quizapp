const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');
const asyncHandler = require('../utils/asyncHandler');

exports.overview = asyncHandler(async (req, res) => {
  const since = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
  since.setUTCHours(0, 0, 0, 0);

  const [users, quizzes, attempts, summary, daily, topQuizzes, recent] = await Promise.all([
    User.countDocuments(),
    Quiz.countDocuments(),
    Attempt.countDocuments(),
    Attempt.aggregate([
      { $group: { _id: null, avg: { $avg: '$percent' }, passed: { $sum: { $cond: ['$passed', 1, 0] } } } },
    ]),
    Attempt.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
    ]),
    Attempt.aggregate([
      { $group: { _id: '$quiz', attempts: { $sum: 1 }, avg: { $avg: '$percent' } } },
      { $sort: { attempts: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'quizzes', localField: '_id', foreignField: '_id', as: 'quiz' } },
      { $project: { attempts: 1, avg: { $round: ['$avg', 0] }, title: { $arrayElemAt: ['$quiz.title', 0] } } },
    ]),
    Attempt.find().populate('user', 'name').populate('quiz', 'title').sort('-createdAt').limit(6).lean(),
  ]);

  const counts = Object.fromEntries(daily.map((day) => [day._id, day.count]));
  const last7Days = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(since);
    day.setUTCDate(since.getUTCDate() + index);
    const date = day.toISOString().slice(0, 10);
    return { date, count: counts[date] || 0 };
  });

  const { avg = 0, passed = 0 } = summary[0] || {};

  res.json({
    users,
    quizzes,
    attempts,
    avgScore: Math.round(avg),
    passRate: attempts ? Math.round((passed / attempts) * 100) : 0,
    last7Days,
    topQuizzes,
    recent,
  });
});
