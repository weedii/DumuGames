import { Outlet, Navigate } from "react-router-dom";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Pages = () => {
  const [visible, setVisible] = useState(false);
  const currentUser = useSelector((state) => state.currentUser.user);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    setVisible(scrolled > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisible);
    return () => {
      window.removeEventListener("scroll", toggleVisible);
    };
  }, []);

  return (
    <div className="bg-[#ecf5fe]">
      <NavBar />
      <button
        className={`bg-white p-3 rounded-xl shadow-md opacity-85 hover:scale-110 hover:opacity-70 fixed bottom-5 right-5
        ${visible ? "" : "hidden"} z-20`}
        onClick={scrollToTop}
      >
        <MdOutlineKeyboardArrowUp size={30} color="#5956E9" />
      </button>

      {(currentUser && !currentUser.isAdmin) || !currentUser ? (
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      ) : (
        <Navigate to="/admin/dashboard/all-users" replace />
      )}
      <Footer />
    </div>
  );
};

export default Pages;
