import { HashRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import WelcomePage from "./pages/welcome";
import SignupPage from "./pages/signup";
import { AuthProvider } from "./utils/AuthContext";
import SignupConfirmPage from "./pages/signup-confirm";
import SigninPage from "./pages/signin";
import RecoveryPage from "./pages/recovery";
import RecoveryConfirmPage from "./pages/recovery-confirm";
import BalancePage from "./pages/balance";
import AuthRoute from "./utils/AuthRoute";
import PrivateRoute from "./utils/PrivateRoute";
import SettingsPage from "./pages/settings";
import ReceivePage from "./pages/receive";
import SendPage from "./pages/send";
import NotificationsPage from "./pages/notifications";
import TransactionPage from "./pages/transaction";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<AuthRoute element={<WelcomePage />} />} />
            <Route
              path="/signup"
              element={<AuthRoute element={<SignupPage />} />}
            />
            <Route
              path="/signup-confirm"
              element={<AuthRoute element={<SignupConfirmPage />} />}
            />
            <Route
              path="/signin"
              element={<AuthRoute element={<SigninPage />} />}
            />
            <Route
              path="/recovery"
              element={<AuthRoute element={<RecoveryPage />} />}
            />
            <Route
              path="/recovery-confirm"
              element={<AuthRoute element={<RecoveryConfirmPage />} />}
            />
            <Route
              path="/balance"
              element={<PrivateRoute element={<BalancePage />} />}
            />
            <Route
              path="/settings"
              element={<PrivateRoute element={<SettingsPage />} />}
            />
            <Route
              path="/receive"
              element={<PrivateRoute element={<ReceivePage />} />}
            />
            <Route
              path="/send"
              element={<PrivateRoute element={<SendPage />} />}
            />
            <Route
              path="/notifications"
              element={<PrivateRoute element={<NotificationsPage />} />}
            />
            <Route
              path="/transaction/:id"
              element={<PrivateRoute element={<TransactionPage />} />}
            />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
