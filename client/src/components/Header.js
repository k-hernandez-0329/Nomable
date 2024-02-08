import React from "react";
import logo from"../nomable_logo.png";
import { Link } from "react-router-dom";

const Header = ({user, onLogout}) => {

function handleLogout() {
  fetch("/logout", {
    method: "DELETE",
  }).then(() => onLogout());
}



  return (
    <header className="header">
      <div className="header-content">
        <Link to="/">
          <img src={logo} alt="Nomable" className="logo" />
        </Link>
        {user ? (
          <div>
            <p>Welcome, {user.username}!</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <Link to="/login" className="login-link">
            Click Here to Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;