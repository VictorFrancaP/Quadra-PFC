// Importando BrowserRouter e rotas
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppIndex } from "./routes/AppIndex";

export const App = () => {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <AppIndex />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
};
