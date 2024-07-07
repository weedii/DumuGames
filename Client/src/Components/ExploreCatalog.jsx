import Ctalog from "../Pages/Ctalog";
import axios from "axios";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const ExploreCatalog = () => {
  const [cardsArray, setCardsArray] = useState(null);
  const [loading, setLoading] = useState(false);

  const getAllCards = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/get-all-cards");
      if (res.data.success) {
        if (res.data.card.length > 4) {
          setCardsArray(res.data.card.slice(0, 5));
        } else {
          setCardsArray(null);
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching cards:", error);
    }
  };

  useEffect(() => {
    AOS.init({ duration: 500 });
  }, []);

  useEffect(() => {
    getAllCards();
  }, []);

  return loading ? (
    <div className="flex items-center justify-center">
      <Spin
        indicator={
          <LoadingOutlined
            style={{
              fontSize: 50,
            }}
            spin
          />
        }
      />
    </div>
  ) : (
    cardsArray && <Ctalog headMsg={null} showButton={true} cards={cardsArray} />
  );
};

export default ExploreCatalog;
