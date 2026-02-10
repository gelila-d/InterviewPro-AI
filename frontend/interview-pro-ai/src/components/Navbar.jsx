import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Menu, X, Code, MessageSquare, BookOpen, BarChart2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: BarChart2 },
        { name: 'Mock Interview', href: '/mock-interview', icon: MessageSquare },
        { name: 'Question Bank', href: '/question-bank', icon: BookOpen },
        { name: 'Coding Practice', href: '/coding-practice', icon: Code },
        { name: 'Analytics', href: '/analytics', icon: BarChart2 },
    ];

    // Hide Navbar on auth pages
    if (['/login', '/register'].includes(location.pathname)) return null;
    if (location.pathname === '/') return <Navigate to="/dashboard" />;

    const handleLogout = () => {
        logout();           // Clear token + user
        navigate('/login'); // Redirect to login page
    };

    return (
        <nav className="bg-gray-900 border-b border-gray-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/dashboard" className="flex items-center space-x-2">
                            <Code className="h-8 w-8 text-blue-500" />
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                                InterviewPro AI
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === item.href
                                        ? 'bg-gray-800 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }`}
                                >
                                    <Icon className="h-4 w-4 mr-2" />
                                    {item.name}
                                </Link>
                            );
                        })}
                        {user && (
                            <button
                                onClick={handleLogout}
                                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </button>
                        )}
                    </div>

                    {/* Mobile menu toggle */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        {user && (
                            <button
                                onClick={handleLogout}
                                className="text-red-400 hover:bg-gray-700 hover:text-red-300 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
