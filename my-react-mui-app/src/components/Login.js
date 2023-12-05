import { Box, Button, Link, Paper, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useState } from "react";
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

const LoginContainer = styled(Paper)({
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

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `http://45.87.28.51:5000/Admin_Login?Username=${encodeURIComponent(
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
      <LoginContainer elevation={3}>
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
            type="password"
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
            Login
          </Button>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            <Link to="/register" style={{ color: "black" }}>
              Don't have an account?
            </Link>
          </Box>
        </form>
      </LoginContainer>
    </Background>
  );
};

export default Login;
