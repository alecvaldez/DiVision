import { mergeStyles, PartialTheme, ThemeProvider } from "@fluentui/react";
import { initializeIcons } from "@fluentui/react/lib/Icons";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import {
  getAuth
} from "firebase/auth";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { getDatabase } from "firebase/database";
import { generateTheme } from "./components/theme-designer/ThemeDesigner";

initializeIcons();

mergeStyles({
  ":global(body,html,#root)": {
    margin: 0,
    padding: 0,
    height: "100vh",
  },
});


const firebaseConfig = {
  apiKey: "AIzaSyCngDQpA2XIehOHzgtIUF8YbNQrJbAHCbU",
  authDomain: "division-91b2e.firebaseapp.com",
  projectId: "division-91b2e",
  storageBucket: "division-91b2e.appspot.com",
  messagingSenderId: "650721899687",
  appId: "1:650721899687:web:12d97613bc9373df49d782",
  measurementId: "G-SPDFXT0MWY",
};

// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
      <BrowserRouter>
        <App auth={auth} />
      </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
