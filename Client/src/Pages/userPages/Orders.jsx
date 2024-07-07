import { Table, Spin } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { LoadingOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import OrderModal from "../../Components/OrderModal";

const Orders = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [showModal, setShowModal] = useState(false);
  const currentUser = useSelector((state) => state.currentUser.user);

  const columns = [
    {
      title: "Order ID",
      dataIndex: "ID",
    },
    {
      title: "user Email",
      dataIndex: "email",
    },
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Order Cards",
      dataIndex: "cards",
    },
    {
      title: "Total Price",
      dataIndex: "price",
      width: 150,
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
      .get("/api/user/get-orders")
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
    <div className="min-h-screen">
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
          <p className="text-2xl md:text-3xl font-semibold text-center uppercase text-[#525FE1] mb-10">
            My Orders
          </p>

          <Table
            columns={columns}
            dataSource={data}
            scroll={{
              x: 900,
            }}
            className="font-body"
          />

          <OrderModal
            showModal={showModal}
            handleOnClose={handleOnClose}
            tittle={"Order Informations"}
            footer={footer}
            selectedOrder={selectedOrder}
            currentUser={currentUser}
            user={true}
          />
        </div>
      )}
    </div>
  );
};

export default Orders;
