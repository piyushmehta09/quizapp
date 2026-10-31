const { Schema, model } = require('mongoose');

const questionSchema = new Schema(
  {
    quiz: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true, index: true },
    text: { type: String, required: [true, 'Question text is required'], trim: true },
    options: {
      type: [String],
      validate: [(v) => v.length >= 2 && v.length <= 6, 'A question needs 2 to 6 options'],
    },
    correct: { type: Number, required: true, min: 0 },
    explanation: { type: String, trim: true },
    points: { type: Number, default: 1, min: 1 },
  },
  { timestamps: true }
);

questionSchema.pre('validate', function checkCorrect(next) {
  if (this.options && this.correct >= this.options.length) {
    this.invalidate('correct', 'Correct answer must match one of the options');
  }
  next();
});

module.exports = model('Question', questionSchema);
