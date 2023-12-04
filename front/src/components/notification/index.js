import "./index.css";
import bell_logo from "./bell.svg";
import warning_logo from "./warning.svg";

import ellipse_logo from "./ellipse.svg";

export default function Notification({ time, type }) {
  const convertTime = (notificationTime) => {
    const now = new Date();
    const timeDifference = now - new Date(notificationTime);
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return "Now";
    } else if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (hours < 24) {
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else {
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }
  };

  return (
    <>
      {type === "New incoming transaction" ||
      type === "New outgoing transaction" ? (
        <div className="transaction notification">
          <div className="transaction__logo">
            <img src={bell_logo} alt="icon" />
          </div>
          <div className="transaction__info">
            <div className="transaction__contragent">{type}</div>
            <div className="transaction_details">
              <div>{convertTime(time)} </div>
              <img src={ellipse_logo} alt="icon" />
              <div> Announcement</div>
            </div>
          </div>

          <div></div>
        </div>
      ) : (
        <div className="transaction notification">
          <div className="transaction__logo">
            <img src={warning_logo} alt="icon" />
          </div>
          <div className="transaction__info">
            <div className="transaction__contragent">{type}</div>
            <div className="transaction_details">
              <div>{convertTime(time)} </div>
              <img src={ellipse_logo} alt="icon" />
              <div> Warning</div>
            </div>
          </div>

          <div></div>
        </div>
      )}
    </>
  );
}
