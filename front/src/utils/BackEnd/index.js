import { useAuth } from "../AuthContext";
// import { getCurrentTime } from "../gettime";

const BackendSimulation = () => {
  const auth = useAuth();
  const { authContextData, userData } = auth || {};
  const { state } = authContextData || {};
  const { users } = state || {};

  const sendCode = () => {
    const confirmationCode = Math.floor(100000 + Math.random() * 900000);

    window.confirm(`Код підтвердження: ${confirmationCode}`);

    return confirmationCode;
  };

  const signup = (email, password) => {
    // Перевірка, чи вже існує користувач з таким email
    console.log(users);
    const existingUser = users && users.find((user) => user.email === email);

    if (existingUser) {
      return { success: false, message: "Користувач з таким email вже існує" };
    }

    if (!existingUser && !password) {
      return { success: true, message: "Користувача з таким email не існує" };
    }

    // Створення нового користувача
    const transactions = [
      {
        id: 2,
        type: "Sending",
        amount: -30,
        recipient: "John Doe",
        time: "2023-11-17T14:45:00",
      },
      {
        id: 1,
        type: "Receipt",
        amount: 1250,
        paymentSystem: "Stripe",
        time: "2023-11-16T10:30:00",
      },
    ];
    const newUser = {
      email,
      password,
      confirm: false,
      transactions,
      balance: 0,
      notifications: [],
    };
    authContextData.signup(newUser);

    return { success: true, message: "Реєстрація пройшла успішно" };
  };

  const signin = (email, password) => {
    // Пошук користувача в базі
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return { success: false, message: "Невірний email або пароль" };
    }

    // Перевірка підтвердження реєстрації
    if (!user.confirm) {
      return {
        success: false,
        message: "Підтвердіть реєстрацію на вашому email",
      };
    }

    addnotification("New login");

    return { success: true, message: "Вхід в акаунт успішний", user };
  };

  const getusertransactions = () => {
    const user = users.find((u) => u.email === userData.email);

    user.balance = user.transactions.reduce(
      (acc, transaction) => acc + transaction.amount,
      0
    );
    console.log(user.balance);

    return user.transactions;
  };

  const getbalance = () => {
    const user = users.find((u) => u.email === userData.email);

    return user.balance;
  };

  const addtransaction = (email, type, amountstr, paymentSystem, time) => {
    const addTransactionResult = async () => {
      const res = await fetch(
        `http://localhost:4000/transactions/?email=${email}&type=${type}&amountstr=${amountstr}&paymentSystem=${paymentSystem}&time=${time}`
      );
      const data = await res.json();

      if (res.ok) {
      } else {
        console.log(data.message);
      }
    };

    addTransactionResult();

    // console.log({ email, type, amountstr, paymentSystem, time });
    // const user = users.find((u) => u.email === email);
    // const id = user.transactions.length + 1;
    // let amount = Number(amountstr);
    // let newTransaction;
    // if (paymentSystem === "Stripe" || paymentSystem === "Coinbase") {
    //   newTransaction = { id, type, amount, paymentSystem, time };
    // } else {
    //   const recipient = paymentSystem;
    //   amount = 0 - amount;
    //   newTransaction = { id, type, amount, recipient, time };
    // }

    // user.transactions.unshift(newTransaction);
    // if (amount > 0) {
    //   addnotification("New incoming transaction");
    // } else {
    //   addnotification("New outgoing transaction");
    // }
    // console.log(user.transactions);
  };

  const addnotification = (type) => {
    // console.log({ type });
    // const user = users.find((u) => u.email === userData.email);
    // const id = user.notifications.length + 1;
    // const time = getCurrentTime();
    // const newNotification = { id, type, time };

    // user.notifications.unshift(newNotification);
    // console.log(user.notifications);

    const addNotificationResult = async () => {
      const res = await fetch(
        `http://localhost:4000/notification/?email=${userData.email}&type=${type}`
      );
      const data = await res.json();

      if (res.ok) {
      } else {
        console.log(data.message);
      }

      // const userTransactions = await backend.getusertransactions();
      // setTransactions(userTransactions.slice(0, 8));
    };

    addNotificationResult();
  };

  const getusernotifications = () => {
    const user = users.find((u) => u.email === userData.email);

    return user.notifications;
  };

  const changemail = (email, password) => {
    // Перевірка, чи вже існує користувач з таким email
    const changeMailResult = async () => {
      const res = await fetch(
        `http://localhost:4000/changemail/?email=${email}&oldemail=${userData.email}&password=${password}`
      );
      const data = await res.json();

      if (res.ok) {
        userData.email = email;
        return { success: true, message: "Емейл змінено успішно" };
      } else {
        console.log(data.message);
        return { success: false, message: data.message };
      }
    };

    changeMailResult();

    // console.log(users);
    // const existingUser = users && users.find((user) => user.email === email);

    // if (existingUser) {
    //   return { success: false, message: "Користувач з таким email вже існує" };
    // }

    // const user = users.find(
    //   (u) => u.email === userData.email && u.password === password
    // );

    // if (!user) {
    //   return { success: false, message: "Невірний пароль" };
    // }

    // user.email = email;
    // userData.email = email;

    // addnotification("Email has been changed");

    // return { success: true, message: "Емейл змінено успішно" };
  };

  const changepassword = (password, newPassword) => {
    // Перевірка, чи вже існує користувач з таким email
    console.log(users);

    const email = userData.email;

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return { success: false, message: "Невірний пароль" };
    }

    user.password = newPassword;

    addnotification("Password has been changed");

    return { success: true, message: "Пароль змінено успішно" };
  };

  return {
    signup,
    signin,
    getusertransactions,
    getbalance,
    addtransaction,
    addnotification,
    getusernotifications,
    sendCode,
    changemail,
    changepassword,
  };
};

export default BackendSimulation;
