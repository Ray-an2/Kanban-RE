import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import KanbanBoard from '../components/Tableau.tsx';
import Log from './Log.tsx';
import Inscription from './Inscription.tsx';
import Connexion from "./Connexion.tsx";
import TableauPage from "./Accueil.tsx";
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<KanbanBoard />} />
        <Route path="/tableau/log" element={<Log />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/login" element={<Connexion />} />
        <Route path="/tableau" element={<TableauPage />} />
        <Route path="*" element={<h1>Page non trouvée</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
