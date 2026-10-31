const Category = require('../models/Category');
const Quiz = require('../models/Quiz');
const asyncHandler = require('../utils/asyncHandler');

exports.list = asyncHandler(async (req, res) => {
  res.set('Cache-Control', 'public, max-age=60');
  res.json(await Category.find().sort('name').lean());
});

exports.create = asyncHandler(async (req, res) => {
  res.status(201).json(await Category.create({ name: req.body.name }));
});

exports.remove = asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  await Quiz.updateMany({ category: req.params.id }, { $unset: { category: 1 } });
  res.json({ success: true });
});
