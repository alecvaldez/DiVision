import {
  CommandBarButton,
  DefaultButton,
  DefaultEffects,
  IPersonaSharedProps,
  IStackTokens,
  Label,
  Persona,
  PersonaInitialsColor,
  PersonaPresence,
  PrimaryButton,
  Spinner,
  SpinnerSize,
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
  descriptor: string;
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
      descriptor: "",
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
        backgroundImage: "red"
      }}
    >
      {user !== null && (
        <>
          <TitleBar photoUrl={photoUrl} user={user} />
          <div
            style={{
              display: "flex",
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
              <Stack style={{ width: "100%" }} tokens={verticalGapStackTokens}>
                <Text variant={"xxLarge"} nowrap block>
                  Profile Settings
                </Text>


                <div style={{ width: "100%", alignItems: "center", textAlign: "center", justifyContent: "center " }}>

                  <Persona
                    {...persona}
                    presence={PersonaPresence.none}
                    className="account-picture"
                    initialsColor={PersonaInitialsColor.gold}
                    coinSize={window.innerWidth / 5}
                    imageAlt=""
                    styles={{
                      root: {
                        width: 0,
                        margin: "auto",
                        display: "block"
                      }
                    }}
                  />
                </div>
                
                <div style={{ width: "100%", alignItems: "center", textAlign: "center", justifyContent: "center " }}>

                <CommandBarButton
                  iconProps={{ iconName: "Upload" }}
                  text="Upload Picture"
                  type="file"
                  style={{
                    height: 30,
                    width: "40%",
                  }}
                  onClick={() => fileInputRef.current.click()}
                />
                </div>
                <input
                  id="photo-upload"
                  type="file"
                  name="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={changeHandler}
                />
                <form style={{marginTop: "auto", marginBottom: "10%"}}>
                  <ControlledTextField
                    // onKeyDown={siginKeyDown}
                    label="Alias"
                    control={controlProfile}
                    name={nameof<Form>("alias")}
                  />
                              <ControlledTextField
                    // onKeyDown={siginKeyDown}
                    label="Descriptor"
                    control={controlProfile}
                    name={nameof<Form>("descriptor")}
                  />
                  <Stack horizontal tokens={{
                    childrenGap: 10
                  }}>
                    
                  <PrimaryButton style={{marginTop: 20}}>
                    Save
                  </PrimaryButton>
                  <Spinner size={SpinnerSize.large} style={{marginTop: 20}} />
                  </Stack>
                </form>
              </Stack>


            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Account;
