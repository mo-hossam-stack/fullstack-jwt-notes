import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingIndicator from './LoadingIndicator';
import '../styles/ProtectedRoute.css';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="protected-route-loading">
        <LoadingIndicator />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;