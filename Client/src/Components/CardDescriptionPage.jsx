/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import Spinner from "./Spinner";
import { FiArrowLeft, FiShoppingCart } from "react-icons/fi";
import { Select } from "antd";
// import { FiShoppingCart } from "react-icons/fi";
// import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/CartSlice";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";
import { useSelector } from "react-redux";

const CardDescriptionPage = ({ showCart, setShowCart, cardInfo }) => {
  const cartRef = useRef(null);
  const [amountsArray, setAmountsArray] = useState([]);
  const [regionsArray, setRegionsArray] = useState([]);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const currentUser = useSelector((state) => state.currentUser.user);
  const [selectedQuantity, setSelectedQuantity] = useState(
    currentUser ? 10 : 1
  );
  const [selectedRegion, setSelectedRegion] = useState("");
  const cartItems = useSelector((state) => state.Cart);
  const dispatch = useDispatch();

  const subSelectedAmount = selectedAmount
    ? selectedAmount.slice(0, selectedAmount.length - 1)
    : "";

  const quantityArray = currentUser
    ? [
        { value: 10 },
        { value: 20 },
        { value: 30 },
        { value: 40 },
        { value: 50 },
        { value: 60 },
        { value: 70 },
        { value: 80 },
        { value: 90 },
        { value: 100 },
      ]
    : [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }];

  const handleAddToCart = () => {
    if (!selectedAmount) {
      toast.error("Select an amount!");
      return;
    }
    if (!selectedRegion) {
      toast.error("Select a Region!");
      return;
    }

    if (
      selectedQuantity > cardInfo.quantity[subSelectedAmount][selectedRegion]
    ) {
      toast.error(
        `Insufficient cards max is ${cardInfo.quantity[subSelectedAmount][selectedRegion]}`
      );
      return;
    }

    const card = {
      type: cardInfo.type,
      region: selectedRegion,
      amount: selectedAmount,
      price: cardInfo.prices[subSelectedAmount],
      quantity: selectedQuantity,
      pictureURL: cardInfo.pictureURL,
    };

    dispatch(addToCart(card));
  };

  useEffect(() => {
    AOS.init({ duration: 500 });
  }, []);

  useEffect(() => {
    if (cardInfo) {
      let arr = [];
      for (let key in cardInfo.quantity) {
        arr.push({
          value: key + "$",
          label: key + "$",
        });
      }
      setAmountsArray(arr);
    }
  }, [cardInfo]);

  useEffect(() => {
    if (selectedAmount) {
      setSelectedRegion("");
      const subamount = selectedAmount.slice(0, selectedAmount.length - 1);
      let arr = [];
      for (let rgn of cardInfo.amountsWithRegions[subamount]) {
        arr.push({
          value: rgn,
          label: rgn,
        });
      }
      setRegionsArray(arr);
    }
  }, [cardInfo.amountsWithRegions, selectedAmount]); //if didnt work fasa5 3la zebi hedhi (cardInfo.amountsWithRegions)

  return (
    <div
      className={`fixed top-0 right-0 w-full h-full z-20 bg-slate-500 bg-opacity-10 ease-in-out
      ${showCart ? "scale-100" : "scale-0"} cursor-pointer`}
    >
      <div
        className={`bg-[#ECF5FE] w-full md:w-7/12 ml-auto h-full shadow-2xl cursor-default`}
        ref={cartRef}
        data-aos="fade-left"
      >
        {cardInfo ? (
          <div className="w-full h-full pb-14">
            <div className="flex items-center justify-between p-5">
              <p
                className="flex items-center cursor-pointer text-[#5956E9] font-semibold hover:opacity-80 w-fit"
                onClick={() => {
                  setSelectedAmount(null);
                  setShowCart(false);
                }}
              >
                <FiArrowLeft color="black" size={15} />
                Back
              </p>

              <Link
                to="/Cart"
                reloadDocument
                className="flex items-center gap-2 font-semibold text-[#5956E9] hover:opacity-80 relative"
              >
                <span
                  className={`bg-red-700 rounded-full absolute -top-3 -right-3 text-white text-[9px] font-sans font-bold py-1 px-2`} // ${cartItems.cartItems.length > 0 ? "block" : "hidden"}
                >
                  {cartItems.totalQuantity}
                </span>
                <span className="">
                  <FiShoppingCart color="black" />
                </span>
                Cart
              </Link>
            </div>
            <hr className="border-black" />

            <div className="mt-8">
              <div className="block lg:flex w-full md:w-[87%] px-5 md:px-0 m-auto">
                <div className="hidden md:block h-36 w-[12.5rem] mt-12 mr-12">
                  <img
                    src={cardInfo.pictureURL}
                    className="w-full rounded-sm object-cover"
                  />
                </div>

                <div className="max-w-3xl flex-1">
                  <div className="mt-4">
                    <p className="text-lg font-medium mb-4 text-center md:text-start">
                      {cardInfo.type} Cards
                    </p>
                  </div>

                  <img
                    src={cardInfo.pictureURL}
                    className="h-36 w-[12.5rem] rounded-sm object-cover mx-auto mb-16 md:hidden"
                  />

                  <div className="flex flex-col items-center gap-14 border border-slate-300 rounded-md p-5 shadow-sm">
                    <div className="flex w-full justify-between gap-5">
                      <div className="flex flex-col w-1/2">
                        <p className="text-xs font-semibold mb-2">
                          Select Amount
                        </p>
                        <Select
                          defaultValue={selectedAmount}
                          onChange={(e) => setSelectedAmount(e)}
                          options={amountsArray}
                          className="w-full"
                        />

                        {selectedAmount && (
                          <p className="text-sm mt-3 flex gap-1">
                            Card Price:
                            <span>
                              {cardInfo.prices[
                                Number(selectedAmount.split("$")[0])
                              ] + "$"}
                            </span>
                          </p>
                        )}
                      </div>

                      <div className="w-1/2">
                        <p className="text-xs font-semibold mb-2">
                          Select Quantity
                        </p>
                        <Select
                          defaultValue={selectedQuantity}
                          onChange={(e) => setSelectedQuantity(e)}
                          options={quantityArray}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="w-full mb-4">
                      <p className="text-xs font-semibold mb-2">
                        Select Region
                      </p>
                      <Select
                        defaultValue={selectedRegion}
                        onChange={(e) => setSelectedRegion(e)}
                        options={regionsArray}
                        className="w-full"
                      />
                    </div>

                    <div className="flex flex-col w-full gap-3">
                      <button
                        className="bg-[#5956E9] p-3 rounded-md text-white hover:opacity-85"
                        onClick={handleAddToCart}
                      >
                        Add <span>{selectedQuantity}</span> To Cart
                      </button>
                      <button className="bg-[#5956E9] p-3 rounded-md text-white hover:opacity-85 hidden">
                        CheckOut{" "}
                        {selectedAmount &&
                          cardInfo.prices[subSelectedAmount] *
                            selectedQuantity +
                            "$"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
};

export default CardDescriptionPage;

{
  /* <p className="text-xs mb-5 hidden">
  Buy a Netflix Gift Card online to get a
  no-strings-attached subscription in seconds. Receive your
  gift card code by email and redeem it instantly to access
  the world’s most popular streaming service. Stream it all
  ad-free, unlimited and without linking a personal bank
  account. Forget about annoying automatic renewals and
  easily keep track of spending. No need to even leave your
  couch. Grab a Netflix eGift Card, get your popcorn ready
  and start streaming today.
</p>

<p className="text-xs mb-5 hidden">
  How many months of Netflix do you want? After selecting
  your prepaid balance, payment is a breeze. Choose from our
  secure payment methods pay. Your Netflix Gift Card code
  appears directly on the screen. It also arrives in your
  inbox in seconds along with your redeem instructions and
  receipt. Extending your subscription has never been
  easier.
</p>

<p className="text-xs mb-5 hidden">
  Netflix cards are the best choice for moviegoers who love
  movies and series
</p> */
}

// useEffect(() => {
//   let handler = (e) => {
//     if (cartRef.current && !cartRef.current.contains(e.target))
//       setShowCart(false);
//   };
//   document.addEventListener("mousedown", handler);
//   return () => document.removeEventListener("mousedown", handler);
// }, [setShowCart]);
