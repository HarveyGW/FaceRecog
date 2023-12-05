import React, { useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Content from "./components/Content";
import Header from "./components/Header";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <Content />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
