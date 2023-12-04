import "./index.css";
import stripe_logo from "./stripe.svg";
import coinbase_logo from "./coinbase.svg";
import user_logo from "./user.svg";
import ellipse_logo from "./ellipse.svg";
import { formatAmount } from "../format-amount";

export default function Transaction({
  contragent,
  time,
  type,
  amount,
  onClick,
}) {
  const convertTime = (transactionTime) => {
    const parsedTime = new Date(transactionTime);
    const hours = parsedTime.getHours().toString().padStart(2, "0");
    const minutes = parsedTime.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <>
      {amount > 0 ? (
        <div className="transaction">
          <div className="transaction__logo">
            <img
              src={contragent === "Stripe" ? stripe_logo : coinbase_logo}
              alt="icon"
            />
          </div>
          <div className="transaction__info">
            <div className="transaction__contragent">{contragent}</div>
            <div className="transaction_details">
              <div>{convertTime(time)} </div>
              <img src={ellipse_logo} alt="icon" />
              <div> {type}</div>
            </div>
          </div>

          {formatAmount(amount, "transaction__amount--green")}
        </div>
      ) : (
        <div className="transaction">
          <div className="transaction__logo">
            <img src={user_logo} alt="icon" />
          </div>
          <div className="transaction__info">
            <div className="transaction__contragent">{contragent}</div>
            <div className="transaction_details">
              <div>{convertTime(time)}</div>
              <img src={ellipse_logo} alt="icon" />
              <div>{type}</div>
            </div>
          </div>

          {formatAmount(amount, "transaction__amount")}
        </div>
      )}
    </>
  );
}
