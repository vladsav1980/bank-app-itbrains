import React, { createContext, useReducer, useContext, useState } from "react";

// Define action types
const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT";
const UPDATE_TRANSACTIONS = "UPDATE_TRANSACTIONS";

// Define reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
      };
    case LOGOUT:
      return {
        ...state,
        token: null,
        user: {},
      };
    case "SIGNUP":
      return {
        ...state,
        users: [...state.users, action.payload.user],
      };
    case UPDATE_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload,
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Create AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    users: [],
    token: null,
    user: {},
    transactions: [],
  });

  const login = (token, user) => {
    dispatch({
      type: LOGIN,
      payload: { token, user },
    });
  };

  const logout = () => {
    dispatch({ type: LOGOUT });
  };

  const signup = (user) => {
    dispatch({ type: "SIGNUP", payload: { user } });
  };

  const confirmSignup = (newPassword) => {
    // Отримуємо поточні дані користувача
    const { users } = state;

    const currentUser = users.find((user) => user.email === userData.email);

    if (newPassword) {
      currentUser.password = newPassword;

      // Оновлюємо стан контексту
      dispatch({ type: "PASSWORD_RECOVERY", payload: { users } });
      return;
    }

    // Оновлюємо статус користувача на підтверджений
    if (currentUser) {
      currentUser.confirm = true;

      // Оновлюємо стан контексту
      dispatch({ type: "CONFIRM_SIGNUP", payload: { users } });
    }
  };

  const authContextData = {
    state,
    dispatch,
    login,
    logout,
    signup,
    confirmSignup,
  };

  const [userData, setUserData] = useState(null);
  const [confirmationCode, setConfirmationCode] = useState(null);

  const updateUserData = (newData) => {
    setUserData(newData);
  };

  const updateConfirmationCode = (code) => {
    setConfirmationCode(code);
  };

  return (
    <AuthContext.Provider
      value={{
        authContextData,
        userData,
        confirmationCode,
        updateUserData,
        updateConfirmationCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create custom hook for using AuthContext
export const useAuth = () => useContext(AuthContext);
export { UPDATE_TRANSACTIONS };
