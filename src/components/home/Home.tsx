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
  noProfile: boolean;
  setSigin: (bool: boolean) => void;
}

const Home: React.FC<HomeProps> = ({
  user,
  profile,
  profileLoaded,
  noProfile,
  setSigin
}: HomeProps) => {
  const navigate = useNavigate();

  const goToDashboard = (): void => {
    navigate("/dashboard");
  };

  const goToCreateAccount = (): void => {
    setSigin(false);
    navigate("/login");
  };

  const goToLogin = (): void => {
    navigate("/login");
  };

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
        overflowX: "scroll",
        overflowY: "scroll"
      }}
    >
      {profileLoaded && (
        <div
          className="welcome-container"
          style={{
            whiteSpace: "pre-wrap",
            textAlign: "center",
            lineHeight: "100px",
          }}
        >
          <Text variant={"mega"} className="welcome-text"  block>
            Welcome, {getWelcomeName()}
          </Text>
          <Text variant={"xxLargePlus"} className="info-text"  block>
            Click to access your DiVision Dashboard
          </Text>
          <PrimaryButton
            onClick={goToDashboard}
            className="info-text"
            style={{ width: "300px", height: "3rem", fontSize: "20pt" }}
          >
            Dashboard
          </PrimaryButton>
        </div>
      )}
      {!profileLoaded && noProfile && (
        <div
          className="welcome-container"
          style={{
            whiteSpace: "pre-wrap",
            textAlign: "center",
            lineHeight: "100px",
          }}
        >
          <Text variant={"mega"} className="welcome-text" block>
            Welcome to DiVision!
          </Text>
          <Text variant={"xxLargePlus"} className="info-text" block>
            Click to Login or Create a New Account
          </Text>
          <PrimaryButton
            onClick={goToLogin}
            className="info-text"
            style={{
              width: "250px",
              height: "3rem",
              marginRight: "20px",
              fontSize: "20pt",
            }}
          >
            Login
          </PrimaryButton>
          <PrimaryButton
            onClick={goToCreateAccount}
            className="info-text"
            style={{
              width: "250px",
              marginLeft: "20px",
              height: "3rem",
              fontSize: "20pt",
            }}
          >
            Create Account
          </PrimaryButton>
        </div>
      )}
    </div>
  );
};

export default Home;
