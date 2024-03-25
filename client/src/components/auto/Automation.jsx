import { Link, Outlet } from 'react-router-dom';
import classes from './Automation.module.css';

const Automation = () => {
  return (
    <section className={classes.auto}>
      <div className={classes.nav}>
        <Link to="/automation/view-fb-accounts">View accounts</Link>
        <Link to="/automation/create-fb-account">Create Facebook account</Link>
        <Link to="/automation/update-fb-cookies">Update account cookies</Link>
        <Link to="/automation/update-fb-messages">Update account messages</Link>
      </div>
      <main>
        <Outlet />
      </main>
    </section>
  );
};

export default Automation;
