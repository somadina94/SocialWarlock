import { useLoaderData } from "react-router-dom";

import classes from "./Platforms.module.css";
import { getPlatforms } from "../../api/api";
import Platform from "./Platform";

const Platforms = () => {
  const res = useLoaderData();
  const platforms = res.data.platforms;

  return (
    <section className={classes.platforms}>
      {platforms.map((data) => (
        <Platform
          key={data.id}
          name={data.name}
          price={data.price}
          id={data._id}
          status={data.status}
        />
      ))}
    </section>
  );
};

export default Platforms;

export const loader = () => {
  return getPlatforms();
};
