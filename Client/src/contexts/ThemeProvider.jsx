import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const storedTheme = localStorage.getItem('floydschool-theme');
        return (storedTheme === 'studio' || !storedTheme) ? 'modern' : storedTheme;
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('floydschool-theme', theme);
    }, [theme]);

    const toggleTheme = (newTheme) => {
        if (newTheme === 'studio') {
            setTheme('modern');
        } else {
            setTheme(newTheme);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme: toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;