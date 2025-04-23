import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Loader from '../components/Loader';
import Error from '../components/Error';
import { FaSignInAlt, FaEnvelope, FaLock } from 'react-icons/fa';

function Loginscreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        try {
            setLoading(true);
            setError('');
            
            const result = await axios.post('/api/users/login', {
                email,
                password
            });

            if (result.data.success) {
                localStorage.setItem('currentUser', JSON.stringify(result.data.user));
                window.dispatchEvent(new Event('authChange'));
                navigate('/home');
            } else {
                setError(result.data.message || 'Login failed');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <FaSignInAlt className="auth-icon" />
                    <h2>Login</h2>
                </div>
                
                {error && <Error message={error} />}
                
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            <FaEnvelope className="me-2" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            <FaLock className="me-2" />
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="btn btn-primary w-100 mt-3"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                
                <div className="auth-footer mt-3">
                    <p className="text-center">
                        Don't have an account? <Link to="/register">Register here</Link>
                    </p>
                    <p className="text-center">
                        <Link to="/forgot-password">Forgot password?</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Loginscreen;