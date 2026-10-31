const { Schema, model } = require('mongoose');

const categorySchema = new Schema({
  name: { type: String, required: [true, 'Category name is required'], unique: true, trim: true },
});

module.exports = model('Category', categorySchema);
