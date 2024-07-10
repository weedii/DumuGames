import { Table, Spin, Input } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import UserDescriptionModal from "./UserDescriptionModal";
import API_URL from "../../utils/apiConfig";

// eslint-disable-next-line react/prop-types
const AllUsers = ({ admins }) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");

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

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
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
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <UserDescriptionModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedUser={selectedUser}
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
              placeholder="Search here..."
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={(value) => setSearchText(value)}
            />
            <Table
              columns={columns}
              dataSource={data}
              onChange={onChange}
              scroll={{
                x: 850,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
