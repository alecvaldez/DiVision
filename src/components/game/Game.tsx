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
import { useNavigate, useParams } from "react-router-dom";
import { GameData } from "../../App";
import { addGameToUser, getGame } from "../../firebase/FirebaseUtils";
import { ControlledTextField } from "../textfield/ControlledTextField";

interface GameProps {
  user: User | null;
  game: GameData;
  gameId: string;
}

type Form = {
  gameId: string;
};

const verticalGapStackTokens: IStackTokens = {
  childrenGap: 40,
  padding: 10,
};

export const nameof = <T extends {}>(name: keyof T) => name;

const Game: React.FC<GameProps> = ({ user, game, gameId }: GameProps) => {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [joinError, setJoinError] = useState(false);

  const primaryRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const cardRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const checkOverflow = (): boolean => {
    return primaryRef.current.offsetHeight < cardRef.current.offsetHeight;
  };

  const {
    handleSubmit: handleGame,
    getValues,
    formState,
    control: controlGame,
    setValue: setGameValue,
  } = useForm<Form, any>({
    defaultValues: {
      gameId: "",
    },
    reValidateMode: "onSubmit",
    mode: "all",
  });

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

  //   useEffect(() => {
  //     const values = getValues();
  //     if (formState.isValid && values["gameId"].length == 5) {
  //       setIsEditing(true);
  //     } else {
  //       setIsEditing(false);
  //     }
  //   }, [watch]);

  const goBack = (): void => {
    navigate(-1);
  };

  const keyDown = (e: any) => {
    if (e.key === "Enter") {
      joinGame();
    }
  };

  const joinGame = () => {
    handleGame(
      (data) => {
        setLoading(true);
        getGame(data.gameId).then((snapshot) => {
          // if (snapshot.exists()) {
          //   setJoinError(false);
          //   addGameToUser(data.gameId);
          //   callback();
          // } else {
          //   setJoinError(true);
          // }
          // setLoading(false);
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
                {game.name}
              </Text>
              <Text variant={"large"} nowrap block>
                {gameId}
              </Text>

              <ControlledTextField
                onKeyDown={keyDown}
                onError={() => console.log("error")}
                label="Game ID"
                autoComplete="off"
                control={controlGame}
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
                  }}
                  block
                  variant="large"
                >
                  Invalid Game ID
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

export default Game;
