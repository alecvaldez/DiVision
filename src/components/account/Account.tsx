import {
  CommandBarButton,
  CommandButton,
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
import { Profile } from "../../App";
import {
  updateUserProfile,
  updateUserProfilePhoto,
} from "../../firebase/FirebaseUtils";
import { ControlledTextField } from "../textfield/ControlledTextField";
import TitleBar from "../title-bar/TitleBar";
import "./Account.css";

interface AccountProps {
  user: User | null;
  profile: Profile;
  callback: () => void;
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

const Account: React.FC<AccountProps> = ({
  user,
  profile,
  callback,
}: AccountProps) => {
  const navigate = useNavigate();

  const fileInputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [isEditing, setIsEditing] = useState(false);
  const [tmpPhotoUrl, setTmpPhotoUrl] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user == null) {
      navigate("/login");
    }
  }, [user]);

  const goBack = (): void => {
    navigate(-1);
  }

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
  };

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
        if (photo) {
          updateUserProfilePhoto(photo).then(() => {
            updateUserProfile(data.alias, data.descriptor).then(() => {
              setIsEditing(false);
              setLoading(false);
              callback();
            });
          });
        } else {
          updateUserProfile(data.alias, data.descriptor).then(() => {
            setIsEditing(false);
            setLoading(false);
            callback();
          });
        }
      },
      (err) => { }
    )();
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        position: "absolute",
        width: "100vw",
        height: "calc(100vh - 3.5rem)",
        zIndex: 100,
        top: "3.5rem",
        alignItems: "center",
        overflowY: "auto"
      }}
    >
      {user !== null && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="account-card"
            style={{ boxShadow: DefaultEffects.elevation16 }}
          >
            <Stack
              style={{ width: "100%", zIndex: 1000 }}
              tokens={verticalGapStackTokens}
            >
              <Text variant={"xxLarge"} nowrap block>
                Profile Settings
              </Text>

              <div
                style={{
                  width: "100%",
                  alignItems: "center",
                  textAlign: "center",
                  justifyContent: "center ",
                }}
              >
                <Persona
                  {...persona}
                  presence={PersonaPresence.none}
                  className="account-picture"
                  initialsColor={PersonaInitialsColor.gold}
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
              <ControlledTextField
                onKeyDown={keyDown}
                label="Alias"
                control={controlProfile}
                name={nameof<Form>("alias")}
              />
              <ControlledTextField
                onKeyDown={
                  keyDown
                }
                label="Descriptor"
                control={controlProfile}
                name={nameof<Form>("descriptor")}
              />
              <Stack
                horizontal

                style={{
                  marginTop: 60,
                  height: "auto",
                  display: "flex",
                  justifyContent: "space-between",
                  bottom: 0
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
                    size={SpinnerSize.large}
                  />
                )}
                <PrimaryButton
                  disabled={!isEditing}
                  onClick={saveProfile}
                  style={{
                    height: "38px"
                  }}
                >
                  Save
                </PrimaryButton>
              </Stack>
            </Stack>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
