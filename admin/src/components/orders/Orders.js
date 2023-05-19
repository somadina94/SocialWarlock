import Cookies from "universal-cookie";
import { useLoaderData } from "react-router-dom";

import classes from "./Orders.module.css";
import Order from "./Order";
import { getOrders } from "../../api/api";

const Orders = () => {
  const res = useLoaderData();
  const orders = res.data.orders;

  return (
    <section className={classes.orders}>
      {orders.map((el) => (
        <Order
          key={el._id}
          id={el._id}
          totalQuantity={el.totalQuantity}
          totalPrice={el.totalPrice}
          date={el.createdAt}
          status={el.status}
        />
      ))}
    </section>
  );
};

export default Orders;

export const loader = () => {
  const cookie = new Cookies();
  const jwt = cookie.get("jwt");
  return getOrders(jwt);
};
