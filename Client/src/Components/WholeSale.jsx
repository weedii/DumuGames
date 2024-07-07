import { useEffect, useRef, useState } from "react";
import { Select, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { PhoneNumberUtil } from "google-libphonenumber";
import { IoCheckmarkCircleOutline, IoClose } from "react-icons/io5";
import { toast } from "react-hot-toast";
import {
  countriesArray,
  identificationTypeArray,
  genderArray,
} from "./Countries";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UploadIdentity, UploadSelfieIdentity } from "./UploadIdentity";
import AOS from "aos";
import "aos/dist/aos.css";

const WholeSale = () => {
  const forma = useRef();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const phoneUtil = PhoneNumberUtil.getInstance();
  const navigate = useNavigate();
  const [identityImg, setIdentityImg] = useState(null);
  const [identitySelfie, setIdentitySelfie] = useState(null);
  const [emails, setEmails] = useState([]);

  const handleChangeData = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const isPhoneValid = (phone) => {
    try {
      return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
    } catch (error) {
      return false;
    }
  };
  const isValidPhone = isPhoneValid(phone);

  const handleIdentityImgChange = (file) => {
    setIdentityImg(file);
  };

  const handleIdentitySelfieChange = (file) => {
    setIdentitySelfie(file);
  };

  const UploadID = async () => {
    try {
      if (identityImg) {
        const folderName =
          formData.first_name + " " + formData.last_name + " " + formData.email;

        // Create a unique public ID that incorporates the username
        const publicId = `${folderName}/${Math.random()
          .toString(36)
          .substring(2, 15)}.jpg`; // Example: john_doe/12345abcde.jpg

        const formDataa = new FormData();
        formDataa.append("file", identityImg); // Assuming 'identityImg' is your image file object
        formDataa.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET); // Replace with your Cloudinary upload preset
        formDataa.append("public_id", publicId); // Add the username-based public ID

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUD_NAME
          }/upload`,
          formDataa
        );
        const updatedFormData = {
          ...formData,
          id_picture: res.data.secure_url,
        };
        return updatedFormData;
      } else {
        return false;
      }
    } catch (err) {
      toast.error("Error while uploading image!");
      return formData;
    }
  };

  const UploadIDSelfie = async (updatedFormDataa) => {
    try {
      if (identitySelfie) {
        const folderName =
          formData.first_name + " " + formData.last_name + " " + formData.email;

        // Create a unique public ID that incorporates the username
        const publicId = `${folderName}/${Math.random()
          .toString(36)
          .substring(2, 15)}.jpg`; // Example: john_doe/12345abcde.jpg

        const formDataa = new FormData();
        formDataa.append("file", identitySelfie); // Assuming 'identityImg' is your image file object
        formDataa.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET); // Replace with your Cloudinary upload preset
        formDataa.append("public_id", publicId); // Add the username-based public ID

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUD_NAME
          }/upload`,
          formDataa
        );
        const updatedFormData = {
          ...updatedFormDataa,
          selfie_id_picture: res.data.secure_url,
        };
        setFormData(updatedFormData);
        return updatedFormData; // Return updated form data
      } else {
        return false;
      }
    } catch (error) {
      toast.error("Error while uploading image!");
      return formData;
    }
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
    return emailPattern.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.email ||
      !formData.first_name ||
      !formData.last_name ||
      !formData.gender ||
      !formData.country ||
      !formData.identification_type
    ) {
      toast.error("Missing Fields!");
      return;
    }

    if (!validateEmail(formData.email)) { 
      toast.error("Invalid Email!");
      return;
    }

    if (!identityImg || !identitySelfie) {
      toast.error("Missing Fields!");
      return;
    }

    if (emails.includes(formData.email)) {
      toast.error("User Already Exist!");
      return;
    }

    const updatedFormData = await UploadID();
    const finalFormData = await UploadIDSelfie(updatedFormData);

    if (!updatedFormData || !finalFormData) {
      toast.error("Missing Fields!");
      return;
    }

    if (finalFormData.phone && !isValidPhone) {
      toast.error("Invalid Phone Number!");
      return;
    }

    setLoading(true);
    await axios
      .post("/api/auth/signup-wholesale", finalFormData)
      .then(async (res) => {
        setLoading(false);
        toast.success(res.data);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        navigate("/", { replace: true });
        window.location.reload();
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.response.data.message);
      });
  };

  useEffect(() => {
    AOS.init({ duration: 500 });
  }, []);

  useEffect(() => {
    axios
      .get("/api/user/get-soussa")
      .then((res) => {
        if (res.data.success) {
          setEmails(res.data.emails);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start mt-20 space-y-20 mb-10"
      data-aos="fade-in"
    >
      <p className="text-xl text-center font-bold text-violet-600 w-2/3">
        For Wholesale Enter your Inforamtion we will create an account for you
        then you get all the information you need in email!
      </p>
      <form className="mx-auto w-3/4" onSubmit={handleSubmit} ref={forma}>
        {loading ? (
          <div className="flex items-center justify-center">
            <Spin
              indicator={
                <LoadingOutlined
                  style={{
                    fontSize: 70,
                    marginBottom: 300,
                  }}
                  spin
                />
              }
            />
          </div>
        ) : (
          <>
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="email"
                name="email"
                id="email"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                onChange={handleChangeData}
              />
              <label
                htmlFor="email"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Email address <span className="text-red-700">*</span>
              </label>
            </div>

            <div className="grid md:grid-cols-2 md:gap-6">
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  onChange={handleChangeData}
                />
                <label
                  htmlFor="first_name"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  First Name <span className="text-red-700">*</span>
                </label>
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="last_name"
                  id="last_name"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                  onChange={handleChangeData}
                />
                <label
                  htmlFor="last_name"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Last Name <span className="text-red-700">*</span>
                </label>
              </div>
            </div>

            <div className="flex items-start justify-between gap-5 flex-wrap my-10">
              <div className="flex items-center flex-wrap gap-2">
                <p className="text-xs font-semibold text-gray-500">
                  Select gender
                </p>
                <Select
                  defaultValue={""}
                  style={{
                    width: 150,
                  }}
                  onChange={(e) => setFormData({ ...formData, gender: e })}
                  options={genderArray}
                />
              </div>

              <div className="flex items-center flex-wrap gap-2">
                <p className="text-xs font-semibold text-gray-500">
                  Select country
                </p>
                <Select
                  defaultValue={""}
                  style={{ width: "210px" }}
                  showSearch
                  onChange={(e) => setFormData({ ...formData, country: e })}
                  options={countriesArray}
                />
              </div>

              <div className="flex items-center flex-wrap gap-2">
                <p className="text-xs font-semibold text-gray-500">
                  Enter Phone Number
                </p>
                <div className="flex items-center gap-2">
                  <PhoneInput
                    defaultCountry="us"
                    value={phone}
                    onChange={(phone) => {
                      setPhone(phone);
                      setFormData({ ...formData, phone: phone });
                    }}
                  />
                  {isValidPhone ? (
                    <IoCheckmarkCircleOutline className="text-green-700 text-xl" />
                  ) : (
                    <IoClose className="text-red-700 text-xl" />
                  )}
                </div>
              </div>

              {formData.first_name && formData.last_name && formData.email && (
                <div className="flex items-center flex-wrap gap-2">
                  <p className="text-xs font-semibold text-gray-500">
                    Select Identification Type
                  </p>
                  <Select
                    defaultValue={""}
                    style={{ width: "210px" }}
                    onChange={(e) =>
                      setFormData({ ...formData, identification_type: e })
                    }
                    options={identificationTypeArray}
                  />
                </div>
              )}

              {formData.first_name && formData.last_name && formData.email && (
                <div className="flex items-center flex-wrap gap-7">
                  <div className="flex flex-col gap-2">
                    <p>Upload Identity Photo</p>
                    <UploadIdentity onFileChange={handleIdentityImgChange} />
                  </div>

                  <div className="flex flex-col gap-2">
                    <p>Upload Selfie holding the Identity</p>
                    <UploadSelfieIdentity
                      onFileChange={handleIdentitySelfieChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <button
          type="submit"
          className="text-white bg-[#5956E9] hover:bg-opacity-85 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-sm w-full  px-5 py-2.5 text-center disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default WholeSale;
