const User = require('../models/User');
const Attempt = require('../models/Attempt');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.list = asyncHandler(async (req, res) => {
  res.json(await User.find().sort('-createdAt').lean());
});

exports.setRole = asyncHandler(async (req, res) => {
  if (String(req.user._id) === req.params.id) throw new AppError('You cannot change your own role', 400);
  const role = req.body.role === 'admin' ? 'admin' : 'user';
  res.json(await User.findByIdAndUpdate(req.params.id, { role }, { new: true }));
});

exports.remove = asyncHandler(async (req, res) => {
  if (String(req.user._id) === req.params.id) throw new AppError('You cannot delete yourself', 400);
  await Promise.all([User.findByIdAndDelete(req.params.id), Attempt.deleteMany({ user: req.params.id })]);
  res.json({ success: true });
});
