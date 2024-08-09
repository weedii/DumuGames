import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CatalogPage from "../CatalogPage";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import API_URL from "../../utils/apiConfig";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../redux/userSlice";

const ProcessPayment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  var currentUser = useSelector((state) => state.currentUser.user);

  useEffect(() => {
    if (!localStorage.getItem("invoiceId")) {
      navigate("/", { replace: true });
      return;
    }

    // Get Invoice
    const getInvoiceInfo = async () => {
      await axios
        .get(
          `https://paydo.com/v1/invoices/${localStorage.getItem("invoiceId")}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then(async (res) => {
          // check request status
          if (res.data && res.data.status === 1) {
            // check status of the invoice paid or not
            if (res.data.data.status === 0) {
              toast.error("Not Paid!");
              navigate("/payment/fail-payment", {
                replace: true,
                state: { data: "Not Paid" },
              });
            } else if (res.data.data.status === 1) {
              // check if items empty means that it is a wholesaler
              if (res.data.data.items.length === 0) {
                // update user wallet then navigate to success payment page
                const resUpdateUser = await axios.post(
                  `${API_URL}/api/user/update/${currentUser._id}`,
                  { balance: res.data.data.amount },
                  { withCredentials: true }
                );
                if (resUpdateUser.data.success) {
                  dispatch(updateUser(resUpdateUser.data.user));

                  toast.success("Success Payment!");
                  navigate("/payment/success-payment", {
                    replace: true,
                    state: { wholesaler: true },
                  });
                  window.location.reload();
                  return;
                } else {
                  toast.error("Error while updating wallet!");
                  navigate("/payment/fail-payment", { replace: true });
                }
              } else {
                let orderInfo = {};
                // save order to DB then send email to the user that contains buyed cards info + invoice
                await axios
                  .post(
                    `${API_URL}/api/user/get-cards-individuals`,
                    {
                      paid: true,
                      formData: {
                        name: res.data.data.payer.extraFields.name,
                        email: res.data.data.payer.email,
                      },
                      cardsArray: res.data.data.items,
                      totalAmount: res.data.data.amount,
                    },
                    { withCredentials: true }
                  )
                  .then((res) => {
                    orderInfo = res.data.order;
                  })
                  .catch((err) => {
                    console.log(err.response.data);
                  });

                toast.success("Order saved successfully!");
                navigate("/payment/success-payment", {
                  replace: true,
                  state: { status: "paid", orderInfo },
                });
              }
            }
          }
        })
        .catch(() => {
          toast.error("Error while getting order info!");
          navigate("/payment/fail-payment", { replace: true });
        });
    };

    getInvoiceInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen relative cursor-wait">
      <div className="opacity-10">
        <CatalogPage />
      </div>

      <div className="absolute w-full h-full inset-0 flex items-center justify-center bg-white bg-opacity-35">
        <div className="flex flex-col text-center">
          <Spin
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 80,
                  marginBottom: 50,
                  color: "#5956E9",
                }}
                spin
              />
            }
          />

          <p className="text-2xl font-semibold text-[#5956E9]">
            Processing your order...
          </p>

          <p className="mt-3 text-red-500 font-bold">
            {"Please don't leave the page! You can lose your order!"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProcessPayment;
