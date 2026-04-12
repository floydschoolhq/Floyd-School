import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { PortalContext } from '../../contexts/PortalProvider';

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(PortalContext);
    const location = useLocation();

    // If no user is logged in, redirect to login page
    // We save the current location they were trying to access so we can redirect them back after login
    if (!user) {
        return <Navigate to="/student/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;