/* eslint-disable react/prop-types */
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Modal, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import InvoiceFile from "./InvoiceFile";
import { useEffect, useState } from "react";

const OrderModal = ({
  showModal,
  handleOnClose,
  tittle,
  footer,
  selectedOrder,
  currentUser,
  user,
}) => {
  const [loading, setLoading] = useState(true);

  const defaultFooter = (
    <button
      onClick={handleOnClose}
      className="bg-[#5956E9] text-white px-3 py-1 rounded-md shadow-md hover:bg-opacity-85 mt-5"
    >
      Ok
    </button>
  );

  useEffect(() => {
    if (currentUser && user) setLoading(false);
    if (!currentUser && !user) setLoading(false);
  }, [currentUser, user]);

  const parsedDate = `${selectedOrder.createdAt?.split("T")[0]} AT ${
    selectedOrder.createdAt?.split("T")[1].split(".")[0].split(":")[0]
  }:${selectedOrder.createdAt?.split("T")[1].split(".")[0].split(":")[1]}h`;

  return (
    <Modal
      title={tittle}
      className="font-body"
      open={showModal}
      destroyOnClose
      onCancel={handleOnClose}
      footer={footer || defaultFooter}
      width={700}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <Spin
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 50,
                  marginTop: 50,
                }}
                spin
              />
            }
          />
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-3">
          <p className="font-semibold text-[#5956E9] flex items-center justify-between gap-5">
            Order ID:
            <span className="text-black"> {selectedOrder._id}</span>
          </p>
          {selectedOrder.userID && (
            <p className="font-semibold text-[#5956E9] flex items-center justify-between gap-5">
              User ID:
              <span className="text-black"> {selectedOrder.userID}</span>
            </p>
          )}
          <p className="font-semibold text-[#5956E9] flex items-center justify-between gap-5">
            User Email:
            <span className="text-black"> {selectedOrder.userEmail}</span>
          </p>
          <p className="font-semibold text-[#5956E9] flex items-center justify-between gap-5">
            Order Date:
            <span className="text-black">{parsedDate}</span>
          </p>

          <p className="font-semibold text-[#5956E9] mt-3">Cards Info</p>
          {selectedOrder.cards?.map((item, idx) => (
            <div key={idx} className="">
              <div className="flex flex-col gap-y-1 text-xs md:text-sm">
                <div className="flex gap-3 items-center">
                  <p>{item.cardType} cards</p>
                  <p>Of {item.amount}$</p>
                  <p>| Qt: {item.quantity}</p>
                  <p>| Rg: {item.region}</p>
                </div>
                <p className="mt-2">{`Price: ${item.totalCardPrice}$`}</p>
              </div>
              <div className="w-full my-3 outline outline-1 outline-red-300" />
            </div>
          ))}
          <p className="text-[#5956E9] font-semibold">
            Total price:{" "}
            <span className="text-black">{selectedOrder.totalPrice}$</span>
          </p>
          <PDFDownloadLink
            document={
              <InvoiceFile
                selectedOrder={selectedOrder}
                currentUser={currentUser}
                date={parsedDate}
              />
            }
            fileName={`invoice-${selectedOrder._id}`}
            className="w-fit"
          >
            {({ loading }) =>
              loading ? (
                "Loading..."
              ) : (
                <button className="w-fit mt-5 p-2 rounded-md shadow-md bg-green-700 text-white hover:bg-opacity-80">
                  Download Inovice
                </button>
              )
            }
          </PDFDownloadLink>
        </div>
      )}
    </Modal>
  );
};

export default OrderModal;
