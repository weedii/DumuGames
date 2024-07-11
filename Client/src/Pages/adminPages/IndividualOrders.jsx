import { Table, Spin, Input } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { LoadingOutlined } from "@ant-design/icons";
import OrderModal from "../../Components/OrderModal";
import API_URL from "../../utils/apiConfig";

const IndividualOrders = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState("");

  const columns = [
    {
      title: "Order ID",
      dataIndex: "ID",
      filteredValue: [searchText],
      onFilter: (value, record) =>
        record.ID.includes(value) || record.email.includes(value),
    },
    {
      title: "Email",
      dataIndex: "email",
      filteredValue: [searchText],
    },
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Order Cards",
      dataIndex: "cards",
      filteredValue: [searchText],
    },
    {
      title: "Total Price",
      dataIndex: "price",
      width: 150,
      filteredValue: [searchText],
    },
  ];

  const handleOnClose = () => {
    setShowModal(false);
  };

  const footer = (
    <button
      onClick={handleOnClose}
      className="bg-[#5956E9] text-white px-3 py-1 rounded-md shadow-md hover:bg-opacity-85 mt-5"
    >
      Ok
    </button>
  );

  useEffect(() => {
    axios
      .get(`${API_URL}/api/admin/get-orders-individuals`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          const ordersData = res.data.orders.map((item, idx) => ({
            key: idx,
            ID: item._id,
            email: item.userEmail,
            date: `${item.createdAt.split("T")[0]} AT ${
              item.createdAt.split("T")[1].split(".")[0].split(":")[0]
            }:${item.createdAt.split("T")[1].split(".")[0].split(":")[1]} h`,
            price: item.totalPrice + "$",
            cards: (
              <button
                className="text-blue-600 hover:underline"
                onClick={() => {
                  setSelectedOrder(item);
                  setShowModal(true);
                }}
              >
                Show Details
              </button>
            ),
          }));
          setData(ordersData);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen px-5">
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
              scroll={{
                x: 800,
              }}
              className="font-body"
            />

            <OrderModal
              showModal={showModal}
              handleOnClose={handleOnClose}
              tittle={"Order Informations"}
              footer={footer}
              selectedOrder={selectedOrder}
              currentUser={null}
              user={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default IndividualOrders;
