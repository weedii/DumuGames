import { Table, Spin, Input, Modal } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import UserDescriptionModal from "./UserDescriptionModal";
import API_URL from "../../utils/apiConfig";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { toast } from "react-hot-toast";

// eslint-disable-next-line react/prop-types
const AllUsers = ({ admins }) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showModalAddAdmin, setShowModalAddAdmin] = useState(false);

  const [newName, setNewName] = useState(null);
  const [newEmail, setNewEmail] = useState(null);
  const [newPass, setNewPass] = useState(null);
  const [showPass, setShowPass] = useState(false);

  const handleOnCloseAddAdminModal = () => {
    setNewName(null);
    setNewEmail(null);
    setNewPass(null);
    setShowPass(false);
    setShowModalAddAdmin(false);
  };

  const columns = [
    {
      title: "user ID",
      dataIndex: "ID",
      filteredValue: [searchText],
      onFilter: (value, record) =>
        record.ID.includes(value) ||
        record.name.includes(value) ||
        record.email.includes(value),
    },
    {
      title: "Name",
      dataIndex: "name",
      filteredValue: [searchText],
    },
    {
      title: "Email",
      dataIndex: "email",
      filteredValue: [searchText],
    },
    {
      title: "Status",
      dataIndex: "status",
      filteredValue: [searchText],
    },
    {
      title: "Info",
      dataIndex: "info",
      width: 150,
      filteredValue: [searchText],
    },
  ];

  // const onChange = (pagination, filters, sorter, extra) => {
  //   console.log("params", pagination, filters, sorter, extra);
  // };

  const handleShowPass = () => {
    setShowPass(!showPass);
  };

  const getAllUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        admins
          ? `${API_URL}/api/admin/get-admins`
          : `${API_URL}/api/admin/get-users`,
        { withCredentials: true }
      );
      const userData = res.data.map((user, index) => ({
        key: `${index}`,
        ID: user._id,
        name: user.name || user.first_name,
        email: user.email,
        status: (
          <p className="flex items-center gap-2">
            {user.isAdmin ? "----------" : user.verification_status}
            <span
              className={`w-2 h-2 rounded-full ${user.isAdmin && "hidden"}
              ${
                user.verification_status === "pending"
                  ? "bg-yellow-500"
                  : user.verification_status === "accepted"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            ></span>
          </p>
        ),
        role: user.isAdmin ? "Admin" : "User",
        info: (
          <button
            className="bg-[#5956E9] text-white text-xs p-2 rounded-md hover:opacity-85"
            onClick={() => {
              setShowModal(true);
              setSelectedUser(user);
            }}
          >
            Click for more
          </button>
        ),
      }));
      setData(userData);
      setLoading(false);
    } catch (error) {
      toast.error("Error while getting Users");
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
    return emailPattern.test(email);
  };

  const handleAddAdmin = async () => {
    if (!newName || !newEmail || !newPass) {
      toast.error("Missing Fields!");
      return;
    } else if (!validateEmail(newEmail)) {
      toast.error("Invalid Email!");
      return;
    } else {
      setLoading(true);
      axios
        .post(
          `${API_URL}/api/admin/signup-admin`,
          { name: newName, email: newEmail, password: newPass },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setLoading(false);
          handleOnCloseAddAdminModal();
          toast.success(res.data);
          getAllUsers();
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.response.data.message);
        });
    }
  };

  useEffect(() => {
    getAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const footer = (
    <div className="space-x-2">
      <button
        disabled={loading}
        onClick={handleOnCloseAddAdminModal}
        className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 disabled:bg-opacity-75 disabled:cursor-not-allowed"
      >
        Cancel
      </button>
      <button
        disabled={loading}
        onClick={handleAddAdmin}
        className="bg-green-700 px-3 py-2 rounded-md text-white hover:bg-green-800 disabled:bg-opacity-75 disabled:cursor-not-allowed"
      >
        {loading ? "Loading..." : "Add"}
      </button>
    </div>
  );

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <UserDescriptionModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedUser={selectedUser}
        fetchUsers={getAllUsers}
      />

      <p className="px-5 mb-5 text-center text-[#5956E9] text-2xl font-semibold">
        All Users
      </p>
      <div className="px-5">
        {loading ? (
          <div className="min-h-screen flex items-center justify-center">
            <Spin
              indicator={
                <LoadingOutlined
                  style={{
                    fontSize: 80,
                    marginBottom: 300,
                  }}
                  spin
                />
              }
            />
          </div>
        ) : (
          <div>
            <Input.Search
              className="my-5"
              placeholder="ID.. Name.. Email.."
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={(value) => setSearchText(value)}
            />

            {admins && (
              <div className="my-5">
                <button
                  className="bg-[#5956E9] text-white text-sm font-semibold p-2 rounded-md hover:opacity-85"
                  onClick={() => {
                    setShowModalAddAdmin(true);
                  }}
                >
                  Add admin
                </button>
              </div>
            )}

            <Table
              columns={columns}
              dataSource={data}
              // onChange={onChange}
              scroll={{
                x: 850,
              }}
            />

            <Modal
              title="Add admin"
              open={showModalAddAdmin}
              className=""
              destroyOnClose
              onCancel={handleOnCloseAddAdminModal}
              footer={footer}
            >
              <div className="flex flex-col gap-5 mb-5">
                <Input
                  type="name"
                  placeholder="Name"
                  required
                  onChange={(e) => setNewName(e.target.value)}
                />

                <Input
                  type="email"
                  placeholder="Email"
                  required
                  onChange={(e) => setNewEmail(e.target.value)}
                />

                <Input
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  required
                  onChange={(e) => setNewPass(e.target.value)}
                />

                {showPass ? (
                  <p
                    onClick={handleShowPass}
                    className="flex items-center text-sm gap-1 cursor-pointer"
                  >
                    <LuEye />
                    Hide password
                  </p>
                ) : (
                  <p
                    onClick={handleShowPass}
                    className="flex items-center text-sm gap-1 cursor-pointer"
                  >
                    <LuEyeOff />
                    Show password
                  </p>
                )}
              </div>
            </Modal>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
