import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, useHistory } from "react-router-dom";
import Header from "./Header"
import "../index.css";
import RecipeList from "./RecipeList"
import Footer from "./Footer";
import SearchBar from "./SearchBar";
import SignUp from "./SignUp";
import Login from "./Login";
import Home from "./Home";
import Navbar from "./NavBar";
import Profile from "./Profile";




function App() {
  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    document.title = "Nomable";
    return () => {
      document.title = "Default Tab Name";
    };
  }, []);

  
  //  useEffect(() => {
    
  //    fetch("/check_session")
  //      .then((response) => {
  //        if (response.ok) {
  //          return response.json();
  //        } else {
  //          throw new Error("Session check failed");
  //        }
  //      })
  //      .then((userData) => setUser(userData))
  //      .catch((error) => console.error("Session check error:", error));
  //  }, []);

  function handleLogin(user) {
    setUser(user);
  }

  function handleLogout() {
    setUser(null);
    history.push("/");
  }

  return (
    <Router>
      <div>
        <Header user={user} />
        {user && <Navbar user={user} />}
        <SearchBar />
        <Switch>
          <Route path="/recipes" component={RecipeList} />
          <Route path="/profile" component={Profile} onLogout={handleLogout} />
          <Route path="/signup" component={SignUp} />
          <Route path="/login">
            <Login onLogin={handleLogin} />
          </Route>
          <Route
            exact
            path="/"
            render={() => <Home isAuthenticated={user !== null} />}
          />
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;