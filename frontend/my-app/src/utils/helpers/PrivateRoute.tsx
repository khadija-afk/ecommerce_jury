import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode; // Les enfants que ce composant enveloppe
  isLoggedIn: boolean; // Indique si l'utilisateur est connecté
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, isLoggedIn }) => {
  return isLoggedIn ? <>{children}</> : <Navigate to="/sign" replace />;
};

export default PrivateRoute;
