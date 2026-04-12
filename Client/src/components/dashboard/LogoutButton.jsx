import React, { useContext } from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PortalContext } from '../../contexts/PortalProvider';

export const LogoutButton = ({ className = '' }) => {
    const navigate = useNavigate();
    const { logout } = useContext(PortalContext);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <button
            onClick={handleLogout}
            className={`flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${className}`}
        >
            <LogOut className="w-4 h-4" />
            Sign Out
        </button>
    );
};

