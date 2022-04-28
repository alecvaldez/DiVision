import {
  Auth,
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  User,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  NavigateFunction,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  CSSTransition,
  SwitchTransition,
  TransitionGroup,
} from "react-transition-group";
import "./App.css";
import Account from "./components/account/Account";
import Dashboard from "./components/dashboard/Dashboard";
import Login from "./components/login/Login";
import { getUserProfilePhoto } from "./firebase/FirebaseUtils";

interface AppProps {
  auth: Auth;
}

const App: React.FC<AppProps> = ({ auth }: AppProps) => {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const location = useLocation();
  const [userLoaded, setUserLoaded] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    (async () => {
      await setPersistence(auth, browserLocalPersistence).then(() => {
        setUserLoaded(true);
      });
    })();
    onAuthStateChanged(auth, (user: User | null) => {
      setCurrentUser(user);
      if(user !== null) {
        getUserProfilePhoto().then((url) => {
          setPhotoUrl(url);
        });
      }
    });
  }, []);

  return (
    <SwitchTransition>
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
            element={<>{userLoaded && <Dashboard photoUrl={photoUrl} user={currentUser} />}</>}
          />
          <Route
            path="account"
            element={<>{userLoaded && <Account photoUrl={photoUrl} user={currentUser} />}</>}
          />
        </Routes>
      </CSSTransition>
    </SwitchTransition>
  );
};

export default App;
