import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[200px]">
            <motion.div
                className={`${sizes[size]} border-4 border-christmas-red border-t-christmas-gold rounded-full`}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            {message && (
                <motion.p
                    className="mt-4 text-gray-600 dark:text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {message}
                </motion.p>
            )}
        </div>
    );
};

export default LoadingSpinner;
