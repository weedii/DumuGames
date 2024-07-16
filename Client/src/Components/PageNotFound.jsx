import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10">
      <p className="text-2xl md:text-5xl font-semibold">404 Page Not Found</p>
      <Link to={"/"}>
        <button className="bg-[#5956E9] w-[20rem] p-5 rounded-md text-white shadow-md hover:opacity-80">
          Back To Home
        </button>
      </Link>
    </div>
  );
};

export default PageNotFound;
