import { BsFillCSquareFill } from "react-icons/bs";

import classes from "./Footer.module.css";
import PayMethod from "./PayMethod";

const Footer = () => {
  const date = new Date(Date.now()).toLocaleDateString("en-US", {
    year: "numeric",
  });
  return (
    <footer className={classes.footer}>
      <PayMethod />
      <p>
        <BsFillCSquareFill className={classes.icon} />
        <span>{date}</span>
        <span>Copyright All Rights Reserved Social Warlock Inc.</span>
      </p>
    </footer>
  );
};

export default Footer;
