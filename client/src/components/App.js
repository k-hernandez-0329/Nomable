import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./Header"
import "../index.css";
import Footer from "./Footer";
import SearchBar from "./SearchBar";
import SignUp from "./SignUp";




function App() {
  useEffect(() => {
    document.title = "Nomable";
    return () => {
      document.title = "Default Tab Name";
    };
  }, []); 
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  return (
    <Router>
      <div>
        <Header />
        <SearchBar />
        <Switch>
          <Route path="/signup" component={SignUp} />
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
