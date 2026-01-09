import { Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import { AiOutlineWhatsApp } from 'react-icons/ai';
import ReactWhatsapp from 'react-whatsapp';

import classes from '../UI/General.module.css';
import Header from '../main/Header';
import Footer from '../main/Footer';

const UserLayout = () => {
  return (
    <Fragment>
      <Header />
      <main>
        <Outlet />
      </main>
      <ReactWhatsapp number="+2349136858289" className={classes.whatsapp}>
        <AiOutlineWhatsApp className={classes['whatsapp-icon']} />
      </ReactWhatsapp>
      <Footer />
    </Fragment>
  );
};

export default UserLayout;
