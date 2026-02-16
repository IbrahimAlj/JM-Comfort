import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') || sessionStorage.getItem('user');
  
  if (isAuthenticated) {
    // Redirect to dashboard/home if already logged in
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

export default PublicRoute;