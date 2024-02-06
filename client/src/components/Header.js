import React from "react";
import logo from"../nomable_logo.png";

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <img src={logo} alt="Nomable" className="logo" />
      </div>
    </header>
  );
};

export default Header;