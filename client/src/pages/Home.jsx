import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaGift, FaEye, FaUpload, FaUsers } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { pairingAPI, settingsAPI } from '../services/api';
import Snowfall from '../components/Snowfall';
import CountdownTimer from '../components/CountdownTimer';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Home = () => {
    const { user } = useAuth();
    const [status, setStatus] = useState(null);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [statusRes, settingsRes] = await Promise.all([
                pairingAPI.getStatus(),
                settingsAPI.getSettings(),
            ]);
            setStatus(statusRes.data);
            setSettings(settingsRes.data);
        } catch (error) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    const QuickActionCard = ({ icon: Icon, title, description, to, color }) => (
        <Link to={to}>
            <motion.div
                className={`card-hover p-6 bg-gradient-to-br ${color}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Icon className="text-4xl text-white mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-white/90 text-sm">{description}</p>
            </motion.div>
        </Link>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
            <Snowfall />

            <div className="container mx-auto px-4 py-8 relative z-10">
                {/* Hero Section */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <motion.div
                        className="text-6xl md:text-8xl mb-4 inline-block"
                        animate={{ rotate: [0, -5, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        🎅
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
                        Welcome, {user?.name}!
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        🎄 Office Secret Santa 2025 🎁
                    </p>
                </motion.div>

                {/* Countdown */}
                {settings?.revealDate && !status?.hasRevealed && (
                    <motion.div
                        className="card mb-8 text-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            ⏰ Reveal Countdown
                        </h2>
                        <CountdownTimer targetDate={settings.revealDate} />
                        <p className="text-gray-600 dark:text-gray-400 mt-4">
                            Until the big reveal! 🎉
                        </p>
                    </motion.div>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <QuickActionCard
                        icon={FaGift}
                        title="My Assignment"
                        description={status?.hasPairing ? "See who you're giving to" : "Waiting for pairings"}
                        to="/assignment"
                        color="from-christmas-red to-pink-600"
                    />

                    <QuickActionCard
                        icon={FaUpload}
                        title="Upload Gift"
                        description={status?.hasSubmittedGift ? "Edit your gift" : "Submit your gift"}
                        to="/assignment"
                        color="from-christmas-green to-emerald-700"
                    />

                    <QuickActionCard
                        icon={FaEye}
                        title="Reveal Secret Santa"
                        description={status?.hasRevealed ? "View again" : "Discover who gave you a gift"}
                        to="/reveal"
                        color="from-yellow-500 to-christmas-gold"
                    />
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatusCard
                        title="Pairing Status"
                        value={status?.hasPairing ? "✅ Assigned" : "⏳ Pending"}
                        color={status?.hasPairing ? "green" : "yellow"}
                    />
                    <StatusCard
                        title="Gift Submitted"
                        value={status?.hasSubmittedGift ? "✅ Yes" : "❌ Not Yet"}
                        color={status?.hasSubmittedGift ? "green" : "red"}
                    />
                    <StatusCard
                        title="Revealed"
                        value={status?.hasRevealed ? "✅ Yes" : "🔒 Locked"}
                        color={status?.hasRevealed ? "green" : "gray"}
                    />
                </div>
            </div>
        </div>
    );
};

const StatusCard = ({ title, value, color }) => {
    const colors = {
        green: 'from-green-500 to-emerald-600',
        red: 'from-red-500 to-pink-600',
        yellow: 'from-yellow-500 to-orange-600',
        gray: 'from-gray-500 to-gray-600',
    };

    return (
        <motion.div
            className={`card bg-gradient-to-br ${colors[color]} text-white`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-2xl font-bold">{value}</p>
        </motion.div>
    );
};

export default Home;
