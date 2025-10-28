import { Routes, Route, Navigate } from "react-router-dom";
import { Home } from "../pages/Home";
import { CadastroRequest } from "../pages/CadastroRequest";
import { CadastroConfirm } from "../pages/CadastroConfirm";
import { LoginPage } from "../pages/Login";
import { ProfilePage } from "../pages/Profile";
import { PrivateRoute } from "./PrivateRoute";
import { AdminRoute } from "./AdminRoute";
import { AdminDashboard } from "../pages/AdminDashboard";
import { Order } from "../pages/OrderForm";
import { ViewOrderPage } from "../pages/ViewOrder";
import { CreateQuadraForm } from "../pages/CreateQuadra";
import { QuadrasPage } from "../pages/Quadras";
import { NearbyQuadrasPage } from "../pages/NearbyQuadra";
import { ReservationPage } from "../pages/Reservation";
import { PaymentSuccess } from "../pages/PaymentSuccess";
import { PaymentFailure } from "../pages/PaymentFailure";
import { PaymentPending } from "../pages/PaymentPending";
import { MyReservationsPage } from "../pages/MinhaReserva";
import { SoccerDetailPage } from "../pages/QuadraDetails";
import { OwnerRoute } from "./OwnerRoute";
import { MyQuadraPage } from "../pages/MinhaQuadra";

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
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failure" element={<PaymentFailure />} />
        <Route path="/payment/pending" element={<PaymentPending />} />

        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/solicitar-proprietario" element={<Order />} />
          <Route path="/minha-solicitacao" element={<ViewOrderPage />} />
          <Route path="/cadastrar-quadra" element={<CreateQuadraForm />} />
          <Route path="/quadras" element={<QuadrasPage />} />
          <Route path="/quadras-proximas" element={<NearbyQuadrasPage />} />
          <Route path="/reservar/:soccerId" element={<ReservationPage />} />
          <Route path="/minhas-reservas" element={<MyReservationsPage />} />
          <Route path="/quadra/:id" element={<SoccerDetailPage />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        <Route element={<OwnerRoute />}>
          <Route path="/minha-quadra" element={<MyQuadraPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};
