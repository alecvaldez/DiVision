import {
  ContextualMenu,
  DefaultEffects,
  IContextualMenuItem,
  IPersonaSharedProps,
  Persona,
  PersonaPresence,
  PrimaryButton,
  Stack,
} from "@fluentui/react";
import { getAuth, User } from "firebase/auth";
import React, { ReactElement, useEffect } from "react";
import { Navigate, NavigateFunction, useNavigate } from "react-router-dom";
import { firebaseLogout } from "../../firebase/FirebaseUtils";
import "./Dashboard.css";

interface DashboardProps {
  user: User | null;
}

const menuItems: IContextualMenuItem[] = [
  {
    key: "account",
    text: "Account",
    onClick: () => {
      console.log("kek");
    },
  },
  {
    key: "logout",
    text: "Logout",
  },
];
const Dashboard: React.FC<DashboardProps> = ({
  user
}: DashboardProps) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (user == null) {
      navigate("/login");
    }
  }, [user]);

  const linkRef = React.useRef(null);
  const [showContextualMenu, setShowContextualMenu] = React.useState(false);
  const onShowContextualMenu = React.useCallback(
    (ev: React.MouseEvent<HTMLElement>) => {
      ev.preventDefault(); // don't navigate
      setShowContextualMenu(true);
    },
    []
  );

  const onHideContextualMenu = React.useCallback(
    () => setShowContextualMenu(false),
    []
  );

  const logout = (): void => {
    firebaseLogout().then(() => {
      navigate("/login");
    });
  };

  const email = user?.email;

  const persona: IPersonaSharedProps = {
    imageUrl: "",
    imageInitials: email?.slice(0, 2).toUpperCase() || "AA",
    text: email || "",
    secondaryText: "Game Master",
  };

  return (
    <div style={{
        display: "flex",
        justifyContent: "center",
        position: "absolute",
        width: "100vw",
        height: "100vh",
        alignItems: "center",
      }}>
      {user !== null && (
        <>
        <Stack>
        <Stack horizontal>
            <PrimaryButton onClick={logout}>Logout</PrimaryButton>
            <Persona
              onClick={onShowContextualMenu}
              {...persona}
              presence={PersonaPresence.busy}
              imageAlt=""
            />

            <a ref={linkRef} onClick={onShowContextualMenu} href="#">
              Click for ContextualMenu
            </a>
          </Stack>
          <ContextualMenu
            // doNotLayer={true}
            items={menuItems}
            hidden={!showContextualMenu}
            target={linkRef}
            onItemClick={onHideContextualMenu}
            onDismiss={onHideContextualMenu}
          />
          <div style={{ backgroundColor: "gray", boxShadow: DefaultEffects.elevation64 }}>
        Hello
          </div>
        </Stack>

        </>
      )}
    </div>
  );
};

export default Dashboard;
