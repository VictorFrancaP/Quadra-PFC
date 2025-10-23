import { useState } from "react";
import { LoginForm } from "../components/LoginForm";
import { Setup2FA } from "../components/Setup2FA";
import { Verify2FA } from "../components/Verify2FA";
import { useAuth } from "../context/AuthContext";
import type { User } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

type Step = "login" | "setup_2fa" | "verify_2fa";

export const LoginPage = () => {
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState<Step>("login");
  const [tempUser, setTempUser] = useState<User | null>(null);
  const [tempToken, setTempToken] = useState<string | null>(null);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLoginSuccess = (data: any) => {
    if (data.step === "setup_2fa") {
      setTempUser(data.user);
      setTempToken(data.token);
      setStep("setup_2fa");
    } else if (data.step === "2fa_required") {
      setTempUser(data.user);
      setStep("verify_2fa");
    }
  };

  const renderStep = () => {
    switch (step) {
      case "login":
        return <LoginForm onLoginSuccess={handleLoginSuccess} />;
      case "setup_2fa":
        return <Setup2FA user={tempUser!} tempToken={tempToken!} />;
      case "verify_2fa":
        return <Verify2FA user={tempUser!} />;
      default:
        return <LoginForm onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return <div className="login-container">{renderStep()}</div>;
};
