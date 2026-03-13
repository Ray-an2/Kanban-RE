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
/*import { RestrictedGuest } from "./components/RestrictedGuest";
import { RestrictedLoggedIn } from "./components/RestrictedLoggedIn";*/

import "./App.css";

function App() {
  return (
    //<AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route
            path="/login"
            element={
              //<RestrictedGuest>
                <Connexion />
              //</RestrictedGuest>
            }
          />
          <Route
            path="/inscription"
            element={
              //<RestrictedGuest>
                <Inscription />
              //</RestrictedGuest>
            }
          />

          <Route
            path="/tableau"
            element={
              //<RestrictedLoggedIn>
                <TableauPage />
              //</RestrictedLoggedIn>
            }
          />
          <Route
            path="/tableau/:id"
            element={
              //<RestrictedLoggedIn>
                <KanbanBoard />
              //</RestrictedLoggedIn>
            }
          />
          <Route
            path="/tableau/:id/log"
            element={
              //<RestrictedLoggedIn>
                <Log />
              //</RestrictedLoggedIn>
            }
          />
          <Route
            path="/tableau/:boardId/carte/:cardId"
            element={
              //<RestrictedLoggedIn>
                <CardDetailsPage />
              //</RestrictedLoggedIn>
            }
          />
          <Route
            path="/compte"
            element={
              //<RestrictedLoggedIn>
                <AccountPage />
              //</RestrictedLoggedIn>
            }
          />
          <Route
            path="/notification"
            element={
              //<RestrictedLoggedIn>
                <Notification />
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
