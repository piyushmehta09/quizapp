const router = require('express').Router();
const { protect, authorize } = require('../middlewares/auth');
const stats = require('../controllers/statsController');
const users = require('../controllers/userController');
const categories = require('../controllers/categoryController');
const quizzes = require('../controllers/quizController');
const questions = require('../controllers/questionController');
const attempts = require('../controllers/attemptController');

router.use(protect, authorize('admin'));

router.get('/stats', stats.overview);

router.get('/users', users.list);
router.patch('/users/:id/role', users.setRole);
router.delete('/users/:id', users.remove);

router.route('/categories').get(categories.list).post(categories.create);
router.delete('/categories/:id', categories.remove);

router.route('/quizzes').get(quizzes.adminList).post(quizzes.create);
router.route('/quizzes/:id').get(quizzes.adminGet).put(quizzes.update).delete(quizzes.remove);

router.route('/quizzes/:quizId/questions').get(questions.list).post(questions.create);
router.route('/questions/:id').put(questions.update).delete(questions.remove);

router.get('/attempts', attempts.adminList);

module.exports = router;
