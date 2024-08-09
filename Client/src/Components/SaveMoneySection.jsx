import { Link } from "react-router-dom";
import money from "../assets/money.png";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const SaveMoneySection = () => {
  useEffect(() => {
    AOS.init({ duration: 500 });
  }, []);

  return (
    <div
      className="min-h-[60vh] mt-10 flex flex-col lg:flex-row items-center justify-center gap-10 px-5 mb-10"
      data-aos="fade-up"
    >
      <div className="flex-1">
        <p className="text text-4xl md:text-6xl lg:text-6xl max-w-4xl text-[#5956E9] font-bold leading-snug text-center lg:text-start">
          We have the best prices for you
        </p>

        <p className="text-center lg:text-start text-wrap text-lg font-semibold mt-10 text-gray-700">
          {"Don't waste your time and start shopping now!"}
        </p>

        <Link to="/catalog" className="hidden lg:block">
          <button className="mt-5 bg-[#5956E9] text-white px-7 py-4 rounded-md hover:opacity-85">
            Catalog
          </button>
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-2">
        <img src={money} alt="save money section" />

        <Link to="/catalog" className="lg:hidden w-2/3 mt-10">
          <button className="bg-[#5956E9] text-white px-7 py-4 rounded-md hover:opacity-85 w-full">
            Catalog
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SaveMoneySection;
