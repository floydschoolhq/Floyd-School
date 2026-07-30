import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { PortalContext } from '../../contexts/PortalProvider';

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(PortalContext);
    const location = useLocation();

    // Allow both regular users and guest users
    if (!user) {
        return <Navigate to="/student/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
