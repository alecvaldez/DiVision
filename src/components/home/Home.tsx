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
  backgroundColor: string;
  setSigin: (bool: boolean) => void;
}

const Home: React.FC<HomeProps> = ({
  user,
  profile,
  profileLoaded,
  noProfile,
  backgroundColor,
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
      className="primary-div"
      style={{
        backgroundColor: backgroundColor,
      }}
    >
      <div className="secondary-div">

        {profileLoaded && (
          <div
            className="welcome-container"
            style={{
              textAlign: "center",
              lineHeight: "100px",
            }}
          >
            <Text variant={"mega"} className="welcome-text" block>
              Welcome, {getWelcomeName()}
            </Text>
            <Text variant={"xxLargePlus"} className="info-text" block>
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
            <div style={{
              display: "flex",
              paddingBottom: "60px",
              justifyContent: "center"
            }}>

              <PrimaryButton
                onClick={goToLogin}
                className="info-text"
                style={{
                  width: "8rem",
                  height: "3.5rem",
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
                  width: "8rem",
                  marginLeft: "20px",
                  height: "3.5rem",
                  fontSize: "20pt",
                }}
              >
                Create Account
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
