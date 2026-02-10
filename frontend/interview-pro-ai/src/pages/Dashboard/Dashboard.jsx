import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { MessageSquare, BookOpen, Code, BarChart2, ArrowRight } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();

    const cards = [
        {
            title: 'Mock Interview',
            description: 'Start a realistic AI-powered interview session.',
            icon: MessageSquare,
            link: '/mock-interview',
            color: 'bg-blue-500'
        },
        {
            title: 'Question Bank',
            description: 'Browse hundreds of interview questions by category.',
            icon: BookOpen,
            link: '/question-bank',
            color: 'bg-purple-500'
        },
        {
            title: 'Coding Practice',
            description: 'Solve coding problems with AI assistance.',
            icon: Code,
            link: '/coding-practice',
            color: 'bg-green-500'
        },
        {
            title: 'Analytics',
            description: 'Track your progress and performance over time.',
            icon: BarChart2,
            link: '/analytics',
            color: 'bg-orange-500'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h1 className="text-2xl font-bold text-white">
                    Welcome back, {user?.username}!
                </h1>
                <p className="text-gray-400 mt-2">
                    Ready to prepare for your next interview?
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link
                            key={card.title}
                            to={card.link}
                            className="group bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg ${card.color} bg-opacity-20`}>
                                    <Icon className={`h-6 w-6 ${card.color.replace('bg-', 'text-')}`} />
                                </div>
                                <ArrowRight className="h-5 w-5 text-gray-500 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                {card.title}
                            </h3>
                            <p className="text-gray-400">
                                {card.description}
                            </p>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
};

export default Dashboard;
