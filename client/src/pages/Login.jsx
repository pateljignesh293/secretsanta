import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaKey } from 'react-icons/fa';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Snowfall from '../components/Snowfall';

const Login = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleRequestLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await authAPI.requestLogin(email);
            toast.success('Magic link sent to your email!');
            setShowOTP(true);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to send magic link');
        } finally {
            setLoading(false);
        }
    };

    const handleOTPLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authAPI.simulateOTP(email, otp);
            login(response.data.user, response.data.token);
            toast.success(`Welcome back, ${response.data.user.name}! 🎄`);
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-christmas-red via-pink-500 to-christmas-green flex items-center justify-center p-4 relative overflow-hidden">
            <Snowfall />

            <motion.div
                className="w-full max-w-md relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="card text-center mb-8">
                    <motion.div
                        className="text-6xl mb-4"
                        animate={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        🎅
                    </motion.div>
                    <h1 className="text-4xl font-bold gradient-text mb-2">Secret Santa 2025</h1>
                    <p className="text-gray-600 dark:text-gray-400">Office Celebration</p>
                </div>

                <div className="card">
                    {!showOTP ? (
                        <form onSubmit={handleRequestLogin} className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                    Login to Continue
                                </h2>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="input-field pl-12"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending...' : 'Send Magic Link 🎁'}
                            </button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => setShowOTP(true)}
                                    className="text-sm text-christmas-green dark:text-christmas-gold hover:underline"
                                >
                                    Or use OTP (Demo: 1234)
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleOTPLogin} className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    Enter OTP
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                    Sent to {email}
                                </p>
                                <div className="relative">
                                    <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Enter OTP (1234)"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="input-field pl-12"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Verifying...' : 'Verify & Login 🎄'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowOTP(false)}
                                className="text-sm text-gray-600 dark:text-gray-400 hover:underline w-full"
                            >
                                ← Back to email
                            </button>
                        </form>
                    )}
                </div>

                <div className="text-center mt-6 text-white text-sm">
                    <p>🎄 Office Secret Santa Celebration 2025 🎁</p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
