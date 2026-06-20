import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


export default function ProtectedRoute({ children, allowedRoles }) {

  const { user } = useAuth();

  // if not user login so return to first login 
  if (!user) {

    return <Navigate to="/login" replace />;
  }

  //check allowed path/ role and current user role and then allows
  // otherwise re direct on home page
  if (allowedRoles && !allowedRoles.includes(user.role)) {

    return <Navigate to="/" replace />;
  }

  return children;
}
