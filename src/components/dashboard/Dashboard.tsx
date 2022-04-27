import { ContextualMenu, IContextualMenuItem, IPersonaSharedProps, Persona, PersonaPresence, PrimaryButton, Stack } from "@fluentui/react";
import { getAuth, User } from "firebase/auth";
import React, { ReactElement, useEffect } from "react";
import { Navigate, NavigateFunction } from "react-router-dom";
import { firebaseLogout } from "../../firebase/FirebaseUtils";
import "./Dashboard.css";

interface DashboardProps {
    navigate: NavigateFunction;
    user: User | null;
}

interface ProtectedRouteProps {
    user: User | null;
    children: ReactElement<any, any>;
  }
  
  const ProtectedRoute = ({ user, children }: ProtectedRouteProps) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
  
    return children;
  };

const menuItems: IContextualMenuItem[] = [
    {
        key: 'account',
        text: 'Account',
        onClick: () => { console.log("kek") }
    },
    {
        key: 'logout',
        text: 'Logout'
    }
]
const Dashboard: React.FC<DashboardProps> = ({ navigate, user }: DashboardProps) => {
      
    const linkRef = React.useRef(null);
    const [showContextualMenu, setShowContextualMenu] = React.useState(false);
    const onShowContextualMenu = React.useCallback((ev: React.MouseEvent<HTMLElement>) => {
        ev.preventDefault(); // don't navigate
        setShowContextualMenu(true);
    }, []);

    const onHideContextualMenu = React.useCallback(() => setShowContextualMenu(false), []);

    const logout = (): void => {
        firebaseLogout().then(() => {
            navigate("/login");
        })
    }

    const email = user?.email;

    const persona: IPersonaSharedProps = {
        imageUrl: "",
        imageInitials: email?.slice(0, 2).toUpperCase() || "AA",
        text: email || "",
        secondaryText: 'Game Master',
    };

    return (
        // <ProtectedRoute user={user}>

        <div style={{ position: "absolute"}}>
            <Stack horizontal>
                <PrimaryButton onClick={logout}>
                    Logout
                </PrimaryButton>
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
        </div>
        // </ProtectedRoute>

    );
};

export default Dashboard;
