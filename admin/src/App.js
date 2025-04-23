import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './screens/AdminLogin';
import AdminDashboard from './screens/AdminDashboard';
import Navbar from './components/Navbar';
import Profile from './screens/Profile';
import './App.css';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Load user from localStorage on initial render
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        setUser(currentUser);

        // Listen for storage changes
        const handleStorageChange = () => {
            const updatedUser = JSON.parse(localStorage.getItem('currentUser'));
            setUser(updatedUser);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Navigate to="/admin/login" replace />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                
                {/* Protected admin routes */}
                <Route 
                    path="/admin/dashboard" 
                    element={
                        user?.isAdmin ? (
                            <AdminDashboard />
                        ) : (
                            <Navigate to="/admin/login" replace />
                        )
                    } 
                />
                <Route 
                    path="/admin/profile" 
                    element={
                        user?.isAdmin ? (
                            <Profile />
                        ) : (
                            <Navigate to="/admin/login" replace />
                        )
                    } 
                />
                
                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/admin/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;