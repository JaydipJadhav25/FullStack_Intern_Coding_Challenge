import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ChangePassword from './pages/auth/ChangePassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminStores from './pages/admin/AdminStores';
import UserStores from './pages/user/UserStores';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import Home from './layouts/Home';



//protecte route
function RoleHomeRedirect() {
  
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return <Navigate to={ '/login'} replace />;
}



// all routing
const AppRouter = () => {
  return(
      <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/stores"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminStores />
          </ProtectedRoute>
        }
      />

      <Route
        path="/stores"
        element={
          <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
            <UserStores />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner"
        element={
          <ProtectedRoute allowedRoles={['STORE_OWNER']}>
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
      <AppRouter/>
  );
}
