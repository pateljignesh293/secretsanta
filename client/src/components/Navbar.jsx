import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGift, FaHome, FaUser, FaCog, FaMoon, FaSun, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Home', path: '/', icon: FaHome },
        { name: 'My Assignment', path: '/assignment', icon: FaGift },
        { name: 'Reveal', path: '/reveal', icon: FaGift },
        { name: 'Profile', path: '/profile', icon: FaUser },
    ];

    if (isAdmin) {
        navItems.push({ name: 'Admin', path: '/admin', icon: FaCog });
    }

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <motion.div
                            className="text-3xl"
                            animate={{ rotate: [0, -10, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                            🎅
                        </motion.div>
                        <span className="text-xl font-bold gradient-text hidden sm:inline">
                            Secret Santa
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${isActive(item.path)
                                        ? 'bg-gradient-to-r from-christmas-red to-pink-600 text-white'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <item.icon />
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Right side actions */}
                    <div className="flex items-center space-x-3">
                        {/* Dark mode toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {darkMode ? (
                                <FaSun className="text-yellow-500 text-xl" />
                            ) : (
                                <FaMoon className="text-gray-600 text-xl" />
                            )}
                        </button>

                        {/* User menu */}
                        <div className="hidden md:flex items-center space-x-3">
                            <div className="text-right">
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {user?.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {user?.role === 'admin' ? '👑 Admin' : '🎁 Participant'}
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-christmas-red transition-colors"
                                aria-label="Logout"
                            >
                                <FaSignOutAlt className="text-xl" />
                            </button>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <motion.div
                        className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <div className="flex flex-col space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`px-4 py-3 rounded-lg flex items-center space-x-3 transition-all ${isActive(item.path)
                                            ? 'bg-gradient-to-r from-christmas-red to-pink-600 text-white'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <item.icon />
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="px-4 py-3 rounded-lg flex items-center space-x-3 text-christmas-red hover:bg-red-100 dark:hover:bg-red-900/30"
                            >
                                <FaSignOutAlt />
                                <span>Logout</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
