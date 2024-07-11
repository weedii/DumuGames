import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const AdminRoutes = () => {
  const currentUser = useSelector((state) => state.currentUser.user);

  return currentUser && currentUser.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in/admin/moula_el_bach" replace />
  );
};

export default AdminRoutes;
