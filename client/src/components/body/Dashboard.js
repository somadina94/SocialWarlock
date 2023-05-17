import { Outlet } from "react-router-dom";

import classes from "./Dashboard.module.css";
import UserNav from "./UserNav";

const Dashboard = () => {
  return (
    <section className={classes.dashboard}>
      <UserNav />
      <main>
        <Outlet />
      </main>
    </section>
  );
};

export default Dashboard;
