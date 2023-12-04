import React, { useState } from "react";
import Input from "../../components/input";

import Page from "../../components/page";
import BackButton from "../../components/backbutton";
import Button from "../../components/button";
import "./index.css";

import { useNavigate } from "react-router-dom";

import danger_logo from "./danger.svg";
import { useAuth } from "../../utils/AuthContext";

import BackendSimulation from "../../utils/BackEnd";

const SignupConfirmPage = () => {
  const { authContextData, userData, confirmationCode } = useAuth();
  const { login: authLogin } = authContextData; // Отримуємо функцію login зі стану AuthContext

  const navigate = useNavigate();
  const [enteredCode, setEnteredCode] = useState("");
  const [isValidCode, setIsValidCode] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const backend = BackendSimulation();

  const handleConfirm = () => {
    // Перевірка введеного коду

    const isCodeValid = enteredCode === confirmationCode.toString();
    setIsValidCode(isCodeValid);

    if (!isCodeValid) {
      setErrorMessage("Введено невірний код");
      return;
    }

    const token = Math.random().toString(36).substring(2, 16);

    const user = { ...userData, confirm: true, token };

    authLogin(token, user);

    console.log(user);

    // confirmSignup();

    const signupConfirmResult = async () => {
      const res = await fetch(
        `http://localhost:4000/signup-confirm/?email=${userData.email}`
      );
      const data = await res.json();

      if (res.ok) {
        setErrorMessage("");
        backend.addnotification("New login");

        navigate("/balance");

        // Перехід на сторінку підтвердження
      } else {
        setErrorMessage(data.message);

        console.log(errorMessage);
      }

      // const userTransactions = await backend.getusertransactions();
      // setTransactions(userTransactions.slice(0, 8));
    };

    signupConfirmResult();
  };

  return (
    <Page>
      <BackButton />
      <div className="title">
        <h2>Confirm account</h2>
        <h3>Write the code you received</h3>
      </div>

      <div className="form">
        <Input
          type="text"
          value={enteredCode}
          onChange={(e) => setEnteredCode(e.target.value)}
          placeholder="Код підтвердження"
          isValid={isValidCode}
          errorMessage="Введено невірний код"
        />
        <Button onClick={handleConfirm}>Confirm</Button>
        {errorMessage && (
          <div className="error">
            <span>
              <img src={danger_logo} alt="icon" />
            </span>
            {errorMessage}
          </div>
        )}
      </div>
    </Page>
  );
};

export default SignupConfirmPage;
