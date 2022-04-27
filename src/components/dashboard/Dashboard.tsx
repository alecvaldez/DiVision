import { ContextualMenu, DefaultButton, FontWeights, getTheme, IContextualMenuItem, IContextualMenuProps, IPersonaSharedProps, mergeStyleSets, Persona, PersonaPresence, PrimaryButton, Stack } from "@fluentui/react";
import React, { useMemo, useRef, useState } from "react";
import { NavigateFunction } from "react-router-dom";
import { Icon } from '@fluentui/react/lib/Icon';
import { firebaseLogout } from "../../firebase/FirebaseUtils";
import "./Dashboard.css";
import { getAuth, User } from "firebase/auth";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { Text } from "@fluentui/react/lib/Text";

interface DashboardProps {
    navigate: NavigateFunction;
}

const menuItems: IContextualMenuItem[] = [
    {
        key: 'account',
        text: 'Account',
        onClick: () => { console.log("kek") }
    },
    {
        key: 'logout',
        text: 'logout'
    }
]
const Dashboard: React.FC<DashboardProps> = ({ navigate }: DashboardProps) => {
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

    const email = getAuth().currentUser?.email;

    const persona: IPersonaSharedProps = {
        imageUrl: "",
        imageInitials: email?.slice(0, 2).toUpperCase() || "AA",
        text: email || "",
        secondaryText: 'Game Master',
    };

    return (
        <div>
            <Stack horizontal>
                <PrimaryButton onClick={logout}>
                    Logout
                </PrimaryButton>
                <Persona
                    {...persona}
                    presence={PersonaPresence.busy}
                    imageAlt=""
                />

                <a ref={linkRef} onClick={onShowContextualMenu} href="#">
                    Click for ContextualMenu
                </a>
            </Stack>
            <ContextualMenu
                doNotLayer={true}
                items={menuItems}
                hidden={!showContextualMenu}
                target={linkRef}
                onItemClick={onHideContextualMenu}
                onDismiss={onHideContextualMenu}
            />
        </div>
    );
};

export default Dashboard;
