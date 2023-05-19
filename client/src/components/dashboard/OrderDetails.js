import Cookies from "universal-cookie";
import { useLoaderData } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";

import classes from "./OrderDetails.module.css";
import { getOneOrder } from "../../api/api";
import Product from "./Product";

const OrderDetails = () => {
  const res = useLoaderData();

  const order = res.data.order;

  const date = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  if (order.products.includes(null)) {
    return (
      <p className={classes.empty}>
        Your product list is empty, please contact customer support with your
        order number.
      </p>
    );
  }
  return (
    <div className={classes["order-details"]}>
      <div className={classes.details}>
        <span>Total quantity</span>
        <span>{order.totalQuantity}</span>
      </div>
      <div className={classes.details}>
        <span>Total price</span>
        <span>{order.totalPrice}</span>
      </div>
      <div className={classes.details}>
        <span>Date created</span>
        <span>{date}</span>
      </div>

      <div>
        <Accordion>
          {order.products.map((el) => (
            <Accordion.Item
              key={el._id}
              eventKey={order.products.indexOf(el)}
              style={{ backgroundColor: "transparent", color: "#fff" }}
            >
              <Accordion.Header>{el._id}</Accordion.Header>
              <Accordion.Body>
                <Product
                  username={el.username}
                  password={el.password}
                  recoveryEmail={el.recoveryEmail}
                  recoveryPassword={el.recoveryPassword}
                  platform={el.platform}
                  id={el._id}
                  cart={order.cart}
                />
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default OrderDetails;

export const loader = ({ params }) => {
  const cookie = new Cookies();
  const jwt = cookie.get("jwt");
  return getOneOrder(jwt, params.id);
};
