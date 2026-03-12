import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../page/App.css';

interface Board {
  id: string;
  title: string;
  description?: string;
  color?: string;
}

const TableauPage: React.FC = () => {
  const navigate = useNavigate();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBoards([
        { id: '1', title: 'Projet A', description: 'Gestion du projet client X', color: '#FFD1DC' },
        { id: '2', title: 'Projet B', description: 'Développement nouvelle fonctionnalité', color: '#E6E6FA' },
        { id: '3', title: 'Personnel', description: 'Mes tâches quotidiennes', color: '#E0FFFF' },
        { id: '4', title: 'Équipe', description: 'Tableau collaboratif', color: '#F0E68C' },
      ]);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  const handleLogout = () => {
    navigate('/login');
  };
  const handleAddBoard = () => {
    const newBoard: Board = {
      id: Date.now().toString(),
      title: 'Nouveau Tableau',
      description: 'Ajoutez une description',
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    };
    setBoards([...boards, newBoard]);
  };

   if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement de vos tableaux...</p>
      </div>
    );
  }

  const handleBoardClick = (boardId: string) => {
    navigate(`/tableau/${boardId}`);
  };
  const pseudo = 'Utilisateur'; 
  return (
    <div className="accueil-container">
      <div className="page-header">
        <h1>Bienvenue sur votre espace</h1>
        <div className="header-buttons">
          <button type="button" className="add-board-button" onClick={handleAddBoard}>
            + Nouveau Tableau
          </button>
          <button type="button" onClick={() => navigate(`/compte/${pseudo}`)} className="account-button">
            Mon Compte
          </button>
          <button type="button" className="logout-button" onClick={handleLogout}>
            Se déconnecter
          </button>
        </div>
      </div>

      {boards.length === 0 ? (
        <div className="empty-state">
          <p>Vous n'avez pas encore de tableaux.</p>
          <button type="button" className="create-first-board" onClick={handleAddBoard}>
            Créer mon premier tableau
          </button>
        </div>
      ) : (
        <>
          <h2 className="section-title">Mes Tableaux</h2>
          <div className="boards-grid-container">
            {boards.map((board) => (
              <div
                key={board.id}
                className="board-card-horizontal"
                style={{ backgroundColor: board.color || '#f0f0f0' }}
                onClick={() => handleBoardClick(board.id)}
              >
                <div className="board-row-card-content">
                  <h3>{board.title}</h3>
                  {board.description && <p>{board.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TableauPage;
