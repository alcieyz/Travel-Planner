import React from 'react';
import { Navigate } from 'react-router-dom';
import {useAuth} from './AuthContext';

const ProtectedRoute = ({ children }) => {
    const {isLoggedIn} = useAuth();
    
    if (!isLoggedIn) {
        return <Navigate to="/LogIn" replace/>; //replaces current route in browser's history stack, so the back button cannot be used to return to protected page
    }

    return children; //If logged in, render the children (protected route)
};

export default ProtectedRoute;