const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const pick = require('../utils/pick');

const FIELDS = ['title', 'description', 'category', 'difficulty', 'timeLimit', 'passScore', 'questionLimit', 'published'];
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const findPublished = async (id) => {
  const quiz = await Quiz.findOne({ _id: id, published: true });
  if (!quiz) throw new AppError('Quiz not found', 404);
  return quiz;
};

const sanitize = (body) => {
  const data = pick(body, FIELDS);
  if (data.category === '') data.category = null;
  return data;
};

exports.list = asyncHandler(async (req, res) => {
  const { search, category, difficulty } = req.query;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 12);
  const filter = { published: true };

  if (search) filter.title = new RegExp(escapeRegex(String(search)), 'i');
  if (category) filter.category = category;
  if (difficulty) filter.difficulty = difficulty;

  const [items, total] = await Promise.all([
    Quiz.find(filter)
      .populate('category', 'name')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Quiz.countDocuments(filter),
  ]);

  res.json({ items, page, total, pages: Math.ceil(total / limit) });
});

exports.details = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findOne({ _id: req.params.id, published: true }).populate('category', 'name').lean();
  if (!quiz) throw new AppError('Quiz not found', 404);
  res.json(quiz);
});

exports.start = asyncHandler(async (req, res) => {
  const quiz = await findPublished(req.params.id);
  const size = quiz.questionLimit > 0 ? Math.min(quiz.questionLimit, quiz.questionCount) : quiz.questionCount;
  if (!size) throw new AppError('This quiz has no questions yet', 400);

  const questions = await Question.aggregate([
    { $match: { quiz: quiz._id } },
    { $sample: { size } },
    { $project: { text: 1, options: 1, points: 1 } },
  ]);

  res.json({
    quiz: { _id: quiz._id, title: quiz.title, timeLimit: quiz.timeLimit, passScore: quiz.passScore },
    questions,
  });
});

exports.submit = asyncHandler(async (req, res) => {
  const quiz = await findPublished(req.params.id);
  const submitted = Array.isArray(req.body.answers) ? req.body.answers.slice(0, 200) : [];

  const questions = await Question.find({
    _id: { $in: submitted.map((answer) => answer.question) },
    quiz: quiz._id,
  }).lean();
  const byId = new Map(questions.map((question) => [String(question._id), question]));

  const seen = new Set();
  const graded = [];
  let correctCount = 0;
  let incorrectCount = 0;
  let unanswered = 0;
  let score = 0;
  let total = 0;

  submitted.forEach((answer) => {
    const question = byId.get(String(answer.question));
    if (!question || seen.has(String(question._id))) return;
    seen.add(String(question._id));

    const selected = Number.isInteger(answer.selected) ? answer.selected : -1;
    total += question.points;

    if (selected < 0) unanswered += 1;
    else if (selected === question.correct) {
      correctCount += 1;
      score += question.points;
    } else incorrectCount += 1;

    graded.push({ question: question._id, selected });
  });

  if (!graded.length) throw new AppError('No valid answers submitted', 400);

  const percent = total ? Math.round((score / total) * 100) : 0;
  const attempt = await Attempt.create({
    user: req.user._id,
    quiz: quiz._id,
    answers: graded,
    correctCount,
    incorrectCount,
    unanswered,
    score,
    total,
    percent,
    passed: percent >= quiz.passScore,
    timeTaken: Math.max(0, Math.floor(Number(req.body.timeTaken) || 0)),
  });

  res.status(201).json({ id: attempt._id });
});

exports.adminList = asyncHandler(async (req, res) => {
  res.json(await Quiz.find().populate('category', 'name').sort('-createdAt').lean());
});

exports.adminGet = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).lean();
  if (!quiz) throw new AppError('Quiz not found', 404);
  res.json(quiz);
});

exports.create = asyncHandler(async (req, res) => {
  res.status(201).json(await Quiz.create(sanitize(req.body)));
});

exports.update = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findByIdAndUpdate(req.params.id, sanitize(req.body), { new: true, runValidators: true });
  if (!quiz) throw new AppError('Quiz not found', 404);
  res.json(quiz);
});

exports.remove = asyncHandler(async (req, res) => {
  await Promise.all([
    Quiz.findByIdAndDelete(req.params.id),
    Question.deleteMany({ quiz: req.params.id }),
    Attempt.deleteMany({ quiz: req.params.id }),
  ]);
  res.json({ success: true });
});
