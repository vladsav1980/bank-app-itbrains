import React, { useState } from "react";
import "./index.css";

const PasswordInput = ({
  type,
  value,
  onChange,
  placeholder,
  isValid,
  errorMessage,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="field">
      <label>{placeholder}</label>
      <div className="input-container">
        <input
          type={showPassword ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{ borderColor: isValid ? "" : "#F23152" }}
        />
        <div
          className={`password-toggle-button ${
            showPassword ? "show-password" : ""
          }`}
          onClick={handleTogglePassword}
        ></div>
      </div>
      <div className="field__error" style={{ color: "#F23152" }}>
        {isValid ? "" : errorMessage}
      </div>
    </div>
  );
};

export default PasswordInput;
