import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const PrivateRoute = ({ element }) => {
  const auth = useAuth();
  const { authContextData } = auth || {};
  const { state } = authContextData || {};
  console.log({ state });

  return state && state.token ? element : <Navigate to="/" />;
};

export default PrivateRoute;
