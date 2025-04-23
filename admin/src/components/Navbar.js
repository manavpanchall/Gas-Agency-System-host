import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        setUser(currentUser);

        const handleStorageChange = () => {
            const updatedUser = JSON.parse(localStorage.getItem('currentUser'));
            setUser(updatedUser);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    function logout() {
        localStorage.removeItem('currentUser');
        window.dispatchEvent(new Event('storage'));
        navigate('/admin/login');
    }

    function handleAdminPanelClick(e) {
        e.preventDefault();
        if (!user) {
            navigate('/admin/login');
        } else {
            navigate('/admin/dashboard');
        }
    }

    function handleProfileClick(e) {
        e.preventDefault();
        if (user?.isAdmin) {
            navigate('/admin/profile');
        } else {
            navigate('/admin/login');
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="#" onClick={handleAdminPanelClick} style={{ cursor: 'pointer' }}>
                    Admin Panel
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav ms-auto">
                        {user ? (
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    id="navbarDropdownMenuLink"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="fas fa-user me-1"></i> {user.name}
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
                                    <li>
                                        <button 
                                            className="dropdown-item" 
                                            onClick={handleProfileClick}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Profile
                                        </button>
                                    </li>
                                    <li>
                                        <button 
                                            className="dropdown-item" 
                                            onClick={logout}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <li className="nav-item">
                                <a className="nav-link" href="/admin/login">
                                    Login
                                </a>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;