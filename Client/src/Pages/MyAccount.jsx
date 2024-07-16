import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  IoPersonCircleOutline,
  IoWalletOutline,
  IoLogOutOutline,
} from "react-icons/io5";
import { LuClipboardList } from "react-icons/lu";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signOut } from "../redux/userSlice";
import API_URL from "../utils/apiConfig";

const MyAccount = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navItems = [
    { tittle: "Wallet", path: "Wallet", icon: <IoWalletOutline /> },
    { tittle: "Orders", path: "Orders", icon: <LuClipboardList /> },
    {
      tittle: "Personal Info",
      path: "Profile",
      icon: <IoPersonCircleOutline />,
    },
    { tittle: "Signout", path: "", icon: <IoLogOutOutline /> },
  ];

  const handleSignOut = () => {
    axios
      .get(`${API_URL}/api/auth/signout`, { withCredentials: true })
      .then(() => {
        dispatch(signOut());
        navigate("/", { replace: true });
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row justify-between px-5 gap-10 mt-20">
      <div className="w-full md:w-4/12">
        <p className="text-lg font-semibold">My Account</p>
        {navItems.map((item, idx) =>
          item.path ? (
            <NavLink
              to={item.path}
              reloadDocument
              className="flex justify-between items-center px-3 py-1 text-base md:text-xl font-semibold my-7 border-b-2 hover:opacity-60"
              style={({ isActive }) => {
                return isActive
                  ? { color: "#5956E9", borderBottomColor: "#5956E9" }
                  : {};
              }}
              key={idx}
            >
              {item.tittle}
              <span className="md:text-2xl">{item.icon}</span>
            </NavLink>
          ) : (
            <button
              className="w-full flex justify-between items-center px-3 py-1 text-base md:text-xl font-semibold my-5 border-b-2 hover:opacity-60 text-red-700"
              onClick={handleSignOut}
              key={idx}
            >
              {item.tittle}
              {item.icon}
            </button>
          )
        )}
      </div>

      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default MyAccount;
