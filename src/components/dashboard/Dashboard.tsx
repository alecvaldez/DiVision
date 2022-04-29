import {
  ContextualMenu,
  DefaultEffects,
  DirectionalHint,
  FontIcon,
  Icon,
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
  profile: Profile;
}

const Dashboard: React.FC<DashboardProps> = ({ user, profile }: DashboardProps) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (user == null) {
      navigate("/login");
    }
  }, [user]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        position: "absolute",
        width: "100vw",
        height: "100vh",
        zIndex: 10000,
        alignItems: "center",
      }}
    >
      {user !== null && (
        <>
          <TitleBar profile={profile} user={user} />
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
                <Stack>
                  <div
                    className="game-card"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.05)",
                      boxShadow: DefaultEffects.elevation16,
                    }}
                  >
                    Hello
                  </div>
                </Stack>
              </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
