import { useState, useEffect } from 'react';

const STREAK_KEY = 'floydschool_streak';

export const useStreak = () => {
    const [streak, setStreak] = useState(0);
    const [isNewDay, setIsNewDay] = useState(false);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem(STREAK_KEY) || '{}');
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        if (stored.lastVisit === today) {
            // Already visited today — just show streak
            setStreak(stored.streak || 1);
        } else if (stored.lastVisit === yesterday) {
            // Visited yesterday — extend streak
            const newStreak = (stored.streak || 0) + 1;
            setStreak(newStreak);
            setIsNewDay(true);
            localStorage.setItem(STREAK_KEY, JSON.stringify({ streak: newStreak, lastVisit: today }));
        } else {
            // Streak broken or first visit
            setStreak(1);
            setIsNewDay(!stored.lastVisit); // Only "new day" animation if not first ever
            localStorage.setItem(STREAK_KEY, JSON.stringify({ streak: 1, lastVisit: today }));
        }
    }, []);

    return { streak, isNewDay };
};
