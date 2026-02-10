const Question = require('../models/Question');

// @desc    Get all questions or filter by category/difficulty
// @route   GET /api/questions
// @access  Public (or Private)
const getQuestions = async (req, res) => {
    const { category, difficulty } = req.query;
    const query = {};

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    try {
        const questions = await Question.find(query);
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single question by ID
// @route   GET /api/questions/:id
// @access  Public
const getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json(question);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add a new question
// @route   POST /api/questions
// @access  Private (Admin only ideally)
const addQuestion = async (req, res) => {
    try {
        const question = await Question.create(req.body);
        res.status(201).json(question);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
};

module.exports = {
    getQuestions,
    getQuestionById,
    addQuestion
};
