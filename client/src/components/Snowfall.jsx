import React, { useEffect, useState } from 'react';

const Snowfall = () => {
    const [snowflakes, setSnowflakes] = useState([]);

    useEffect(() => {
        // Generate snowflakes with random properties
        const flakes = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            animationDuration: 5 + Math.random() * 10,
            opacity: 0.3 + Math.random() * 0.7,
            size: 2 + Math.random() * 4,
            delay: Math.random() * 5,
        }));
        setSnowflakes(flakes);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {snowflakes.map((flake) => (
                <div
                    key={flake.id}
                    className="absolute rounded-full bg-white"
                    style={{
                        left: `${flake.left}%`,
                        width: `${flake.size}px`,
                        height: `${flake.size}px`,
                        opacity: flake.opacity,
                        animation: `snowFall ${flake.animationDuration}s linear infinite`,
                        animationDelay: `${flake.delay}s`,
                    }}
                />
            ))}
        </div>
    );
};

export default Snowfall;
