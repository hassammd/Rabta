import { useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router";

const ProtectedRoutes = () => {
  const { user, loading } = useSelector((state) => state.signIn);
  console.log("this is user and loading", user, loading);
  const navigate = useNavigate();
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loading loading-spinner text-accent"></span>;
      </div>
    );
  }
  return user ? <Outlet /> : <Navigate to="/auth" />;
};
export default ProtectedRoutes;
