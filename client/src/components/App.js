import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import Header from "./Header"
import "../index.css";



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
   
    </div>
  );
}

export default App;
