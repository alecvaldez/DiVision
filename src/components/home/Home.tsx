import { DefaultButton, PrimaryButton } from "@fluentui/react";
import { Text } from "@fluentui/react/lib/Text";
import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Profile } from "../../App";
import "./Home.css";

interface HomeProps {
  user: User | null;
  profile: Profile;
  profileLoaded: boolean;
}

const Home: React.FC<HomeProps> = ({
  user,
  profile,
  profileLoaded,
}: HomeProps) => {
  const navigate = useNavigate();

  const goToDashboard = (): void => {
    navigate("/dashboard");
  }

  const getWelcomeName = (): string => {
    if (profile.alias !== "") {
      return profile.alias;
    } else if (user?.email) {
      return user.email;
    } else {
      return "User";
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        position: "absolute",
        width: "100vw",
        height: "100vh",
        zIndex: 100,
        backgroundColor: "#121212",
      }}
    >
      {profileLoaded && (
        <div style={{ whiteSpace: "pre-wrap", textAlign: "center", lineHeight: "100px", marginTop: "30vh" }}>
          <Text variant={"mega"} className="welcome-text" nowrap block>
            Welcome, {getWelcomeName()}
          </Text>
          <Text variant={"xxLargePlus"} className="info-text" nowrap block>
            Click to access your DiVision Dashboard
          </Text>
          <PrimaryButton onClick={goToDashboard} className="info-text" style={{width: "100%", height: "3rem", fontSize: "20pt"}}>
            Dashboard
          </PrimaryButton>
        </div>
      )}
    </div>
  );
};

export default Home;
