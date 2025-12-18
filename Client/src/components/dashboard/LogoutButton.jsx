import React, { useContext } from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PortalContext } from '../Context/PortalProvider';

export const LogoutButton = ({ className = '' }) => {
    const navigate = useNavigate();
    const { logout } = useContext(PortalContext);

    const handleLogout = () => {
        logout();
        navigate('/role');
    };

    return (
        <button
            onClick={handleLogout}
            className={`flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 hover:text-red-300 rounded-lg font-medium transition-colors ${className}`}
        >
            <LogOut className="w-4 h-4" />
            Logout
        </button>
    );
};
