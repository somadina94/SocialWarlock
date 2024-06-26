import { Fragment, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
// import { useNavigate } from "react-router-dom";

import classes from './Cart.module.css';
import styles from '../UI/General.module.css';
import Backdrop from '../UI/Backdrop';
import { cartActions } from '../../store/cart-slice';
import CartItems from './CartItems';
import { createCheckout } from '../../api/api';
import Spinner from '../UI/Spinner';
import { alertActions } from '../../store/alert-slice';

const CartModal = () => {
  const dispatch = useDispatch();
  const [showSpinner, setShowSpinner] = useState(false);
  const cart = useSelector((state) => state.cart.cart);
  const [showOrderBtn, setShowOrderBtn] = useState(false);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const cartVisibility = useSelector((state) => state.cart.cartVisibility);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { jwt } = useCookies(['jwt'])[0];
  // const navigate = useNavigate();

  const totalAmount = `$${totalPrice.toFixed(2)}`;
  const cartContentLength = cart.length;

  useEffect(() => {
    if (cartContentLength > 0) {
      setShowOrderBtn(true);
    }
  }, [cartContentLength]);

  const hideCartHandler = () => {
    dispatch(cartActions.hideCart());
  };

  const proceedHandler = async () => {
    setShowSpinner(true);
    const data = {
      totalPrice,
      totalQuantity,
      cart,
    };
    const res = await createCheckout(jwt, data);

    if (res.status === 'success') {
      const url = res.data.charge.hosted_url;
      window.location.href = url;
    } else {
      dispatch(alertActions.setState({ message: res.message, status: 'error' }));
    }

    dispatch(cartActions.clearCart());
    dispatch(cartActions.hideCart());
  };

  const cartClasses = cartVisibility ? `${classes.cart} ${styles.add}` : `${classes.cart} ${styles.remove}`;

  return (
    <div className={cartClasses}>
      {!showOrderBtn && <p className={classes.empty}>Your cart is empty. Please go ahead and add items to cart.</p>}
      {showSpinner && <Spinner />}
      <ul>
        {cart.map((prod) => (
          <CartItems
            key={prod.id}
            name={prod.name}
            summedPrice={prod.summedPrice}
            quantity={prod.quantity}
            id={prod.id}
            price={prod.price}
          />
        ))}
      </ul>
      {showOrderBtn && (
        <div className={classes.total}>
          <span>Total amount</span>
          <span>{totalAmount}</span>
        </div>
      )}
      <div className={classes.actions}>
        <button onClick={hideCartHandler}>Close cart</button>
        {showOrderBtn && isLoggedIn && (
          <button type="button" onClick={proceedHandler}>
            Proceed to payment
          </button>
        )}
        {!isLoggedIn && <p className={classes.warning}>Please login to pay</p>}
      </div>
    </div>
  );
};

const Cart = () => {
  const backdropEl = document.getElementById('backdrop-root');
  const overlayEl = document.getElementById('overlay-root');

  return (
    <Fragment>
      {ReactDOM.createPortal(<Backdrop />, backdropEl)}
      {ReactDOM.createPortal(<CartModal />, overlayEl)}
    </Fragment>
  );
};

export default Cart;
