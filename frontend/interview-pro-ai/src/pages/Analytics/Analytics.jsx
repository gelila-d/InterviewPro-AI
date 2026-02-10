import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Award, Clock, AlertCircle } from 'lucide-react';

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const { data } = await api.get('/interview/analytics');
            // Data structure: { totalSessions, sessions: [...] }
            // detailed stats need valid sessions with scores
            // My current backend mock just returns sessions.
            // Let's process sessions to get meaningful stats

            const sessions = data.sessions || [];

            const processedData = {
                totalSessions: data.totalSessions,
                avgScore: 0,
                sessionsByDate: []
            };

            if (sessions.length > 0) {
                const scores = sessions.map(s => s.totalScore || 0); // Assuming totalScore exists
                const totalScore = scores.reduce((a, b) => a + b, 0);
                processedData.avgScore = (totalScore / sessions.length).toFixed(1);

                // Group by date for chart
                // Simple map for now
                processedData.sessionsByDate = sessions.map((s, index) => ({
                    name: s.createdAt ? new Date(s.createdAt).toLocaleDateString() : `Session ${index + 1}`,
                    score: s.totalScore || 0,
                    type: s.sessionType
                })).slice(-10); // Last 10 sessions
            }

            setStats(processedData);

        } catch (err) {
            console.error(err);
            setError('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-12 text-white">Loading analytics...</div>;
    if (error) return <div className="text-center py-12 text-red-400">{error}</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Performance Analytics</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-900/30 p-3 rounded-lg">
                            <Clock className="h-6 w-6 text-blue-400" />
                        </div>
                        <span className="text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded">+12%</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{stats?.totalSessions || 0}</div>
                    <div className="text-sm text-gray-400 text-nowrap">Total Sessions</div>
                </div>

                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-900/30 p-3 rounded-lg">
                            <Award className="h-6 w-6 text-purple-400" />
                        </div>
                        <span className="text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded">+5%</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{stats?.avgScore || 0}</div>
                    <div className="text-sm text-gray-400">Average Score</div>
                </div>

                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-orange-900/30 p-3 rounded-lg">
                            <TrendingUp className="h-6 w-6 text-orange-400" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white">Top 10%</div>
                    <div className="text-sm text-gray-400">Global Rank</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <h3 className="text-xl font-semibold text-white mb-6">Score History</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats?.sessionsByDate || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="score" stroke="#8B5CF6" strokeWidth={2} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <h3 className="text-xl font-semibold text-white mb-6">Activity Overview</h3>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                        {/* Placeholder for another chart, e.g. radar chart for skills */}
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.sessionsByDate || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                                />
                                <Bar dataKey="score" fill="#3B82F6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
