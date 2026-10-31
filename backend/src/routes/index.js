const router = require('express').Router();

router.use('/auth', require('./authRoutes'));
router.use('/categories', require('./categoryRoutes'));
router.use('/quizzes', require('./quizRoutes'));
router.use('/attempts', require('./attemptRoutes'));
router.use('/admin', require('./adminRoutes'));

module.exports = router;
