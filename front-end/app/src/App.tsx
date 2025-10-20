// Importando BrowserRouter e rotas
import { BrowserRouter } from "react-router-dom";
import { AppIndex } from "./routes/AppIndex";

export const App = () => {
  return (
    <>
      <BrowserRouter>
        <AppIndex />
      </BrowserRouter>
    </>
  );
};
