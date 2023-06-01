import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import classes from './Platforms.module.css';
import { getPlatforms } from '../../api/api';
import Platform from './Platform';

const Platforms = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [platforms, setPlatforms] = useState([1, 2, 3]);

  useEffect(() => {
    const request = async () => {
      const res = await getPlatforms();
      if (res.status === 'success') {
        setIsLoading(false);
        setPlatforms(res.data.platforms);
      }
    };
    request();
  }, []);

  const platformsClasses = isLoading
    ? `${classes.platforms} ${classes['is-loading']}`
    : `${classes.platforms} ${classes.loaded}`;

  return (
    <section className={platformsClasses}>
      <Helmet>
        <title>Products</title>
        <meta
          name="description"
          content="Purchase reliable social media accounts for your marketing and other important purposes."
        />
        <link rel="canonical" href="/products" />
      </Helmet>
      {isLoading && platforms.map((el) => <Skeleton key={el} width="30rem" height="50rem" variant="rectangular" />)}
      {!isLoading &&
        platforms.map((data) => (
          <Platform key={data.id} name={data.name} price={data.price} id={data._id} status={data.status} />
        ))}
    </section>
  );
};

export default Platforms;
