import {
  Callout,
  CommandButton,
  DefaultButton,
  DefaultEffects,
  Dialog,
  DialogFooter,
  DialogType,
  IconButton,
  IDialogContentProps,
  Modal,
  PrimaryButton,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
} from "@fluentui/react";
import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GamesMap } from "../../App";
import { useBoolean, useId } from "@fluentui/react-hooks";
import "./Dashboard.css";
import {
  removeGameFromUser,
  removeGameListener,
  removePlayerFromGame,
} from "../../firebase/FirebaseUtils";

interface DashboardProps {
  user: User | null;
  games: GamesMap;
  textColor: string;
  callback: () => void;
}

const dialogContentProps: IDialogContentProps = {
  type: DialogType.normal,
  title: "Remove Game",
  closeButtonAriaLabel: "Close",
  subText: "Are you sure you want to remove this game from your Dashboard?",
  showCloseButton: true,
};

const Dashboard: React.FC<DashboardProps> = ({
  user,
  games,
  textColor,
  callback,
}: DashboardProps) => {
  const navigate = useNavigate();
  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] =
    useBoolean(false);
  const [loading, setLoading] = useState(false);

  const [selectedGame, setSelectedGame] = useState("");

  useEffect(() => {
    if (user == null) {
      navigate("/login");
    }
  }, [user]);

  const goCreateGame = (): void => {
    navigate("/create-game");
  };

  const goJoinGame = (): void => {
    navigate("/join-game");
  };

  const removeGame = (gameKey: string): void => {
    setLoading(true);
    removeGameFromUser(gameKey).then(() => {
      removePlayerFromGame(gameKey).then(() => {
        callback();
        removeGameListener(gameKey);
        setLoading(false);
        hideModal();
      });
    });
  };

  return (
    <div className="primary-div">
      <div className="secondary-div">
        {user !== null && (
          <div className="games-div">
            <Modal
              isOpen={isModalOpen}
              onDismiss={hideModal}
              isBlocking={false}
            >
              <div
                style={{
                  width: 340,
                }}
              >
                <div
                  style={{
                    padding: "16px 46px  20px 24px",
                    width: 340,
                    boxSizing: "border-box",
                  }}
                >
                  <Text variant={"xLarge"} nowrap>
                    Remove Game
                  </Text>
                </div>
                <div
                  style={{
                    padding: "0px 24px 24px 24px",
                    width: 340,
                    boxSizing: "border-box",
                  }}
                >
                  <Text variant={"medium"}>
                    Are you sure you want to remove this game from your
                    Dashboard?
                  </Text>
                  <Stack
                    horizontal
                    style={{
                      marginTop: 24,
                      justifyContent: "right",
                    }}
                    tokens={{
                      childrenGap: 10,
                    }}
                  >
                    {loading && (
                      <Spinner
                        style={{
                          marginLeft: "auto",
                        }}
                        size={SpinnerSize.large}
                      />
                    )}
                    <PrimaryButton
                      onClick={() => {
                        removeGame(selectedGame);
                      }}
                    >
                      Remove
                    </PrimaryButton>
                    <DefaultButton onClick={hideModal}>
                      Don't Remove
                    </DefaultButton>
                  </Stack>
                </div>
              </div>
            </Modal>
            <div
              className="game-card"
              style={{
                boxShadow: DefaultEffects.elevation64,
              }}
            >
              <Text
                variant={"large"}
                style={{
                  position: "absolute",
                  textAlign: "center",
                  height: "18rem",
                  width: "18rem",
                  lineHeight: "420px",
                  zIndex: 200,
                  pointerEvents: "none",
                }}
                nowrap
                block
              >
                New Game
              </Text>
              <IconButton
                iconProps={{ iconName: "Add" }}
                style={{
                  height: "100%",
                  width: "100%",
                  fontSize: "40px",
                  borderRadius: "5px",
                }}
                styles={{
                  rootHovered: {
                    backgroundColor: "rgba(0,0,0, 0.3)",
                  },
                  rootPressed: {
                    backgroundColor: "rgba(0,0,0, 0.5)",
                  },
                  icon: {
                    fontSize: "150%",
                    color: textColor,
                  },
                }}
                onClick={goCreateGame}
              />
            </div>
            <div
              className="game-card"
              style={{
                boxShadow: DefaultEffects.elevation64,
              }}
            >
              <Text
                variant={"large"}
                style={{
                  position: "absolute",
                  textAlign: "center",
                  height: "18rem",
                  width: "18rem",
                  lineHeight: "420px",
                  zIndex: 200,
                  pointerEvents: "none",
                }}
                nowrap
                block
              >
                Join Game
              </Text>
              <IconButton
                iconProps={{ iconName: "ReleaseGate" }}
                style={{
                  height: "100%",
                  width: "100%",
                  fontSize: "40px",
                  borderRadius: "5px",
                }}
                styles={{
                  rootHovered: {
                    backgroundColor: "rgba(0,0,0, 0.3)",
                  },
                  rootPressed: {
                    backgroundColor: "rgba(0,0,0, 0.5)",
                  },
                  icon: {
                    fontSize: "150%",
                    color: textColor,
                  },
                }}
                onClick={goJoinGame}
              />
            </div>
            {Object.entries(games).map(([key, value]) => {
              return (
                <div
                  className="game-card"
                  key={key}
                  style={{
                    boxShadow: DefaultEffects.elevation64,
                    justifyContent: "center",
                    backgroundSize: "cover",
                    textAlign: "center",
                    alignContent: "center",
                    backgroundImage: `url(${value.imgUrl})`,
                  }}
                >
                  <CommandButton
                    iconProps={{ iconName: "Cancel" }}
                    onClick={() => {
                      setSelectedGame(key);
                      showModal();
                    }}
                    style={{
                      position: "absolute",
                      zIndex: 2000,
                      right: 0,
                    }}
                    styles={{
                      icon: {
                        color: textColor,
                      },
                    }}
                  />
                  <Text
                    variant={"xxLargePlus"}
                    style={{
                      marginTop: "40%",
                      width: "100%",
                      zIndex: 11,
                      left: 0,
                      borderRadius: "5px",
                      position: "absolute",
                      pointerEvents: "none",
                    }}
                    nowrap
                  >
                    {value.name}
                  </Text>
                  <Text
                    variant={"xLarge"}
                    style={{
                      marginTop: "60%",
                      width: "100%",
                      left: 0,
                      zIndex: 11,
                      pointerEvents: "none",
                      borderRadius: "5px",
                      position: "absolute",
                    }}
                  >
                    {key}
                  </Text>
                  <PrimaryButton
                    style={{
                      height: "100%",
                      width: "100%",
                      borderRadius: "5px",
                      alignItems: "center",
                      display: "block",
                      zIndex: 10,
                      flexWrap: "wrap",
                    }}
                    onClick={() => {
                      navigate(`/game/${key}`);
                    }}
                    styles={{
                      root: {
                        backgroundColor: "rgba(0,0,0,0.2)",
                        borderColor: "rgba(0,0,0,0)",
                      },
                      rootHovered: {
                        backgroundColor: "rgba(0,0,0, 0.3)",
                        borderColor: "rgba(0,0,0,0)",
                      },
                      rootPressed: {
                        backgroundColor: "rgba(0,0,0, 0.5)",
                        borderColor: "rgba(0,0,0,0)",
                      },
                      icon: {
                        fontSize: "150%",
                        color: "#d9d9d9",
                      },
                    }}
                  ></PrimaryButton>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
