import { useState } from "react";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  if (!token) {
    return <LoginPage onLogin={setToken} />;
  }

  return <DashboardPage onLogout={() => setToken(null)} />;
}
