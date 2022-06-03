import { PartialTheme, PersonaInitialsColor, ThemeProvider } from "@fluentui/react";
import {
  Auth,
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  User
} from "firebase/auth";
import { DataSnapshot } from "firebase/database";
import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import "./App.css";
import Account from "./components/account/Account";
import SVG from "./components/background-svg/BackgroundSVG";
import CreateCharacter, { CharacterForm } from "./components/create-character/CreateCharacter";
import CreateGame from "./components/create-game/CreateGame";
import Dashboard from "./components/dashboard/Dashboard";
import Game from "./components/game/Game";
import Home from "./components/home/Home";
import JoinGame from "./components/join-game/JoinGame";
import Login from "./components/login/Login";
import { generateTheme } from "./components/theme-designer/ThemeDesigner";
import TitleBar from "./components/title-bar/TitleBar";
import {
  addGameListener,
  getGame,
  getUserGames,
  getUserProfile, removeGameListener
} from "./firebase/FirebaseUtils";

const DARK_THEME = {
  primaryColor: "#e00000",
  textColor: "#d9d9d9",
  backgroundColor: "#121212",
};

const LIGHT_THEME = {
  primaryColor: "#e00000",
  textColor: "#000",
  backgroundColor: "#fff",
};

interface AppProps {
  auth: Auth;
}

export interface ProfileData {
  alias: string;
  descriptor: string;
  primaryColor: string;
  theme: string;
  photoUrl: string;
  email: string | null | undefined;
}

export interface Enemy {
  name: string;
  hp: number;
  ac: number;
}

export interface GameData {
  imgUrl: string;
  name: string;
  selectedEnemy: string;
  selectedPlayer: string;
  selectedWeapon: string;
  selectedRoll: string;
  gameMasterId: string;
  players: { [key: string]: CharacterForm };
  enemies: {[key: string]: Enemy}
}

type RawGamesMap = { [key: string]: Array<string> };

export type GamesMap = { [key: string]: GameData };

export interface Profile extends ProfileData {
  photoUrl: string;
}

export const getPersonaIntialsColor = (name: string): PersonaInitialsColor => {
  let h=0;

  for(let i = 0; i < name.length; i++) 
        h = Math.imul(31, h) + name.charCodeAt(i) | 0;

  return h % 24;
};


const App: React.FC<AppProps> = ({ auth }: AppProps) => {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const location = useLocation();
  const [userLoaded, setUserLoaded] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [noProfile, setNoProfile] = useState(false);
  const [primaryColor, setPrimaryColor] = useState(DARK_THEME.primaryColor);
  const [backgroundColor, setBackgroundColor] = useState(
    DARK_THEME.backgroundColor
  );
  const [textColor, setTextColor] = useState(DARK_THEME.textColor);
  const [sigin, setSigin] = useState(true);
  const [games, setGames] = useState<GamesMap>({});

  const [profile, setProfile] = useState<Profile>({
    photoUrl: "",
    alias: "",
    descriptor: "",
    primaryColor: "",
    theme: "",
    email: "",
  });

  const appTheme: PartialTheme = generateTheme({
    primaryColor: primaryColor,
    textColor: textColor,
    backgroundColor: backgroundColor,
  });

  const getFirebaseProfile = () => {
    getUserProfile().then((snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        const value = val as ProfileData;

        const profileColor: string =
          value.primaryColor !== "" ? value.primaryColor : "#e00000";

        const profileTheme: string = value.theme;

        if (profileTheme === "light") {
          setTextColor(LIGHT_THEME.textColor);
          setBackgroundColor(LIGHT_THEME.backgroundColor);
        } else {
          setTextColor(DARK_THEME.textColor);
          setBackgroundColor(DARK_THEME.backgroundColor);
        }

        setPrimaryColor(profileColor);

        setProfile(() => ({
          photoUrl: value.photoUrl,
          alias: value.alias,
          descriptor: value.descriptor,
          primaryColor: value.primaryColor,
          theme: value.theme,
          email: currentUser?.email,
        }));
      }
      setProfileLoaded(true);
    });
  };

  const setGame = (gameId: string, snapshot: DataSnapshot): void => {
    const val = snapshot.val();
    const rawGame = val as GameData;
    setGames((prevState) => ({
      ...prevState,
      [gameId]: rawGame,
    }));
  }

  const getGames = (): void => {
    setGames({});
    getUserGames().then((snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val() as RawGamesMap;

        if (val) {
          Object.keys(val).forEach((gameId) => {
            getGame(gameId).then((snapshot) => {
              if (snapshot.exists()) {
                setGame(gameId, snapshot);

                addGameListener(gameId, (snapshot1: DataSnapshot) => {
                  if(snapshot1.exists()) {
                    setGame(gameId, snapshot1);
                  }
                })
              }
            });
          });
        }
      } else {
        Object.keys(games).forEach(gameId => {
          removeGameListener(gameId);
        });
        setGames({});
      }
    });
  };

  const setDefaultTheme = (): void => {
    setPrimaryColor(DARK_THEME.primaryColor);
    setBackgroundColor(DARK_THEME.backgroundColor);
    setTextColor(DARK_THEME.textColor);
  };

  useEffect(() => {
    (async () => {
      await setPersistence(auth, browserLocalPersistence).then(() => {
        setUserLoaded(true);
      });
    })();
    onAuthStateChanged(auth, (user: User | null) => {
      setCurrentUser(user);
      if (user !== null) {
        setNoProfile(false);
        getGames();
        getFirebaseProfile();
      } else {
        setNoProfile(true);
      }
    });
  }, []);

  return (
    <ThemeProvider theme={appTheme}>
      <div
        style={{
          backgroundColor: backgroundColor,
          width: "100vw",
          height: "100vh",
        }}
      >
        <TitleBar
          profile={profile}
          user={currentUser}
          profileLoaded={profileLoaded}
          primaryColor={primaryColor}
          setDefaultTheme={setDefaultTheme}
          clearGames={() => {
            setGames({});
          }}
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
                    backgroundColor={backgroundColor}
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
                    {userLoaded && (
                      <Dashboard
                        user={currentUser}
                        games={games}
                        textColor={textColor}
                        callback={getGames}
                      />
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
                element={
                  <>
                    {userLoaded && (
                      <CreateGame
                        user={currentUser}
                        backgroundColor={backgroundColor}
                        callback={getGames}
                      />
                    )}
                  </>
                }
              />
              <Route
                path="join-game"
                element={
                  <>
                    {userLoaded && (
                      <JoinGame user={currentUser} callback={getGames} />
                    )}
                  </>
                }
              />
              <Route path="game/:gameid" element={<> </>} />
              <Route path="create-character/:gameid" element={<> </>} />
              {Object.entries(games).map(([key, value]) => {
                return (
                  <Route
                    key={`game-${key}`}
                    path={`game/${key}`}
                    element={
                      <>
                        {userLoaded && (
                          <Game primaryColor={primaryColor} backgroundColor={backgroundColor} user={currentUser} game={value} gameId={key} />
                        )}
                      </>
                    }
                  />
                );
              })}

              {Object.entries(games).map(([key, _value]) => {
                return (
                  <Route
                    key={`create-character-${key}`}
                    path={`create-character/${key}`}
                    element={
                      <>
                        {userLoaded && (
                          <CreateCharacter
                            backgroundColor={backgroundColor}
                            user={currentUser}
                            gameId={key}
                            callback={getGames}
                          />
                        )}
                      </>
                    }
                  />
                );
              })}
            </Routes>
          </CSSTransition>
        </SwitchTransition>
      </div>
    </ThemeProvider>
  );
};

export default App;
