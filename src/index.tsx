import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { mergeStyles, PartialTheme, ThemeProvider } from "@fluentui/react";
import { BrowserRouter } from "react-router-dom";
import { initializeIcons } from "@fluentui/react/lib/Icons";

initializeIcons();
// Inject some global styles
mergeStyles({
  ":global(body,html,#root)": {
    margin: 0,
    padding: 0,
    height: "100vh",
  },
});

const appTheme: PartialTheme = {
  palette: {
    themePrimary: "#1e90ff",
    themeLighterAlt: "#01060a",
    themeLighter: "#051729",
    themeLight: "#092b4d",
    themeTertiary: "#125699",
    themeSecondary: "#1b7ee0",
    themeDarkAlt: "#359aff",
    themeDark: "#54aaff",
    themeDarker: "#81c0ff",
    neutralLighterAlt: "#1c1c1c",
    neutralLighter: "#252525",
    neutralLight: "#343434",
    neutralQuaternaryAlt: "#3d3d3d",
    neutralQuaternary: "#454545",
    neutralTertiaryAlt: "#656565",
    neutralTertiary: "#e5e5e5",
    neutralSecondary: "#eaeaea",
    neutralPrimaryAlt: "#eeeeee",
    neutralPrimary: "#d9d9d9",
    neutralDark: "#f6f6f6",
    black: "#fafafa",
    white: "#121212",
  },
};

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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={appTheme}>
      <BrowserRouter>
          <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
