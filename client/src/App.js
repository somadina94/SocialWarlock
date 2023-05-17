import { Fragment, useRef } from "react";
import { useSelector } from "react-redux";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Transition } from "react-transition-group";
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";

import UserLayout from "./components/pages/UserLayout";
import AlertModal from "./components/UI/AlertModal";
import Login from "./components/auth/Login";
import Create from "./components/auth/Create";
import Platforms from "./components/body/Platforms";
import Cart from "./components/cart/Cart";
import Payment from "./components/auth/Payment";
import UserDetails from "./components/body/UserDetails";
import Carousels from "./components/UI/Carousel";
import Orders from "./components/body/Orders";
import Dashboard from "./components/body/Dashboard";
import OrderDetails from "./components/dashboard/OrderDetails";
import Password from "./components/dashboard/Password";
import ContactUs from "./components/body/ContactUs";
import ErrorModal from "./components/UI/ErrorModal";

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
    </Route>
  )
);

function App() {
  const showModal = useSelector((state) => state.alert.showModal);
  // const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const cartVisibility = useSelector((state) => state.cart.cartVisibility);
  const showPayment = useSelector((state) => state.cart.showPayment);
  const tawkMessengerRef = useRef();

  return (
    <Fragment>
      {showModal && <AlertModal />}
      <Transition mountOnEnter unmountOnExit in={cartVisibility} timeout={1000}>
        {(state) => <Cart />}
      </Transition>
      <Transition mountOnEnter unmountOnExit in={showPayment} timeout={1000}>
        {(state) => <Payment />}
      </Transition>
      <Carousels />
      <TawkMessengerReact
        propertyId="643012464247f20fefea5d26"
        widgetId="1gtdseqgd"
        ref={tawkMessengerRef}
      />
      <RouterProvider router={router} />
    </Fragment>
  );
}

export default App;
