require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');
const Quiz = require('./models/Quiz');
const Question = require('./models/Question');

const quizzes = [
  {
    title: 'World Basics',
    description: 'A quick warm-up on general knowledge.',
    category: 'General Knowledge',
    difficulty: 'easy',
    timeLimit: 5,
    questionLimit: 4,
    questions: [
      ['Capital of France?', ['Berlin', 'Paris', 'Rome', 'Madrid'], 1, 'Paris is the capital of France.'],
      ['Largest planet in our solar system?', ['Earth', 'Mars', 'Jupiter', 'Venus'], 2, 'Jupiter is the largest planet.'],
      ['How many continents are there?', ['5', '6', '7', '8'], 2, 'Seven by the common convention.'],
      ['Which ocean is the largest?', ['Atlantic', 'Indian', 'Arctic', 'Pacific'], 3, 'The Pacific covers about a third of Earth.'],
      ['Which gas do plants absorb?', ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Helium'], 1, 'Plants absorb CO2 for photosynthesis.'],
    ],
  },
  {
    title: 'JavaScript Fundamentals',
    description: 'Check your core JavaScript knowledge.',
    category: 'Technology',
    difficulty: 'medium',
    timeLimit: 8,
    questionLimit: 0,
    questions: [
      ['Which keyword declares a block-scoped variable?', ['var', 'let', 'def', 'dim'], 1, 'let is block scoped.'],
      ['What does JSON stand for?', ['JavaScript Object Notation', 'Java Source Object Name', 'Joint Script Online Network', 'None of these'], 0, 'JavaScript Object Notation.'],
      ['Which method adds an item to the end of an array?', ['push', 'pop', 'shift', 'unshift'], 0, 'push appends to the end.'],
    ],
  },
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User.deleteMany({ email: 'admin@quizly.com' }), Quiz.deleteMany({}), Question.deleteMany({})]);

  await User.create({ name: 'Admin', email: 'admin@quizly.com', password: 'Admin@123', role: 'admin' });

  for (const item of quizzes) {
    const category = await Category.findOneAndUpdate({ name: item.category }, { name: item.category }, { upsert: true, new: true });
    const { questions, ...fields } = item;
    const quiz = await Quiz.create({ ...fields, category: category._id, published: true, questionCount: questions.length });
    await Question.insertMany(
      questions.map(([text, options, correct, explanation]) => ({ quiz: quiz._id, text, options, correct, explanation }))
    );
  }

  console.log('Seeded. Admin login: admin@quizly.com / Admin@123');
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
