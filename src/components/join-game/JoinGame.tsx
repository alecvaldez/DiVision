import {
  CommandButton,
  DefaultEffects,
  IStackTokens,
  PrimaryButton,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
} from "@fluentui/react";
import { User } from "firebase/auth";
import { watch } from "fs";
import React, { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  addGameToUser,
  addPlayerToGame,
  getGame,
} from "../../firebase/FirebaseUtils";
import { ControlledTextField } from "../textfield/ControlledTextField";

interface JoinGameProps {
  user: User | null;
  callback: () => void;
}

type Form = {
  gameId: string;
};

const verticalGapStackTokens: IStackTokens = {
  childrenGap: 40,
  padding: 10,
};

export const nameof = <T extends {}>(name: keyof T) => name;

const JoinGame: React.FC<JoinGameProps> = ({
  user,
  callback,
}: JoinGameProps) => {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [joinError, setJoinError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const primaryRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const cardRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const checkOverflow = (): boolean => {
    return primaryRef.current.offsetHeight < cardRef.current.offsetHeight;
  };

  const {
    handleSubmit: handleJoinGame,
    getValues,
    formState,
    control: controlJoin,
    setValue: setProfileValue,
  } = useForm<Form, any>({
    defaultValues: {
      gameId: "",
    },
    reValidateMode: "onSubmit",
    mode: "all",
  });

  const watch = useWatch({ control: controlJoin });

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

  useEffect(() => {
    const values = getValues();
    if (values["gameId"].length == 5) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [watch]);

  const goBack = (): void => {
    navigate(-1);
  };

  const keyDown = (e: any) => {
    if (e.key === "Enter") {
      joinGame();
    }
  };

  const joinGame = () => {
    handleJoinGame(
      (data) => {
        setLoading(true);
        const gameKey = data.gameId.toUpperCase();
        getGame(gameKey).then((snapshot) => {
          if (snapshot.exists()) {
            const value = snapshot.val();
            const userId = user?.uid;
            if (
              userId && value.players && 
              (value.players[userId] || value.gameMasterId === userId)
            ) {
              setJoinError(true);
              setErrorMessage("You have already joined this game");
            } else {
              setJoinError(false);
              addGameToUser(gameKey);
              callback();
              addPlayerToGame(gameKey).then(() => {
                navigate(`/create-character/${gameKey}`);
              });
            }
          } else {
            setJoinError(true);
            setErrorMessage("Invalid Game ID");
          }
          setLoading(false);
        });
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
              <Text variant={"xxLarge"} nowrap block>
                Join Game
              </Text>

              <ControlledTextField
                onKeyDown={keyDown}
                onError={() => console.log("kek")}
                label="Game ID"
                autoComplete="off"
                control={controlJoin}
                maxLength={5}
                minLength={5}
                name={nameof<Form>("gameId")}
                rules={{
                  pattern: {
                    value: /^[A-Z0-9]+$/i,
                    message: "This is not a valid game id",
                  },
                  required: "This field is required",
                }}
              />
              {joinError ? (
                <Text
                  className="error-text"
                  style={{
                    margin: 0,
                    height: 64,
                  }}
                  block
                  variant="large"
                >
                  {errorMessage}
                </Text>
              ) : (
                <Stack style={{ height: "64px", margin: 0 }}> </Stack>
              )}
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
                  onClick={joinGame}
                  style={{
                    height: "38px",
                  }}
                >
                  Join
                </PrimaryButton>
              </Stack>
            </Stack>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinGame;
