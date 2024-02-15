import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "../index.css";
import donut from "../donut.png";
import fried_egg from "../fried-egg.png";
import gummy_bear from "../gummy-bear.png";
import taco from "../taco.png";


function Navbar() {
  const { user } = useContext(AuthContext);


  const renderAvatar = () => {
    switch (user.avatar) {
      case donut:
        return <img src={donut} alt="Donut Avatar" className="avatar-option" />;
      case fried_egg:
        return (
          <img
            src={fried_egg}
            alt="Fried Egg Avatar"
            className="avatar-option"
          />
        );
      case gummy_bear:
        return (
          <img
            src={gummy_bear}
            alt="Gummy Bear Avatar"
            className="avatar-option"
          />
        );
      case taco:
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
              <Link to="/journal-entry">Show Us!</Link>
              <Link to="/new-recipe">Create Your Own Recipe</Link>
              <Link to="/profile">{renderAvatar()}</Link>
            </>
          ) : (
            <>
              <Link to="/">Home</Link>
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
