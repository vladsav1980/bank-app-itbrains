import React, { useState } from "react";
import Input from "../../components/input";

import BackendSimulation from "../../utils/BackEnd";
import Page from "../../components/page";
import BackButton from "../../components/backbutton";
import Button from "../../components/button";
import "./index.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import danger_logo from "./danger.svg";
import { useAuth } from "../../utils/AuthContext";
import PasswordInput from "../../components/input-password";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isValidPasswordConfirmation, setIsValidPasswordConfirmation] =
    useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const backend = BackendSimulation();
  const navigate = useNavigate();
  const { updateUserData, updateConfirmationCode } = useAuth();

  const validatePassword = (value) => {
    // Перевірка пароля
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(value);
  };

  const validateEmail = (value) => {
    // Перевірка емейла
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSignup = async () => {
    // Перевірка пароля
    const isPasswordValid = validatePassword(password);
    setIsValidPassword(isPasswordValid);

    // Перевірка емейла
    const isEmailValid = validateEmail(email);
    setIsValidEmail(isEmailValid);

    // Перевірка підтвердження пароля
    const isPasswordConfirmationValid = password === passwordConfirmation;
    setIsValidPasswordConfirmation(isPasswordConfirmationValid);

    if (!isPasswordValid || !isEmailValid || !isPasswordConfirmationValid) {
      setErrorMessage("Помилка введених даних");
      return;
    }

    // Перевірка наявності користувача в базі

    const signupResult = async () => {
      const res = await fetch(
        `http://localhost:4000/signup/?email=${email}&password=${password}`
      );
      const data = await res.json();

      console.log(res, res.status);

      if (res.ok) {
        setErrorMessage("");
        const confirmationCode = backend.sendCode();

        // Перехід на сторінку підтвердження

        const userData = { email, password };
        updateUserData(userData);
        updateConfirmationCode(confirmationCode);
        console.log(email, password, userData, confirmationCode);

        navigate("/signup-confirm");
      } else {
        setErrorMessage(data.message);
        setIsValidEmail(false);
        console.log(errorMessage);
      }

      // const userTransactions = await backend.getusertransactions();
      // setTransactions(userTransactions.slice(0, 8));
    };

    signupResult();

    //  const signupResult = backend.signup(email, password);

    // if (!signupResult.success) {
    //   setErrorMessage(signupResult.message);
    //   return;
    // }

    // const confirmationCode = backend.sendCode();

    // // Перехід на сторінку підтвердження

    // const userData = { email, password };
    // updateUserData(userData);
    // updateConfirmationCode(confirmationCode);
    // console.log(email, password, userData, confirmationCode);
    // navigate("/signup-confirm");
  };

  return (
    <Page>
      <BackButton />
      <div className="title">
        <h2>Sign up</h2>
        <h3>Choose a registration method</h3>
      </div>

      <div className="form">
        <Input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Емейл"
          isValid={isValidEmail}
          errorMessage="Введіть коректний емейл"
        />
        <PasswordInput
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          isValid={isValidPassword}
          errorMessage="Пароль має містити мінімум 8 символів, літери, цифри та технічні символи"
        />
        <PasswordInput
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          placeholder="Підтвердіть пароль"
          isValid={isValidPasswordConfirmation}
          errorMessage="Паролі не співпадають"
        />
        <div>
          Already have an account? &nbsp;
          <Link className="linkstyle" to="/signin">
            Sign In
          </Link>
        </div>
        <Button onClick={handleSignup}>Continue</Button>
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

export default SignupPage;
