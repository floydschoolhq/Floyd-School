import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Course = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        // Simple redirect to Home page's course section
        navigate('/#online-focus');
    }, [navigate]);

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
};

export default Course;
