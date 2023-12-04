import "./index.css";

import cell_logo from "./cell.svg";
import wifi_logo from "./wifi.svg";
import batt_logo from "./batt.svg";

import React, { useState, useEffect } from "react";

export default function StatusBar() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const getCurrentTime = () => {
    const hours = currentTime.getHours().toString().padStart(2, "0");
    const minutes = currentTime.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <div className="statusbar">
      {getCurrentTime()}
      <span>
        <img src={cell_logo} alt="icon" />
        <img src={wifi_logo} alt="icon" />
        <img src={batt_logo} alt="icon" />
      </span>
    </div>
  );
}
