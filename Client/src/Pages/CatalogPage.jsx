import { useEffect, useState } from "react";
import Ctalog from "./Ctalog";
import axios from "axios";
import Spinner from "../Components/Spinner";

const CatalogPage = () => {
  const [loading, setLoading] = useState(false);
  const [cardsArray, setCardsArray] = useState(null);

  const getAllCards = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/get-all-cards");
      if (res.data.success) {
        setCardsArray(res.data.card);
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

  return loading ? (
    <Spinner />
  ) : (
    <div className="min-h-screen">
      <Ctalog
        headMsg={
          cardsArray?.length > 0 ? "Availble Cards" : "No Availble Cards"
        }
        cards={cardsArray}
      />
    </div>
  );
};

export default CatalogPage;
