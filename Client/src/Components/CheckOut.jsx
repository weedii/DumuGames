import { FiShoppingCart } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  clearCart,
  decreaseItemQuantity,
  getTotals,
  increaseItemQuantity,
  removeFromCart,
} from "../redux/CartSlice";
import { IoMdTrash } from "react-icons/io";
import { useEffect, useState } from "react";
import { Modal, Input } from "antd";
import axios from "axios";
import toast from "react-hot-toast";
import OrderModal from "./OrderModal";

const CheckOut = () => {
  const cartItems = useSelector((state) => state.Cart);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
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

  const handleOnChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
    return emailPattern.test(email);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      toast.error("Missing Fields!");
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error("Invalid Email!");
      return;
    }

    const cardsArray = [];
    setLoading(true);
    for (let cartItem of cartItems.cartItems) {
      cardsArray.push({
        type: cartItem.type,
        region: cartItem.region,
        amount: cartItem.amount.substring(0, cartItem.amount.length - 1),
        quantity: cartItem.quantity,
        price: cartItem.price,
        totalPrice: cartItems.totalAmount,
      });
    }
    axios
      .post("/api/user/get-cards-individuals", {
        paid: true,
        formData,
        cardsArray,
        totalAmount: cartItems.totalAmount,
      })
      .then((res) => {
        if (res.data.success) {
          setShowModal(false);
          setLoading(false);
          setSelectedOrder(res.data.order);
          dispatch(clearCart());
          toast.success("Check your email!");
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

  // useEffect(() => {
  //   if (cartItems.cartItem.length > 0) {
  //     cartItems.cartItems.map((item) => {
  //       setSelectedOrder({
  //         ...selectedOrder,
  //         totalPrice: item.price * item.quantity,
  //       });
  //     });
  //   }
  // });

  const footer = (
    <div className="space-x-2">
      <button
        disabled={loading}
        onClick={handleOnClose}
        className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800 disabled:bg-opacity-75 disabled:cursor-not-allowed"
      >
        Cancel
      </button>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-green-700 px-3 py-2 rounded-md text-white hover:bg-green-800 disabled:bg-opacity-75 disabled:cursor-not-allowed"
      >
        Confirm
      </button>
    </div>
  );

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

      <Modal
        title="Confirm Order"
        open={showModal}
        onCancel={handleOnClose}
        destroyOnClose
        // footer={footer}
        footer={null}
      >
        <div className="min-h-[15vh]">
          {/* <form className="flex flex-col gap-2 mb-5">
            <p>
              Name: <span className="text-red-700">*</span>
            </p>
            <Input id="name" placeholder="Name" onChange={handleOnChange} />
            <p>
              Email: <span className="text-red-700">*</span>
            </p>
            <Input
              type="email"
              id="email"
              placeholder="Email"
              onChange={handleOnChange}
            />
            <p className="text-red-700 text-xs font-bold">
              *** (Note that you will recieve everything on this Email so be
              careful!) ***
            </p>
          </form>

          {cartItems.cartItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex gap-2">
                <p>{item.type} Cards</p>
                <p>Of {item.amount}</p>
                <p>| Qt: {item.quantity}</p>
                <p>| Rg: {item.region}</p>
              </div>

              <p>{item.price * item.quantity}$</p>
            </div>
          ))}
          <p className="mt-5 text-end text-[#5956E9] font-semibold">
            Total: {cartItems.totalAmount}$
          </p> */}
          <p className="text-3xl text-center font-body font-medium text-red-700 mt-14">
            Comming Soon
          </p>
        </div>
      </Modal>

      <OrderModal
        showModal={showOrderModal}
        handleOnClose={handleOnCloseOrderModal}
        tittle={"Order Informations"}
        footer={null}
        selectedOrder={selectedOrder}
        currentUser={null}
        user={false}
      />
    </div>
  );
};

export default CheckOut;
