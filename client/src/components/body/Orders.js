import { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import classes from './Orders.module.css';
import Order from './Order';
import { getOrders } from '../../api/api';

const Orders = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([1, 2]);
  const cookie = new Cookies();
  const jwt = cookie.get('jwt');

  const ordersClasses = `${classes.orders} ${isLoading ? classes['bg-white'] : ''}`;
  useEffect(() => {
    const request = async () => {
      const res = await getOrders(jwt);
      if (res.status === 'success') {
        setOrders(res.data.orders);
        setIsLoading(false);
      }
    };
    request();
  }, [jwt]);

  return (
    <section className={ordersClasses}>
      {isLoading && orders.map((el) => <Skeleton key={el} variant="rectangular" width="40rem" height="40rem" />)}
      {!isLoading &&
        orders.map((el) => (
          <Order
            key={el._id}
            id={el._id}
            totalQuantity={el.totalQuantity}
            totalPrice={el.totalPrice}
            date={el.createdAt}
          />
        ))}
    </section>
  );
};

export default Orders;
