import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Search, Filter, ChevronDown, ChevronUp, BookOpen, AlertCircle } from 'lucide-react';

const QuestionBank = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        difficulty: ''
    });
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        fetchQuestions();
    }, [filters]);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.category) params.category = filters.category;
            if (filters.difficulty) params.difficulty = filters.difficulty;

            const { data } = await api.get('/questions', { params });
            setQuestions(data);
        } catch (err) {
            setError('Failed to fetch questions');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Question Bank</h1>
                    <p className="text-gray-400">Browse and study interview questions.</p>
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="relative">
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            className="appearance-none bg-gray-800 text-white pl-10 pr-8 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Categories</option>
                            <option value="MERN">MERN Stack</option>
                            <option value="JavaScript">JavaScript</option>
                            <option value="DSA">DSA</option>
                            <option value="System Design">System Design</option>
                        </select>
                        <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>

                    <div className="relative">
                        <select
                            value={filters.difficulty}
                            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                            className="appearance-none bg-gray-800 text-white pl-10 pr-8 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Difficulties</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                        <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-900/50 border border-red-800 text-red-200 p-4 rounded-lg flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            ) : questions.length === 0 ? (
                <div className="text-center py-12 text-gray-400 bg-gray-900 rounded-lg border border-gray-800">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No questions found matching your filters.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {questions.map((q) => (
                        <div
                            key={q._id}
                            className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden transition-all hover:border-gray-700"
                        >
                            <div
                                onClick={() => toggleExpand(q._id)}
                                className="p-6 cursor-pointer flex items-start justify-between"
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${q.difficulty === 'Easy' ? 'bg-green-900 text-green-300' :
                                                q.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                                                    'bg-red-900 text-red-300'
                                            }`}>
                                            {q.difficulty}
                                        </span>
                                        <span className="text-gray-400 text-sm">{q.category}</span>
                                    </div>
                                    <h3 className="text-lg font-medium text-white">{q.questionText}</h3>
                                </div>
                                {expandedId === q._id ? (
                                    <ChevronUp className="h-5 w-5 text-gray-500" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-gray-500" />
                                )}
                            </div>

                            {expandedId === q._id && (
                                <div className="px-6 pb-6 pt-0 border-t border-gray-800 mt-2">
                                    <div className="mt-4 space-y-4">
                                        {q.hints && q.hints.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-blue-400 mb-2">Hints</h4>
                                                <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                                                    {q.hints.map((hint, idx) => (
                                                        <li key={idx}>{hint}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {(q.exampleInput || q.exampleOutput) && (
                                            <div className="grid grid-cols-2 gap-4 bg-gray-950 p-4 rounded-md">
                                                {q.exampleInput && (
                                                    <div>
                                                        <span className="text-xs uppercase text-gray-500 font-semibold">Example Input</span>
                                                        <code className="block mt-1 text-gray-300 font-mono text-sm">{q.exampleInput}</code>
                                                    </div>
                                                )}
                                                {q.exampleOutput && (
                                                    <div>
                                                        <span className="text-xs uppercase text-gray-500 font-semibold">Example Output</span>
                                                        <code className="block mt-1 text-gray-300 font-mono text-sm">{q.exampleOutput}</code>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuestionBank;
