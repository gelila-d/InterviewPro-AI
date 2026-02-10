const { GoogleGenerativeAI } = require("@google/generative-ai");
const InterviewSession = require('../models/InterviewSession');
const Question = require('../models/Question');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Start a new interview session
// @route   POST /api/interview/start
// @access  Private
const startInterview = async (req, res) => {
    const { category, difficulty } = req.body;

    try {
        const session = await InterviewSession.create({
            userId: req.user.id,
            sessionType: 'MockInterview',
            questionsAsked: [],
            totalScore: 0
        });

        // Initial prompt to Gemini to start the interview
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: `You are an expert technical interviewer. I want to start a mock interview for a ${difficulty} level ${category} developer position. Please start by asking me a relevant technical question. Do not provide the answer, just ask the question.` }],
                },
            ],
        });

        const result = await chat.sendMessage("Start the interview.");
        const response = await result.response;
        const text = response.text();

        res.status(201).json({
            sessionId: session._id,
            message: text,
            history: [] // We might want to store chat history in DB or handle it on frontend
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Process user answer and get AI response
// @route   POST /api/interview/chat
// @access  Private
const chatInterview = async (req, res) => {
    const { sessionId, message, history } = req.body;

    try {
        const session = await InterviewSession.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Construct history for Gemini
        // specific formatting might be needed based on 'history' structure from frontend
        // For simplicity, let's assume frontend sends full history or we rely on session context if we kept it alive (but we can't easily across requests without storing)
        // So we reconstruct chat from history provided by frontend + current message

        const chatHistory = history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        const chat = model.startChat({
            history: chatHistory
        });

        // We can append a system instruction to evaluate/score if it's an answer
        // For now, simple chat
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        // Optionally parse text for score/feedback if we instructed AI to provide it in a specific format

        res.json({
            message: text
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get feedback and score for a specific answer (Backend logic to separate evaluation)
// @route   POST /api/interview/evaluate
// @access  Private
const evaluateAnswer = async (req, res) => {
    const { question, userAnswer } = req.body;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Question: ${question}\nUser Answer: ${userAnswer}\n\nEvaluate the user's answer. Provide a score out of 10 and constructive feedback. Return JSON format: { "score": number, "feedback": "string" }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present to parse JSON
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const feedbackData = JSON.parse(jsonStr);

        res.json(feedbackData);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error evaluating answer' });
    }
}

// @desc    Get user analytics
// @route   GET /api/interview/analytics
// @access  Private
const getAnalytics = async (req, res) => {
    try {
        const sessions = await InterviewSession.find({ userId: req.user.id });
        // aggregate data
        const totalSessions = sessions.length;
        // Calculate average score if fields exist
        // For now just return sessions
        res.json({
            totalSessions,
            sessions
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    startInterview,
    chatInterview,
    evaluateAnswer,
    getAnalytics
};
