import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./Header"
import "../index.css";
import RecipeList from "./RecipeList"
import Footer from "./Footer";
import SearchBar from "./SearchBar";
import SignUp from "./SignUp";
import Login from "./Login";
import Home from "./Home";




function App() {
   const [user, setUser] = useState(null);
   const [recipes, setRecipes] = useState([]);
   useEffect(() => {
    document.title = "Nomable";
    return () => {
      document.title = "Default Tab Name";
    };
   }, []); 
  
   useEffect(() => {
      fetch("/recipes")
        .then((res) => res.json())
        .then((data) => {
          setRecipes(data);
         })
     }, []);
  



  

    // useEffect(() => {
    //   fetch("/check_session").then((response) => {
    //     if (response.ok) {
    //       response.json().then((user) => setUser(user));
    //     }
    //   });
    // }, []);
  
  
   function handleLogin(user) {
     setUser(user);
   }

    function handleLogout() {
      setUser(null);
    }
  
   
  
  
  
  
  
  
  
  
  
  
  
  return (
    <Router>
      <div>
        <Header user={user} onLogout={handleLogout} />
        <SearchBar />
        <Switch>
          <Route path="/recipes"><RecipeList/></Route>
          <Route path="/signup" component={SignUp} />
          <Route path="/login" component={Login}>
            <Login onLogin={handleLogin} />
          </Route>
          <Route path="/" component={Home} />
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
