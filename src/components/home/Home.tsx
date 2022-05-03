import { User } from "firebase/auth";
import React, { useEffect } from "react";
import {
    Link,
    useNavigate
} from "react-router-dom";
  
  interface HomeProps {
    user: User | null;
  }
  
  const Home: React.FC<HomeProps> = ({
    user
  }: HomeProps) => {
    const navigate = useNavigate();
    useEffect(() => {
      if (user == null) {
        navigate("/login");
      } else {
          navigate("/dashboard")
      }
    }, [user]);
  
    return (
      <div style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "#121212",
          position: "absolute",
          zIndex: 1100
      }}/>
    );
  };
  
  export default Home;
  