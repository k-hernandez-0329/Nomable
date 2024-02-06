import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import Header from "./Header"
import "../index.css";
import Footer from "./Footer";



function App() {
  useEffect(() => {
    document.title = "Nomable";
    return () => {
      document.title = "Default Tab Name";
    };
  }, []); 
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  return (
    <div>
      <Header />
    
     


    <Footer/>
    </div>
  );
}

export default App;
