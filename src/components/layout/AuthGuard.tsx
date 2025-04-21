
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

type AuthGuardProps = {
  children: React.ReactNode;
};

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { session, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="spinner-border animate-spin h-8 w-8 border-b-2 rounded-full"></div>
        <span className="ml-2">Caricamento...</span>
      </div>
    );
  }

  if (!session) {
    // Redirect to the login page but save the location they were trying to access
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
