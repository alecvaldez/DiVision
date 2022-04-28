import {
  CommandBarButton,
  DefaultButton,
  DefaultEffects,
  IPersonaSharedProps,
  IStackStyles,
  IStackTokens,
  Persona,
  PersonaInitialsColor,
  PersonaPresence,
  PersonaSize,
  Spinner,
  SpinnerSize,
  Stack,
} from "@fluentui/react";
import { Text } from "@fluentui/react/lib/Text";
import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import TitleBar from "../title-bar/TitleBar";
import "./Account.css";
import AvatarEditor from "react-avatar-editor";
import {
  getUserProfilePhoto,
  updateUserProfilePhoto,
} from "../../firebase/FirebaseUtils";
import avatar from "../../no-avatar.png";
import { useNavigate } from "react-router-dom";

interface AccountProps {
  user: User | null;
}

const verticalGapStackTokens: IStackTokens = {
  childrenGap: 40,
  padding: 10,
};

const Account: React.FC<AccountProps> = ({ user }: AccountProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      getUserProfilePhoto().then((url) => {
        setPhotoUrl(url);
      });
    } else {
      navigate("/login");
    }
  }, [user]);

  const [loadPhoto, setLoadPhoto] = useState(false);

  const [photoUrl, setPhotoUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);

  const email = user?.email;

  const persona: IPersonaSharedProps = {
    imageUrl: photoUrl,
    imageInitials: email?.slice(0, 2).toUpperCase() || "AA",
    text: "",
  };

  const changeHandler = (event: any) => {
    setLoadPhoto(true);
    updateUserProfilePhoto(event.target.files[0])
      .then((snapshot) => {
        setLoadPhoto(true);
      })
      .catch((err) => {
        setLoadPhoto(true);
      });
  };

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
          <TitleBar user={user} />
          <div
            style={{
              display: "flex",
              backgroundColor: "#121212",
              width: "100vw",
              height: "100vh",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              className="account-card"
              style={{ boxShadow: DefaultEffects.elevation16 }}
            >
              <Stack tokens={verticalGapStackTokens}>
                <Text variant={"xxLarge"} nowrap block>
                  Profile Settings
                </Text>

                <Persona
                  {...persona}
                  presence={PersonaPresence.none}
                  className="account-picture"
                  initialsColor={PersonaInitialsColor.gold}
                  coinSize={window.innerHeight * 0.2}
                  imageAlt=""
                />
                {loadPhoto && <Spinner size={SpinnerSize.large} />}
                <CommandBarButton
                  iconProps={{ iconName: "Upload" }}
                  text="Upload Picture"
                  type="file"
                />
                <input type="file" name="file" onChange={changeHandler} />
              </Stack>
              {/* <img src={photoUrl} style={{ height: "20vh", width: "20vh"}}/>
            <AvatarEditor
              image={photoUrl}
              border={50}
              color={[255, 255, 255, 0.2]} // RGBA
              style={{
                borderRadius: 1000,
                outerHeight: "20vh",
                innerHeight: "20vh"
              }}
              borderRadius={1000}
              scale={1.2}
              rotate={0}
            /> */}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Account;
