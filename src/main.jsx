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
import LoaderProvider from "./components/context/LoaderContext";

// NOTE: The global MUI <ThemeProvider> was removed from here on purpose.
// Its only job was setting the font family on MUI components, which is now
// handled by a plain CSS rule in index.css. Keeping the provider here forced
// the entire 136KB MUI styling engine onto the homepage's critical path even
// though the landing page renders zero MUI components (only ~7 lazy routes do).
// Those routes pull MUI in their own lazy chunks when they load.

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="5404414440-02ttfd1mvhk62e5bubrkcipdjhdrrabv.apps.googleusercontent.com">
      <LoaderProvider>
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </LoaderProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
