import { PacmanLoader } from "react-spinners";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const Loader = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="min-h-screen bg-[#ecf5fe] flex items-center justify-center">
      <span data-aos="fade-up">
        <PacmanLoader color="#5956E9" size={40} className="mr-16" />
      </span>
    </div>
  );
};

export default Loader;
