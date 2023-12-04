import React from "react";
import "./index.css";

const Input = ({
  type,
  value,
  onChange,
  placeholder,
  isValid,
  errorMessage,
}) => (
  <div className="field">
    <label>{placeholder}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ borderColor: isValid ? "" : "#F23152" }}
    />
    <div className="field__error" style={{ color: "#F23152" }}>
      {isValid ? "" : errorMessage}
    </div>
  </div>
);

export default Input;
