const { Schema, model } = require('mongoose');

const attemptSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    quiz: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
    answers: [
      {
        _id: false,
        question: { type: Schema.Types.ObjectId, ref: 'Question' },
        selected: { type: Number, default: -1 },
      },
    ],
    correctCount: { type: Number, default: 0 },
    incorrectCount: { type: Number, default: 0 },
    unanswered: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    percent: { type: Number, default: 0 },
    passed: { type: Boolean, default: false },
    timeTaken: { type: Number, default: 0 },
  },
  { timestamps: true }
);

attemptSchema.index({ user: 1, createdAt: -1 });
attemptSchema.index({ quiz: 1, createdAt: -1 });

module.exports = model('Attempt', attemptSchema);
