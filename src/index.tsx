import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCngDQpA2XIehOHzgtIUF8YbNQrJbAHCbU",
  authDomain: "division-91b2e.firebaseapp.com",
  projectId: "division-91b2e",
  storageBucket: "division-91b2e.appspot.com",
  messagingSenderId: "650721899687",
  appId: "1:650721899687:web:12d97613bc9373df49d782",
  measurementId: "G-SPDFXT0MWY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
