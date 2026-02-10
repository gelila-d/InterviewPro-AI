const express = require('express');
const router = express.Router();
const { startInterview, chatInterview, evaluateAnswer, getAnalytics } = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/start', protect, startInterview);
router.post('/chat', protect, chatInterview);
router.post('/evaluate', protect, evaluateAnswer);
router.get('/analytics', protect, getAnalytics);

module.exports = router;
