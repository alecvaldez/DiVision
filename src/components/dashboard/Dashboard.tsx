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
import { firebaseLogout } from "../../firebase/FirebaseUtils";
import TitleBar from "../title-bar/TitleBar";
import "./Dashboard.css";

interface DashboardProps {
  user: User | null;
}

const Dashboard: React.FC<DashboardProps> = ({ user }: DashboardProps) => {
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
        backgroundColor: "#121212",
        position: "absolute",
        width: "100vw",
        height: "100vh",
        alignItems: "center",
      }}
    >
      {user !== null && (
        <Stack
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TitleBar user={user} />
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
        </Stack>
      )}
    </div>
  );
};

export default Dashboard;
