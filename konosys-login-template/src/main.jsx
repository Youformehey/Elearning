import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext"; // ✅ import ici

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider> {/* ✅ applique darkMode ici */}
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
