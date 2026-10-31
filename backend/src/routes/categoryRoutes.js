const router = require('express').Router();
const { list } = require('../controllers/categoryController');

router.get('/', list);

module.exports = router;
