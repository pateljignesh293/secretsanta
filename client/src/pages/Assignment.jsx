import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaGift, FaEdit } from 'react-icons/fa';
import { pairingAPI, giftAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Assignment = () => {
    const [assignment, setAssignment] = useState(null);
    const [gift, setGift] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        giftName: '',
        message: '',
        giftImage: null,
    });
    const [imagePreview, setImagePreview] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [assignmentRes, giftRes] = await Promise.all([
                pairingAPI.getMyAssignment().catch(() => null),
                giftAPI.getMyGift().catch(() => null),
            ]);

            if (assignmentRes) setAssignment(assignmentRes.data);
            if (giftRes && giftRes.data.gift) {
                setGift(giftRes.data.gift);
                setFormData({
                    giftName: giftRes.data.gift.giftName,
                    message: giftRes.data.gift.message,
                    giftImage: null,
                });
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, giftImage: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.giftImage && !gift) {
            toast.error('Please upload a gift image');
            return;
        }

        setSubmitting(true);
        try {
            const submitData = new FormData();
            submitData.append('giftName', formData.giftName);
            submitData.append('message', formData.message);
            if (formData.giftImage) {
                submitData.append('giftImage', formData.giftImage);
            }

            await giftAPI.submitGift(submitData);
            toast.success(gift ? 'Gift updated successfully! 🎁' : 'Gift submitted successfully! 🎁');
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to submit gift');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner message="Loading your assignment..." />;

    if (!assignment) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="card max-w-md text-center">
                    <div className="text-6xl mb-4">⏳</div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Pairings Not Yet Generated
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        The admin hasn't generated Secret Santa pairings yet. Please check back later!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <div className="container mx-auto py-8 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center"
                >
                    <h1 className="text-4xl font-bold gradient-text mb-4">Your Secret Santa Assignment</h1>
                </motion.div>

                {/* Assignment Card */}
                <motion.div
                    className="card mb-8"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="flex items-center gap-6">
                        <img
                            src={assignment.assignment.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(assignment.assignment.name)}&background=random&size=200`}
                            alt={assignment.assignment.name}
                            className="w-24 h-24 rounded-full border-4 border-christmas-red"
                        />
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {assignment.assignment.name}
                            </h2>
                            {assignment.assignment.department && (
                                <p className="text-lg text-gray-600 dark:text-gray-400">
                                    {assignment.assignment.department}
                                </p>
                            )}
                            <p className="text-christmas-red font-semibold mt-2">
                                🎁 This is who you're giving a gift to!
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Gift Form */}
                <motion.div
                    className="card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <FaGift className="text-christmas-red" />
                        {gift ? 'Update Your Gift' : 'Submit Your Gift'}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Gift Image Upload */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Gift Image *
                            </label>
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-christmas-red transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="gift-image"
                                />
                                <label htmlFor="gift-image" className="cursor-pointer">
                                    {imagePreview || (gift && gift.imageUrl) ? (
                                        <div className="relative">
                                            <img
                                                src={imagePreview || `${API_BASE_URL}${gift.imageUrl}`}
                                                alt="Gift preview"
                                                className="max-h-64 mx-auto rounded-lg"
                                            />
                                            <div className="mt-4 text-christmas-red font-semibold flex items-center justify-center gap-2">
                                                <FaEdit /> Click to change image
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <FaUpload className="text-5xl text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Click to upload gift image
                                            </p>
                                            <p className="text-sm text-gray-500 mt-2">
                                                PNG, JPG, GIF up to 5MB
                                            </p>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Gift Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Gift Name *
                            </label>
                            <input
                                type="text"
                                value={formData.giftName}
                                onChange={(e) => setFormData({ ...formData, giftName: e.target.value })}
                                placeholder="e.g., Wireless Mouse"
                                className="input-field"
                                required
                            />
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Personal Message *
                            </label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Write a warm message for your recipient..."
                                className="input-field min-h-[120px] resize-none"
                                maxLength={500}
                                required
                            />
                            <p className="text-sm text-gray-500 mt-1 text-right">
                                {formData.message.length}/500
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Submitting...' : gift ? 'Update Gift 🎁' : 'Submit Gift 🎁'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Assignment;
