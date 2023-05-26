import classes from "./PayMethod.module.css";

import eth from "../../images/eth.png";
import btc from "../../images/btc.jpg";

const PayMethod = () => {
  return (
    <div className={classes.payment}>
      <h2>Payment methods</h2>
      <div className={classes["payment-method"]}>
        <div className={classes.method}>
          <img src={btc} alt="btc" />
        </div>
        <div className={classes.method}>
          <img src={eth} alt="eth" />
        </div>
      </div>
    </div>
  );
};

export default PayMethod;
