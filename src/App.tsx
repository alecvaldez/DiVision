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
import TitleBar from "./components/title-bar/TitleBar";
import { getUserProfile, getUserProfilePhoto } from "./firebase/FirebaseUtils";

interface AppProps {
  auth: Auth;
}

interface ProfileData {
  alias: string;
  descriptor: string;
}

export interface Profile extends ProfileData {
  photoUrl: string;
}

const App: React.FC<AppProps> = ({ auth }: AppProps) => {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const location = useLocation();
  const [userLoaded, setUserLoaded] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    photoUrl: "",
    alias: "",
    descriptor: "",
  });

  const getFirebaseProfile = () => {
    getUserProfilePhoto().then((url) => {
      getUserProfile().then((snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const value = val as ProfileData;

          setProfile((obj) => ({
            photoUrl: url,
            alias: value.alias,
            descriptor: value.descriptor,
          }));

          console.log(profile);
        }
      });
    });
  };

  useEffect(() => {
    (async () => {
      await setPersistence(auth, browserLocalPersistence).then(() => {
        setUserLoaded(true);
      });
    })();
    onAuthStateChanged(auth, (user: User | null) => {
      setCurrentUser(user);
      console.log(user);
      if (user !== null) {
        getFirebaseProfile();
      }
    });
  }, []);

  return (
    <>
      <TitleBar profile={profile} user={currentUser} />
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
              element={
                <>
                  {userLoaded && (
                    <Dashboard profile={profile} user={currentUser} />
                  )}
                </>
              }
            />
            <Route
              path="account"
              element={
                <>
                  {userLoaded && (
                    <Account
                      profile={profile}
                      callback={getFirebaseProfile}
                      user={currentUser}
                    />
                  )}
                </>
              }
            />
          </Routes>
        </CSSTransition>
      </SwitchTransition>
    </>
  );
};

export default App;
