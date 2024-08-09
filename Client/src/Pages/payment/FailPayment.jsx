import { IoIosCloseCircle } from "react-icons/io";
import AOS from "aos";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const FailPayment = () => {
  const [data, setData] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.data) {
      setData(location.state.data);
    }
  }, [location.state]);

  useEffect(() => {
    AOS.init({ duration: 100 });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center gap-5">
      <IoIosCloseCircle size={100} color="red" data-aos="zoom-in" />
      <p className="text-3xl text-red-500 font-bold" data-aos="zoom-in">
        Your Payment Fail
      </p>

      {data && typeof data === "string" && (
        <div>
          <p className="text-xl font-semibold text-gray-600">
            What went wrong!
          </p>

          <p className="mt-7 font-semibold text-gray-600">{data}</p>
        </div>
      )}

      {data && Array.isArray(data) && data.length > 0 && (
        <div>
          <p className="text-xl font-semibold text-gray-600">
            What went wrong!
          </p>

          <div className="mt-7 flex flex-wrap justify-center font-semibold text-gray-600 gap-3">
            {location.state.msg && (
              <p className="font-bold">{location.state.msg} for:</p>
            )}
            {data.map((item, key) => (
              <div className="flex items-center gap-2" key={key}>
                <p className="font-bold text-black">{item},</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FailPayment;
