import { Routes, Route, Navigate } from "react-router-dom";
import { Home } from "../pages/Home";
import { CadastroRequest } from "../pages/CadastroRequest";
import { CadastroConfirm } from "../pages/CadastroConfirm";
import { LoginPage } from "../pages/Login";
import { ProfilePage } from "../pages/Profile";
import { PrivateRoute } from "./PrivateRoute";
import { AdminRoute } from "./AdminRoute";
import { AdminDashboard } from "../pages/AdminDashboard";

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

        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};
