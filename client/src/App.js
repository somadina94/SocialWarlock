import { Fragment, useRef } from "react";
import { useSelector } from "react-redux";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Transition } from "react-transition-group";
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";

import UserLayout from "./components/pages/UserLayout";
import AlertModal from "./components/UI/AlertModal";
import Login from "./components/auth/Login";
import Create from "./components/auth/Create";
import Platforms from "./components/body/Platforms";
import Cart from "./components/cart/Cart";
import UserDetails from "./components/body/UserDetails";
import Carousels from "./components/UI/Carousel";
import Orders from "./components/body/Orders";
import Dashboard from "./components/body/Dashboard";
import OrderDetails from "./components/dashboard/OrderDetails";
import Password from "./components/dashboard/Password";
import ContactUs from "./components/body/ContactUs";
import ErrorModal from "./components/UI/ErrorModal";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import CarouselMobile from "./components/UI/CarouselMobile";

import { loader as productsLoader } from "./components/body/Platforms";
import { loader as ordersLoader } from "./components/body/Orders";
import { loader as orderDetailsLoader } from "./components/dashboard/OrderDetails";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<UserLayout />} errorElement={<ErrorModal />}>
      <Route index element={<Platforms />} loader={productsLoader} />
      <Route path="/Login" element={<Login />} />
      <Route path="/create-account" element={<Create />} />
      <Route path="/products" element={<Platforms />} loader={productsLoader} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/resetPassword/:token" element={<ResetPassword />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<UserDetails />} />
        <Route path="/dashboard/account-info" element={<UserDetails />} />
        <Route
          path="/dashboard/orders"
          element={<Orders />}
          loader={ordersLoader}
        />
        <Route
          path="orders/:id"
          element={<OrderDetails />}
          loader={orderDetailsLoader}
        />
        <Route path="updatePassword" element={<Password />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Route>
  )
);

function App() {
  const showModal = useSelector((state) => state.alert.showModal);
  const cartVisibility = useSelector((state) => state.cart.cartVisibility);
  const tawkMessengerRef = useRef();

  return (
    <Fragment>
      {showModal && <AlertModal />}
      <Transition mountOnEnter unmountOnExit in={cartVisibility} timeout={1000}>
        {(state) => <Cart />}
      </Transition>
      <Carousels />
      <CarouselMobile />
      <TawkMessengerReact
        propertyId="64704413ad80445890ef3152"
        widgetId="default"
        ref={tawkMessengerRef}
      />
      <RouterProvider router={router} />
    </Fragment>
  );
}

export default App;
