import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated (adjust based on your auth implementation)
  const isAuthenticated = localStorage.getItem('token') || sessionStorage.getItem('user');
  
  if (!isAuthenticated) {
    // Redirect to home if not authenticated
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default ProtectedRoute;