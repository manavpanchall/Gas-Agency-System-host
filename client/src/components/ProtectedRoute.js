import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
}

export default ProtectedRoute;