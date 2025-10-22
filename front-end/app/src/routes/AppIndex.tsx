
import { Routes, Route, Navigate } from "react-router-dom";

import { Home } from "../pages/Home";
import { CadastroRequest } from "../pages/CadastroRequest";
import { CadastroConfirm } from "../pages/CadastroConfirm";

import { LoginPage } from "../pages/Login";
import { ProfilePage } from "../pages/Profile";
import { PrivateRoute } from "./PrivateRoute";

const DashboardPage = () => (
  <div>
    <h1>Dashboard</h1>
    <p>Bem-vindo! Você está logado.</p>
  </div>
);

export const AppIndex = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/cadastrar" element={<CadastroRequest />} />
        <Route
          path="/auth/user/cadastrar/:token"
          element={<CadastroConfirm />}
        />
        <Route path="/login" element={<LoginPage />} />

        {/* rotas privadas */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
    </>
  );
};