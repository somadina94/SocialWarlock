import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import { CookiesProvider } from "react-cookie";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./store";
import store from "./store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <CookiesProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </CookiesProvider>
);
