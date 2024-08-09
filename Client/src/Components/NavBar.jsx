import { useState, useEffect, useRef } from "react";
import { RiGameLine } from "react-icons/ri";
import { CiMenuFries } from "react-icons/ci";
import { TfiClose } from "react-icons/tfi";
import { FiShoppingCart } from "react-icons/fi";
import { PiHouseBold } from "react-icons/pi";
import { AiOutlineGlobal } from "react-icons/ai";
import { TbCards } from "react-icons/tb";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { CgProfile } from "react-icons/cg";
import { useDispatch } from "react-redux";
import { getTotals } from "../redux/CartSlice";
import { IoWalletOutline } from "react-icons/io5";

const NavBar = () => {
  const [menu, setMenu] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const currentUser = useSelector((state) => state.currentUser.user);
  const cartItems = useSelector((state) => state.Cart);
  const menuRef = useRef(null);
  const dispatch = useDispatch();

  const toggleMenu = () => {
    setMenu(!menu);
  };

  const navItems = !currentUser
    ? [
        { link: "Home", path: "/", icon: <PiHouseBold /> },
        // { link: "About", path: "/#about", icon: <AiOutlineInfo /> },
        { link: "Catalog", path: "/Catalog", icon: <TbCards /> },
        { link: "Wholesale", path: "/wholesale", icon: <AiOutlineGlobal /> },
        { link: "Cart", path: "/Cart", icon: <FiShoppingCart /> },
      ]
    : [
        { link: "Catalog", path: "/Catalog", icon: <TbCards /> },
        // {
        //   link: "Wallet",
        //   path: "/My-Account/Wallet",
        //   icon: <IoWalletOutline />,
        // },
        { link: "Cart", path: "/Cart", icon: <FiShoppingCart /> },
      ];

  useGSAP(() => {
    gsap.fromTo(
      ".to-left",
      {
        opacity: 0,
        x: 100,
      },
      {
        opacity: 1,
        x: 0,
        duration: 1.5,
      }
    );
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 70) setIsSticky(true);
      else setIsSticky(false);
    };

    return window.addEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) setMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menu]);

  useEffect(() => {
    dispatch(getTotals());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems]);

  return (
    <div
      className={`${
        isSticky ? "shadow-sm duration-200" : ""
      } bg-[#ecf5fe] sticky top-0 z-10 flex justify-center`}
    >
      <div className="flex items-center justify-between h-20 px-5 max-w-7xl w-full">
        <div className="flex items-center gap-2 relative">
          <span onClick={toggleMenu} className="lg:hidden">
            {menu ? (
              <TfiClose size={24} className="rotate-180" />
            ) : (
              <CiMenuFries size={24} className="rotate-180" />
            )}
          </span>

          <ul
            className={`bg-[#ecf5ff] absolute top-10 left-0 py-6 px-4 text-sm font-semibold space-y-4 rounded-lg shadow-md transition-all duration-500 border
            ${menu ? "scale-100" : "scale-0"}`}
            onClick={toggleMenu}
            ref={menuRef}
          >
            {navItems.map(
              (item, idx) =>
                item.link != "Cart" && (
                  <li
                    className="hover:underline underline-offset-8"
                    key={idx}
                    onClick={toggleMenu}
                  >
                    <a
                      href={item.path}
                      className="flex items-center justify-center gap-1 hover:opacity-80"
                    >
                      <span className="text-[#5956E9] text-xl">
                        {item.icon}
                      </span>
                      {item.link}
                    </a>
                  </li>
                )
            )}

            {!currentUser && (
              <li>
                <Link to="sign-in" onClick={toggleMenu}>
                  <button
                    className="bg-[#5956E9] px-4 py-2 rounded-lg text-white text-center font-semibold flex mx-auto
                    hover:scale-105 duration-100"
                  >
                    Sign-in
                  </button>
                </Link>
              </li>
            )}

            {currentUser && (
              <li>
                <Link
                  to="/My-Account/Wallet"
                  reloadDocument
                  className="flex items-center gap-2"
                >
                  <CgProfile size={20} color="#5956E9" />
                  <p className="">Prfile</p>
                </Link>
              </li>
            )}
          </ul>

          {!currentUser || currentUser.isAdmin ? (
            <a
              href="/"
              className="text-[#5956E9] text-lg md:text-2xl font-bold flex flex-row-reverse items-center hover:opacity-80 to-left"
            >
              <RiGameLine className="to-left" />
              DumuGames
            </a>
          ) : (
            <p className="text-[#5956E9] text-lg md:text-2xl font-bold flex flex-row-reverse items-center hover:opacity-80 to-left cursor-default">
              <RiGameLine className="to-left" />
              DumuGames
            </p>
          )}
        </div>

        <ul className="hidden lg:flex items-center space-x-12 font-semibold to-left">
          {currentUser && (
            <div className="bg-white px-5 p-1 rounded-md border flex items-center gap-3">
              <IoWalletOutline color="#5956E9" size={20} />
              <p className="text-sm">{currentUser.balance}$</p>
            </div>
          )}

          {navItems.map((item, idx) => (
            <li
              className="relative after:absolute after:h-[2px] after:bg-[#5956E9] after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left after:mt-2"
              key={idx}
            >
              <a
                href={item.path}
                className="flex items-center gap-1 hover:opacity-80"
              >
                <div>
                  <span
                    className={`bg-red-700 rounded-full absolute -top-3 -right-3 text-white text-[9px] font-bold py-1 px-[6px]
                    ${item.link === "Cart" ? "block" : "hidden"}`} // ${cartItems.cartItems.length > 0 && item.link === "Cart"? "block": "hidden"}
                  >
                    {cartItems.totalQuantity}
                  </span>
                  <span className="text-[#5956E9]">{item.icon}</span>
                </div>
                {item.link}
              </a>
            </li>
          ))}

          {currentUser ? (
            <Link
              to="/My-Account/Wallet"
              reloadDocument
              className="cursor-pointer hover:opacity-80 group"
            >
              <CgProfile size={30} color="#5956E9" />
              <span
                className={`hidden group-hover:block bg-gray-300 absolute -right-7 top-8 p-2 rounded-md`}
              >
                <p className="text-xs">My Account</p>
              </span>
            </Link>
          ) : (
            <Link to="sign-in">
              <button
                className="bg-[#5956E9] px-4 py-2 rounded-md text-white font-semibold
                hover:scale-105 duration-100"
              >
                Sign-in
              </button>
            </Link>
          )}
        </ul>

        <div className="lg:hidden h-fit cursor-pointer to-left">
          <div className="flex items-center space-x-4">
            {currentUser && (
              <div className="bg-white px-5 p-1 rounded-md border flex items-center gap-3">
                <IoWalletOutline color="#5956E9" size={20} />
                <p className="text-sm">{currentUser.balance}$</p>
              </div>
            )}

            <Link
              to="/Cart"
              reloadDocument
              className="text-[#5956E9] flex items-center gap-2"
            >
              <div className="relative">
                <span
                  className={`bg-red-700 rounded-full absolute -top-3 -right-2 text-white text-xs font-bold py-0 px-[5px]`}
                >
                  {cartItems.totalQuantity}
                </span>
                <FiShoppingCart size={23} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
