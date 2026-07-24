import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import LoaderProvider from "./components/context/LoaderContext";

// NOTE: The global MUI <ThemeProvider> was removed (font-only theme, now a CSS
// rule in index.css). The global <GoogleOAuthProvider> was also removed: it
// loaded Google's GSI script on every page, setting Google third-party cookies
// that fail the Best Practices audit. It now wraps only the two login components
// that need it (see GoogleAuthProvider.jsx).

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LoaderProvider>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </LoaderProvider>
  </StrictMode>
);
