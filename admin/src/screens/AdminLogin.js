import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import Error from '../components/Error';
import Swal from 'sweetalert2';

function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    async function login() {
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/users/login`,
                { email, password }
            );

            if (response.data.success) {
                if (response.data.user.isAdmin) {
                    localStorage.setItem('currentUser', JSON.stringify(response.data.user));
                    // Force state update by dispatching storage event
                    window.dispatchEvent(new Event('storage'));
                    navigate('/admin/dashboard');
                } else {
                    setError('You are not authorized as admin');
                }
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-container">
            {loading && <Loader />}
            <div className="login-box">
                {error && <Error message={error} />}
                <h2>Admin Login</h2>
                <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button className="btn btn-primary" onClick={login}>
                    Login
                </button>
            </div>
        </div>
    );
}

export default AdminLogin;