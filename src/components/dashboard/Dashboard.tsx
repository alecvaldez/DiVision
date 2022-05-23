import {
  DefaultEffects,
  IconButton,
  PrimaryButton,
  Text,
} from "@fluentui/react";
import { User } from "firebase/auth";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GamesData, Profile } from "../../App";
import "./Dashboard.css";

interface DashboardProps {
  user: User | null;
  games: GamesData;
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  games,
}: DashboardProps) => {
  const navigate = useNavigate();
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
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {user !== null && (
        <>
          <div
            style={{
              display: "flex",
              width: "100vw",
              height: "100vh",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="games-div">
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
                      color: "#d9d9d9",
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
                      color: "#d9d9d9",
                    },
                  }}
                  onClick={goJoinGame}
                />
              </div>
              {games.map((game) => {
                return (
                  <div
                    className="game-card"
                    key={game.key}
                    style={{
                      boxShadow: DefaultEffects.elevation64,
                      justifyContent: "center",
                      backgroundSize: "cover",
                      textAlign: "center",
                      alignContent: "center",
                      backgroundImage: `url(${game.imgUrl})`,
                    }}
                  >
                                          <Text
                        variant={"xxLargePlus"}
                        style={{
                          marginTop: "40%",
                          width: "100%",
                          zIndex: 11,
                          left: 0,
                          borderRadius: "5px",
                          position: "absolute"
                        }}
                        nowrap
                        
                      >
                        {game.name}
                      </Text>
                      <Text
                        variant={"xLarge"}
                        style={{
                          marginTop: "60%",
                          width: "100%",
                          left: 0,
                          zIndex: 11,

                          borderRadius: "5px",
                          position: "absolute"

                        }}
                        
                      >
                        {game.key}
                      </Text>
                    <PrimaryButton
                      style={{
                        height: "100%",
                        width: "100%",
                        borderRadius: "5px",
                        alignItems: "center",
                        display: "block",
                        zIndex: 10,
                        flexWrap: "wrap"

                      }}
                      styles={{
                        root: {
                          backgroundColor: "rgba(0,0,0,0.2)",
                          borderColor: "rgba(0,0,0,0)"
                        },
                        rootHovered: {
                          backgroundColor: "rgba(0,0,0, 0.3)",
                          borderColor: "rgba(0,0,0,0)"
                        },
                        rootPressed: {
                          backgroundColor: "rgba(0,0,0, 0.5)",
                          borderColor: "rgba(0,0,0,0)"
                        },
                        icon: {
                          fontSize: "150%",
                          color: "#d9d9d9",
                        },
                      }}
                    >

                    </PrimaryButton>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
