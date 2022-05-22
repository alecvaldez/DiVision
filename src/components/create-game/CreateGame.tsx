import {
  CommandButton,
  ContextualMenu,
  DefaultEffects,
  DirectionalHint,
  FontIcon,
  Icon,
  IconButton,
  IContextualMenuItem,
  IPersonaSharedProps,
  IStackTokens,
  Persona,
  PersonaPresence,
  PersonaSize,
  PrimaryButton,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
} from "@fluentui/react";
import { getAuth, User } from "firebase/auth";
import React, { ReactElement, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Navigate,
  NavigateFunction,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { firebaseLogout } from "../../firebase/FirebaseUtils";
import { ControlledTextField } from "../textfield/ControlledTextField";
import TitleBar from "../title-bar/TitleBar";
import "./CreateGame.css";

interface CreateGameProps {
  user: User | null;
}

type Form = {
  name: string;
};

const verticalGapStackTokens: IStackTokens = {
  childrenGap: 40,
  padding: 10,
};

export const nameof = <T extends {}>(name: keyof T) => name;

const CreateGame: React.FC<CreateGameProps> = ({ user }: CreateGameProps) => {
  const navigate = useNavigate();

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
  };

  const {
    handleSubmit: handleCreateGame,
    control: controlGame,
    setValue: setProfileValue,
  } = useForm<Form, any>({
    defaultValues: {
      name: "",
    },
    reValidateMode: "onSubmit",
    mode: "all",
  });

  const email = user?.email;

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
        createGame();
    }
  };

  const createGame = () => {
    handleCreateGame(
      (data) => {
        setLoading(true);
      },
      (err) => {}
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
        alignItems: "center",
        overflowY: "auto",
      }}
    >
      {user !== null && (

          <div
            className="account-card"
            style={{ boxShadow: DefaultEffects.elevation16 }}
          >
            <Stack
              style={{ width: "100%", zIndex: 1000 }}
              tokens={verticalGapStackTokens}
            >
              <Text variant={"xxLarge"} nowrap block>
                Create Game
              </Text>

              <ControlledTextField
                onKeyDown={keyDown}
                label="Name"
                autoComplete="off"
                control={controlGame}
                maxLength={10}
                name={nameof<Form>("name")}
                rules={{
                    pattern: {
                        value: /^[a-zA-Z0-9 ]+$/i,
                        message: "This is not a valid game name",
                    },
                    required: "This field is required"
                }}
              />
              <Stack
                horizontal
                style={{
                  marginTop: 60,
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
                  onClick={createGame}
                  style={{
                    height: "38px",
                  }}
                >
                  Create
                </PrimaryButton>
              </Stack>
            </Stack>
          </div>
      )}
    </div>
  );
};

export default CreateGame;
