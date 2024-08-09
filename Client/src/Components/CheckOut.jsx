import { FiShoppingCart } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  // decreaseItemQuantity,
  getTotals,
  // increaseItemQuantity,
  removeFromCart,
} from "../redux/CartSlice";
import { IoMdTrash } from "react-icons/io";
import { useEffect, useState } from "react";
import { Modal, Input } from "antd";
import axios from "axios";
import toast from "react-hot-toast";
import API_URL from "../utils/apiConfig";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

const CheckOut = () => {
  const cartItems = useSelector((state) => state.Cart);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const handleOnClose = () => {
    setShowModal(false);
  };

  const handleRemoveFromCart = (item) => {
    dispatch(removeFromCart(item));
    return;
  };

  // const handleDecreaseItemCart = (item) => {
  //   dispatch(decreaseItemQuantity(item));
  //   return;
  // };

  // const handleIncreaseItemCart = (item) => {
  //   dispatch(increaseItemQuantity(item));
  //   return;
  // };

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

  const handleCheckStockCards = async (cardsArray) => {
    try {
      const res = await axios.post(`${API_URL}/api/user/check-stock`, {
        cardsArray,
      });

      if (res.data.success) {
        return { isInStock: true, cradTypes: [] };
      } else if (!res.data.success) {
        return { isInStock: false, cradTypes: res.data.cradTypes };
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckOut = async () => {
    if (!formData.name || !formData.email) {
      toast.error("Missing Fields!");
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error("Invalid Email!");
      return;
    }

    try {
      setLoading(true);

      // generate order ID
      const orderId = uuidv4();

      const cardsArray = [];
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

      // check if there is cards in stock
      const { isInStock, cradTypes } = await handleCheckStockCards(cardsArray);

      if (!isInStock) {
        toast.error("Insufficient Stock!");
        navigate("/payment/fail-payment", {
          state: { msg: "Insufficient Stock", data: cradTypes },
        });
        return;
      } else {
        const response = await axios.post(`${API_URL}/api/checkout/checkout`, {
          orderId,
          amount: cartItems.totalAmount,
          items: cardsArray,
          payerEmail: formData.email,
          payerName: formData.name,
        });

        if (response.data && response.data.data) {
          const invoiceId = response.data.data;

          // save invoiceId in localhost to use it in success payment page to create an order and send cards to user
          localStorage.setItem("invoiceId", invoiceId);

          setLoading(false);

          // Redirect user to PayDo checkout page
          window.location.href = `https://checkout.paydo.com/en/payment/invoice-preprocessing/${invoiceId}`;
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Payment error:", error);
    }
  };

  useEffect(() => {
    dispatch(getTotals());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems]);

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
        onClick={handleCheckOut}
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
                      {item.type}
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
                    {/* <button
                      className="font-bold text-xl px-2 py-0 rounded-md bg-slate-200 hover:bg-red-300"
                      onClick={() => {
                        handleDecreaseItemCart(item);
                      }}
                    >
                      -
                    </button> */}
                    <p className="text-xs md:text-base">
                      Quantity: {item.quantity}
                    </p>
                    {/* <button
                      className="font-bold text-xl px-2 py-0 rounded-md bg-slate-200 hover:bg-green-300"
                      onClick={() => {
                        handleIncreaseItemCart(item);
                      }}
                    >
                      +
                    </button> */}
                  </div>

                  <p className="text-xs md:text-base">
                    Total: {(item.price * item.quantity).toFixed(2)}$
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
        footer={footer}
        // footer={null}
      >
        <div className="min-h-[15vh]">
          <form className="flex flex-col gap-2 mb-5">
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

              <p>{(item.price * item.quantity).toFixed(2)}$</p>
            </div>
          ))}
          <p className="mt-5 text-end text-[#5956E9] font-semibold">
            Total: {cartItems.totalAmount}$
          </p>
          {/* <p className="text-3xl text-center font-body font-medium text-red-700 mt-14">
            Comming Soon
          </p> */}
        </div>
      </Modal>
    </div>
  );
};

export default CheckOut;
