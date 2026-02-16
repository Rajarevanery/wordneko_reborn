import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../context/AuthContext";
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthContext();

 

  return isAuthenticated ? <Outlet /> : <Navigate to={"/sign-in"} />;
};
export default ProtectedRoute;
