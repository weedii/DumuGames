/* eslint-disable react/prop-types */
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Link } from "react-router-dom";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { useState } from "react";
import CardDescriptionPage from "../Components/CardDescriptionPage";
import { useSelector } from "react-redux";
import CardDescriptionPageAdmin from "./adminPages/CardDescriptionPageAdmin";
import Spinner from "../Components/Spinner";

// eslint-disable-next-line react/prop-types
const Ctalog = ({ headMsg, showButton, cards, getAllCards }) => {
  const [showCart, setShowCart] = useState(false);
  const [showCartAdmin, setShowCartAdmin] = useState(false);
  const [cardInfo, setCardInfo] = useState(null);
  const currentUser = useSelector((state) => state.currentUser.user);

  useGSAP(() => {
    if (cards) {
      gsap.fromTo(
        ".to-scale",
        {
          scale: 0.5,
        },
        {
          scale: 1,
          duration: 1,
        }
      );
      gsap.fromTo(
        ".to-opacity",
        {
          opacity: 0,
          x: 80,
        },
        {
          opacity: 1,
          x: 0,
          duration: 1,
        }
      );
    }
  });

  return (
    <div>
      {cards ? (
        <div
          className={`flex flex-col items-center p-5 w-full
      ${cards.length < 10 ? "justify-center" : "justify-around"}`}
        >
          {showCart && (
            <CardDescriptionPage
              showCart={showCart}
              setShowCart={setShowCart}
              cardInfo={cardInfo}
            />
          )}

          {showCartAdmin && (
            <CardDescriptionPageAdmin
              showCart={showCartAdmin}
              setShowCart={setShowCartAdmin}
              cardInfo={cardInfo}
              getAllCards={getAllCards}
            />
          )}

          <p
            className={`${headMsg ? "block" : "hidden"}
        text-3xl md:text-5xl font-bold text-[#5956E9] mb-9 md:mb-20 to-opacity`}
          >
            {headMsg}
          </p>

          <div
            className={`flex flex-wrap ${
              cards.length < 5 ? "justify-center" : "justify-around"
            } w-full gap-2 md:gap-5 max-w-4x mx-auto`}
          >
            {cards.map((item, idx) => (
              <div
                className="mb-7 to-scale"
                key={idx}
                onClick={() => {
                  setCardInfo(item);
                  if (currentUser && currentUser.isAdmin) {
                    setShowCartAdmin(true);
                  } else {
                    setShowCart(true);
                  }
                }}
              >
                <img
                  src={item.pictureURL}
                  className="w-36 md:w-52 h-[6.4rem] md:h-36 object-cover rounded-md shadow-md
                transition-transform duration-300 hover:-translate-y-3 hover:scale-110 cursor-pointer"
                />

                <p className="my-2 text-xs font-bold text-center text-black]">
                  {item.type}
                </p>
              </div>
            ))}
          </div>
          {showButton && (
            <Link
              to="Catalog"
              reloadDocument
              className="bg-[#5956E9] flex items-center justify-center w-1/2 h-11 text-white rounded-md
          shadow-md mt-5 hover:opacity-85"
            >
              See More <MdKeyboardDoubleArrowRight />
            </Link>
          )}
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default Ctalog;
