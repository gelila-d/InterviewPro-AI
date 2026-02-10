const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sessionType: {
        type: String, // 'MockInterview', 'CodingPractice'
        required: true
    },
    questionsAsked: [{
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        userAnswer: String,
        aiFeedback: String,
        score: Number // 0-10 or 0-100
    }],
    totalScore: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('InterviewSession', sessionSchema);
