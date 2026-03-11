import React, { useState } from 'react';
import './App.css'; // Assure-toi d'avoir un fichier CSS pour les styles

interface Card {
  id: string;
  title: string;
  description: string;
  dueDate: string;
}

interface Column {
  id: string;
  title: string;
  cards: Card[];
}

const App: React.FC = () => {
  // État initial des colonnes et cartes
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'todo',
      title: 'To Do',
      cards: [
        { id: '1', title: 'Task 1', description: 'Terminer la maquette.', dueDate: '15/03/2026' },
        { id: '2', title: 'Task 2', description: 'Préparer la réunion.', dueDate: '12/03/2026' },
      ],
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      cards: [
        { id: '3', title: 'Task 3', description: 'Développer la fonctionnalité de login.', dueDate: '20/03/2026' },
      ],
    },
  ]);

  // État pour la modale
  const [modal, setModal] = useState<{ open: boolean; title: string; description: string; dueDate: string }>({
    open: false,
    title: '',
    description: '',
    dueDate: '',
  });

  // État pour le drag-and-drop
  const [draggedCard, setDraggedCard] = useState<Card | null>(null);
  const [dragSourceColumn, setDragSourceColumn] = useState<string | null>(null);

  // Ouvre la modale
  const openModal = (title: string, description: string, dueDate: string) => {
    setModal({ open: true, title, description, dueDate });
  };

  // Ferme la modale
  const closeModal = () => {
    setModal({ ...modal, open: false });
  };

  // Début du drag
  const dragStart = (e: React.DragEvent, card: Card, columnId: string) => {
    setDraggedCard(card);
    setDragSourceColumn(columnId);
    e.dataTransfer.setData('text/plain', ''); // Nécessaire pour Firefox
  };

  // Pendant le drag (survol)
  const dragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Quand une carte est déposée
  const drop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (!draggedCard || !dragSourceColumn) return;

    // Met à jour les colonnes
    const newColumns = columns.map((column) => {
      if (column.id === dragSourceColumn) {
        return { ...column, cards: column.cards.filter((card) => card.id !== draggedCard.id) };
      }
      if (column.id === columnId) {
        return { ...column, cards: [...column.cards, draggedCard] };
      }
      return column;
    });

    setColumns(newColumns);
    setDraggedCard(null);
    setDragSourceColumn(null);
  };

  // Fin du drag
  const dragEnd = () => {
    setDraggedCard(null);
    setDragSourceColumn(null);
  };

  return (
    <div className="app">
      <h1>Kanban</h1>
      <div id="board" className="board">
        {columns.map((column) => (
          <div key={column.id} className="column">
            <h2 className="column-title">{column.title}</h2>
            <div
              className="cards"
              onDragOver={dragOver}
              onDrop={(e) => drop(e, column.id)}
            >
              {column.cards.map((card) => (
                <div
                  key={card.id}
                  className="card"
                  draggable
                  onDragStart={(e) => dragStart(e, card, column.id)}
                  onDragEnd={dragEnd}
                  onClick={() => openModal(card.title, card.description, card.dueDate)}
                >
                  <div className="card-title">{card.title}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modale */}
      {modal.open && (
        <div id="modal" className="modal" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2 id="modal-title">{modal.title}</h2>
            <p id="modal-description">Description : {modal.description}</p>
            <p id="modal-due-date">Date limite : {modal.dueDate}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
