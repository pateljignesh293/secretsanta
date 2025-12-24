import React from 'react';
import { motion } from 'framer-motion';

const CountdownTimer = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = React.useState({});

    React.useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date();

            if (difference > 0) {
                return {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }

            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        };

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const TimeUnit = ({ value, label }) => (
        <motion.div
            className="flex flex-col items-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="bg-gradient-to-br from-christmas-red to-pink-600 dark:from-christmas-green dark:to-emerald-700 rounded-lg p-4 min-w-[80px] shadow-lg">
                <div className="text-3xl md:text-4xl font-bold text-white text-center">
                    {String(value).padStart(2, '0')}
                </div>
            </div>
            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-2 font-semibold uppercase">
                {label}
            </div>
        </motion.div>
    );

    return (
        <div className="flex gap-3 md:gap-6 justify-center flex-wrap">
            <TimeUnit value={timeLeft.days || 0} label="Days" />
            <TimeUnit value={timeLeft.hours || 0} label="Hours" />
            <TimeUnit value={timeLeft.minutes || 0} label="Minutes" />
            <TimeUnit value={timeLeft.seconds || 0} label="Seconds" />
        </div>
    );
};

export default CountdownTimer;
