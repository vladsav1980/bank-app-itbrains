import React from "react";

// import BackendSimulation from "../../utils/BackEnd";
import Page from "../../components/page";
import BackButton from "../../components/backbutton";

import Box from "../../components/box";

import "./index.css";

import { useParams } from "react-router-dom";

import Break from "../../components/break";

import { formatAmount } from "../../components/format-amount";

import { useAuth } from "../../utils/AuthContext";

const TransactionPage = () => {
  const { id } = useParams();

  // const backend = BackendSimulation();
  const auth = useAuth();
  const { userData } = auth || {};
  const [transactions, setTransactions] = React.useState([]);
  const [transaction, setTransaction] = React.useState({});

  React.useEffect(() => {
    const fetchTransactions = async () => {
      const res = await fetch(
        `http://localhost:4000/balance/?email=${userData.email}`
      );
      const data = await res.json();

      if (res.ok) {
        setTransactions(data.transactions);
      }
    };

    fetchTransactions();
  }, []);

  React.useEffect(() => {
    setTransaction(transactions.find((txn) => txn.id === parseInt(id)));
  }, [transactions]);

  // const transactions = backend.getusertransactions();

  // const transaction = transactions.find((txn) => txn.id === parseInt(id));

  return (
    <Page style={{ backgroundColor: "#F5F5F7" }}>
      <BackButton />
      <div className="settings__title">
        <h2>Transaction</h2>
      </div>
      {transaction && (
        <>
          <div className="transaction-amount">
            {transaction.amount > 0 ? (
              <>
                {formatAmount(
                  transaction.amount,
                  "transaction__amount--green transaction__big"
                )}
              </>
            ) : (
              <>
                {formatAmount(
                  transaction.amount,
                  "transaction__amount transaction__big"
                )}
              </>
            )}
          </div>

          <div className="settings__form ">
            <Box>
              <div className="transaction__block">
                <div>Date</div>
                <div>
                  {new Date(transaction.time).toDateString().slice(4, 10)},{" "}
                  {new Date(transaction.time).toTimeString().slice(0, 5)}
                </div>
              </div>
              <Break></Break>
              <div className="transaction__block">
                <div>Address</div>
                <div>{transaction.paymentSystem || transaction.recipient}</div>
              </div>
              <Break></Break>
              <div className="transaction__block">
                <div>Type</div>
                <div>{transaction.type}</div>
              </div>
            </Box>
          </div>
        </>
      )}
    </Page>
  );
};

export default TransactionPage;
