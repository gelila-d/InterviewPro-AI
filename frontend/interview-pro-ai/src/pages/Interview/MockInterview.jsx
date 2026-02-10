import React, { useState } from 'react';
import api from '../../utils/api';
import ChatInterface from '../../components/ChatInterface';
import { Play, Settings, AlertCircle } from 'lucide-react';

const MockInterview = () => {
    const [sessionStarted, setSessionStarted] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [config, setConfig] = useState({
        category: 'MERN',
        difficulty: 'Medium'
    });
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const startInterview = async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/interview/start', config);
            setSessionId(data.sessionId);
            setMessages([{ role: 'model', content: data.message }]);
            setSessionStarted(true);
        } catch (err) {
            setError('Failed to start interview. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const { data } = await api.post('/interview/chat', {
                sessionId,
                message: input,
                history: messages // Send previous history including new one logic handled in backend or here? Backend assumes full history or state. 
                // My backend implementation creates history from request body `history`. 
                // Ideally should append user message before sending?
                // Let's send the *current* history (before this user message) + let backend append? 
                // Actually, backend map logic: `history.map(...)` 
                // If I send `[...messages]`, it doesn't include the new `userMessage` I just added to state (React state update is async, but I can form the array).
                // Let's send `[...messages, userMessage]`.
            });

            const botMessage = { role: 'model', content: data.message }; // Use data.message from response
            setMessages((prev) => [...prev, botMessage]);
        } catch (err) {
            console.error(err);
            // Add error message to chat?
        } finally {
            setLoading(false);
        }
    };

    if (!sessionStarted) {
        return (
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
                    <div className="flex items-center space-x-3 mb-6">
                        <Settings className="h-8 w-8 text-blue-500" />
                        <h1 className="text-2xl font-bold text-white">Configure Interview</h1>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-900/50 border border-red-800 rounded-lg flex items-center text-red-200">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                            <select
                                value={config.category}
                                onChange={(e) => setConfig({ ...config, category: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="MERN">MERN Stack</option>
                                <option value="JavaScript">JavaScript</option>
                                <option value="DSA">Data Structures & Algorithms</option>
                                <option value="System Design">System Design</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Difficulty</label>
                            <select
                                value={config.difficulty}
                                onChange={(e) => setConfig({ ...config, difficulty: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={startInterview}
                        disabled={loading}
                        className="w-full flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center">Starting...</span>
                        ) : (
                            <>
                                <Play className="h-5 w-5 mr-2" />
                                Start Interview
                            </>
                        )}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Mock Interview: {config.category} ({config.difficulty})</h2>
                <button onClick={() => setSessionStarted(false)} className="text-sm text-red-400 hover:text-red-300">End Session</button>
            </div>
            <ChatInterface
                messages={messages}
                input={input}
                setInput={setInput}
                handleSend={handleSend}
                isLoading={loading}
            />
        </div>
    );
};

export default MockInterview;
