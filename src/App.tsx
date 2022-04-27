import React, { useEffect } from "react";
import {
  Stack,
  Text,
  Link,
  FontWeights,
  IStackTokens,
  IStackStyles,
  ITextStyles,
} from "@fluentui/react";
import {
  Routes,
  Route,
  useNavigate,
  NavigateFunction,
} from "react-router-dom";
import { browserLocalPersistence, getAuth, onAuthStateChanged, setPersistence, User } from "firebase/auth";
import "./App.css";
import Login from "./components/login/Login";
import Dashboard from "./components/dashboard/Dashboard";

const boldStyle: Partial<ITextStyles> = {
  root: { fontWeight: FontWeights.semibold },
};
const stackTokens: IStackTokens = { childrenGap: 15 };
const stackStyles: Partial<IStackStyles> = {
  root: {
    width: "960px",
    margin: "0 auto",
    textAlign: "center",
    color: "#605e5c",
  },
};



const App: React.FC<{}> = () => {
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    console.log("test")
    const auth = getAuth();
    (async () => {
      await setPersistence(auth, browserLocalPersistence);
    })();
    onAuthStateChanged(auth, (user: User | null) => {
        console.log(user)
      if (user != undefined) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    });
  }, []);

  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="dashboard" element={<Dashboard navigate={navigate} />} />
    </Routes>
  );
};

export default App;
