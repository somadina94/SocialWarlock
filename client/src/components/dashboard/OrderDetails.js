import Cookies from "universal-cookie";
import { useLoaderData } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";

import classes from "./OrderDetails.module.css";
import { getOneOrder } from "../../api/api";
import Product from "./Product";

const OrderDetails = () => {
  const res = useLoaderData();

  const order = res.data.order;
  return (
    <div className={classes.details}>
      <div className={classes.details}>
        <span></span>
        <span></span>
      </div>
      <div className={classes.details}>
        <span></span>
        <span></span>
      </div>
      <div className={classes.details}>
        <span></span>
        <span></span>
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
