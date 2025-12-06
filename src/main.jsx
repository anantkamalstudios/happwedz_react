import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import LoaderProvider from "./components/context/LoaderContext";
import { ThemeProvider } from "@mui/material/styles";
import muiTheme from "./theme/muiTheme";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={muiTheme}>
      <GoogleOAuthProvider clientId="5404414440-cpfrtjjfh6maga878im03li5lmpqga30.apps.googleusercontent.com">
        <LoaderProvider>
          <Provider store={store}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </Provider>
        </LoaderProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  </StrictMode>
);
