import { useEffect, useState } from "react";
import pacman from "../../assets/pacmanenemy.png";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";
import { useSelector } from "react-redux";
import API_URL from "../../utils/apiConfig";

const SignUp = () => {
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.currentUser.user);

  const handleChangeData = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      toast.error("Password Dosen't Match!");
      return;
    }

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Missing Fields!");
      return;
    }

    // eslint-disable-next-line no-unused-vars
    const { confirm_password: pass, ...rest } = formData;
    setLoading(true);
    axios
      .post(`${API_URL}/api/admin/signup-admin`, formData, {
        withCredentials: true,
      })
      .then((res) => {
        setLoading(false);
        toast.success(res.data);
        navigate("/sign-in/admin/moula_el_bach");
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.response.data.message);
      });
  };

  useEffect(() => {
    AOS.init({ duration: 500 });
    if (currentUser) navigate("/", { replace: true });
  }, [navigate, currentUser]);

  return (
    <div
      className="min-h-screen max-w-xl mx-auto flex flex-col items-center gap-5"
      data-aos="fade-right"
    >
      {/* <Toaster position="top-right" reverseOrder={false} /> */}

      <div className="flex flex-col gap-5 my-7">
        <p className="text-2xl md:text-4xl font-semibold text-center uppercase">
          Sign Up
        </p>
        <img src={pacman} className="mx-auto h-7 object-contain px-5" />
      </div>

      <div className="w-11/12">
        <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            id="name"
            required
            className="border p-3 md:p-4 rounded-md outline outline-1 outline-slate-300 text-sm font-semibold focus-within:ring-2"
            onChange={handleChangeData}
          />
          <input
            type="email"
            placeholder="Email"
            id="email"
            required
            className="border p-3 md:p-4 rounded-md outline outline-1 outline-slate-300 text-sm font-semibold focus-within:ring-2"
            onChange={handleChangeData}
          />
          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            id="password"
            required
            className="border p-3 md:p-4 rounded-md outline outline-1 outline-slate-300 text-sm font-semibold focus-within:ring-2"
            onChange={handleChangeData}
          />
          <input
            type={showPass ? "text" : "password"}
            placeholder="Confirm Password"
            id="confirm_password"
            required
            className="border p-3 md:p-4 rounded-md outline outline-1 outline-slate-300 text-sm font-semibold focus-within:ring-2"
            onChange={handleChangeData}
          />

          <div
            className="flex items-center space-x-2 w-fit cursor-pointer text-sm font-semibold"
            onClick={() => setShowPass(!showPass)}
          >
            <p> {showPass ? <FiEye /> : <FiEyeOff />} </p>
            <button type="button">
              {showPass ? "Hide Password" : "Show Password"}{" "}
            </button>
          </div>

          <button
            className={`bg-[#5956E9] p-2 md:p-3 rounded-md text-white font-semibold uppercase
            outline outline-1 outline-slate-300 hover:opacity-85 disabled:opacity-85
            ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
            disabled={loading}
          >
            Sign Up
          </button>
        </form>

        <div className="flex mt-5 gap-2 text-sm">
          <p>Have an account?</p>
          <Link to="/sign-in/admin/moula_el_bach">
            <span className="text-blue-700 hover:underline underline-offset-4">
              Sign In
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
