const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');

const respond = (res, user, status = 200) =>
  res.status(status).json({
    token: generateToken(user._id),
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
  });

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) throw new AppError('Name, email and password are required', 400);
  const user = await User.create({ name, email, password });
  respond(res, user, 201);
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email || '').toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(String(password || '')))) {
    throw new AppError('Invalid email or password', 401);
  }
  respond(res, user);
});

exports.me = (req, res) => res.json({ user: req.user });
