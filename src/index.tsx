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

initializeIcons();

mergeStyles({
  ":global(body,html,#root)": {
    margin: 0,
    padding: 0,
    height: "100vh",
  },
});

const appTheme: PartialTheme = {
  palette: {
    themePrimary: '#ff0000',
    themeLighterAlt: '#0a0000',
    themeLighter: '#290000',
    themeLight: '#4d0000',
    themeTertiary: '#990000',
    themeSecondary: '#e00000',
    themeDarkAlt: '#ff1919',
    themeDark: '#ff3d3d',
    themeDarker: '#ff7070',
    neutralLighterAlt: '#1c1c1c',
    neutralLighter: '#252525',
    neutralLight: '#343434',
    neutralQuaternaryAlt: '#3d3d3d',
    neutralQuaternary: '#454545',
    neutralTertiaryAlt: '#656565',
    neutralTertiary: '#e5e5e5',
    neutralSecondary: '#eaeaea',
    neutralSecondaryAlt: '#eaeaea',
    neutralPrimaryAlt: '#eeeeee',
    neutralPrimary: '#d9d9d9',
    neutralDark: '#f6f6f6',
    black: '#fafafa',
    white: '#121212',
  }};
// const appTheme: PartialTheme = {
//   palette: {
//     themePrimary: "#1e90ff",
//     themeLighterAlt: "#01060a",
//     themeLighter: "#051729",
//     themeLight: "#092b4d",
//     themeTertiary: "#125699",
//     themeSecondary: "#1b7ee0",
//     themeDarkAlt: "#359aff",
//     themeDark: "#54aaff",
//     themeDarker: "#81c0ff",
//     neutralLighterAlt: "#1c1c1c",
//     neutralLighter: "#252525",
//     neutralLight: "#343434",
//     neutralQuaternaryAlt: "#3d3d3d",
//     neutralQuaternary: "#454545",
//     neutralTertiaryAlt: "#656565",
//     neutralTertiary: "#e5e5e5",
//     neutralSecondary: "#eaeaea",
//     neutralPrimaryAlt: "#eeeeee",
//     neutralPrimary: "#d9d9d9",
//     neutralDark: "#f6f6f6",
//     black: "#fafafa",
//     white: "#121212",
//   },
// };

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
    <ThemeProvider theme={appTheme}>
      <BrowserRouter>
        <App auth={auth} />
      </BrowserRouter>
    </ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
