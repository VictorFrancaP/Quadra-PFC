import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppIndex } from "./routes/AppIndex";
import "leaflet/dist/leaflet.css";
import { SocketProvider } from "./context/SocketContext";

export const App = () => {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <SocketProvider>
            <AppIndex />
          </SocketProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
};
