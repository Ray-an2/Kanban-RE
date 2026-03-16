import {PrivateRoute} from "../components/PrivateRoute.tsx";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
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

import "./App.css";

function App() {
  return (
    <BrowserRouter>
  <Routes>
    <Route path="/" element={<Navigate to="/auth/login" replace />} />

    <Route path="/auth/login" element={<Connexion />} />
    <Route path="/auth/inscription" element={<Inscription />} />

    {/* Routes privées (utilisateur connecté) */}
    <Route element={<PrivateRoute />}>
      <Route path="/api/tableau" element={<TableauPage />} />
      <Route path="/api/tableau/:id" element={<KanbanBoard />} />
      <Route path="/api/tableau/:id/log" element={<Log />} />
      <Route path="/api/tableau/:boardId/carte/:cardId" element={<CardDetailsPage />} />
      <Route path="/api/compte" element={<AccountPage />} />
      <Route path="/api/notifications" element={<Notification />} />
      <Route path="/api/tableau/logs" element={<AdminLogsPage />} />
      <Route path="/api/admin/tableaux" element={<AdminTableaux />} />
      <Route path="/api/admin/compte" element={<CompteAdmin />} />
      <Route path="/api/admin/comptes" element={<UserManagementPage />} />
    </Route>

    <Route path="*" element={<h1>Page non trouvée</h1>} />
  </Routes>
</BrowserRouter>
  );
}

export default App;
