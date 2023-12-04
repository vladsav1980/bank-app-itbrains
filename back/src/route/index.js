// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()

const users = []

const getusertransactions = (email) => {
  const user = users.find((u) => u.email === email)

  user.balance = user.transactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0,
  )
  console.log(user.balance)

  return user.transactions
}

const signup = (email, password) => {
  // Перевірка, чи вже існує користувач з таким email
  console.log(users)
  const existingUser =
    users && users.find((user) => user.email === email)

  if (existingUser) {
    return {
      success: false,
      message: 'Користувач з таким email вже існує',
    }
  }

  // Створення нового користувача
  const transactions = [
    {
      id: 2,
      type: 'Sending',
      amount: -30,
      recipient: 'John Doe',
      time: '2023-11-17T14:45:00',
    },
    {
      id: 1,
      type: 'Receipt',
      amount: 1250,
      paymentSystem: 'Stripe',
      time: '2023-11-16T10:30:00',
    },
  ]
  const newUser = {
    email,
    password,
    confirm: false,
    transactions,
    balance: 0,
    notifications: [],
  }
  users.push(newUser)

  console.log(users)

  return {
    success: true,
    message: 'Реєстрація пройшла успішно',
  }
}

const confirmSignup = (email) => {
  // Отримуємо поточні дані користувача

  const currentUser = users.find(
    (user) => user.email === email,
  )

  // Оновлюємо статус користувача на підтверджений
  if (currentUser) {
    currentUser.confirm = true

    return true
  }
}

const addnotification = (type, email) => {
  console.log({ type })
  const user = users.find((u) => u.email === email)
  const id = user.notifications.length + 1
  const time = getCurrentTime()
  const newNotification = { id, type, time }

  user.notifications.unshift(newNotification)
  console.log(user.notifications)
  return true
}

const getCurrentTime = () => {
  const currentDateTime = new Date()
  const year = currentDateTime.getFullYear()
  const month = (currentDateTime.getMonth() + 1)
    .toString()
    .padStart(2, '0')
  const day = currentDateTime
    .getDate()
    .toString()
    .padStart(2, '0')
  const hours = currentDateTime
    .getHours()
    .toString()
    .padStart(2, '0')
  const minutes = currentDateTime
    .getMinutes()
    .toString()
    .padStart(2, '0')
  const seconds = currentDateTime
    .getSeconds()
    .toString()
    .padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}

const getusernotifications = (email) => {
  const user = users.find((u) => u.email === email)

  return user.notifications
}

const signin = (email, password) => {
  // Пошук користувача в базі
  const user = users.find(
    (u) => u.email === email && u.password === password,
  )

  if (!user) {
    return {
      success: false,
      message: 'Невірний email або пароль',
    }
  }

  // Перевірка підтвердження реєстрації
  if (!user.confirm) {
    return {
      success: false,
      message: 'Підтвердіть реєстрацію на вашому email',
    }
  }

  addnotification('New login', email)

  return {
    success: true,
    message: 'Вхід в акаунт успішний',
    user,
  }
}

const recovery = (email) => {
  // Перевірка, чи вже існує користувач з таким email
  console.log(users)
  const existingUser =
    users && users.find((user) => user.email === email)

  if (!existingUser) {
    return {
      success: false,
      message: 'Користувача з таким email не існує',
    }
  }

  return {
    success: true,
    message: 'Відновлення пароля пройшла успішно',
  }
}

const confirmRecovery = (email, newPassword) => {
  // Отримуємо поточні дані користувача

  const currentUser = users.find(
    (user) => user.email === email,
  )

  currentUser.password = newPassword

  // Оновлюємо статус користувача на підтверджений
  return true
}

const changemail = (email, oldemail, password) => {
  // Перевірка, чи вже існує користувач з таким email
  console.log(users)
  const existingUser =
    users && users.find((user) => user.email === email)

  if (existingUser) {
    return {
      success: false,
      message: 'Користувач з таким email вже існує',
    }
  }

  const user = users.find(
    (u) => u.email === oldemail && u.password === password,
  )

  if (!user) {
    return { success: false, message: 'Невірний пароль' }
  }

  user.email = email
  // userData.email = email;

  addnotification('Email has been changed', email)

  return { success: true, message: 'Емейл змінено успішно' }
}

const changepassword = (email, password, newPassword) => {
  // Перевірка, чи вже існує користувач з таким email
  console.log(users)

  const user = users.find(
    (u) => u.email === email && u.password === password,
  )

  if (!user) {
    return { success: false, message: 'Невірний пароль' }
  }

  user.password = newPassword

  addnotification('Password has been changed', email)

  return {
    success: true,
    message: 'Пароль змінено успішно',
  }
}

