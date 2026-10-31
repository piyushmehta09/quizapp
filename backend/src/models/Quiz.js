const { Schema, model } = require('mongoose');

const quizSchema = new Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    description: { type: String, trim: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    timeLimit: { type: Number, default: 10, min: 1 },
    passScore: { type: Number, default: 60, min: 1, max: 100 },
    questionLimit: { type: Number, default: 0, min: 0 },
    questionCount: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

quizSchema.index({ published: 1, createdAt: -1 });
quizSchema.index({ category: 1 });

module.exports = model('Quiz', quizSchema);
