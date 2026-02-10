import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import CodeEditor from '../../components/CodeEditor';
import { Code, Play, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodingPractice = () => {
    const [questions, setQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [code, setCode] = useState('// Write your solution here\n');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(true);
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            // Fetch only coding related categories ideally, or filter
            const { data } = await api.get('/questions');
            const codingQuestions = data.filter(q => ['DSA', 'JavaScript'].includes(q.category));
            setQuestions(codingQuestions);
            if (codingQuestions.length > 0) {
                setSelectedQuestion(codingQuestions[0]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRunCode = async () => {
        // In a real app, send to backend for execution (e.g. using Piston API or similar)
        // For this MERN demo without external compiler API, we'll simulate check or just show it running.
        // Or we can use Gemini to check the code?

        setOutput('Running code...\n(Note: Client-side execution sandbox not implemented in this demo. Integrating a compiler API or Gemini Judge would be next steps.)');

        // Let's ask Gemini to review the code as a "Run" step?
        try {
            const prompt = `Review this solution for the problem: "${selectedQuestion.questionText}". \n\nCode:\n${code}\n\nIs this correct? Output the result of the code or a success message if it looks correct.`;
            // We reuse the 'chat' endpoint or 'evaluate' endpoint logic?
            // Let's use evaluate endpoint but repurpose logic or just create a new helper
            // Since we don't have a direct "run code" endpoint, let's just simulate output for now 
            // Or better, let's call the evaluate endpoint which uses Gemini

            const { data } = await api.post('/interview/evaluate', {
                question: selectedQuestion.questionText,
                userAnswer: code
            });

            // The evaluate endpoint returns { score, feedback }
            setOutput(`Score: ${data.score}/10\n\nFeedback:\n${data.feedback}`);

        } catch (err) {
            setOutput('Error evaluating code.');
        }
    };

    if (loading) return <div className="text-center py-12 text-white">Loading practice problems...</div>;

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] gap-4">
            {/* Problem List Sidebar */}
            <div className="w-full md:w-1/4 bg-gray-900 border border-gray-800 rounded-lg flex flex-col">
                <div className="p-4 border-b border-gray-800">
                    <h2 className="text-lg font-bold text-white flex items-center">
                        <Code className="h-5 w-5 mr-2 text-blue-500" />
                        Problems
                    </h2>
                </div>
                <div className="overflow-y-auto flex-1 p-2 space-y-2">
                    {questions.map(q => (
                        <div
                            key={q._id}
                            onClick={() => { setSelectedQuestion(q); setCode('// Write your solution here\n'); setOutput(''); setShowHint(false); }}
                            className={`p-3 rounded-md cursor-pointer transition-colors ${selectedQuestion?._id === q._id ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300'}`}
                        >
                            <div className="font-medium text-sm">{q.questionText.substring(0, 50)}...</div>
                            <div className="text-xs opacity-70 mt-1">{q.difficulty} • {q.category}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Coding Area */}
            <div className="flex-1 flex flex-col gap-4">
                {selectedQuestion ? (
                    <>
                        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                            <h1 className="text-2xl font-bold text-white mb-2">{selectedQuestion.questionText}</h1>
                            <div className="flex gap-2 mb-4">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${selectedQuestion.difficulty === 'Easy' ? 'bg-green-900 text-green-300' :
                                        selectedQuestion.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                                            'bg-red-900 text-red-300'
                                    }`}>
                                    {selectedQuestion.difficulty}
                                </span>
                                <span className="text-gray-400 text-xs py-0.5">{selectedQuestion.category}</span>
                            </div>

                            {selectedQuestion.exampleInput && (
                                <div className="bg-gray-950 p-3 rounded-md mb-4 text-sm font-mono text-gray-300">
                                    <div>Input: {selectedQuestion.exampleInput}</div>
                                    <div>Output: {selectedQuestion.exampleOutput}</div>
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => setShowHint(!showHint)}
                                    className="flex items-center text-sm text-yellow-500 hover:text-yellow-400"
                                >
                                    <Lightbulb className="h-4 w-4 mr-1" />
                                    {showHint ? 'Hide Hint' : 'Show Hint'}
                                </button>
                            </div>
                            {showHint && selectedQuestion.hints && (
                                <div className="mt-2 text-sm text-yellow-200 bg-yellow-900/20 p-2 rounded">
                                    {selectedQuestion.hints[0]}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 bg-gray-900 border border-gray-800 rounded-lg overflow-hidden flex flex-col">
                            <div className="p-2 border-b border-gray-800 bg-gray-950 flex justify-between items-center">
                                <span className="text-xs text-gray-400 font-mono">JavaScript</span>
                                <button
                                    onClick={handleRunCode}
                                    className="flex items-center px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                                >
                                    <Play className="h-4 w-4 mr-1.5" />
                                    Run & Evaluate
                                </button>
                            </div>
                            <div className="flex-1 relative">
                                <CodeEditor code={code} setCode={setCode} />
                            </div>
                        </div>

                        {output && (
                            <div className="bg-black border border-gray-800 rounded-lg p-4 h-48 overflow-y-auto">
                                <div className="text-xs text-gray-500 mb-2 uppercase font-bold">Output / AI Feedback</div>
                                <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap">{output}</pre>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">Select a problem to start coding</div>
                )}
            </div>
        </div>
    );
};

export default CodingPractice;
