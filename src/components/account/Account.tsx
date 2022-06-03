import {
  CommandBarButton,
  CommandButton,
  DefaultEffects,
  IPersonaSharedProps,
  IStackTokens,
  Persona,
  PersonaInitialsColor,
  PersonaPresence,
  PrimaryButton,
  Spinner,
  SpinnerSize,
  Stack,
  Toggle,
} from "@fluentui/react";
import { Text } from "@fluentui/react/lib/Text";
import { User } from "firebase/auth";
import React, { createRef, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getPersonaIntialsColor, Profile, ProfileData } from "../../App";
import {
  getUserProfilePhoto,
  updateUserProfile,
  updateUserProfilePhoto,
} from "../../firebase/FirebaseUtils";
import { ControlledTextField } from "../textfield/ControlledTextField";
import { CirclePicker, Color, ColorResult } from "react-color";
import "./Account.css";

interface AccountProps {
  user: User | null;
  profile: Profile;
  primaryColor: string;
  getFirebaseProfile: () => void;
  setPrimaryColor: (color: string) => void;
}

type Form = {
  alias: string;
  descriptor: string;
};

const verticalGapStackTokens: IStackTokens = {
  childrenGap: 20,
  padding: 10,
};

export const nameof = <T extends {}>(name: keyof T) => name;

const Account: React.FC<AccountProps> = ({
  user,
  profile,
  primaryColor,
  getFirebaseProfile,
  setPrimaryColor,
}: AccountProps) => {
  const navigate = useNavigate();

  const fileInputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [isEditing, setIsEditing] = useState(false);
  const [tmpPhotoUrl, setTmpPhotoUrl] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState((profile.theme === "light") ? false : true);

  const primaryRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const cardRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const checkOverflow = (): boolean => {
    return primaryRef.current.offsetHeight < cardRef.current.offsetHeight;
  };

  useEffect(() => {
    if (user == null) {
      navigate("/login");
    }
  }, [user]);

  useEffect(() => {
    if (checkOverflow()) {
      cardRef.current.style.top = "0";
    } else {
      cardRef.current.style.top = "auto";
    }
  }, []);

  const goBack = (): void => {
    navigate(-1);
  };

  const {
    handleSubmit: handleSaveProfile,
    control: controlProfile,
    setValue: setProfileValue,
  } = useForm<Form, any>({
    defaultValues: {
      alias: profile.alias,
      descriptor: profile.descriptor,
    },
    reValidateMode: "onSubmit",
    mode: "all",
  });

  const email = user?.email;

  const persona: IPersonaSharedProps = {
    imageUrl: tmpPhotoUrl == "" ? profile.photoUrl : tmpPhotoUrl,
    imageInitials: email?.slice(0, 2).toUpperCase() || "AA",
    text: "",
    initialsColor: email ? getPersonaIntialsColor(email) : 0
  };

  const changeTheme = (_event: any, checked?: boolean | undefined): void => {
    setIsEditing(true);
    if(checked == true) {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  }

  const changeHandler = (event: any) => {
    const file = event.target.files[0];
    const fileUrl = URL.createObjectURL(file);
    setTmpPhotoUrl(fileUrl);
    setIsEditing(true);
    setPhoto(file);
  };

  const keyDown = (e: any) => {
    setIsEditing(true);
    if (e.key === "Enter") {
      saveProfile();
    }
  };

  const saveProfile = () => {
    handleSaveProfile(
      (data) => {
        setLoading(true);
        const profileData: ProfileData = {
          alias: data.alias,
          descriptor: data.descriptor,
          primaryColor: primaryColor,
          theme: darkMode ? "dark" : "light",
          photoUrl: "",
          email: user?.email
        }

        if (photo) {
          updateUserProfilePhoto(photo).then(() => {
            getUserProfilePhoto().then((url) => {
              profileData.photoUrl = url;
              updateUserProfile(profileData).then(
                () => {
                  setIsEditing(false);
                  setLoading(false);
                  getFirebaseProfile();
                }
              );
            });

          });
        } else {
          updateUserProfile(profileData).then(
            () => {
              setIsEditing(false);
              setLoading(false);
              getFirebaseProfile();
            }
          );
        }
      },
      (err) => {}
    )();
  };

  return (
    <div className="primary-div" ref={primaryRef}>
      <div className="secondary-div">
        {user !== null && (
          <div
            className="card"
            ref={cardRef}
            style={{ boxShadow: DefaultEffects.elevation16 }}
          >
            <Stack
              style={{ width: "100%", zIndex: 1000 }}
              tokens={verticalGapStackTokens}
            >
              <Text
                variant={"xxLarge"}
                style={{ position: "absolute" }}
                nowrap
                block
              >
                Profile Settings
              </Text>

              <div
                style={{
                  width: "100%",
                  alignItems: "center",
                  textAlign: "center",
                  justifyContent: "center ",
                  marginTop: 80,
                }}
              >
                <Persona
                  {...persona}
                  presence={PersonaPresence.none}
                  className="account-picture"
                  coinSize={300}
                  imageAlt=""
                  styles={{
                    root: {
                      width: 0,
                      margin: "auto",
                      display: "block",
                    },
                  }}
                />
              </div>

              <div
                style={{
                  width: "100%",
                  alignItems: "center",
                  textAlign: "center",
                  justifyContent: "center ",
                }}
              >
                <CommandBarButton
                  iconProps={{ iconName: "Upload" }}
                  text="Upload Picture"
                  type="file"
                  style={{
                    height: 30,
                    width: "200px",
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

              <CirclePicker
                width="100%"
                className="circle-picker"
                colors={[
                  "#fa0000",
                  "#4073ff",
                  "#da00f2",
                  "#ff5e00",
                  "#e8d500",
                  "#00d9e8",
                  "#00c700",
                ]}
                onChange={(color) => {
                  setIsEditing(true);
                  setPrimaryColor(color.hex);
                }}
                color={primaryColor}
              />
              <ControlledTextField
                onKeyDown={keyDown}
                label="Alias"
                maxLength={10}
                control={controlProfile}
                name={nameof<Form>("alias")}
              />
              <ControlledTextField
                onKeyDown={keyDown}
                label="Descriptor"
                maxLength={10}
                control={controlProfile}
                name={nameof<Form>("descriptor")}
              />

              <Toggle label="Dark Mode" defaultChecked={darkMode} onText="On" offText="Off" onChange={changeTheme}/>

              <Stack
                horizontal
                style={{
                  marginTop: 30,
                  height: "auto",
                  display: "flex",
                  justifyContent: "space-between",
                  bottom: 0,
                }}
                tokens={{
                  childrenGap: 10,
                }}
              >
                <CommandButton
                  iconProps={{ iconName: "SkypeArrow" }}
                  text="Back"
                  onClick={goBack}
                />
                {loading && (
                  <Spinner
                    style={{
                      marginLeft: "auto",
                    }}
                    size={SpinnerSize.large}
                  />
                )}
                <PrimaryButton
                  disabled={!isEditing}
                  onClick={saveProfile}
                  style={{
                    height: "38px",
                  }}
                >
                  Save
                </PrimaryButton>
              </Stack>
            </Stack>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
