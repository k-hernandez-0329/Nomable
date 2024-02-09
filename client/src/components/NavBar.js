import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "../index.css";
import donut from "../donut.png";
import fried_egg from "../fried-egg.png";
import gummy_bear from "../gummy-bear.png";
import taco from "../taco.png";


function Navbar() {
  const { user, onLogout } = useContext(AuthContext);

  function handleLogout() {
    console.log("Logging out...");
    fetch("/logout", {
      method: "DELETE",
    })
      .then(() => {
        console.log("Logout successful.");
        onLogout();
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  }
  const renderAvatar = () => {
    switch (user.avatar) {
      case "donut.png":
        return <img src={donut} alt="Donut Avatar" className="avatar-option" />;
      case "fried-egg.png":
        return (
          <img
            src={fried_egg}
            alt="Fried Egg Avatar"
            className="avatar-option"
          />
        );
      case "gummy-bear.png":
        return (
          <img
            src={gummy_bear}
            alt="Gummy Bear Avatar"
            className="avatar-option"
          />
        );
      case "taco.png":
        return <img src={taco} alt="Taco Avatar" className="avatar-option" />;
      default:
        return <div className="avatar-placeholder">Avatar Not Found</div>;
    }
  };

  return (
    <nav>
      <div className="menu">
        <div className="user-info">
          {user ? (
            <>
              <p>Welcome, {user.username}!</p>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
              <Link to="/">Home</Link>
              <Link to="/recipes">Recipes</Link>
              <Link to="/profile">{renderAvatar()}</Link>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
