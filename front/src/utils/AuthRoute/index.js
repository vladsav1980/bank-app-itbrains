// AuthRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const AuthRoute = ({ element }) => {
  const auth = useAuth();
  const { authContextData } = auth || {};
  const { state } = authContextData || {};

  return state && state.token ? <Navigate to="/balance" /> : element;
};

export default AuthRoute;
