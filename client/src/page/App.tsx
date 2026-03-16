import React, { useEffect } from "react";
import jwtDecode from "jwt-decode";
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from "react-router-dom";
//import { AuthProvider } from "./contexts/AuthProvider";
import KanbanBoard from "../components/Tableau.tsx";
import Log from "./Log.tsx";
import Inscription from "./Inscription.tsx";
import Connexion from "./Connexion.tsx";
import TableauPage from "./Accueil.tsx";
import CardDetailsPage from "./CarteDetails.tsx";
import AccountPage from "./Compte.tsx";
import Notification from "./Notification.tsx";
import AdminLogsPage from "./LogListe.tsx";
import UserManagementPage from "./UserList.tsx"
import AdminTableaux from "./TableauAdmin.tsx";
import CompteAdmin from "./CompteAdmin.tsx";
/*import { RestrictedGuest } from "./components/RestrictedGuest"; //les routes faites par prof sont commentées
import { RestrictedLoggedIn } from "./components/RestrictedLoggedIn";*/

import "./App.css";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth/login'); // Redirige vers la page de login si pas de token
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const role = decoded.pfl_role;

      // Vérifie si le token est expiré
      const time = Date.now() / 1000;
      if (decoded.exp < time) {
        localStorage.removeItem('token');
        navigate('/auth/login');
        return;
      }

      // Vérifie si le rôle de l'user est autorisé
      if (!["U", "A"].includes(role)) {
        navigate('/auth/login'); // Redirige vers la page de login si le rôle n'est pas présent
      }
    } catch (err) { // token expiré ou invalide
      navigate('/auth/login'); 
    }
  }, [navigate]);
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

          <Route 
          path="/api/admin/tableaux" element={
            <AdminTableaux />
          } 
          />
          <Route path="/api/admin/compte" element={<CompteAdmin />} />
          <Route path="/api/admin/comptes" element={<UserManagementPage />} />

          <Route path="*" element={<h1>Page non trouvée</h1>} />
        </Routes>
      </BrowserRouter>
    //</AuthProvider>
  );
}

export default App;
