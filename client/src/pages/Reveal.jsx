import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { FaGift, FaEye } from 'react-icons/fa';
import { pairingAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Snowfall from '../components/Snowfall';
import toast from 'react-hot-toast';

const Reveal = () => {
    const [revealed, setRevealed] = useState(false);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [flipped, setFlipped] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const handleReveal = async () => {
        setLoading(true);
        try {
            const response = await pairingAPI.reveal();
            setData(response.data);
            setRevealed(true);

            // Trigger flip animation
            setTimeout(() => setFlipped(true), 500);

            // Trigger confetti
            setTimeout(() => setShowConfetti(true), 1500);

            // Stop confetti after 5 seconds
            setTimeout(() => setShowConfetti(false), 6500);

            if (!response.data.alreadyRevealed) {
                toast.success('🎉 Your Secret Santa has been revealed!');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to reveal');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner message="Revealing your Secret Santa..." />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-christmas-red p-4 relative overflow-hidden">
            <Snowfall />
            {showConfetti && <Confetti numberOfPieces={500} recycle={false} />}

            <div className="container mx-auto py-12 relative z-10">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-5xl font-bold text-white mb-4">
                        🎁 Secret Santa Reveal 🎁
                    </h1>
                    <p className="text-white/90 text-lg">
                        {revealed ? "Here's who got you a gift!" : "Ready to discover your Secret Santa?"}
                    </p>
                </motion.div>

                {!revealed ? (
                    <motion.div
                        className="max-w-md mx-auto"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="card text-center">
                            <motion.div
                                className="text-8xl mb-6"
                                animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                🎁
                            </motion.div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                The Big Moment!
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-8">
                                Click the button below to reveal who your Secret Santa is!
                            </p>
                            <motion.button
                                onClick={handleReveal}
                                className="btn-gold w-full py-4 text-xl"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaEye className="inline mr-2" />
                                Reveal My Secret Santa! 🎉
                            </motion.button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="max-w-2xl mx-auto">
                        <div className="perspective-1000">
                            <motion.div
                                className="relative w-full"
                                style={{ transformStyle: 'preserve-3d' }}
                                animate={{ rotateY: flipped ? 180 : 0 }}
                                transition={{ duration: 0.8, type: 'spring' }}
                            >
                                {/* Front of card */}
                                <div
                                    className="absolute w-full backface-hidden"
                                    style={{ backfaceVisibility: 'hidden' }}
                                >
                                    <div className="card text-center h-[500px] flex flex-col items-center justify-center bg-gradient-to-br from-christmas-green to-emerald-700">
                                        <FaGift className="text-8xl text-white mb-4" />
                                        <h2 className="text-3xl font-bold text-white">Flipping...</h2>
                                    </div>
                                </div>

                                {/* Back of card */}
                                <div
                                    className="w-full backface-hidden"
                                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                                >
                                    <div className="card bg-gradient-to-br from-yellow-400 to-christmas-gold text-gray-900">
                                        <div className="text-center mb-6">
                                            <h2 className="text-3xl font-bold mb-2">🎉 Your Secret Santa Is... 🎉</h2>
                                        </div>

                                        {/* Secret Santa Info */}
                                        <div className="text-center mb-8">
                                            <img
                                                src={data?.secretSanta?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data?.secretSanta?.name || 'User')}&background=random&size=200`}
                                                alt={data?.secretSanta?.name}
                                                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
                                            />
                                            <h3 className="text-4xl font-bold mb-2">{data?.secretSanta?.name}</h3>
                                            <p className="text-lg opacity-90">{data?.secretSanta?.department}</p>
                                        </div>

                                        {/* Gift Details */}
                                        {data?.gift && (
                                            <div className="bg-white/90 rounded-lg p-6">
                                                <h4 className="text-xl font-bold mb-4 text-center">Your Gift 🎁</h4>
                                                <img
                                                    src={`${API_BASE_URL}${data.gift.image}`}
                                                    alt={data.gift.name}
                                                    className="w-full h-64 object-cover rounded-lg mb-4 shadow-md"
                                                />
                                                <h5 className="text-2xl font-bold mb-2">{data.gift.name}</h5>
                                                <div className="bg-gray-100 rounded-lg p-4">
                                                    <p className="text-gray-800 italic">"{data.gift.message}"</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .backface-hidden {
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
      `}</style>
        </div>
    );
};

export default Reveal;
