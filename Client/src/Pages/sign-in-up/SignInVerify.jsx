import { useEffect, useState } from "react";
import pacman from "../../assets/pacmanenemy.png";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { signIn } from "../../redux/userSlice";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import API_URL from "../../utils/apiConfig";
import LoadingButton from "../../Components/LoadingButton";

const SignInVerify = () => {
  const [loading, setLoading] = useState(false);
  const [loadingResendPass, setLoadingResendPass] = useState(false);
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const verifyPassword = async (e) => {
    e.preventDefault();

    if (!password || password.length < 10) {
      toast.error("Missing Fields Or Invalid Password!");
      return;
    }
    setLoading(true);
    await axios
      .post(
        `${API_URL}/api/auth/signin`,
        {
          email: location.state.email,
          password: password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.success) {
          setLoading(false);
          dispatch(signIn(res.data.userInfo));
          navigate("/Catalog", { replace: true });
          window.location.reload();
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.response.data.message);
      });
  };

  const handleSendPassAgain = async () => {
    try {
      setLoadingResendPass(true);
      const res = await axios.post(`${API_URL}/api/auth/resend-pass`, {
        email: location.state.email,
      });
      if (res.data.success) {
        toast.success(res.data.msg);
        setLoadingResendPass(false);
        return;
      }
    } catch (error) {
      toast.error("Error while re-sending password!");
      setLoadingResendPass(false);
      return;
    }
  };

  useEffect(() => {
    if (!location.state || (location.state && !location.state.email)) {
      navigate("/", { replace: true });
      return;
    }
  }, [location.state, navigate]);

  useEffect(() => {
    AOS.init({ duration: 500 });
  }, []);

  return (
    <div
      className="min-h-screen mt-10 max-w-xl mx-auto flex flex-col items-center gap-5 px-5"
      data-aos="fade-right"
    >
      <p className="text-center font-semibold">
        We have sent a password to your email
      </p>
      <p className="text-center font-semibold">
        Please check and enter below to get started
      </p>
      <img src={pacman} className="mx-auto h-7 object-contain" />

      <form
        className="flex flex-col gap-7 w-full mt-14 md:mt-14"
        onSubmit={verifyPassword}
      >
        <input
          type="password"
          placeholder="Password"
          id="password"
          required
          className="border p-3 md:p-4 rounded-md outline outline-1 outline-slate-300 text-sm font-semibold focus-within:ring-2"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className={`bg-[#5956E9] p-2 md:p-3 rounded-md text-white font-semibold uppercase
            outline outline-1 outline-slate-300 hover:opacity-85 disabled:opacity-85
            ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
          disabled={loading}
        >
          {loading ? <LoadingButton /> : "Verify"}
        </button>
      </form>

      <div className="sm:flex gap-1 items-center justify-start w-full">
        <p className="text-sm text-gray-700">{"Didn't get the password?"}</p>
        <p
          className="text-sm font-semibold text-blue-500 cursor-pointer hover:underline"
          onClick={loadingResendPass ? null : handleSendPassAgain}
        >
          {loadingResendPass ? (
            <LoadingButton color={"#5956E9"} />
          ) : (
            "Send Again"
          )}
        </p>
      </div>
    </div>
  );
};

export default SignInVerify;