const addtransaction = (
  email,
  type,
  amountstr,
  paymentSystem,
  time,
) => {
  console.log({
    email,
    type,
    amountstr,
    paymentSystem,
    time,
  })
  const user = users.find((u) => u.email === email)
  const id = user.transactions.length + 1
  let amount = Number(amountstr)
  let newTransaction
  if (
    paymentSystem === 'Stripe' ||
    paymentSystem === 'Coinbase'
  ) {
    newTransaction = {
      id,
      type,
      amount,
      paymentSystem,
      time,
    }
  } else {
    const recipient = paymentSystem
    amount = 0 - amount
    newTransaction = { id, type, amount, recipient, time }
  }

  user.transactions.unshift(newTransaction)
  if (amount > 0) {
    addnotification('New incoming transaction', email)
  } else {
    addnotification('New outgoing transaction', email)
  }
  console.log(user.transactions)
  return true
}

const getbalance = (email) => {
  const user = users.find((u) => u.email === email)

  return user.balance
}

// Підключіть файли роутів
// const test = require('./test')
// Підключіть інші файли роутів, якщо є

// Об'єднайте файли роутів за потреби
// router.use('/', test)
// Використовуйте інші файли роутів, якщо є

router.get('/', (req, res) => {
  res.status(200).json('Hello World')
})

router.get('/balance', function (req, res) {
  const { email } = req.query

  console.log(email)

  try {
    const transactions = getusertransactions(email)

    if (transactions.length === 0) {
      return res.status(200).json({
        transactions: [],
      })
    }

    return res.status(200).json({
      transactions,
    })
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

router.get('/signup', function (req, res) {
  const { email, password } = req.query

  console.log(email, password)

  try {
    const signupResult = signup(email, password)

    if (signupResult.success) {
      return res.status(200).json({
        message: signupResult.message,
      })
    } else {
      console.log(signupResult.message)
      return res.status(400).json({
        message: signupResult.message,
      })
    }
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

router.get('/signup-confirm', function (req, res) {
  const { email } = req.query

  try {
    const signupConfirmResult = confirmSignup(email)

    if (signupConfirmResult) {
      console.log(users)
      return res.status(200).json({})
    } else {
      return res.status(400).json({
        message: 'Користувача з таким емейл не існує',
      })
    }
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

router.get('/notification', function (req, res) {
  const { email, type } = req.query

  try {
    const notificationResult = addnotification(type, email)

    if (notificationResult) {
      console.log(users)
      return res.status(200).json({})
    } else {
      return res.status(400).json({
        message: 'Користувача з таким емейл не існує',
      })
    }
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

router.get('/notifications', function (req, res) {
  const { email } = req.query

  console.log(email)

  try {
    const notifications = getusernotifications(email)

    if (notifications.length === 0) {
      return res.status(200).json({
        notifications: [],
      })
    }

    return res.status(200).json({
      notifications,
    })
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

router.get('/signin', function (req, res) {
  const { email, password } = req.query

  console.log(email, password)

  try {
    const signinResult = signin(email, password)

    if (signinResult.success) {
      return res.status(200).json({
        message: signinResult.message,
      })
    } else {
      console.log(signinResult.message)
      return res.status(400).json({
        message: signinResult.message,
      })
    }
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

router.get('/recovery', function (req, res) {
  const { email } = req.query

  console.log(email)

  try {
    const recoveryResult = recovery(email)

    if (recoveryResult.success) {
      return res.status(200).json({
        message: recoveryResult.message,
      })
    } else {
      console.log(recoveryResult.message)
      return res.status(400).json({
        message: recoveryResult.message,
      })
    }
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

router.get('/recovery-confirm', function (req, res) {
  const { email, password } = req.query

  try {
    const recoveryConfirmResult = confirmRecovery(
      email,
      password,
    )

    if (recoveryConfirmResult) {
      console.log(users)
      return res.status(200).json({})
    } else {
      return res.status(400).json({
        message: 'Користувача з таким емейл не існує',
      })
    }
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

router.get('/changemail', function (req, res) {
  const { email, oldemail, password } = req.query

  console.log(email)

  try {
    const changemailResult = changemail(
      email,
      oldemail,
      password,
    )

    if (changemailResult.success) {
      return res.status(200).json({
        message: changemailResult.message,
      })
    } else {
      console.log(changemailResult.message)
      return res.status(400).json({
        message: changemailResult.message,
      })
    }
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

router.get('/changepassword', function (req, res) {
  const { email, oldpassword, password } = req.query

  console.log(email)

  try {
    const changepasswordResult = changepassword(
      email,
      oldpassword,
      password,
    )

    if (changepasswordResult.success) {
      return res.status(200).json({
        message: changepasswordResult.message,
      })
    } else {
      console.log(changepasswordResult.message)
      return res.status(400).json({
        message: changepasswordResult.message,
      })
    }
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

router.get('/transactions', function (req, res) {
  const { email, type, amountstr, paymentSystem, time } =
    req.query

  try {
    const transactionsResult = addtransaction(
      email,
      type,
      amountstr,
      paymentSystem,
      time,
    )

    if (transactionsResult) {
      console.log(users)
      return res.status(200).json({})
    } else {
      return res.status(400).json({
        message: 'Помилка обробки транзакції',
      })
    }
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

router.get('/getbalance', function (req, res) {
  const { email } = req.query

  console.log(email)

  try {
    const balance = getbalance(email)

    return res.status(200).json({
      balance,
    })
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

// Експортуємо глобальний роутер
module.exports = router
