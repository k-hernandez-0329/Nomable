import React from "react";
import ReactDOM  from "react-dom";
import App from "./components/App";
import "./index.css";
import { AuthProvider } from "./components/AuthContext";
// import { createRoot } from "react-dom/client";

// const container = document.getElementById("root");


ReactDOM.render(
  // Use ReactDOM.render to render your App component
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);





// const root = createRoot(container);
// root.render(<App />);
