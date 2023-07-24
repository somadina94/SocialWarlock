import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AiFillFacebook, AiFillInstagram, AiFillLinkedin } from 'react-icons/ai';
import { BsFillCartPlusFill, BsForwardFill } from 'react-icons/bs';

import classes from './Platform.module.css';
import { getOnePlatform } from '../../api/api';
import { cartActions } from '../../store/cart-slice';
import { getProductCount } from '../../api/api';

const Platform = (props) => {
  const [status, setStatus] = useState(false);
  const dispatch = useDispatch();
  const { name, id, price } = props;

  useEffect(() => {
    const request = async () => {
      const res = await getProductCount(name);

      if (res.status === 'success' && res.data.productCount > 2) {
        setStatus(true);
      }
    };
    request();
  }, [name]);

  const Icon = name === 'Facebook' ? AiFillFacebook : name === 'Instagram' ? AiFillInstagram : AiFillLinkedin;

  const addProdToCartHandler = () => {
    dispatch(
      cartActions.add({
        name: props.name,
        id,
        price,
        quantity: 1,
      })
    );
  };
  const displayStatus = status ? 'In-stock' : 'Out of stock';

  return (
    <div className={classes.platform}>
      <div className={classes['logo-container']}>
        <Icon className={classes.icon} />
      </div>
      <div className={classes.name}>
        <span>{name}</span>
      </div>
      <div className={classes.details}>
        <span>Price</span>
        <BsForwardFill className={classes.arrow} />
        <span>${price}</span>
      </div>
      <div className={classes.details}>
        <span>status</span>
        <BsForwardFill className={classes.arrow} />
        <span className={`${status ? classes.available : classes.unavailable}`}>{displayStatus}</span>
      </div>
      <div className={classes['cart-action']}>
        <button onClick={addProdToCartHandler} disabled={!status}>
          {' '}
          <p>Add to Cart</p>
          <BsFillCartPlusFill className={classes.add} />
        </button>
      </div>
      <p className={classes.note}>NB: No refund after successful login</p>
    </div>
  );
};

export default Platform;

export const loader = ({ params }) => {
  return getOnePlatform(params.id);
};
