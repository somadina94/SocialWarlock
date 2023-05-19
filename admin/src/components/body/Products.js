import Cookies from "universal-cookie";
import { useLoaderData } from "react-router-dom";

import classes from "./Products.module.css";
import { getProducts } from "../../api/api";
import Product from "./Product";

const Products = () => {
  const res = useLoaderData();
  const products = res.data.products;
  return (
    <section className={classes.products}>
      {products.map((el) => (
        <Product
          key={el._id}
          id={el._id}
          name={el.name}
          username={el.username}
          password={el.password}
          recoveryEmail={el.recoveryEmail}
          recoveryPassword={el.recoveryPassword}
          date={el.createdAt}
          active={el.active}
          status={el.status}
        />
      ))}
    </section>
  );
};

export default Products;

export const loader = () => {
  const cookies = new Cookies();
  const jwt = cookies.get("jwt");
  return getProducts(jwt);
};
