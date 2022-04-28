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
import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseLogout } from "../../firebase/FirebaseUtils";
import { Text } from "@fluentui/react";
import { User } from "firebase/auth";
import "./TitleBar.css";

interface TitleBarProps {
  user: User | null;
  photoUrl: string;
}

const TitleBar: React.FC<TitleBarProps> = ({ user, photoUrl }: TitleBarProps) => {
  const navigate = useNavigate();

  const email = user?.email;

  const persona: IPersonaSharedProps = {
    imageUrl: photoUrl,
    imageInitials: email?.slice(0, 2).toUpperCase() || "AA",
    text: email || "",
    secondaryText: "Game Master",
    coinProps: {
        color: "red"
    }
  };

  const menuItems: IContextualMenuItem[] = [
    {
      key: "account",
      text: "Account",
      onClick: () => {
        navigate("/account");
      },
      iconProps: { iconName: "Contact", style: { color: "dodgerblue" } },
    },
    {
      key: "logout",
      text: "Logout",
      iconProps: { iconName: "Leave", style: { color: "dodgerblue" } },
      onClick: () => {
        logout();
      },
    },
  ];

  const linkRef = useRef(null);
  const [showContextualMenu, setShowContextualMenu] = useState(false);
  const onShowContextualMenu = useCallback(
    (ev: React.MouseEvent<HTMLElement>) => {
      ev.preventDefault(); // don't navigate
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

  return (
    <div
      className="title-bar"
      style={{ boxShadow: DefaultEffects.elevation16 }}
    >
      <Stack verticalAlign="center" horizontal style={{ float: "left" }}>
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
            styles={{}}
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
    </div>
  );
};

export default TitleBar;
