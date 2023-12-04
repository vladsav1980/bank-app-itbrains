import React, { useState } from "react";
import Input from "../../components/input";

// import BackendSimulation from "../../utils/BackEnd";
import Page from "../../components/page";
import BackButton from "../../components/backbutton";
import Button from "../../components/button";
import "./index.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../utils/AuthContext";

import danger_logo from "./danger.svg";

import PasswordInput from "../../components/input-password";

const SigninPage = () => {
  const { authContextData } = useAuth();
  const { login: authLogin } = authContextData; // Отримуємо функцію login зі стану AuthContext

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isValidEmail, setIsValidEmail] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");
  // const backend = BackendSimulation();
  const navigate = useNavigate();
  const { updateUserData } = useAuth();

  const validateEmail = (value) => {
    // Перевірка емейла
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSignin = async () => {
    // Перевірка емейла
    const isEmailValid = validateEmail(email);
    setIsValidEmail(isEmailValid);

    if (!isEmailValid) {
      setErrorMessage("Помилка введених даних");
      return;
    }

    // Перевірка наявності користувача в базі

    const signinResult = async () => {
      const res = await fetch(
        `http://localhost:4000/signin/?email=${email}&password=${password}`
      );
      const data = await res.json();

      if (res.ok) {
        setErrorMessage("");

        const token = Math.random().toString(36).substring(2, 16);

        const user = { email, password, confirm: true, token };

        authLogin(token, user);

        const userData = { email, password };
        updateUserData(userData);

        navigate("/balance");
      } else {
        setErrorMessage(data.message);

        console.log(errorMessage);
      }
    };

    signinResult();

    // const signinResult = backend.signin(email, password);
  };

  return (
    <Page>
      <BackButton />
      <div className="title">
        <h2>Sign in</h2>
        <h3>Select login method</h3>
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
          isValid={true}
        />
        <div>
          Forgot your password? &nbsp;
          <Link className="linkstyle" to="/recovery">
            Restore
          </Link>
        </div>
        <Button onClick={handleSignin}>Continue</Button>
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

export default SigninPage;
