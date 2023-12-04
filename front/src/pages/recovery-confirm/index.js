// components/SignupPage.js
import React, { useState } from "react";
import Input from "../../components/input";

import Page from "../../components/page";
import BackButton from "../../components/backbutton";
import Button from "../../components/button";
import "./index.css";

import { useNavigate } from "react-router-dom";

import danger_logo from "./danger.svg";
import { useAuth } from "../../utils/AuthContext";
import PasswordInput from "../../components/input-password";
import BackendSimulation from "../../utils/BackEnd";

const RecoveryConfirmPage = () => {
  const { authContextData, userData, confirmationCode } = useAuth();
  const { login: authLogin } = authContextData; // Отримуємо функцію login зі стану AuthContext

  const navigate = useNavigate();
  const [enteredCode, setEnteredCode] = useState("");
  const [isValidCode, setIsValidCode] = useState(true);

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isValidPasswordConfirmation, setIsValidPasswordConfirmation] =
    useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const backend = BackendSimulation();

  const validatePassword = (value) => {
    // Перевірка пароля
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(value);
  };

  const handleConfirm = () => {
    // Перевірка введеного коду

    const isCodeValid = enteredCode === confirmationCode.toString();
    setIsValidCode(isCodeValid);

    const isPasswordValid = validatePassword(password);
    setIsValidPassword(isPasswordValid);

    // Перевірка підтвердження пароля
    const isPasswordConfirmationValid = password === passwordConfirmation;
    setIsValidPasswordConfirmation(isPasswordConfirmationValid);

    if (!isPasswordValid || !isPasswordConfirmationValid) {
      setErrorMessage("Помилка введених даних");
      return;
    }

    if (!isCodeValid) {
      setErrorMessage("Введено невірний код");
      return;
    }

    const token = Math.random().toString(36).substring(2, 16);

    const user = { ...userData, confirm: true, token };

    authLogin(token, user);

    console.log(user);

    const recoveryConfirmResult = async () => {
      const res = await fetch(
        `http://localhost:4000/recovery-confirm/?email=${userData.email}&password=${password}`
      );
      const data = await res.json();

      if (res.ok) {
        setErrorMessage("");
        backend.addnotification("New password recovery");

        navigate("/balance");

        // Перехід на сторінку підтвердження
      } else {
        setErrorMessage(data.message);

        console.log(errorMessage);
      }
    };

    recoveryConfirmResult();

    // confirmSignup(password);

    // backend.addnotification("New password recovery");

    // navigate("/balance");
  };

  return (
    <Page>
      <BackButton />
      <div className="title">
        <h2>Recover password</h2>
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
        <PasswordInput
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Новий пароль"
          isValid={isValidPassword}
          errorMessage="Пароль має містити мінімум 8 символів, літери, цифри та технічні символи"
        />
        <PasswordInput
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          placeholder="Підтвердіть новий пароль"
          isValid={isValidPasswordConfirmation}
          errorMessage="Паролі не співпадають"
        />
        <Button onClick={handleConfirm}>Restore password</Button>
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

export default RecoveryConfirmPage;
