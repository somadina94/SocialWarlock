import { Fragment } from "react";
import { useSelector } from "react-redux";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Transition } from "react-transition-group";

import UserLayout from "./components/pages/UserLayout";
import AlertModal from "./components/UI/AlertModal";
import Login from "./components/auth/Login";
import ErrorModal from "./components/UI/ErrorModal";
import Carousels from "./components/UI/Carousel";
import Accounts from "./components/body/Accounts";
import Platforms from "./components/body/Platforms";
import UpdatePlatform from "./components/actions/UpdatePlatform";
import Orders from "./components/orders/Orders";
import OrderDetails from "./components/orders/OrderDetails";
import CreateProduct from "./components/actions/CreateProduct";
import Products from "./components/body/Products";
import CreatePlatform from "./components/actions/CreatePlatform";
import CarouselMobile from "./components/UI/CarouselMobile";

import { loader as usersLoader } from "./components/body/Accounts";
import { loader as platformsLoader } from "./components/body/Platforms";
import { loader as platformLoader } from "./components/actions/UpdatePlatform";
import { loader as ordersLoader } from "./components/orders/Orders";
import { loader as orderLoader } from "./components/orders/OrderDetails";
import { loader as createProductLoader } from "./components/actions/CreateProduct";
import { loader as productsLoader } from "./components/body/Products";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<UserLayout />} errorElement={<ErrorModal />}>
      <Route index element={<Login />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/accounts" element={<Accounts />} loader={usersLoader} />
      <Route path="/create-platform" element={<CreatePlatform />} />
      <Route
        path="/platforms"
        element={<Platforms />}
        loader={platformsLoader}
      />
      <Route
        path="/platforms/:id"
        element={<UpdatePlatform />}
        loader={platformLoader}
      />
      <Route path="/orders" element={<Orders />} loader={ordersLoader} />
      <Route
        path="/orders/:id"
        element={<OrderDetails />}
        loader={orderLoader}
      />
      <Route
        path="/platforms/:id/create"
        element={<CreateProduct />}
        loader={createProductLoader}
      />
      <Route path="/products" element={<Products />} loader={productsLoader} />
    </Route>
  )
);

function App() {
  const showModal = useSelector((state) => state.alert.showModal);
  return (
    <Fragment>
      <Transition mountOnEnter unmountOnExit in={showModal} timeout={1000}>
        {(state) => <AlertModal />}
      </Transition>
      <Carousels />
      <CarouselMobile />
      <RouterProvider router={router} />
    </Fragment>
  );
}

export default App;
