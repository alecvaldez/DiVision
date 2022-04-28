import { DefaultEffects, Stack } from "@fluentui/react";
import { User } from "firebase/auth";
import React from "react";
import TitleBar from "../title-bar/TitleBar";
import "./Account.css";

interface AccountProps {
    user: User | null;
}

const Account: React.FC<AccountProps> = ({ user }: AccountProps) => {
    return (
        <div
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#121212",
          position: "absolute",
          width: "100vw",
          height: "100vh",
          alignItems: "center",
        }}
      >
        {user !== null && (
          <Stack
            style={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TitleBar user={user} />
            <div className="games-div">
              <Stack>
                <div
                  className="game-card"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    boxShadow: DefaultEffects.elevation16,
                  }}
                >
                  Hello
                </div>
              </Stack>
            </div>
          </Stack>
        )}
      </div>
    );
};

export default Account;
