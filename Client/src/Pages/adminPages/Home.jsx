import { useEffect, useRef, useState } from "react";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";
import { CiMenuFries } from "react-icons/ci";
import { TfiClose } from "react-icons/tfi";

const Home = () => {
  const [menu, setMenu] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setMenu(!menu);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menu]);

  return (
    <div className="min-h-screen flex">
      <div className={`w- h-full z-20 bg-transparent fixed`} ref={menuRef}>
        <span onClick={toggleMenu} className="fixed top-5 right-5 lg:hidden">
          {menu ? (
            <TfiClose size={20} color="#5956E9" />
          ) : (
            <CiMenuFries size={24} color="#5956E9" />
          )}
        </span>
        <SideBar menu={menu} />
      </div>

      <div className="bg-white w-full h-full pt-16 lg:pl-64">
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
