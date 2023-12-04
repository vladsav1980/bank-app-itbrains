// components/BackButton.js
import React from "react";
import { useNavigate } from "react-router-dom";

import "./index.css";

import back_logo from "./arrowback.svg";

const BackButton = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Повертає на попередню сторінку
  };

  return (
    <div className="arrowback" style={{ cursor: "pointer" }} onClick={goBack}>
    
      <img src={back_logo} alt="icon" />
    </div>
  );
};

export default BackButton;
