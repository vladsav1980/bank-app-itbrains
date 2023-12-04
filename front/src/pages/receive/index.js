// components/SignupPage.js
import React, { useState } from "react";
import Input from "../../components/input";

import BackendSimulation from "../../utils/BackEnd";
import Page from "../../components/page";
import BackButton from "../../components/backbutton";

import "./index.css";

import { useAuth } from "../../utils/AuthContext";

import Break from "../../components/break";
import Box from "../../components/box";

import stripe_logo from "./stripe.svg";
import coinbase_logo from "./coinbase.svg";
import master_logo from "./master.svg";
import trongreen_logo from "./trongreen.svg";
import bitcoin_logo from "./bitcoin.svg";
import tronred_logo from "./tronred.svg";
import ether_logo from "./ether.svg";
import busd_logo from "./busd.svg";
import { getCurrentTime } from "../../utils/gettime";

const ReceivePage = () => {
  const auth = useAuth();
  const { userData } = auth || {};

  const [amount, setAmount] = useState("");

  const [isValidAmount, setIsValidAmount] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const backend = BackendSimulation();

  const validateAmount = (amount) => {
    const regex =
      /^(?!$|\s)(?:(?!^0\.00$)^\d{1,6}(?:\.\d{1,2})?$|^(?!^0$)\d{1,6}$)/;

    return regex.test(amount);
  };

  const handleStripe = async () => {
    // Перевірка пароля

    // Перевірка емейла
    const isAmountValid = validateAmount(amount);
    setIsValidAmount(isAmountValid);

    if (!isAmountValid) {
      setErrorMessage("Помилка введених даних");
      setSuccessMessage("");
      return;
    }

    
    const email = userData.email;
    const type = "Receipt";

    const paymentSystem = "Stripe";
    const time = getCurrentTime();

    backend.addtransaction(email, type, amount, paymentSystem, time);

    setErrorMessage("");
    setAmount("");

    setSuccessMessage(`Рахунок поповнено на $${amount}`);
  };

  const handleCoinbase = async () => {
    

    // Перевірка суми
    const isAmountValid = validateAmount(amount);
    setIsValidAmount(isAmountValid);

    if (!isAmountValid) {
      setErrorMessage("Помилка введених даних");
      setSuccessMessage("");
      return;
    }

   
    const email = userData.email;
    const type = "Receipt";

    const paymentSystem = "Coinbase";
    const time = getCurrentTime();

    backend.addtransaction(email, type, amount, paymentSystem, time);

    setErrorMessage("");
    setAmount("");

    setSuccessMessage(`Рахунок поповнено на $ ${amount}`);
  };

  return (
    <Page style={{ backgroundColor: "#F5F5F7" }}>
      <BackButton />
      <div className="settings__title">
        <h2>Receive</h2>
      </div>

      <div className="settings__form">
        <div className="settings__subtitle">Receive amount</div>
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
      <Break />
      <div className="settings__form">
        <div className="settings__subtitle">Payment system</div>

        <Box onClick={handleStripe}>
          <div className="payment-system">
            <div className="transaction__logo">
              <img src={stripe_logo} alt="icon" />
            </div>
            <div className="transaction__info">
              <div className="transaction__contragent">Stripe</div>
            </div>

            <div className="payment-logos">
              <img src={master_logo} alt="icon" />
              <img src={trongreen_logo} alt="icon" />
              <img src={bitcoin_logo} alt="icon" />
              <img src={tronred_logo} alt="icon" />
              <img src={ether_logo} alt="icon" />
              <img src={busd_logo} alt="icon" />
            </div>
          </div>
        </Box>

        <Box onClick={handleCoinbase}>
          <div className="payment-system">
            <div className="transaction__logo">
              <img src={coinbase_logo} alt="icon" />
            </div>
            <div className="transaction__info">
              <div className="transaction__contragent">Coinbase</div>
            </div>

            <div className="payment-logos">
              <img src={trongreen_logo} alt="icon" />
              <img src={master_logo} alt="icon" />
              <img src={tronred_logo} alt="icon" />
              <img src={bitcoin_logo} alt="icon" />
              <img src={busd_logo} alt="icon" />
              <img src={ether_logo} alt="icon" />
            </div>
          </div>
        </Box>

        {errorMessage && <div className="settings__error">{errorMessage}</div>}
        {successMessage && (
          <div className="settings__success">{successMessage}</div>
        )}
      </div>
    </Page>
  );
};

export default ReceivePage;
