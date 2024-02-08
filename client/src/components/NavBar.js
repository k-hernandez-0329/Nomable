
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "../index.css";
import Profile from "./Profile";

function Navbar() {
     const { user } = useContext(AuthContext);
  return (
    <nav>
      <div className="menu">
        <Link to="/">Home</Link>
        <Link to="/signup">Sign Up</Link>
        <Link to="/recipes">Recipes</Link>
        {user ? <Profile /> : <Link to="/login">Login</Link>}
      </div>
    </nav>
  );
}
export default Navbar;