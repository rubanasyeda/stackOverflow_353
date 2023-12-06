// Layout.js
import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";

const Layout = ({ children, location, logout, user }) => {
//   const location = useLocation();
//   const {logout} = useAuth();

  // Check if the current page is LoginSignup
  // const isLoginSignupPage = location.pathname === "/";

  return (

    <>
      <main>
        <Outlet/>
      </main>
      {/* Fixed navigation bar (conditionally rendered) */}
      {/* {!isLoginSignupPage && ( */}

    </>
  );
};

export default Layout;
