import { useCallback } from 'react';

// Dynamically import canvas-confetti to keep chunk size small
const fire = async (opts = {}) => {
    const confetti = (await import('canvas-confetti')).default;

    const defaults = {
        spread: 80,
        ticks: 100,
        gravity: 0.8,
        decay: 0.92,
        startVelocity: 35,
        colors: ['#2563EB', '#7C3AED', '#10B981', '#F59E0B', '#EF4444'],
    };

    confetti({ ...defaults, particleCount: 60, origin: { x: 0.3, y: 0.7 }, ...opts });
    confetti({ ...defaults, particleCount: 60, origin: { x: 0.7, y: 0.7 }, ...opts });
};

export const useConfetti = () => {
    const celebrate = useCallback((opts) => fire(opts), []);
    const celebrateSide = useCallback(() => {
        fire({ angle: 60, spread: 55, origin: { x: 0 } });
        fire({ angle: 120, spread: 55, origin: { x: 1 } });
    }, []);

    return { celebrate, celebrateSide };
};
