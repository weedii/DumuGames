import { useEffect, useState } from "react";
import AddCardsModal from "./AddCardsModal";
import Spinner from "../../Components/Spinner";
import Ctalog from "../Ctalog";
import UpdateCardsModal from "./UpdateCardsModal";
import axios from "axios";
import API_URL from "../../utils/apiConfig";

const Cards = () => {
  const [loading, setLoading] = useState(false);
  const [cardsArray, setCardsArray] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [cardTypesArray, setCardTypesArray] = useState([]);

  const getAllCards = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/admin/get-all-cards`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setCardsArray(res.data.card);
        const typesArray = res.data.card.map((card) => ({
          value: card.type,
          label: card.type,
          pictureURL: card.pictureURL ? true : false,
        }));
        setCardTypesArray(typesArray);
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCards();
  }, []);

  return (
    <div className="min-h-screen px-5">
      <div className="flex flex-col md:flex-row items-center justify-between border-b border-b-neutral-300 pb-2 gap-2">
        {/* <p className="text-lg font-semibold text-red-600 self-start md:self-end">
          Available Cards
        </p> */}

        <div className="flex items-center justify-end gap-5 w-full md:w-auto">
          <button
            className="bg-blue-600 p-2 md:p-3 rounded-md shadow-md text-white text-xs md:text-sm hover:bg-opacity-85"
            onClick={() => setShowModal(true)}
          >
            Add New Card
          </button>
          <button
            className="bg-blue-600 p-2 md:p-3 rounded-md shadow-md text-white text-xs md:text-sm hover:bg-opacity-85"
            onClick={() => setShowModalUpdate(true)}
          >
            Update Card
          </button>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="flex items-center justify-center gap-2">
          <Ctalog
            cards={cardsArray}
            headMsg={
              cardsArray?.length > 0 ? "Availble Cards" : "No Availble Cards"
            }
            getAllCards={getAllCards}
          />
        </div>
      )}

      <AddCardsModal
        showModal={showModal}
        setShowModal={setShowModal}
        cardTypesArray={cardTypesArray}
      />

      <UpdateCardsModal
        showModal={showModalUpdate}
        setShowModal={setShowModalUpdate}
        cardTypesArray={cardTypesArray}
      />
    </div>
  );
};

export default Cards;
