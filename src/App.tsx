import {
  FontWeights,
  IStackStyles,
  IStackTokens,
  ITextStyles,
} from "@fluentui/react";
import {
  Auth,
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  User,
} from "firebase/auth";
import React, { ReactElement, useEffect, useState } from "react";
import {
  Navigate,
  NavigateFunction,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import Dashboard from "./components/dashboard/Dashboard";
import Login from "./components/login/Login";
import {
  SwitchTransition,
  Transition,
  TransitionGroup,
} from "react-transition-group";
import { CSSTransition } from "react-transition-group";
import Account from "./components/account/Account";

interface AppProps {
  auth: Auth;
}

const App: React.FC<AppProps> = ({ auth }: AppProps) => {
  const navigate: NavigateFunction = useNavigate();
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const location = useLocation();

  useEffect(() => {
    (async () => {
      await setPersistence(auth, browserLocalPersistence);
    })();
    onAuthStateChanged(auth, (user: User | null) => {
      if (user != null) {
        console.log(user);
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
  }, []);

  return (
    <TransitionGroup component={null}>
      <CSSTransition
        key={location.key}
        classNames="slide"
        timeout={300}
        unmountOnExit
      >
        <Routes location={location}>
          <Route path="login" element={<Login user={currentUser} />} />
          <Route
            path="dashboard"
            element={<Dashboard user={currentUser} />}
          />
          <Route
            path="account"
            element={<Account user={currentUser} />}
          />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default App;
