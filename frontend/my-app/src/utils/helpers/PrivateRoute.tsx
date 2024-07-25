import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const user = JSON.parse(localStorage.getItem("user") || '{}');
  return user && user.role === 'admin' ? <Outlet /> : <Navigate to="/sign" />;
};

export default PrivateRoute;
