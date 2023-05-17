import { useDispatch } from "react-redux";

import classes from "./CartItems.module.css";
import { cartActions } from "../../store/cart-slice";

const CartItems = (props) => {
  const dispatch = useDispatch();
  const summedPrice = `$${props.summedPrice.toFixed(2)}`;
  const quantity = `x${props.quantity}`;

  const addProdToCartHandler = () => {
    dispatch(
      cartActions.add({ id: props.id, quantity: 1, price: props.price })
    );
  };

  const removeProdFromCartHandler = () => {
    dispatch(cartActions.remove(props.id));
  };
  return (
    <li className={classes.item}>
      <div className={classes.details}>
        <div className={classes.namePrice}>
          <h2>{props.name}</h2>
          <span>{summedPrice}</span>
        </div>
        <span className={classes.quantity}>{quantity}</span>
      </div>
      <div className={classes.actions}>
        <button className={classes.remove} onClick={removeProdFromCartHandler}>
          -
        </button>
        <button className={classes.add} onClick={addProdToCartHandler}>
          +
        </button>
      </div>
    </li>
  );
};

export default CartItems;
