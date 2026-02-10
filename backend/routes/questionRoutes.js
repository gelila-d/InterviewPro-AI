const express = require('express');
const router = express.Router();
const { getQuestions, getQuestionById, addQuestion } = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getQuestions);
router.get('/:id', getQuestionById);
router.post('/', protect, addQuestion); // Protected add

module.exports = router;
