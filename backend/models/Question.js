const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        enum: ['DSA', 'JavaScript', 'MERN', 'System Design']
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    questionText: {
        type: String,
        required: true
    },
    exampleInput: String,
    exampleOutput: String,
    solutionCode: String, // For coding questions
    hints: [String]
});

module.exports = mongoose.model('Question', questionSchema);
