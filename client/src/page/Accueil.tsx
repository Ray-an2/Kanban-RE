import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserBoards from '../components/TableauListe.tsx';
import '../page/App.css';

interface Board {
  id: string;
  title: string;
  description?: string;
  color?: string;
}

const TableauPage: React.FC = () => {
  const navigate = useNavigate();

  // Données simulées pour les tableaux de l'utilisateur
  const userBoardsData: Board[] = [
    { id: '1', title: 'Projet A', description: 'Tableau pour le projet A' },
    { id: '2', title: 'Projet B', description: 'Tableau pour le projet B' },
    { id: '3', title: 'Personnel', description: 'Mes tâches personnelles' },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="tableau-page-container">
      <div className="page-header">
        <h1>Mes Tableaux</h1>
        <button type="button" className="logout-button" onClick={handleLogout}>
          Se déconnecter
        </button>
      </div>
      <UserBoards boards={userBoardsData} />
    </div>
  );
};

export default TableauPage;
