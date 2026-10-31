const router = require('express').Router();
const { list, details, start, submit } = require('../controllers/quizController');
const { protect } = require('../middlewares/auth');

router.get('/', list);
router.get('/:id', details);
router.get('/:id/start', protect, start);
router.post('/:id/submit', protect, submit);

module.exports = router;
