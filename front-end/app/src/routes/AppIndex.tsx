// Importando Route e Routes para utilizar rotas
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";

// Importando Paginas
import { Home } from "../pages/Home";
import { CadastroRequest } from "../pages/CadastroRequest";
import { CadastroConfirm } from "../pages/CadastroConfirm";

export const AppIndex = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastrar" element={<CadastroRequest />} />
        <Route path="/cadastrar/:token" element={<CadastroConfirm />} />
      </Routes>
    </>
  );
};
