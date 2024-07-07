/* eslint-disable react/prop-types */
import { Modal } from "antd";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";

const CheckOutModal = ({
  showModal,
  handleOnClose,
  canBuy,
  footer,
  cartItems,
  currentUser,
}) => {
  return (
    <Modal
      title="Confirm Order"
      open={showModal}
      onCancel={handleOnClose}
      destroyOnClose
      // footer={footer}
      footer={null}
    >
      <div className="min-h-[15vh]">
        {/* {cartItems.cartItems.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
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
        </p>
        {!canBuy ? (
          <div className="flex flex-col gap-2">
            <p className="text-red-700 text-sm font-bold">
              (You need to deposit your wallet) you have {currentUser.balance}$
            </p>
            <Link
              to={"/My-Account/Wallet"}
              className="flex items-center gap-1 font-semibold p-2 w-fit"
            >
              Go To wallet <IoIosArrowForward />
            </Link>
          </div>
        ) : (
          <div>
            <p className="text-green-700 text-xs font-bold">
              (The amount will be taken from your wallet directly!)
            </p>

            <p className="font-semibold mt-5">
              Your Balance is ({currentUser.balance} $)
            </p>
            <p className="font-semibold">
              The amount that will be taken is (-{cartItems.totalAmount} $)
            </p>
          </div>
        )} */}
        <p className="text-3xl text-center font-body font-medium text-red-700 mt-14">
          Comming Soon
        </p>
      </div>
    </Modal>
  );
};

export default CheckOutModal;
