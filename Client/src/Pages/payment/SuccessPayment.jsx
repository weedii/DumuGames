import { IoCheckmarkCircle } from "react-icons/io5";
import OrderModal from "../../Components/OrderModal";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const SuccessPayment = () => {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);
  const [isWholesaler, setIsWholesaler] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const handleOnCloseOrderModal = () => {
    setShowOrderModal(false);
  };

  useEffect(() => {
    if (
      !location.state &&
      (!location.state.orderInfo || !location.state.wholesaler)
    ) {
      navigate("/", { replace: true });
      return;
    } else if (location.state.wholesaler) {
      setIsWholesaler(true);
    } else {
      setOrderInfo(location.state.orderInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-5">
      <div className="flex items-center justify-center text-center gap-2 md:gap-5">
        <IoCheckmarkCircle color="green" className="text-3xl md:text-5xl" />
        <p className="text-xl md:text-3xl font-semibold">Success Payment</p>
      </div>

      {orderInfo && !isWholesaler && (
        <button
          className="bg-green-700 p-2 rounded-md text-white hover:bg-green-600"
          onClick={() => setShowOrderModal(true)}
        >
          Click to see order
        </button>
      )}

      {!orderInfo && isWholesaler && (
        <Link
          to={"/My-Account/Wallet"}
          reloadDocument
          className="bg-green-700 px-4 py-2 rounded-md text-white hover:bg-green-600"
          onClick={() => setShowOrderModal(true)}
        >
          Go to wallet
        </Link>
      )}

      {orderInfo && (
        <OrderModal
          showModal={showOrderModal}
          handleOnClose={handleOnCloseOrderModal}
          tittle={"Order Informations"}
          footer={null}
          selectedOrder={orderInfo}
          currentUser={null}
          user={false}
        />
      )}
    </div>
  );
};

export default SuccessPayment;
