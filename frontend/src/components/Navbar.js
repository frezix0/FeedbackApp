import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, BarChart3, List } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Form Feedback', icon: MessageSquare },
        { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
        { path: '/feedback', label: 'Daftar Feedback', icon: List },
    ];

    return (
        <nav className="bg-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-gray-800">
                            Feedback Analysis App
                        </h1>
                    </div>

                    <div className="flex space-x-4">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                        ? 'bg-primary-500 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon size={18} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 