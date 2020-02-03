import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <section class='landing'>
      <div class='dark-overlay'>
        <div class='landing-inner'>
          <h1 class='x-large'>BarBack</h1>
          <p class='lead'>
            Welcome to BarBack, your bar management assistant. Keep track of
            your product costs. Workshop menus. Discover drink costs so you can
            price your drinks properly.
          </p>
          <div class='buttons'>
            <Link to='/register' class='btn btn-primary'>
              Sign Up
            </Link>
            <Link to='/login' class='btn btn'>
              Log In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
