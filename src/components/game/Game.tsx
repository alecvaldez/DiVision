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
  TeachingBubble,
  Text,
} from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { User } from "firebase/auth";
import { DataSnapshot } from "firebase/database";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { GameData, getPersonaIntialsColor } from "../../App";
import {
  getGame,
  getUserProfileById,
  setEnemyHP,
  setRoll1,
  setRoll2,
  setRollTurn,
} from "../../firebase/FirebaseUtils";
import EnemiesList from "../enemies-list/EnemiesList";
import MasterView from "../master-view/MasterView";
import PlayerStats from "../player-stats/PlayerStats";
import RollModal from "../roll-modal/RollModal";

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

  console.log()
  const [players, setPlayers] = useState<PlayerMap>({});

  const primaryRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const cardRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const [
    isPlayerModalOpen,
    { setTrue: showPlayerModal, setFalse: hidePlayerModal },
  ] = useBoolean(false);

  const [
    isEnemyModalOpen,
    { setTrue: showEnemyModal, setFalse: hideEnenmyModal },
  ] = useBoolean(false);

  const playerRollId = useId("rollPlayer");

  const [playerHitBubble, { toggle: togglePlayerHitBubble }] =
    useBoolean(false);

  const [playerHitValue, setPlayerHitValue] = useState("Hit");

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
    initialsColor: getPersonaIntialsColor(master.email),
  };

  const personas = useMemo(() => {
    return Object.values(players).map((player) => {
      return {
        personaName: "",
        imageUrl: player.photoUrl,
        imageInitials: player.email?.slice(0, 2).toUpperCase(),
        initialsColor: getPersonaIntialsColor(player.email),
      };
    });
  }, [players]);

  const currentRoller = useMemo(() => {
    return {
      personaName: "",
      initialsColor: players[game.selectedPlayer]
        ? getPersonaIntialsColor(players[game.selectedPlayer].email)
        : 0,
      imageUrl: players[game.selectedPlayer]
        ? players[game.selectedPlayer].photoUrl
        : "",
      imageInitials: players[game.selectedPlayer]
        ? players[game.selectedPlayer].email?.slice(0, 2).toUpperCase()
        : "",
    };
  }, [game.selectedPlayer, players]);

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
          <>
            {user?.uid === game.gameMasterId && (
              <>
                {playerHitBubble && (
                  <TeachingBubble
                    target={`#${playerRollId}`}
                    onDismiss={togglePlayerHitBubble}
                    headline={playerHitValue}
                  />
                )}
                <RollModal
                  primaryColor={primaryColor}
                  name="Roll Player"
                  isModalOpen={isPlayerModalOpen}
                  hideModal={hidePlayerModal}
                  rollCallback={(roll) => {
                    if (game.players[game.selectedPlayer].rollTurn == 0) {
                      const enemyAC = game.enemies[game.selectedEnemy].ac;
                      const selectedWeapon = game.players[game.selectedPlayer].selectedWeapon;
                      const hit = roll + game.players[game.selectedPlayer].weapons[selectedWeapon].bonus;
                      setRoll1(gameId, hit, game.selectedPlayer);

                      if (hit > enemyAC) {
                        setRollTurn(gameId, 1, game.selectedPlayer);
                        setPlayerHitValue("Enemy Hit");
                      } else {
                        setPlayerHitValue("Enemy Missed");
                      }
                    } else {
                      const enemyHP = game.enemies[game.selectedEnemy].hp;
                      const enemyName = game.enemies[game.selectedEnemy].name;
                      const selectedWeapon = game.players[game.selectedPlayer].selectedWeapon;
                      const hit = roll + game.players[game.selectedPlayer].weapons[selectedWeapon].modifier;

                      setEnemyHP(gameId, game.selectedEnemy, enemyHP - hit);
                      setRoll2(gameId, hit, game.selectedPlayer);
                      setRollTurn(gameId, 0, game.selectedPlayer);
                      setPlayerHitValue(
                        `${enemyName} new health - ${enemyHP - hit}`
                      );
                    }
                    togglePlayerHitBubble();
                    setTimeout(() => {
                      togglePlayerHitBubble();
                    }, 5000)
                  }}
                />
                <RollModal
                  primaryColor={primaryColor}
                  name="Roll Enemy"
                  isModalOpen={isEnemyModalOpen}
                  hideModal={hideEnenmyModal}
                  rollCallback={(roll) => {
                    console.log(roll);
                  }}
                />
              </>
            )}

            <div
              className="card"
              ref={cardRef}
              style={{
                boxShadow: DefaultEffects.elevation16,
                width: "clamp(20rem, 90vw, 40rem)",
                overflowX: "auto",
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
                      width: "25%",
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

                  <div
                    style={{
                      width: "25%",
                    }}
                  >
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
                          width: "100%",
                        },
                      }}
                    />
                  </div>

                  {user?.uid === game.gameMasterId ? (
                    <div
                      style={{
                        width: "100%",
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
                    <Stack
                      horizontal
                      style={{
                        width: "50%",
                      }}
                    >
                      <div
                        style={{
                          width: "50%",
                        }}
                      >
                        <Text variant={"xLarge"} nowrap>
                          Rolls
                        </Text>
                        <Spinner
                          style={{
                            position: "absolute",
                            transform: "translate(10px, 124px) scale(3) ",
                          }}
                          size={SpinnerSize.large}
                        />
                        {user.uid &&
                        game.players[user.uid] &&
                        !game.players[user.uid].roll1 ? (
                          <Spinner
                            style={{
                              position: "absolute",
                              transform: "translate(10px, 30px) scale(3) ",
                            }}
                            size={SpinnerSize.large}
                          />
                        ) : (
                          <Stack
                            style={{
                              padding: 0,
                              width: 84,
                              height: 84,
                              position: "absolute",
                              transform: "translate(-17px, 2px)",
                              border: `5px solid ${primaryColor}`,
                              borderRadius: 84,
                            }}
                          >
                            <Text
                              variant={"xxLarge"}
                              style={{
                                lineHeight: "84px",
                                width: "100%",
                                textAlign: "center",
                                transform: "translateY(-5px)",
                                color: primaryColor,
                              }}
                            >
                              {game.players[user.uid].roll1}
                            </Text>
                          </Stack>
                        )}
                        {user.uid &&
                        game.players[user.uid] &&
                        !game.players[user.uid].roll2 ? (
                          <Spinner
                            style={{
                              position: "absolute",
                              transform: "translate(10px, 124px) scale(3) ",
                            }}
                            size={SpinnerSize.large}
                          />
                        ) : (
                          <Stack
                            style={{
                              padding: 0,
                              width: 84,
                              height: 84,
                              border: `5px solid ${primaryColor}`,
                              transform: "translate(-17px, 96px)",
                              borderRadius: 84,
                            }}
                          >
                            <Text
                              variant={"xxLarge"}
                              style={{
                                lineHeight: "84px",
                                width: "100%",
                                textAlign: "center",
                                transform: "translateY(-5px)",
                                color: primaryColor,
                              }}
                            >
                              {game.players[user.uid].roll2}
                            </Text>
                          </Stack>
                        )}
                      </div>
                      <div
                        style={{
                          width: "50%",
                        }}
                      >
                        <Text variant={"xLarge"} nowrap>
                          Current Roller
                        </Text>
                        <Persona
                          {...currentRoller}
                          styles={{
                            root: {
                              width: 0,
                              // marginLeft: "auto",
                              marginTop: 20,
                              display: "block",
                            },
                          }}
                          presence={PersonaPresence.none}
                          imageAlt=""
                          size={PersonaSize.size120}
                        />
                        {players[game.selectedPlayer] && (
                          <Text
                            variant={"large"}
                            block
                            nowrap
                            style={{
                              width: 120,
                              textAlign: "center",
                              marginTop: 10,
                            }}
                          >
                            {players[game.selectedPlayer].alias
                              ? players[game.selectedPlayer].alias
                              : players[game.selectedPlayer].email}
                          </Text>
                        )}
                      </div>
                    </Stack>
                  )}
                </Stack>
                {user?.uid === game.gameMasterId ? (
                  <>
                    <MasterView
                      gameKey={gameId}
                      selectedPlayer={game.selectedPlayer}
                      primaryColor={primaryColor}
                      characters={game.players}
                      players={players}
                      backgroundColor={backgroundColor}
                    />
                    <Stack
                      horizontal
                      tokens={{
                        childrenGap: 10,
                      }}
                    >
                      <PrimaryButton
                        disabled={
                          !game.selectedPlayer ||
                          !game.players[game.selectedPlayer].selectedWeapon ||
                          !game.selectedEnemy ||
                          game.players[game.selectedPlayer].rollTurn == undefined
                        }
                        id={playerRollId}
                        onClick={showPlayerModal}
                      >
                        Roll Player
                      </PrimaryButton>
                      <PrimaryButton
                        disabled={
                          !game.selectedPlayer ||
                          !game.players[game.selectedPlayer].selectedWeapon ||
                          !game.selectedEnemy ||
                          game.players[game.selectedPlayer].rollTurn == undefined
                        }
                        onClick={showEnemyModal}
                      >
                        Roll Enemy
                      </PrimaryButton>
                    </Stack>
                  </>
                ) : (
                  <PlayerStats
                    primaryColor={primaryColor}
                    gameKey={gameId}
                    uid={user?.uid}
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
          </>
        )}
      </div>
    </div>
  );
};

export default Game;
