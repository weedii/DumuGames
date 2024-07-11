import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateUser, deleteUser } from "../../redux/userSlice";
import axios from "axios";
import { FaRegTrashCan } from "react-icons/fa6";
import Modal from "../../Components/Modal";
import { useNavigate } from "react-router-dom";
import API_URL from "../../utils/apiConfig";

const PersonalInfoAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const currentUser = useSelector((state) => state.currentUser.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (JSON.stringify(formData) === "{}") {
      toast.error("No Changes To Update!");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `${API_URL}/api/admin/update-admin/${currentUser._id}`,
        formData,
        { withCredentials: true }
      );
      dispatch(updateUser(res.data));
      toast.success("Updated Successfully!");
      setLoading(false);
      // wait untill the message of the toast appears before reloading
      await new Promise((resolve) => setTimeout(resolve, 500));
      window.location.reload();
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    await axios
      .delete(`${API_URL}/api/user/delete/${currentUser._id}`, {
        withCredentials: true,
      })
      .then(() => {
        dispatch(deleteUser());
        navigate("/", { replace: true });
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center md:justify-start px-5">
      <p className="text-2xl md:text-3xl font-semibold text-center uppercase text-[#525FE1] mb-2">
        {"Hello " + currentUser.name}
      </p>

      <form
        className="max-w-3xl mx-auto flex flex-col gap-7 w-full"
        onSubmit={handleSubmit}
      >
        <div>
          <p className="m-1 text-sm">Name:</p>
          <input
            type="text"
            placeholder="Name"
            id="name"
            className="w-full border p-3 md:p-4 rounded-md outline outline-1 outline-slate-300 text-sm font-semibold focus-within:ring-2"
            onChange={handleInputChange}
          />
        </div>

        <div>
          <p className="m-1 text-sm">Email:</p>
          <input
            type="email"
            placeholder="Email"
            id="email"
            className="w-full border p-3 md:p-4 rounded-md outline outline-1 outline-slate-300 text-sm font-semibold focus-within:ring-2"
            onChange={handleInputChange}
          />
        </div>

        <div>
          <p className="m-1 text-sm">Password:</p>
          <input
            type="password"
            placeholder="Password"
            id="password"
            className="w-full border p-3 md:p-4 rounded-md outline outline-1 outline-slate-300 text-sm font-semibold focus-within:ring-2"
            onChange={handleInputChange}
          />
        </div>

        <div>
          <p className="m-1 text-sm">Confirm Password:*</p>
          <input
            type="password"
            placeholder="Confirm Password"
            id="confirm_password"
            className="w-full border p-3 md:p-4 rounded-md outline outline-1 outline-slate-300 text-sm font-semibold focus-within:ring-2"
            onChange={handleInputChange}
          />
        </div>

        <button
          className={`bg-[#5956E9] p-2 md:p-3 rounded-md text-white font-semibold uppercase
          outline outline-1 outline-slate-300 hover:opacity-85 disabled:opacity-85
          ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
          type="submit"
          disabled={loading}
        >
          Update
        </button>
      </form>

      <div className="mt-3 max-w-3xl w-full mx-auto">
        <p
          className="flex items-center gap-1 text-red-700 font-semibold cursor-pointer hover:opacity-80 w-fit"
          onClick={() => setOpenModal(true)}
        >
          <FaRegTrashCan />
          Delete Account
        </p>
      </div>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div className="text-center w-56">
          <FaRegTrashCan size={56} className="mx-auto text-red-500" />

          <div className="mx-auto my-4 w-48 flex flex-col gap-4">
            <h3 className="text-lg font-black text-gray-800">Confirm Delete</h3>
            <p className="text-sm text-gray-500">
              Are you sure you want to delete your Account?
            </p>

            <div className="flex gap-4 mx-auto">
              <button
                className="bg-gray-100 text-gray-500 rounded-lg shadow-md
                text-sm font-semibold py-2 px-4 hover:bg-slate-200 hover:text-black"
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white rounded-lg shadow-md
                text-sm font-semibold py-2 px-4 hover:bg-red-600"
                onClick={handleDeleteUser}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PersonalInfoAdmin;
