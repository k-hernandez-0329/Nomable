
import React from "react";
import { Link } from "react-router-dom";
import "../index.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src="logo.png" alt="Logo" />
        </Link>
      </div>
      <div className="menu">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
        <Link to="/recipes">Recipes</Link>
      </div>
      {/* <div className="profile">
        <Link to="/profile">
          <img src="profile.png" alt="Profile" />
        </Link>
      </div> */}
    </nav>
  );
}

export default Navbar;