import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = () => {
  const currentUser = useSelector((state) => state.currentUser.user);
  return currentUser && !currentUser.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" replace />
  );
};

export default PrivateRoutes;
