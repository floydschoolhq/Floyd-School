import { BookOpen, UserPlus, LogOutIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { DottedGlowBackground } from '../../components/ui/dotted-background';

const LOGO_BLUE = '#007FFF';
const LOGO_ORANGE = '#FF8C00';

const MentorSignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleExit = () => {
        navigate('/role');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !password) return;

        setIsSubmitting(true);

        try {
            const response = await api.post('/auth/signup', {
                name,
                email,
                password,
                role: 'mentor',
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userInfo', JSON.stringify(response.data));

            navigate('/mentor');
        } catch (error) {
            console.error('Signup failed:', error.response?.data?.message || error.message);
            alert(error.response?.data?.message || 'Signup failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-slate-950 flex items-center justify-center p-4 overflow-hidden">
            <DottedGlowBackground
                className="absolute inset-0"
                opacity={0.5}
                gap={20}
                radius={1.2}
                colorDarkVar="--color-neutral-700"
                glowColorDarkVar="--color-emerald-600"
                speedMin={0.2}
                speedMax={0.8}
            />

            <div className="relative z-10 w-full max-w-md p-8 bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800">
                <header className="flex justify-between items-center mb-8 pb-4 border-b border-slate-700">
                    <div className="text-2xl font-extrabold cursor-pointer" onClick={handleExit}>
                        <span style={{ color: LOGO_BLUE }}>think</span>
                        <span style={{ color: LOGO_ORANGE }}>skool</span>
                    </div>
                    <button
                        onClick={handleExit}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold cursor-pointer text-slate-300 bg-slate-800 rounded-full hover:bg-red-900/50 hover:text-red-400 transition duration-300"
                    >
                        <LogOutIcon className="w-4 h-4" />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex items-center justify-center space-x-3 pb-4">
                        <UserPlus className="text-emerald-400 w-6 h-6" />
                        <h3 className="text-2xl font-bold text-white">Mentor Signup</h3>
                    </div>

                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                        />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!name || !email || !password || isSubmitting}
                        className={`flex items-center justify-center gap-2 p-3 font-semibold text-white rounded-lg transition-all duration-300 
                            ${(!name || !email || !password || isSubmitting)
                                ? 'bg-slate-700 cursor-not-allowed'
                                : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:shadow-xl hover:shadow-emerald-500/50 hover:scale-[1.02]'
                            }
                        `}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing up...
                            </>
                        ) : (
                            <><UserPlus className="w-5 h-5" /> Sign Up as Mentor</>
                        )}
                    </button>

                    <div className="text-center mt-4">
                        <p className="text-sm text-slate-400">
                            Already have an account?{' '}
                            <Link to="/mentor/login" className="text-emerald-400 font-semibold hover:text-emerald-300 hover:underline">
                                Log In
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MentorSignupPage;
