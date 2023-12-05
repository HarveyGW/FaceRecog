import { Box, Button, Paper, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import bg from "./login-bg.jpg";
import logo from "./logo.png";

const Background = styled(Box)({
  height: "100vh",
  background: `url(${bg}) no-repeat center center`,
  backgroundSize: "cover",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 1,
  },
});

const RegisterContainer = styled(Paper)({
  padding: "2rem",
  maxWidth: "400px",
  width: "100%",
  margin: "auto",
  backdropFilter: "blur(10px)",
  borderRadius: "15px",
  position: "relative",
  zIndex: 2,
  background: "rgba(255, 255, 255, 0.2)",
});

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `http://45.87.28.51:5000/Admin_Register?Username=${encodeURIComponent(
          username
        )}&Password=${encodeURIComponent(password)}`
      );

      console.log(response.data);
      // Handle successful registration (maybe redirect to login page?)
    } catch (error) {
      console.error("Error during registration:", error);
      // Handle registration error (display a message to the user?)
    }
  };

  return (
    <Background>
      <RegisterContainer elevation={3}>
        <form onSubmit={handleSubmit}>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1vh",
            }}
          >
            <a href="#">
              <img src={logo} alt="Logo" style={{ height: "4vw" }} />
            </a>
          </Box>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "1rem" }}
          >
            Register
          </Button>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            <RouterLink to="/login" style={{ color: "black" }}>
              Already have an account?
            </RouterLink>
          </Box>
        </form>
      </RegisterContainer>
    </Background>
  );
};

export default Register;
