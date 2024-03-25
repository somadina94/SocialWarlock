import { useSelector } from 'react-redux';
import { useSpring, animated } from 'react-spring';

import classes from './UserDetails.module.css';

const UserDetails = () => {
  const user = useSelector((state) => state.auth.user);
  const name = user.name;
  const email = user.email;
  const animation = useSpring({
    marginTop: 0,
    opacity: 1,
    from: { marginTop: -50, opacity: 0 },
    config: { tension: 1000, friction: 10, duration: 1000 },
  });
  return (
    <animated.div style={animation}>
      <div className={classes.info}>
        <div className={classes.details}>
          <span>Name</span>
          <span>{name}</span>
        </div>
        <div className={classes.details}>
          <span>Email</span>
          <span>{email}</span>
        </div>
      </div>
    </animated.div>
  );
};

export default UserDetails;
