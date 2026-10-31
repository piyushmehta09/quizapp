const mongoose = require('mongoose');
const Attempt = require('../models/Attempt');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.mine = asyncHandler(async (req, res) => {
  res.json(await Attempt.find({ user: req.user._id }).populate('quiz', 'title').sort('-createdAt').limit(50).lean());
});

exports.detail = asyncHandler(async (req, res) => {
  const attempt = await Attempt.findOne({ _id: req.params.id, user: req.user._id })
    .populate('quiz', 'title passScore')
    .populate('answers.question')
    .lean();
  if (!attempt) throw new AppError('Result not found', 404);
  res.json(attempt);
});

exports.leaderboard = asyncHandler(async (req, res) => {
  const match = {};
  if (req.query.quiz) match.quiz = new mongoose.Types.ObjectId(req.query.quiz);

  const rows = await Attempt.aggregate([
    { $match: match },
    { $group: { _id: '$user', best: { $max: '$percent' }, avg: { $avg: '$percent' }, attempts: { $sum: 1 } } },
    { $sort: { best: -1, avg: -1 } },
    { $limit: 20 },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    {
      $project: {
        best: 1,
        attempts: 1,
        avg: { $round: ['$avg', 0] },
        name: { $arrayElemAt: ['$user.name', 0] },
      },
    },
  ]);

  res.json(rows);
});

exports.adminList = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = 15;
  const filter = {};
  if (req.query.quiz) filter.quiz = req.query.quiz;
  if (req.query.user) filter.user = req.query.user;

  const [items, total] = await Promise.all([
    Attempt.find(filter)
      .select('-answers')
      .populate('user', 'name email')
      .populate('quiz', 'title')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Attempt.countDocuments(filter),
  ]);

  res.json({ items, page, total, pages: Math.ceil(total / limit) });
});
