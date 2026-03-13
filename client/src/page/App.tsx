import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
//import { AuthProvider } from "./contexts/AuthProvider";
import KanbanBoard from "../components/Tableau.tsx";
import Log from "./Log.tsx";
import Inscription from "./Inscription.tsx";
import Connexion from "./Connexion.tsx";
import TableauPage from "./Accueil.tsx";
import CardDetailsPage from "./Carte.tsx";
import AccountPage from "./Compte.tsx";
import Notification from "./Notification.tsx";
import AdminLogsPage from "./LogListe.tsx";
/*import { RestrictedGuest } from "./components/RestrictedGuest"; //les routes faites par prof sont commentées
import { RestrictedLoggedIn } from "./components/RestrictedLoggedIn";*/

import "./App.css";

function App() {
  return (
    //<AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/auth/login" replace />} />

          <Route
            path="/auth/login"
            element={
                <Connexion />
            }
          />
          <Route
            path="/auth/inscription"
            element={
                <Inscription />
            }
          />

          <Route
            path="/api/tableau"
            element={
              //<RestrictedLoggedIn>
                <TableauPage />
              //</RestrictedLoggedIn>
            }
          />
          <Route
            path="/api/tableau/:id"
            element={
              //<RestrictedLoggedIn>
                <KanbanBoard />
              //</RestrictedLoggedIn>
            }
          />
          <Route
            path="/api/tableau/:id/log"
            element={
              //<RestrictedLoggedIn>
                <Log />
              //</RestrictedLoggedIn>
            }
          />
          <Route
            path="/api/tableau/:boardId/carte/:cardId"
            element={
              //<RestrictedLoggedIn>
                <CardDetailsPage />
              //</RestrictedLoggedIn>
            }
          />
          <Route
            path="/api/compte"
            element={
              //<RestrictedLoggedIn>
                <AccountPage />
              //</RestrictedLoggedIn>
            }
          />
          <Route
            path="/api/notifications"
            element={
              //<RestrictedLoggedIn>
                <Notification />
              //</RestrictedLoggedIn>
            }
          />
          <Route
            path="/api/tableau/logs"
            element={
              //<RestrictedLoggedIn>
                <AdminLogsPage />
              //</RestrictedLoggedIn>
            }
          />

          <Route path="*" element={<h1>Page non trouvée</h1>} />
        </Routes>
      </BrowserRouter>
    //</AuthProvider>
  );
}

export default App;
