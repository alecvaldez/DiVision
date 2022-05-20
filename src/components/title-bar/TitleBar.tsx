import {
  ContextualMenu,
  DefaultEffects,
  DirectionalHint,
  FontIcon,
  IContextualMenuItem,
  IPersonaSharedProps,
  Persona,
  PersonaPresence,
  PersonaSize,
  Stack,
} from "@fluentui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { firebaseLogout } from "../../firebase/FirebaseUtils";
import { Text } from "@fluentui/react";
import { User } from "firebase/auth";
import "./TitleBar.css";
import { Profile } from "../../App";

interface TitleBarProps {
  user: User | null;
  profile: Profile;
  profileLoaded: boolean;
}

const TitleBar: React.FC<TitleBarProps> = ({
  user,
  profile,
  profileLoaded,
}: TitleBarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const siginItems: IContextualMenuItem[] = [
    {
      key: "login",
      text: "Login",
      iconProps: { iconName: "Contact", style: { color: "red" } },
      onClick: () => {
        logout();
      },
    },
  ];

  const userItems: IContextualMenuItem[] = [
    {
      key: "account",
      text: "Account",
      onClick: () => {
        if (location.pathname !== "/account") {
          navigate("/account");
        }
      },
      iconProps: { iconName: "Contact", style: { color: "red" } },
    },
    {
      key: "logout",
      text: "Logout",
      iconProps: { iconName: "Leave", style: { color: "red" } },
      onClick: () => {
        logout();
      },
    },
  ];

  const [menuItems, setMenuItems] = useState(siginItems);

  useEffect(() => {
    if (user) {
      setMenuItems(userItems);
    } else {
      setMenuItems(siginItems);
    }
  }, [user]);

  const getSecondaryText = (): string => {
    if (user) {
      return profile.descriptor === "" ? "User" : profile.descriptor;
    } else {
      return "Sign In";
    }
  };
  const email = user?.email || "";

  const persona: IPersonaSharedProps = {
    imageUrl: profile.photoUrl ? profile.photoUrl : "",
    imageInitials: email?.slice(0, 2).toUpperCase() || "AA",
    text: profile.alias === "" ? email : profile.alias,
    secondaryText: getSecondaryText(),
    coinProps: {
      color: "red",
    },
  };

  const linkRef = useRef(null);
  const [showContextualMenu, setShowContextualMenu] = useState(false);
  const onShowContextualMenu = useCallback(
    (ev: React.MouseEvent<HTMLElement>) => {
      ev.preventDefault();
      setShowContextualMenu(true);
    },
    []
  );

  const onHideContextualMenu = useCallback(
    () => setShowContextualMenu(false),
    []
  );

  const logout = (): void => {
    navigate("/login");
    firebaseLogout();
  };

  const goDashboard = (): void => {
    if (location.pathname !== "/dashboard" && user !== null) {
      navigate("/dashboard");
    }
  };

  return (
    <div
      className="title-bar"
      style={{ boxShadow: DefaultEffects.elevation16 }}
    >
      <Stack
        verticalAlign="center"
        horizontal
        style={{ float: "left", cursor: "pointer" }}
        onClick={goDashboard}
      >
        <Text
          variant={"xxLargePlus"}
          nowrap
          block
          style={{ lineHeight: "50px" }}
        >
          <FontIcon
            className="logo"
            aria-label="WebAppBuilderFragment"
            iconName="WebAppBuilderFragment"
          />
          DiVision
        </Text>
      </Stack>
      {profileLoaded && (
        <>
          <Stack horizontal style={{ float: "right" }}>
            <Stack
              verticalAlign="center"
              style={{ height: "56px", cursor: "pointer" }}
            >
              <Persona
                onClick={onShowContextualMenu}
                {...persona}
                presence={PersonaPresence.none}
                size={PersonaSize.size40}
                imageAlt=""
                ref={linkRef}
              />
            </Stack>
          </Stack>
          <ContextualMenu
            items={menuItems}
            hidden={!showContextualMenu}
            target={linkRef}
            directionalHint={DirectionalHint.bottomLeftEdge}
            onItemClick={onHideContextualMenu}
            gapSpace={10}
            isBeakVisible={false}
            onDismiss={onHideContextualMenu}
          />
        </>
      )}
    </div>
  );
};

export default TitleBar;
