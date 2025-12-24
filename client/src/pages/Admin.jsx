import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaGift, FaRandom, FaCog, FaDownload, FaTrash, FaEnvelope } from 'react-icons/fa';
import { adminAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Admin = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [pairings, setPairings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('stats');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [statsRes, usersRes, pairingsRes] = await Promise.all([
                adminAPI.getStats(),
                adminAPI.getUsers(),
                adminAPI.getPairings().catch(() => ({ data: { pairings: [] } })),
            ]);

            setStats(statsRes.data);
            setUsers(usersRes.data.users);
            setPairings(pairingsRes.data.pairings);
        } catch (error) {
            toast.error('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    const handleGeneratePairings = async () => {
        if (!confirm('Generate Secret Santa pairings? This action cannot be undone unless you delete all pairings.')) return;

        try {
            await adminAPI.generatePairings();
            toast.success('✅ Pairings generated and emails sent!');
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to generate pairings');
        }
    };

    const handleDeletePairings = async () => {
        if (!confirm('Delete all pairings? This will reset the entire Secret Santa.')) return;

        try {
            await adminAPI.deletePairings();
            toast.success('Pairings deleted');
            loadData();
        } catch (error) {
            toast.error('Failed to delete pairings');
        }
    };

    const handleExport = async () => {
        try {
            const response = await adminAPI.exportPairings();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'secret-santa-pairings.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Downloaded CSV file');
        } catch (error) {
            toast.error('Failed to export');
        }
    };

    const handleUnlockReveal = async () => {
        if (!confirm('Unlock reveal for all users?')) return;

        try {
            await adminAPI.updateSettings({ revealLocked: false });
            toast.success('Reveal unlocked!');
            loadData();
        } catch (error) {
            toast.error('Failed to update settings');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <div className="container mx-auto py-8">
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl font-bold gradient-text mb-2">👑 Admin Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage your Secret Santa event</p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatCard icon={FaUsers} title="Total Users" value={stats?.totalUsers || 0} color="blue" />
                    <StatCard icon={FaRandom} title="Pairings" value={stats?.totalPairings || 0} color="green" />
                    <StatCard icon={FaGift} title="Gifts Submitted" value={stats?.totalGifts || 0} color="red" />
                    <StatCard icon={FaUsers} title="Revealed" value={stats?.revealedCount || 0} color="purple" />
                </div>

                {/* Action Buttons */}
                <div className="card mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <button
                            onClick={handleGeneratePairings}
                            disabled={stats?.pairingLocked}
                            className={`btn-secondary ${stats?.pairingLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <FaRandom className="inline mr-2" />
                            Generate Pairings
                        </button>

                        <button
                            onClick={handleUnlockReveal}
                            disabled={!stats?.pairingLocked}
                            className={`btn-gold ${!stats?.pairingLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <FaCog className="inline mr-2" />
                            Unlock Reveal
                        </button>

                        <button
                            onClick={handleExport}
                            disabled={!stats?.pairingLocked}
                            className={`btn-primary ${!stats?.pairingLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <FaDownload className="inline mr-2" />
                            Export CSV
                        </button>

                        <button
                            onClick={handleDeletePairings}
                            disabled={!stats?.pairingLocked}
                            className={`bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 ${!stats?.pairingLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <FaTrash className="inline mr-2" />
                            Delete Pairings
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="card">
                    <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                        <div className="flex gap-4">
                            <TabButton active={activeTab === 'stats'} onClick={() => setActiveTab('stats')}>
                                Statistics
                            </TabButton>
                            <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
                                Users ({users.length})
                            </TabButton>
                            <TabButton active={activeTab === 'pairings'} onClick={() => setActiveTab('pairings')}>
                                Pairings ({pairings.length})
                            </TabButton>
                        </div>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'stats' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Gift Submission Rate</h3>
                                <div className="text-4xl font-bold text-christmas-green">{stats?.giftSubmissionRate}%</div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Reveal Rate</h3>
                                <div className="text-4xl font-bold text-christmas-gold">{stats?.revealRate}%</div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100 dark:bg-gray-800">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Name</th>
                                        <th className="px-4 py-3 text-left">Email</th>
                                        <th className="px-4 py-3 text-left">Department</th>
                                        <th className="px-4 py-3 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className="border-b dark:border-gray-700">
                                            <td className="px-4 py-3">{user.name}</td>
                                            <td className="px-4 py-3 text-sm">{user.email}</td>
                                            <td className="px-4 py-3">{user.department || '-'}</td>
                                            <td className="px-4 py-3">
                                                {user.isActive ? (
                                                    <span className="text-green-600">✓ Active</span>
                                                ) : (
                                                    <span className="text-red-600">✗ Inactive</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'pairings' && (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100 dark:bg-gray-800">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Giver</th>
                                        <th className="px-4 py-3 text-left">→</th>
                                        <th className="px-4 py-3 text-left">Receiver</th>
                                        <th className="px-4 py-3 text-left">Notified</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pairings.map((pairing) => (
                                        <tr key={pairing.id} className="border-b dark:border-gray-700">
                                            <td className="px-4 py-3">{pairing.giver.name}</td>
                                            <td className="px-4 py-3 text-christmas-red">🎁</td>
                                            <td className="px-4 py-3">{pairing.receiver.name}</td>
                                            <td className="px-4 py-3">
                                                {pairing.isNotified ? '✅' : '⏳'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, title, value, color }) => {
    const colors = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        red: 'from-red-500 to-red-600',
        purple: 'from-purple-500 to-purple-600',
    };

    return (
        <motion.div
            className={`card bg-gradient-to-br ${colors[color]} text-white`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <Icon className="text-3xl mb-2" />
            <div className="text-3xl font-bold mb-1">{value}</div>
            <div className="text-sm opacity-90">{title}</div>
        </motion.div>
    );
};

const TabButton = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 font-semibold border-b-2 transition-colors ${active
                ? 'border-christmas-red text-christmas-red'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
    >
        {children}
    </button>
);

export default Admin;
