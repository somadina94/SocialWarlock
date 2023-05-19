import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillLinkedin,
} from "react-icons/ai";
import { BsForwardFill } from "react-icons/bs";
import { Link } from "react-router-dom";

import classes from "./Platform.module.css";
import { getOnePlatform } from "../../api/api";

const Platform = (props) => {
  const { name, id, price, status } = props;

  const Icon =
    name === "Facebook"
      ? AiFillFacebook
      : name === "Instagram"
      ? AiFillInstagram
      : AiFillLinkedin;

  const displayStatus = status ? "In-stock" : "Out of stock";

  return (
    <div className={classes.platform}>
      <div className={classes["logo-container"]}>
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
        <span className={`${status ? classes.available : classes.unavailable}`}>
          {displayStatus}
        </span>
      </div>
      <div className={classes.action}>
        <Link to={`/platforms/${id}`}>Update</Link>
        <Link to={`/platforms/${id}/create`}>Create</Link>
      </div>
    </div>
  );
};

export default Platform;

export const loader = ({ params }) => {
  return getOnePlatform(params.id);
};
