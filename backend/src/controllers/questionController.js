const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const pick = require('../utils/pick');

const FIELDS = ['text', 'options', 'correct', 'explanation', 'points'];

const syncCount = async (quizId) => {
  const count = await Question.countDocuments({ quiz: quizId });
  await Quiz.findByIdAndUpdate(quizId, { questionCount: count });
};

exports.list = asyncHandler(async (req, res) => {
  res.json(await Question.find({ quiz: req.params.quizId }).sort('createdAt').lean());
});

exports.create = asyncHandler(async (req, res) => {
  if (!(await Quiz.exists({ _id: req.params.quizId }))) throw new AppError('Quiz not found', 404);
  const question = await Question.create({ ...pick(req.body, FIELDS), quiz: req.params.quizId });
  await syncCount(req.params.quizId);
  res.status(201).json(question);
});

exports.update = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id);
  if (!question) throw new AppError('Question not found', 404);
  question.set(pick(req.body, FIELDS));
  await question.save();
  res.json(question);
});

exports.remove = asyncHandler(async (req, res) => {
  const question = await Question.findByIdAndDelete(req.params.id);
  if (question) await syncCount(question.quiz);
  res.json({ success: true });
});
