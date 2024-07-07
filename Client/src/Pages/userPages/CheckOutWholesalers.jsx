import { FiShoppingCart } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  clearCart,
  decreaseItemQuantity,
  getTotals,
  increaseItemQuantity,
  removeFromCart,
} from "../../redux/CartSlice";
import { updateUser } from "../../redux/userSlice";
import { IoMdTrash } from "react-icons/io";
import { useEffect, useState } from "react";
import axios from "axios";
import OrderModal from "../../Components/OrderModal";
import CheckOutModal from "./CheckOutModal";

const CheckOutWholesalers = () => {
  const currentUser = useSelector((state) => state.currentUser.user);
  const cartItems = useSelector((state) => state.Cart);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [canBuy, setCanBuy] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState({});

  const handleOnClose = () => {
    setShowModal(false);
  };

  const handleOnCloseOrderModal = () => {
    setShowOrderModal(false);
  };

  const handleRemoveFromCart = (item) => {
    dispatch(removeFromCart(item));
    return;
  };

  const handleDecreaseItemCart = (item) => {
    dispatch(decreaseItemQuantity(item));
    return;
  };

  const handleIncreaseItemCart = (item) => {
    dispatch(increaseItemQuantity(item));
    return;
  };

  const handleSubmit = async () => {
    const cardsArray = [];
    setLoading(true);
    for (let cartItem of cartItems.cartItems) {
      cardsArray.push({
        userID: currentUser._id,
        userEmail: currentUser.email,
        type: cartItem.type,
        region: cartItem.region,
        amount: cartItem.amount.substring(0, cartItem.amount.length - 1),
        quantity: cartItem.quantity,
        price: cartItem.price,
        totalPrice: cartItems.totalAmount,
      });
    }
    axios
      .post("/api/user/get-cards", {
        cardsArray,
        totalAmount: cartItems.totalAmount,
      })
      .then((res) => {
        if (res.data.success) {
          dispatch(updateUser(res.data.user));
          setShowModal(false);
          setLoading(false);
          setSelectedOrder(res.data.order);
          dispatch(clearCart());
          setShowOrderModal(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    dispatch(getTotals());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems]);

  useEffect(() => {
    if (currentUser.balance < cartItems.totalAmount) {
      setCanBuy(false);
    }
  }, [cartItems.totalAmount, currentUser.balance]);

  const footer = canBuy ? (
    <div className="space-x-2">
      <button
        disabled={loading}
        onClick={handleOnClose}
        className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800 disabled:bg-opacity-75 disabled:cursor-not-allowed"
      >
        Cancel
      </button>
      <button
        disabled={loading}
        onClick={handleSubmit}
        className="bg-green-700 px-3 py-2 rounded-md text-white hover:bg-green-800 disabled:bg-opacity-75 disabled:cursor-not-allowed"
      >
        {loading ? "Loading..." : "Confirm"}
      </button>
    </div>
  ) : null;

  return (
    <div className="min-h-screen mb-10">
      {cartItems.cartItems.length === 0 ? (
        <div className="w-full h-screen flex justify-center items-center px-2">
          <p className="text-lg md:text-2xl font-semibold flex items-center gap-5">
            <span>{<FiShoppingCart color="#5956E9" />}</span>
            Your cart is currently empty
          </p>
        </div>
      ) : (
        <div className="my-5 px-5 flex flex-col">
          <p className="text-2xl font-medium text-center mb-12">
            Shopping Cart
          </p>

          <div>
            {cartItems.cartItems.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-3 border-b-2"
              >
                <div className="flex gap-3 mr-auto">
                  <img
                    src={item.pictureURL}
                    className="w-28 md:w-32 object-contain"
                  />
                  <div className="flex flex-col justify-between">
                    <p className="text-start font-semibold text-xs md:text-base">
                      {item.type} Card
                    </p>
                    <div>
                      <p className="text-xs md:text-sm font-bold text-red-600">
                        Region: {item.region}
                      </p>
                      <p className="text-xs md:text-sm font-semibold text-purple-700">
                        Amount: {item.amount}
                      </p>
                      <p className="text-xs md:text-sm font-semibold text-purple-700">
                        Price: {item.price}$
                      </p>
                    </div>
                  </div>
                </div>

                <div className="h-full flex flex-col items-end gap-5 ml-auto">
                  {currentUser ? (
                    <div>
                      <p className="text-xs md:text-base">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        className="font-bold text-xl px-2 py-0 rounded-md bg-slate-200 hover:bg-red-300"
                        onClick={() => {
                          handleDecreaseItemCart(item);
                        }}
                      >
                        -
                      </button>
                      <p className="text-xs md:text-base">{item.quantity}</p>
                      <button
                        className="font-bold text-xl px-2 py-0 rounded-md bg-slate-200 hover:bg-green-300"
                        onClick={() => {
                          handleIncreaseItemCart(item);
                        }}
                      >
                        +
                      </button>
                    </div>
                  )}

                  <p className="text-xs md:text-base">
                    Total: {item.price * item.quantity}$
                  </p>

                  <button
                    className="bg-red-700 p-2 rounded-md text-white hover:bg-opacity-80 shadow-md"
                    onClick={() => {
                      handleRemoveFromCart(item);
                    }}
                  >
                    <IoMdTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 ml-auto mt-20 md:w-1/6">
            <p className="w-full flex justify-between text-xl font-semibold">
              Total:
              <span>{cartItems.totalAmount}$</span>
            </p>

            <button
              className="bg-[#5956E9] p-3 rounded-md text-white hover:opacity-85"
              onClick={() => setShowModal(true)}
            >
              CheckOut
            </button>
          </div>
        </div>
      )}

      <CheckOutModal
        showModal={showModal}
        handleOnClose={handleOnClose}
        canBuy={canBuy}
        footer={footer}
        cartItems={cartItems}
        currentUser={currentUser}
      />

      <OrderModal
        showModal={showOrderModal}
        handleOnClose={handleOnCloseOrderModal}
        tittle={"Order Informations"}
        footer={null}
        selectedOrder={selectedOrder}
        currentUser={currentUser}
        user={true}
      />
    </div>
  );
};

export default CheckOutWholesalers;
