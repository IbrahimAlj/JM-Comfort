import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getToken } from "./Auth";

export default function ProtectedRoute() {
  const location = useLocation();
  const authed = !!getToken();
  return authed ? <Outlet /> : <Navigate to="/admin/login" replace state={{ from: location }} />;
}