import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import PageNotFound from "./Components/PageNotFound";
import Loader from "./Components/Loader";
import Pages from "./Pages/Pages";
import SignIn from "./Pages/sign-in-up/SignIn";
import SignUp from "./Pages/sign-in-up/SignUp";
import MyAccount from "./Pages/MyAccount";
import PrivateRoutes from "./PrivateRoutes";
import PersonalInfo from "./Pages/userPages/PersonalInfo";
import Wallet from "./Pages/userPages/Wallet";
import Orders from "./Pages/userPages/Orders";
import AdminRoutes from "./AdminRoutes";
import HomeAdmin from "./Pages/adminPages/Home";
import AllUsers from "./Pages/adminPages/AllUsers";
import Cards from "./Pages/adminPages/Cards";
import CatalogPage from "./Pages/CatalogPage";
import CheckOut from "./Components/CheckOut";
import { Toaster } from "react-hot-toast";
import WholeSale from "./Components/WholeSale";
import SignInVerify from "./Pages/sign-in-up/SignInVerify";
import SignInAdmin from "./Pages/adminPages/SignInAdmin";
import { useSelector } from "react-redux";
import CheckOutWholesalers from "./Pages/userPages/CheckOutWholesalers";
import IndividualOrders from "./Pages/adminPages/IndividualOrders";
import WholesalerOrders from "./Pages/adminPages/WholesalerOrders";
import SuccessPayment from "./Pages/payment/SuccessPayment";
import FailPayment from "./Pages/payment/FailPayment";
import ProcessPayment from "./Pages/payment/ProcessPayment";
import NavigateScrollTop from "./Components/NavigateScrollTop";

function App() {
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector((state) => state.currentUser.user);

  useEffect(() => {
    const fechFakeData = () => {
      setTimeout(() => {
        setLoading(false);
      }, 1200);
    };
    fechFakeData();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-[#ecf5fe] font-body overflow-x-clip">
          <Toaster position="top-right" reverseOrder={false} />
          <BrowserRouter>
            <NavigateScrollTop />
            <Routes>
              <Route
                path="/payment/process-payment"
                element={<ProcessPayment />}
              />

              <Route element={<Pages />}>
                <Route path="/" element={<Home />} />
                <Route
                  path="/Cart"
                  element={currentUser ? <CheckOutWholesalers /> : <CheckOut />}
                />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/wholesale" element={<WholeSale />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-in/verify" element={<SignInVerify />} />

                <Route
                  path="/payment/success-payment"
                  element={<SuccessPayment />}
                />
                <Route path="/payment/fail-payment" element={<FailPayment />} />
                {/* <Route path="/sign-up" element={<SignUp />} /> */}

                <Route
                  path="/sign-up/admin/moula_el_bach"
                  element={<SignUp />}
                />
                <Route
                  path="/sign-in/admin/moula_el_bach"
                  element={<SignInAdmin />}
                />

                <Route element={<PrivateRoutes />}>
                  <Route path="/My-Account" element={<MyAccount />}>
                    <Route path="Profile" element={<PersonalInfo />} />
                    <Route path="Wallet" element={<Wallet />} />
                    <Route path="Orders" element={<Orders />} />
                  </Route>
                </Route>
              </Route>

              <Route element={<AdminRoutes />}>
                <Route path="admin/dashboard" element={<HomeAdmin />}>
                  <Route
                    path="all-users"
                    element={<AllUsers admins={false} />}
                  />
                  <Route
                    path="all-admins"
                    element={<AllUsers admins={true} />}
                  />
                  <Route path="catalog" />
                  <Route path="cards" element={<Cards />} />
                  {/* <Route path="Profile" element={<PersonalInfoAdmin />} /> */}
                  <Route path="Orders" element={<IndividualOrders />} />
                  <Route
                    path="Wholesaler-Orders"
                    element={<WholesalerOrders />}
                  />
                </Route>
              </Route>

              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      )}
    </>
  );
}

export default App;
