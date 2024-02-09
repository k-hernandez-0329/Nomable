import React from "react";
import logo from "../nomable_logo.png";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/">
          <img src={logo} alt="Nomable" className="logo" />
        </Link>
      </div>
    </header>
  );
};

export default Header;
