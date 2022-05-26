import {
  CommandBarButton,
  CommandButton,
  DefaultEffects,
  FontIcon,
  IStackTokens,
  PrimaryButton,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
} from "@fluentui/react";
import { User } from "firebase/auth";
import React, { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { addGameToUser, createNewGame } from "../../firebase/FirebaseUtils";
import { ControlledTextField } from "../textfield/ControlledTextField";

interface CreateGameProps {
  user: User | null;
  callback: () => void;
}

type Form = {
  name: string;
};

const verticalGapStackTokens: IStackTokens = {
  childrenGap: 40,
  padding: 10,
};

export const nameof = <T extends {}>(name: keyof T) => name;

const CreateGame: React.FC<CreateGameProps> = ({
  user,
  callback,
}: CreateGameProps) => {
  const navigate = useNavigate();

  const fileInputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [isEditing, setIsEditing] = useState(false);
  const [tmpPhotoUrl, setTmpPhotoUrl] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

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
      console.log("overflow");
      cardRef.current.style.top = "0";
    } else {
      cardRef.current.style.top = "auto";
    }
  }, []);

  const goBack = (): void => {
    navigate(-1);
  };

  const {
    handleSubmit: handleCreateGame,
    control: controlGame,
    getValues,
    formState,
    setValue: setProfileValue,
  } = useForm<Form, any>({
    defaultValues: {
      name: "",
    },
    reValidateMode: "onSubmit",
    mode: "all",
  });

  const watch = useWatch({control: controlGame});

  useEffect(() => {
    const values = getValues();
    if(formState.isValid &&values['name'].length > 0) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [watch])


  const changeHandler = (event: any) => {
    const file = event.target.files[0];
    const fileUrl = URL.createObjectURL(file);
    setTmpPhotoUrl(fileUrl);
    setIsEditing(true);
    setPhoto(file);
  };

  const keyDown = (e: any) => {
    if (e.key === "Enter") {
      createGame();
    }
  };

  const createGame = () => {
    handleCreateGame(
      (data) => {
        setLoading(true);
        createNewGame(photo, data.name).then((gameKey) => {
          addGameToUser(gameKey);
          setIsEditing(false);
          setLoading(false);
          callback();
        });
      },
      (_err) => {}
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
              <Text variant={"xxLarge"} nowrap block>
                Create Game
              </Text>
              <div
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  width: "1.5em",
                  height: "1.5em",
                  fontSize: 200,
                  backgroundColor: "#121212",
                  borderRadius: "5px",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  cursor: "pointer",
                  backgroundImage: `url(${tmpPhotoUrl})`,
                  backgroundSize: "cover",
                }}
                onClick={() => fileInputRef.current.click()}
              >
                {tmpPhotoUrl === "" && (
                  <FontIcon
                    iconName="FileImage"
                    style={{
                      fontSize: 200,
                    }}
                  />
                )}
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
                  text="Upload Game Image"
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
                label="Name"
                autoComplete="off"
                control={controlGame}
                minLength={1}
                maxLength={10}
                name={nameof<Form>("name")}
                rules={{
                  pattern: {
                    value: /^[a-zA-Z0-9 ]+$/i,
                    message: "This is not a valid game name",
                  },
                  required: "This field is required",
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
    </div>
  );
};

export default CreateGame;
