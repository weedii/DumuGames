import { useSelector } from "react-redux";
import { FaHandHoldingUsd } from "react-icons/fa";

const Wallet = () => {
  const currentUser = useSelector((state) => state.currentUser.user);

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
            <button className="bg-blue-600 text-white md:w-1/3 flex items-center justify-center gap-2 p-2 md:p-3 rounded-md shadow-md hover:opacity-85">
              <FaHandHoldingUsd /> Deposit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
