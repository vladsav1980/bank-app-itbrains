import React, { useState } from "react";
import Input from "../../components/input";

import BackendSimulation from "../../utils/BackEnd";
import Page from "../../components/page";
import BackButton from "../../components/backbutton";
import Button from "../../components/button";

import "./index.css";

import { useAuth } from "../../utils/AuthContext";

import { getCurrentTime } from "../../utils/gettime";

const SendPage = () => {
  const auth = useAuth();
  const { userData } = auth || {};

  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [balance, setBalance] = useState(0);

  const [isValidEmail, setIsValidEmail] = useState(true);

  const [isValidAmount, setIsValidAmount] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const backend = BackendSimulation();

  React.useEffect(() => {
    const fetchTransactions = async () => {
      const res = await fetch(
        `http://localhost:4000/balance/?email=${userData.email}`
      );
      const data = await res.json();

      if (res.ok) {
        return data.message;
      }
    };

    fetchTransactions();

    const fetchBalance = async () => {
      const res = await fetch(
        `http://localhost:4000/getbalance/?email=${userData.email}`
      );
      const data = await res.json();

      if (res.ok) {
        setBalance(data.balance);
      }
      // const userNotifications = await backend.getusernotifications();
      // setNotifications(userNotifications.slice(0, 7));
    };

    fetchBalance();
  }, []);

  const validateAmount = (amount) => {
    const regex =
      /^(?!$|\s)(?:(?!^0\.00$)^\d{1,6}(?:\.\d{1,2})?$|^(?!^0$)\d{1,6}$)/;

    // const balance = backend.getbalance();

    return (
      regex.test(amount) &&
      parseFloat(amount) <= balance &&
      parseFloat(amount) !== 0
    );
  };

  const validateEmail = (value) => {
    // Перевірка емейла
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSend = async () => {
    console.log({ balance });

    // Перевірка емейла
    const isAmountValid = validateAmount(amount);
    setIsValidAmount(isAmountValid);

    // Перевірка емейла
    const isEmailValid = validateEmail(email);
    setIsValidEmail(isEmailValid);

    if (!isAmountValid || !isEmailValid) {
      setErrorMessage("Помилка введених даних");
      setSuccessMessage("");
      return;
    }

    const email1 = userData.email;
    const type = "Sending";

    const username = email.split("@")[0];

    // Перетворюємо емейл на ім'я отримувача, робимо першу літеру великою
    const capitalizedUsername =
      username.charAt(0).toUpperCase() + username.slice(1);

    const time = getCurrentTime();

    backend.addtransaction(email1, type, amount, capitalizedUsername, time);

    setErrorMessage("");
    setAmount("");
    setEmail("");

    setSuccessMessage(`Здійснено платіж на $${amount}`);
    setBalance(balance - Number(amount));
  };

  return (
    <Page>
      <BackButton />
      <div className="settings__title">
        <h2>Send</h2>
      </div>

      <div className="settings__form">
        <Input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Емейл"
          isValid={isValidEmail}
          errorMessage="Введіть коректний емейл"
        />

        <div className="input-with-icon">
          <span className="dollar-icon">$</span>
          <Input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder=""
            isValid={isValidAmount}
          />
        </div>
      </div>

      <div className="settings__form">
        <Button onClick={handleSend}>Send</Button>

        {errorMessage && <div className="settings__error">{errorMessage}</div>}
        {successMessage && (
          <div className="settings__success">{successMessage}</div>
        )}
      </div>
    </Page>
  );
};

export default SendPage;
