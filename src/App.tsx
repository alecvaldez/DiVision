import { PartialTheme, ThemeProvider } from "@fluentui/react";
import {
  Auth,
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  User,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import "./App.css";
import Account from "./components/account/Account";
import SVG from "./components/background-svg/BackgroundSVG";
import CreateGame from "./components/create-game/CreateGame";
import Dashboard from "./components/dashboard/Dashboard";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import { generateTheme } from "./components/theme-designer/ThemeDesigner";
import TitleBar from "./components/title-bar/TitleBar";
import {
  getGame,
  getUserProfile,
  getUserProfilePhoto,
} from "./firebase/FirebaseUtils";

export type GameArray = { [index: string]: Array<string> };

interface AppProps {
  auth: Auth;
}

interface ProfileData {
  alias: string;
  descriptor: string;
  primaryColor: string;
  games: GameArray;
}

interface RawGameData {
  imgUrl: string;
  name: string;
}

interface GameData extends RawGameData {
  key: string;
}

export type GamesData = Array<GameData>;

export interface Profile extends ProfileData {
  photoUrl: string;
}

const App: React.FC<AppProps> = ({ auth }: AppProps) => {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const location = useLocation();
  const [userLoaded, setUserLoaded] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [noProfile, setNoProfile] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#fa0000");
  const [sigin, setSigin] = useState(true);
  const [games, setGames] = useState<GamesData>([]);

  const [profile, setProfile] = useState<Profile>({
    photoUrl: "",
    alias: "",
    descriptor: "",
    primaryColor: "",
    games: {},
  });

  const appTheme: PartialTheme = generateTheme({
    primaryColor: primaryColor,
    textColor: "#d9d9d9",
    backgroundColor: "#121212",
  });

  const getFirebaseProfile = () => {
    getUserProfilePhoto().then((url) => {
      getUserProfile().then((snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const value = val as ProfileData;
          const gameIds: GameArray | undefined = value.games;

          const profileColor: string =
            value.primaryColor !== "" ? value.primaryColor : "#e00000";

          setPrimaryColor(profileColor);

          setProfile(() => ({
            photoUrl: url,
            alias: value.alias,
            descriptor: value.descriptor,
            primaryColor: value.primaryColor,
            games: gameIds ? gameIds : {},
          }));

          if (gameIds) {
            Object.keys(gameIds).forEach((gameId) => {
              getGame(gameId).then((snapshot) => {
                if (snapshot.exists()) {
                  const val = snapshot.val();
                  const rawGame = val as RawGameData;

                  const game: GameData = {
                    ...rawGame,
                    key: gameId,
                  };

                  const newGames = [...games, game];
                  setGames(newGames);
                }
              });
            });
          }
        }
        setProfileLoaded(true);
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
        setNoProfile(false);
        getFirebaseProfile();
      } else {
        setNoProfile(true);
      }
    });
  }, []);

  return (
    <ThemeProvider theme={appTheme}>
      <TitleBar
        profile={profile}
        user={currentUser}
        profileLoaded={profileLoaded}
        primaryColor={primaryColor}
        setPrimaryColor={setPrimaryColor}
      />
      <SVG color={primaryColor} />
      <SwitchTransition>
        <CSSTransition
          key={location.key}
          classNames="slide"
          timeout={300}
          unmountOnExit
        >
          <Routes location={location}>
            <Route
              path="/"
              element={
                <Home
                  profile={profile}
                  user={currentUser}
                  profileLoaded={profileLoaded}
                  noProfile={noProfile}
                  setSigin={setSigin}
                />
              }
            />
            <Route
              path="login"
              element={
                <Login sigin={sigin} setSigin={setSigin} user={currentUser} />
              }
            />
            <Route
              path="dashboard"
              element={
                <>
                  {userLoaded && <Dashboard user={currentUser} games={games} />}
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
                      primaryColor={primaryColor}
                      user={currentUser}
                      getFirebaseProfile={getFirebaseProfile}
                      setPrimaryColor={(color: string) => {
                        setPrimaryColor(color);
                      }}
                    />
                  )}
                </>
              }
            />
            <Route
              path="create-game"
              element={<>{userLoaded && <CreateGame user={currentUser} />}</>}
            />
          </Routes>
        </CSSTransition>
      </SwitchTransition>
    </ThemeProvider>
  );
};

export default App;
