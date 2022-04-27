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
      if (user != undefined) {
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
          <Route
            path="/login"
            element={<Login navigate={navigate} user={currentUser} />}
          />
          <Route
            index={false}
            path="dashboard"
            element={
                <Dashboard navigate={navigate} user={currentUser} />
            }
          />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default App;
