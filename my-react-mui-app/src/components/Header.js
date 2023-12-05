import { AppBar, Toolbar, Typography } from "@mui/material";
import React from "react";
import logo from "./logo.png";

const Header = () => {
  return (
    <AppBar position="static" style={{ backgroundColor: "black" }}>
      <Toolbar
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <a href="#">
          <img
            src={logo}
            alt="Logo"
            style={{ height: "4vw", marginTop: "1vh" }}
          />
        </a>
        <Typography
          variant="h6"
          style={{
            color: "#B50155",
            fontWeight: "bold",
            fontSize: "1.5rem",
            fontFamily: "Arial",
          }}
        >
          Facial Recognition
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
