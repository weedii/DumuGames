/* eslint-disable react/prop-types */
import { Modal, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import API_URL from "../../utils/apiConfig";
import toast from "react-hot-toast";
import { signOut } from "../../redux/userSlice";

const UserDescriptionModal = ({
  showModal,
  setShowModal,
  selectedUser,
  fetchUsers,
}) => {
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector((state) => state.currentUser.user);
  const dispatch = useDispatch();

  const handleOnClose = () => {
    setShowModal(false);
  };

  const handleOnCloseDelete = () => {
    setShowModalDelete(false);
  };

  const handleDeleteUser = async () => {
    setLoading(true);
    await axios
      .post(
        `${API_URL}/api/admin/delete-user/${currentUser._id}`,
        { userID: selectedUser._id },
        {
          withCredentials: true,
        }
      )
      .then(() => {
        setLoading(false);
        window.location.reload();
      })
      .catch(() => {
        toast.error("Error while deleting User");
        setLoading(false);
      });
  };

  const handleSignOut = () => {
    axios
      .get(`${API_URL}/api/auth/signout`, { withCredentials: true })
      .then(() => {
        dispatch(signOut());
        window.location.href = "/";
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteAdmin = async () => {
    if (selectedUser.email === "admin@g.com") {
      toast.error("You can't delete this admin!");
      handleOnClose();
      return;
    }

    setLoading(true);
    await axios
      .post(
        `${API_URL}/api/admin/delete-admin`,
        { email: selectedUser.email },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.success) {
          setLoading(false);
          toast.success(res.data.msg);
          handleOnClose();
          fetchUsers();
          if (selectedUser.email === currentUser.email) {
            handleSignOut();
          }
        } else if (!res.data.success) {
          setLoading(false);
          handleOnClose();
          toast.error(res.data.msg);
          return;
        }
      })
      .catch(() => {
        toast.error("Error while deleting Admin");
        setLoading(false);
      });
  };

  const handleUpdateUserStatus = async (action) => {
    if (action === "accepted") {
      setLoading(true);
      await axios
        .post(
          `${API_URL}/api/admin/update-user-status/${currentUser._id}`,
          {
            id: selectedUser._id,
            status: "accepted",
          },
          { withCredentials: true }
        )
        .then(() => {
          setLoading(false);
          setShowModal(false);
          fetchUsers();
        })
        .catch(() => {
          toast.error("Error while updating status");
          setLoading(false);
        });
    } else {
      setLoading(true);
      await axios
        .post(
          `${API_URL}/api/admin/update-user-status/${currentUser._id}`,
          {
            id: selectedUser._id,
            status: "rejected",
          },
          { withCredentials: true }
        )
        .then(() => {
          setLoading(false);
          setShowModal(false);
          fetchUsers();
        })
        .catch(() => {
          toast.error("Error while updating status");
          setLoading(false);
        });
    }
  };

  const footer = selectedUser.isAdmin ? (
    <div className="w-full flex items-center justify-end gap-3">
      <button
        onClick={handleOnClose}
        disabled={loading}
        className="bg-gray-500 text-white px-3 py-2 rounded-md shadow-md hover:bg-gray-400 mt-5 disabled:cursor-not-allowed disabled:opacity-75"
      >
        Cancel
      </button>

      <button
        onClick={handleDeleteAdmin}
        disabled={loading}
        className="bg-red-600 text-white px-3 py-2 rounded-md shadow-md hover:bg-red-500 mt-5 disabled:cursor-not-allowed disabled:opacity-75"
      >
        {loading ? "Loading..." : "Delete"}
      </button>
    </div>
  ) : (
    <div className="flex items-center justify-between border-t border-t-slate-600 pt-3">
      <div className="flex gap-2 md:gap-4">
        <button
          type="button"
          onClick={handleOnClose}
          disabled={loading}
          className="text-sm font-semibold bg-slate-200 p-2 md:px-4 md:py-2 rounded-md shadow-md hover:bg-slate-300 disabled:bg-opacity-75 disabled:cursor-not-allowed"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={() => setShowModalDelete(true)}
          disabled={loading}
          className="text-sm font-semibold bg-blue-500 text-white p-2 md:px-4 md:py-2 rounded-md shadow-md hover:bg-opacity-85 disabled:bg-opacity-75 disabled:cursor-not-allowed"
        >
          Delete
        </button>
      </div>

      <div className="flex gap-2 md:gap-4">
        <button
          type="button"
          onClick={() => handleUpdateUserStatus("rejected")}
          disabled={loading}
          className="text-sm font-semibold bg-red-600 text-white p-2 md:px-4 md:py-2 rounded-md shadow-md hover:bg-opacity-80 disabled:bg-opacity-75 disabled:cursor-not-allowed"
        >
          Reject
        </button>

        <button
          type="button"
          onClick={() => {
            handleUpdateUserStatus("accepted");
          }}
          disabled={loading}
          className="text-sm font-semibold bg-green-600 text-white p-2 md:px-4 md:py-2 rounded-md shadow-md hover:bg-opacity-80 disabled:bg-opacity-75 disabled:cursor-not-allowed"
        >
          Accept
        </button>
      </div>
    </div>
  );

  return (
    <Modal
      title="User Informations"
      className="font-body"
      open={showModal}
      destroyOnClose
      onCancel={handleOnClose}
      footer={footer}
      width={700}
    >
      {selectedUser.isAdmin ? (
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-[#5956E9] font-semibold ml-1">Role:</p>
            <input
              disabled
              type="text"
              className="border px-2 py-1 rounded-md outline outline-1 outline-slate-300 text-sm font-semibold cursor-text"
              defaultValue={"Admin"}
            />
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-[#5956E9] font-semibold ml-1">Name:</p>
            <input
              disabled
              type="text"
              className="border px-2 py-1 rounded-md outline outline-1 outline-slate-300 text-sm font-semibold cursor-text"
              defaultValue={selectedUser.name}
            />
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-[#5956E9] font-semibold ml-1">Email:</p>
            <input
              disabled
              type="text"
              className="border px-2 py-1 rounded-md outline outline-1 outline-slate-300 text-sm font-semibold cursor-text"
              defaultValue={selectedUser.email}
            />
          </div>
        </form>
      ) : (
        <form className="flex flex-col gap-4 mt-5">
          <div className="flex items-center justify-between gap-5">
            <p className="text-[#5956E9] font-semibold ml-1">Role:</p>
            <input
              disabled
              type="text"
              className="border px-2 py-1 rounded-md outline outline-1 outline-slate-300 text-sm font-semibold cursor-text w-2/3"
              defaultValue={"User"}
            />
          </div>

          <div className="flex items-center justify-between gap-5">
            <p className="text-[#5956E9] font-semibold ml-1">User ID:</p>
            <input
              disabled
              type="text"
              className="border px-2 py-1 rounded-md outline outline-1 outline-slate-300 text-sm font-semibold cursor-text w-2/3"
              defaultValue={selectedUser._id}
            />
          </div>

          <div className="flex items-center justify-between gap-5">
            <p className="text-[#5956E9] font-semibold ml-1">First Name:</p>
            <input
              disabled
              type="text"
              className="border px-2 py-1 rounded-md outline outline-1 outline-slate-300 text-sm font-semibold cursor-text w-2/3"
              defaultValue={selectedUser.first_name}
            />
          </div>

          <div className="flex items-center justify-between gap-5">
            <p className="text-[#5956E9] font-semibold ml-1">Last Name:</p>
            <input
              disabled
              type="text"
              className="border px-2 py-1 rounded-md outline outline-1 outline-slate-300 text-sm font-semibold cursor-text w-2/3"
              defaultValue={selectedUser.last_name}
            />
          </div>

          <div className="flex items-center justify-between gap-5">
            <p className="text-[#5956E9] font-semibold ml-1">Email:</p>
            <input
              disabled
              type="text"
              className="border px-2 py-1 rounded-md outline outline-1 outline-slate-300 text-sm font-semibold cursor-text w-2/3"
              defaultValue={selectedUser.email}
            />
          </div>

          <div className="flex items-center justify-between gap-5">
            <p className="text-[#5956E9] font-semibold ml-1">Phone:</p>
            <input
              disabled
              type="text"
              className="border px-2 py-1 rounded-md outline outline-1 outline-slate-300 text-sm font-semibold cursor-text w-2/3"
              defaultValue={selectedUser.phone}
            />
          </div>

          <div className="flex items-center justify-between gap-5">
            <p className="text-[#5956E9] font-semibold ml-1">Country:</p>
            <input
              disabled
              type="text"
              className="border px-2 py-1 rounded-md outline outline-1 outline-slate-300 text-sm font-semibold cursor-text w-2/3"
              defaultValue={selectedUser.country}
            />
          </div>

          <div className="flex items-center justify-between gap-5">
            <p className="text-[#5956E9] font-semibold ml-1">Balance:</p>
            <input
              disabled
              type="text"
              className="border px-2 py-1 rounded-md outline outline-1 outline-slate-300 text-sm font-semibold cursor-text w-2/3"
              defaultValue={selectedUser.balance + "$"}
            />
          </div>

          <div className="flex items-center justify-between gap-5">
            <p className="text-[#5956E9] font-semibold ml-1">Status:</p>
            <input
              disabled
              type="text"
              className="border px-2 py-1 rounded-md outline outline-1 outline-slate-300 text-sm font-semibold cursor-text w-2/3"
              defaultValue={selectedUser.verification_status}
            />
          </div>

          <div className="flex items-center justify-between gap-5">
            <p className="text-[#5956E9] font-semibold ml-1">
              Identification Type:
            </p>
            <input
              disabled
              type="text"
              className="border px-2 py-1 rounded-md outline outline-1 outline-slate-300 text-sm font-semibold cursor-text w-2/3"
              defaultValue={selectedUser.identification_type}
            />
          </div>

          <div className="flex items-center justify-between gap-5">
            <p className="text-[#5956E9] font-semibold ml-1">
              Identity picture:
            </p>
            {selectedUser.id_picture ? (
              <img src={selectedUser.id_picture} className="w-1/2" />
            ) : (
              <p className="font-semibold">Not added yet!</p>
            )}
          </div>

          <div className="flex items-center justify-between gap-5">
            <p className="text-[#5956E9] font-semibold ml-1">
              Selfie Identity picture:
            </p>
            {selectedUser.selfie_id_picture ? (
              <img src={selectedUser.selfie_id_picture} className="w-1/2" />
            ) : (
              <p className="font-semibold">Not added yet!</p>
            )}
          </div>
        </form>
      )}

      <Modal
        title="Delete User Account"
        className="font-body"
        open={showModalDelete}
        destroyOnClose
        onCancel={handleOnCloseDelete}
        footer={null}
      >
        {loading ? (
          <div className="w-full h-full flex justify-center items-center">
            <Spin
              indicator={
                <LoadingOutlined
                  style={{
                    fontSize: 30,
                  }}
                  spin
                />
              }
            />
          </div>
        ) : (
          <div className="flex flex-col">
            <p className="text-lg font-semibold mb-10">
              Are you sure you want to delete this user{" "}
              {selectedUser.first_name}?
            </p>

            <hr className="mb-3" />
            <div className="flex justify-end items-center gap-5">
              <button
                type="button"
                className="text-sm font-semibold bg-slate-200 px-4 py-2 rounded-md shadow-md hover:opacity-85 w-fit"
                onClick={handleOnCloseDelete}
              >
                Cancel
              </button>

              <button
                type="button"
                className="text-sm font-semibold bg-red-700 text-white px-4 py-2 rounded-md shadow-md hover:opacity-85 w-fit"
                onClick={handleDeleteUser}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </Modal>
  );
};

export default UserDescriptionModal;
