import { useSelector } from "react-redux";
import { FaHandHoldingUsd } from "react-icons/fa";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import API_URL from "../../utils/apiConfig";
import axios from "axios";
import { Input, Modal } from "antd";
import LoadingButton from "../../Components/LoadingButton";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Wallet = () => {
  var currentUser = useSelector((state) => state.currentUser.user);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleTopUpWallet = async () => {
    if (!amount) {
      toast.error("Missing Amount!");
      return;
    }

    if (amount < 1.11) {
      toast.error("Amount should be greater than 1.11$");
      return;
    }

    try {
      setLoading(true);

      // generate order ID
      const orderId = uuidv4();

      const response = await axios.post(
        `${API_URL}/api/checkout/topup-wallet`,
        {
          orderId,
          amount,
          payerEmail: currentUser.email,
          payerName: currentUser.first_name,
        }
      );

      if (response.data.status === 1 && response.data.data) {
        const invoiceId = response.data.data;

        // save invoiceId in localhost to use it in success payment page to create an order and send cards to user
        localStorage.setItem("invoiceId", invoiceId);

        setLoading(false);
        handleCloseModal(false);

        // Redirect user to PayDo checkout page
        window.location.href = `https://checkout.paydo.com/en/payment/invoice-preprocessing/${invoiceId}`;
      }
    } catch (error) {
      setLoading(false);
      navigate("/payment/fail-payment", { replace: true });
      // console.error("Payment error:", error);
    }
  };

  const footer = (
    <div className="flex w-full items-center justify-end gap-3 mt-10">
      <button
        className="bg-slate-500 text-white flex items-center justify-center gap-2 px-7 py-2 rounded-md shadow-md hover:opacity-85 disabled:cursor-not-allowed"
        onClick={handleCloseModal}
        disabled={loading}
      >
        Cancel
      </button>

      <button
        className="bg-blue-600 text-white flex items-center justify-center gap-2 px-5 py-2 rounded-md shadow-md hover:opacity-85 disabled:cursor-not-allowed disabled:px-12"
        onClick={handleTopUpWallet}
        disabled={loading}
      >
        {loading ? (
          <LoadingButton />
        ) : (
          <>
            <FaHandHoldingUsd /> Deposit
          </>
        )}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen w-full">
      <p className="text-2xl md:text-3xl font-semibold text-center uppercase text-[#525FE1] mb-2">
        My Wallet
      </p>

      <div className="bg-white w-full md:w-4/5 min-h-fit mx-auto mt-10 rounded-md py-5 shadow-md">
        <div className="h-[30%] bg-blue-600 flex flex-col justify-center space-y-2 items-center mx-5 p-3 rounded-md">
          <div className="w-full flex flex-col md:flex-row md:items-center gap-1 justify-between text-white">
            <p className="font-semibold text-xs md:text-base">ACCOUNT NUMBER</p>
            <p className="font-semibold text-xs md:text-base">
              {currentUser._id}
            </p>
          </div>

          <div className="w-full flex items-center justify-between text-white">
            <p className="font-semibold text-xs md:text-base">BALANCE</p>
            <p className="text-sm font-semibold">{currentUser.balance} $</p>
          </div>
        </div>

        <div className="h-[70%] mt-3 flex flex-col justify-around items-center mx-5 p-3 rounded-md border-2 border-[#525FE1]">
          <div className="w-full space-y-5">
            <div className="w-full flex justify-between items-center md:text-lg font-semibold text-xs">
              <p>First Name:</p>
              <p>{currentUser.first_name}</p>
            </div>

            <div className="w-full flex justify-between items-center md:text-lg font-semibold text-xs">
              <p>Last Name:</p>
              <p>{currentUser.last_name}</p>
            </div>

            <div className="w-full flex justify-between items-center md:text-lg font-semibold text-xs">
              <p>Email:</p>
              <p>{currentUser.email}</p>
            </div>

            <div className="w-full flex justify-between items-center md:text-lg font-semibold text-xs">
              <p>Phone:</p>
              <p>{currentUser.phone}</p>
            </div>
          </div>

          <div className="bg-white w-full mt-7">
            <button
              className="bg-blue-600 text-white md:w-1/3 flex items-center justify-center gap-2 p-2 md:p-3 rounded-md shadow-md hover:opacity-85"
              onClick={() => setShowModal(true)}
            >
              <FaHandHoldingUsd /> Deposit
            </button>
          </div>
        </div>
      </div>

      <Modal
        open={showModal}
        onCancel={handleCloseModal}
        destroyOnClose
        footer={footer}
        title="Enter an amount $"
      >
        <div>
          <Input
            type="NUMBER"
            min={1.11}
            step="0.01"
            placeholder="1.11$"
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Wallet;
