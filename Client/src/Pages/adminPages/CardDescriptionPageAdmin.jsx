/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Spinner from "../../Components/Spinner";
import AOS from "aos";
import "aos/dist/aos.css";
import { FiArrowLeft } from "react-icons/fi";
import { Modal } from "antd";
import axios from "axios";
import { toast } from "react-hot-toast";
import API_URL from "../../utils/apiConfig";

const CardDescriptionPageAdmin = ({ showCart, setShowCart, cardInfo }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOnClose = () => {
    setShowModal(false);
  };

  const handleDeleteCard = async (cardID) => {
    setLoading(true);
    await axios
      .post(
        `${API_URL}/api/admin/delete-card`,
        { cardID },
        { withCredentials: true }
      )
      .then(async (res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          await new Promise((resolve) => setTimeout(resolve, 700));
          setLoading(false);
          setShowCart(false);
          window.location.reload();
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const footer = (
    <div className="flex items-center justify-end gap-3">
      <button
        className="bg-slate-200 font-semibold rounded-md px-4 py-2 hover:bg-slate-300 disabled:cursor-not-allowed disabled:bg-opacity-75"
        onClick={handleOnClose}
        disabled={loading}
      >
        Cancel
      </button>
      <button
        className="bg-red-700 text-white font-semibold rounded-md px-4 py-2 hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-opacity-75"
        onClick={() => handleDeleteCard(cardInfo._id)}
        disabled={loading}
      >
        Delete
      </button>
    </div>
  );

  useEffect(() => {
    AOS.init({ duration: 500 });
  }, []);

  return (
    <div
      className={`fixed top-0 right-0 w-full h-full z-20 bg-slate-500 bg-opacity-10 ease-in-out
      ${showCart ? "scale-100" : "scale-0"} cursor-pointer`}
    >
      <div
        className={`bg-[#ECF5FE] w-full md:w-7/12 ml-auto h-full shadow-2xl cursor-default`}
        data-aos="fade-left"
      >
        {cardInfo ? (
          <div className="w-full h-full pb-14">
            <div className="flex items-center p-5">
              <p
                className="flex items-center cursor-pointer text-[#5956E9] font-semibold hover:opacity-80 w-fit"
                onClick={() => {
                  setShowCart(false);
                }}
              >
                <FiArrowLeft color="black" size={15} />
                Back
              </p>
            </div>
            <hr className="border-black" />

            <div className="mt-8">
              <div className="flex w-full md:w-[87%] px-5 md:px-0 m-auto">
                <div className="hidden md:block h-36 w-[12.5rem] mt-12 mr-12">
                  <img
                    src={cardInfo.pictureURL}
                    className="w-full rounded-sm object-cover"
                  />
                </div>

                <div className="max-w-3xl flex-1">
                  <div className="mt-4">
                    <p className="text-2xl font-medium mb-4 text-center md:text-start">
                      {cardInfo.type} Cards
                    </p>
                  </div>

                  <img
                    src={cardInfo.pictureURL}
                    className="h-36 w-[12.5rem] rounded-sm object-cover mx-auto mb-16 md:hidden"
                  />

                  <div className="text-sm">
                    <p className="text-xl font-semibold mb-2 text-[#5956E9]">
                      Quantity:
                    </p>
                    {Object.entries(cardInfo.quantity).map(
                      ([key, val], idx) => (
                        <div key={idx} className="flex items-center flex-wrap">
                          <p>{`${key}$ --> `}</p>
                          {Object.entries(val).map(([rg, qt], idxx) => (
                            <p
                              key={idxx}
                              className="flex items-center gap-1 flex-nowrap my-1 mx-2"
                            >
                              <span className="text-blue-500">{`${rg}:`} </span>
                              {qt}
                            </p>
                          ))}
                          <p className="flex w-full gap-1">
                            <span className="text-red-600 font-semibold">
                              Price:
                            </span>
                            {cardInfo.prices[key]}$
                          </p>
                          <div className="bg-red-700 w-full my-2 outline-dashed outline-1 outline-slate-400" />
                        </div>
                      )
                    )}
                  </div>

                  <button
                    className="text-sm mt-10 bg-red-700 text-white font-semibold p-3 rounded-md shadow-md hover:bg-opacity-85"
                    onClick={() => setShowModal(true)}
                  >
                    Delete This Card
                  </button>
                </div>
              </div>
            </div>

            <Modal
              title="Delete Card"
              className="font-body"
              open={showModal}
              destroyOnClose
              onCancel={handleOnClose}
              footer={footer}
            >
              <div className="h-[7vh] mt-5">
                <p className="font-semibold">
                  Are you sure you want to delete all the{" "}
                  <span className="text-red-700 font-bold uppercase">
                    {cardInfo.type}
                  </span>{" "}
                  cards?
                </p>
              </div>
            </Modal>
          </div>
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
};

export default CardDescriptionPageAdmin;
