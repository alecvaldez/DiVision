import {
  CommandButton,
  DefaultEffects,
  Facepile,
  IPersonaSharedProps,
  IStackTokens,
  OverflowButtonType,
  Persona,
  PersonaInitialsColor,
  PersonaPresence,
  PersonaSize,
  PrimaryButton,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
} from "@fluentui/react";
import { User } from "firebase/auth";
import { DataSnapshot } from "firebase/database";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { GameData } from "../../App";
import { getGame, getUserProfileById } from "../../firebase/FirebaseUtils";
import PlayerStats from "../player-stats/PlayerStats";

interface GameProps {
  user: User | null;
  game: GameData;
  gameId: string;
  backgroundColor: string;
}

interface Player {
  photoUrl: string;
  alias: string;
  email: string;
}

type Form = {
  gameId: string;
};

const verticalGapStackTokens: IStackTokens = {
  childrenGap: 40,
  padding: 10,
};

export const nameof = <T extends {}>(name: keyof T) => name;

const Game: React.FC<GameProps> = ({
  user,
  game,
  gameId,
  backgroundColor,
}: GameProps) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [joinError, setJoinError] = useState(false);
  const [master, setMaster] = useState<Player>({
    photoUrl: "",
    alias: "",
    email: "",
  });

  const [players, setPlayers] = useState<Array<Player>>([]);

  const primaryRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const cardRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  useEffect(() => {
    getUserProfileById(game.gameMasterId).then((snapshot) => {
      if (snapshot.exists()) {
        const value = snapshot.val();
        setMaster(() => ({
          photoUrl: value.photoUrl,
          alias: value.alias,
          email: value.email,
        }));
      }
    });
  }, []);

  useEffect(() => {
    console.log(game);
    const playersIds = game.players;
    if (playersIds) {
      const promises: Array<Promise<DataSnapshot>> = Object.keys(
        playersIds
      ).map((playerId) => {
        return getUserProfileById(playerId);
      });
      Promise.all(promises).then((profiles) => {
        const profilesData: Array<Player> = profiles.map((snapshot) => {
          return snapshot.val() as Player;
        });
        setPlayers(profilesData);
      });
    }
  }, []);

  const gameMaster: IPersonaSharedProps = {
    imageUrl: master.photoUrl,
    imageInitials: master.email?.slice(0, 2).toUpperCase(),
    text: master.alias === "" ? master.email : master.alias,
    secondaryText: "Game Master",
  };

  const personas = useMemo(() => {
    return players.map((player) => {
      return {
        personaName: player.alias !== "" ? player.alias : player.email,
        imageUrl: player.photoUrl,
        imageInitials: player.email?.slice(0, 2).toUpperCase(),
      };
    });
  }, [players]);

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
            style={{
              boxShadow: DefaultEffects.elevation16,
              width: "clamp(20rem, 90vw, 60rem)",
            }}
          >
            <Stack
              style={{ width: "100%", zIndex: 1000 }}
              tokens={verticalGapStackTokens}
            >
              <div
                style={{
                  display: "inline-block",
                }}
              >
                <Text variant={"xxLarge"} nowrap>
                  {game.name}
                </Text>
                <Text
                  variant={"large"}
                  nowrap
                  style={{ float: "right", lineHeight: "37px" }}
                >
                  {gameId}
                </Text>
              </div>

              <Persona
                {...gameMaster}
                presence={PersonaPresence.none}
                initialsColor={PersonaInitialsColor.gold}
                imageAlt=""
                size={PersonaSize.size120}
              />
              <div>
                <Text variant={"xLarge"} nowrap>
                  Players
                </Text>
                <Facepile
                  personas={personas}
                  maxDisplayablePersonas={14}
                  overflowButtonType={OverflowButtonType.descriptive}
                  // showAddButton
                  // addButtonProps={addButtonProps}
                  ariaDescription="To move through the items use left and right arrow keys."
                  styles={{
                    root: {
                      marginTop: "20px",
                    },
                  }}
                />
              </div>
              {user?.uid === game.gameMasterId ? (
                <></>
              ) : (
                <PlayerStats
                  character={game.players[user?.uid]}
                  backgroundColor={backgroundColor}
                />
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
