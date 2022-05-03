import {
  ContextualMenu,
  DefaultEffects,
  DirectionalHint,
  FontIcon,
  Icon,
  IconButton,
  IContextualMenuItem,
  IPersonaSharedProps,
  Persona,
  PersonaPresence,
  PersonaSize,
  PrimaryButton,
  Stack,
  Text,
} from "@fluentui/react";
import { getAuth, User } from "firebase/auth";
import React, { ReactElement, useEffect } from "react";
import {
  Navigate,
  NavigateFunction,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { Profile } from "../../App";
import { firebaseLogout } from "../../firebase/FirebaseUtils";
import TitleBar from "../title-bar/TitleBar";
import "./Dashboard.css";

interface DashboardProps {
  user: User | null;
}

const Dashboard: React.FC<DashboardProps> = ({
  user
}: DashboardProps) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (user == null) {
      navigate("/login");
    }
  }, [user]);

  const goCreateGame = ():void => {
    navigate("/create-game");
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        position: "absolute",
        width: "100vw",
        height: "calc(100vh - 3.5rem)",
        zIndex: 100,
        alignItems: "center",
        top: "3.5rem",
        overflowY: "auto"
      }}
    >
      {user !== null && (
        <>
          <div
            style={{
              display: "flex",
              width: "100vw",
              height: "100vh",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="games-div">
                <div
                  className="game-card"
                  style={{
                    boxShadow: DefaultEffects.elevation64,
                  }}
                >
                  <Text
                    variant={"large"}
                    style={{
                      position: "absolute",
                      textAlign: "center",
                      height: "18rem",
                      width: "18rem",
                      lineHeight: "420px",
                      zIndex: 200,
                      pointerEvents: "none",
                    }}
                    nowrap
                    block
                  >
                    New Game
                  </Text>
                  <IconButton
                    iconProps={{ iconName: "Add" }}
                    style={{
                      height: "100%",
                      width: "100%",
                      fontSize: "40px",
                      borderRadius: "5px",
                    }}
                    styles={{
                      rootHovered: {
                        backgroundColor: "rgba(0,0,0, 0.3)"
                      },
                      rootPressed: {
                        backgroundColor: "rgba(0,0,0, 0.5)"
                      },
                      icon: {
                        fontSize: "150%",
                        color: "#d9d9d9"
                      },
                    }}
                    onClick={goCreateGame}
                  />
                </div>
                <div
                  className="game-card"
                  style={{
                    boxShadow: DefaultEffects.elevation64,
                  }}
                />
                                <div
                  className="game-card"
                  style={{
                    boxShadow: DefaultEffects.elevation64,
                  }}
                />
                                                <div
                  className="game-card"
                  style={{
                    boxShadow: DefaultEffects.elevation64,
                  }}
                />
                                                                <div
                  className="game-card"
                  style={{
                    boxShadow: DefaultEffects.elevation64,
                  }}
                />
                                                                <div
                  className="game-card"
                  style={{
                    boxShadow: DefaultEffects.elevation64,
                  }}
                />

            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
