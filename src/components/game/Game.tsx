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
import EnemiesList from "../enemies-list/EnemiesList";
import MasterView from "../master-view/MasterView";
import PlayerStats from "../player-stats/PlayerStats";

interface GameProps {
  user: User | null;
  game: GameData;
  gameId: string;
  backgroundColor: string;
  primaryColor: string;
}

export interface PlayerMap {
  [key: string]: Player;
}

export interface Player {
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
  primaryColor,
}: GameProps) => {
  const navigate = useNavigate();
  const [master, setMaster] = useState<Player>({
    photoUrl: "",
    alias: "",
    email: "",
  });

  const [players, setPlayers] = useState<PlayerMap>({});

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
    const playersIds = game.players;
    if (playersIds) {
      const promises: Array<Promise<DataSnapshot>> = Object.keys(
        playersIds
      ).map((playerId) => {
        return getUserProfileById(playerId);
      });

      Object.keys(playersIds).forEach((playerId) => {
        getUserProfileById(playerId).then((snapshot) => {
          if (snapshot.val()) {
            setPlayers((old) => ({
              ...old,
              [playerId]: snapshot.val(),
            }));
          }
        });
      });
    }
  }, []);

  const gameMaster: IPersonaSharedProps = {
    imageUrl: master.photoUrl,
    imageInitials: master.email?.slice(0, 2).toUpperCase(),
    text: "",
  };

  const personas = useMemo(() => {
    return Object.values(players).map((player) => {
      return {
        personaName: "",
        imageUrl: player.photoUrl,
        imageInitials: player.email?.slice(0, 2).toUpperCase(),
      };
    });
  }, [players]);

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


  return (
    <div className="primary-div" ref={primaryRef}>
      <div className="secondary-div">
        {user !== null && (
          <div
            className="card"
            ref={cardRef}
            style={{
              boxShadow: DefaultEffects.elevation16,
              width: "clamp(20rem, 90vw, 40rem)",
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
              <Stack
                horizontal
                tokens={{
                  childrenGap: 40,
                }}
              >
                <div
                  style={{
                    width: 150,
                  }}
                >
                  <Text variant={"xLarge"} nowrap>
                    Game Master
                  </Text>
                  <Persona
                    {...gameMaster}
                    styles={{
                      root: {
                        marginTop: 20,
                        marginBottom: 10,
                        width: 0,
                      },
                    }}
                    presence={PersonaPresence.none}
                    initialsColor={PersonaInitialsColor.gold}
                    imageAlt=""
                    size={PersonaSize.size120}
                  />
                  <Text
                    variant={"large"}
                    block
                    nowrap
                    style={{
                      width: 120,
                      textAlign: "center",
                    }}
                  >
                    {master.alias ? master.alias : master.email}
                  </Text>
                </div>

                <div style={{
                  width: 80
                }}>
                  <Text variant={"xLarge"} nowrap>
                    Players
                  </Text>
                  <Facepile
                    personas={personas}
                    maxDisplayablePersonas={14}
                    overflowButtonType={OverflowButtonType.descriptive}
                    // addButtonProps={addButtonProps}
                    ariaDescription="To move through the items use left and right arrow keys."
                    styles={{
                      root: {
                        marginTop: "20px",

                      },
                      members: {
                        display: "flex",
                        flexWrap: "wrap",
                        width: "100%"
                      },
                    }}
                  />
                </div>

                {user?.uid === game.gameMasterId ? (
                  <div
                    style={{
                      overflowX: "auto",
                    }}
                  >
                    <Text variant={"xLarge"} nowrap>
                      Enemies
                    </Text>
                    <EnemiesList
                      selectedEnemy={game.selectedEnemy}
                      gameKey={gameId}
                      backgroundColor={backgroundColor}
                      primaryColor={primaryColor}
                      enemies={game.enemies}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      overflowX: "auto",
                    }}
                  >
                    <Text variant={"xLarge"} nowrap>
                      Current Roller
                    </Text>
                    <EnemiesList
                      selectedEnemy={game.selectedEnemy}
                      gameKey={gameId}
                      backgroundColor={backgroundColor}
                      primaryColor={primaryColor}
                      enemies={game.enemies}
                    />
                  </div>
                )}
              </Stack>
              {user?.uid === game.gameMasterId ? (
                <MasterView
                  gameKey={gameId}
                  selectedPlayer={game.selectedPlayer}
                  selectedWeapon={game.selectedWeapon}
                  selectedRoll={game.selectedRoll}
                  primaryColor={primaryColor}
                  characters={game.players}
                  players={players}
                  backgroundColor={backgroundColor}
                />
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
              </Stack>
            </Stack>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
