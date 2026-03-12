import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../page/App.css';

interface Board {
  id: string;
  title: string;
  description?: string;
}

interface UserBoardsProps {
  boards: Board[];
}

const Accueil: React.FC<UserBoardsProps> = ({ boards }) => {
  const navigate = useNavigate();

  const handleBoardClick = (boardId: string) => {
    navigate(`/tableau/${boardId}`);
  };

  return (
    <div className="user-boards-container">
      <h2>Mes Tableaux</h2>
      {boards.length === 0 ? (
        <p>Aucun tableau disponible. Créez-en un nouveau !</p>
      ) : (
        <div className="boards-list">
          {boards.map((board) => (
            <div
              key={board.id}
              className="board-card"
              onClick={() => handleBoardClick(board.id)}
            >
              <h3>{board.title}</h3>
              {board.description && <p>{board.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Accueil;
