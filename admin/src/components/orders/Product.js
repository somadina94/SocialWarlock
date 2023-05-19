import { useState, useMemo } from "react";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillLinkedin,
} from "react-icons/ai";
import classes from "./Product.module.css";

const Product = (props) => {
  const [platformName, setPlatformName] = useState("");
  const [icon, setIcon] = useState(null);

  const {
    id,
    cart,
    username,
    password,
    recoveryEmail,
    recoveryPassword,
    platform,
  } = props;

  useMemo(() => {
    cart.map((el) => {
      if (el.id === platform) {
        setPlatformName(el.name);
        if (el.name === "Facebook")
          setIcon(<AiFillFacebook className={classes.icon} />);
        if (el.name === "Instagram")
          setIcon(<AiFillInstagram className={classes.icon} />);
        if (el.name === "LinkedIn")
          setIcon(<AiFillLinkedin className={classes.icon} />);
      }

      return "";
    });
  }, [cart, platform]);

  return (
    <div className={classes.product}>
      <div className={classes.detail}>
        <span>{platformName}</span>
        {icon}
      </div>
      <div className={classes.detail}>
        <span>Product number</span>
        <span>{id}</span>
      </div>
      <div className={classes.detail}>
        <span>username</span>
        <span>{username}</span>
      </div>
      <div className={classes.detail}>
        <span>Password</span>
        <span>{password}</span>
      </div>
      <div className={classes.detail}>
        <span>User email's revovery email</span>
        <span>{recoveryEmail}</span>
      </div>
      <div className={classes.detail}>
        <span>User email's revovery password</span>
        <span>{recoveryPassword}</span>
      </div>
    </div>
  );
};

export default Product;
