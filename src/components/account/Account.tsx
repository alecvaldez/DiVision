import {
  CommandBarButton,
  DefaultEffects,
  IPersonaSharedProps,
  IStackTokens,
  Label,
  Persona,
  PersonaInitialsColor,
  PersonaPresence,
  Spinner,
  Stack,
} from "@fluentui/react";
import { Text } from "@fluentui/react/lib/Text";
import { User } from "firebase/auth";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ControlledTextField } from "../textfield/ControlledTextField";
import TitleBar from "../title-bar/TitleBar";
import "./Account.css";

interface AccountProps {
  user: User | null;
  photoUrl: string;
}

type Form = {
  alias: string;
};

const verticalGapStackTokens: IStackTokens = {
  childrenGap: 40,
  padding: 10,
};

export const nameof = <T extends {}>(name: keyof T) => name;

const Account: React.FC<AccountProps> = ({ user, photoUrl }: AccountProps) => {
  const navigate = useNavigate();
  const fileInputRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  useEffect(() => {
    if (user == null) {
      navigate("/login");
    }
  }, [user]);

  const {
    handleSubmit: handleSaveProfile,
    control: controlProfile,
    setValue: setProfileValue,
  } = useForm<Form, any>({
    defaultValues: {
      alias: "",
    },
    reValidateMode: "onSubmit",
    mode: "all",
  });

  const [loadPhoto, setLoadPhoto] = useState(false);

  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);

  const [tmpPhotoUrl, setTmpPhotoUrl] = useState("");

  const email = user?.email;

  const persona: IPersonaSharedProps = {
    imageUrl: tmpPhotoUrl == "" ? photoUrl : tmpPhotoUrl,
    imageInitials: email?.slice(0, 2).toUpperCase() || "AA",
    text: "",
  };

  const changeHandler = (event: any) => {
    const file = event.target.files[0];
    setLoadPhoto(true);
    const fileUrl = URL.createObjectURL(file);
    setTmpPhotoUrl(fileUrl);
    console.log(event.target.files[0]);

    // updateUserProfilePhoto(event.target.files[0])
    //   .then((snapshot) => {
    //     setLoadPhoto(false);
    //   })
    //   .catch((err) => {
    //     setLoadPhoto(false);
    //   });
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
          <TitleBar photoUrl={photoUrl} user={user} />
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
                <Stack style={{height: "100%"}}>
                <Text variant={"xxLarge"}   nowrap block>
                    Profile Settings
                  </Text>
              <Stack horizontal style={{height: "100%"}}>
                <Stack
                  tokens={verticalGapStackTokens}
                  style={{ width: window.innerHeight * 0.3, height: "100%", alignContent: "center",         display: "flex",
                  justifyContent: "center"}}
                >


                  <Persona
                    {...persona}
                    presence={PersonaPresence.none}
                    className="account-picture"
                    initialsColor={PersonaInitialsColor.gold}
                    coinSize={window.innerHeight * 0.25}
                    imageAlt=""
                  />
                  {loadPhoto && (
                    <Spinner
                      style={{
                        position: "absolute",
                        marginTop: 100,
                        transform: "scale(3)",
                      }}
                      size={3}
                    />
                  )}

                  <CommandBarButton
                    iconProps={{ iconName: "Upload" }}
                    text="Upload Picture"
                    type="file"
                    style={{
                      width: window.innerHeight * 0.18,
                      height: 30,
                    }}
                    onClick={() => fileInputRef.current.click()}
                  />
                  <input
                    id="photo-upload"
                    type="file"
                    name="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={changeHandler}
                  />
                </Stack>
                <Stack style={{ width: "70%", height: "100%" }}>
                  <form>
                    <ControlledTextField
                      // onKeyDown={siginKeyDown}
                      label="Alias"
                      control={controlProfile}
                      name={nameof<Form>("alias")}
                    />
                  </form>
                </Stack>
              </Stack>
              </Stack>

            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Account;
