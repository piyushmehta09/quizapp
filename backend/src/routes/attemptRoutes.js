const router = require('express').Router();
const { mine, detail, leaderboard } = require('../controllers/attemptController');
const { protect } = require('../middlewares/auth');

router.get('/leaderboard', leaderboard);
router.get('/me', protect, mine);
router.get('/:id', protect, detail);

module.exports = router;
