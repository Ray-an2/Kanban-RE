import React, { useState } from 'react';
import './App.css';

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

  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    dueDate: string;
  }>({
    isOpen: false,
    title: '',
    description: '',
    dueDate: '',
  });

  const [draggedCard, setDraggedCard] = useState<Card | null>(null);
  const [dragSourceColumn, setDragSourceColumn] = useState<string | null>(null);
  const [dragOverCardId, setDragOverCardId] = useState<string | null>(null);

  const openModal = (e: React.MouseEvent, card: Card) => {
    e.stopPropagation();
    console.log('Ouverture de la modale pour:', card.title);
    setModal({
      isOpen: true,
      title: card.title,
      description: card.description,
      dueDate: card.dueDate,
    });
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  const handleDragStart = (e: React.DragEvent, card: Card, columnId: string) => {
    e.stopPropagation();
    setDraggedCard(card);
    setDragSourceColumn(columnId);
    e.dataTransfer.setData('text/plain', card.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, cardId: string | null, _columnId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverCardId(cardId);
  };

  const handleDrop = (e: React.DragEvent, cardId: string | null, columnId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedCard || !dragSourceColumn) return;

    const newColumns = [...columns];
    const sourceColumnIndex = newColumns.findIndex(col => col.id === dragSourceColumn);
    const targetColumnIndex = newColumns.findIndex(col => col.id === columnId);

    if (sourceColumnIndex === targetColumnIndex) {
      const column = newColumns[sourceColumnIndex];
      const cardIndex = column.cards.findIndex(c => c.id === draggedCard.id);
      const dropIndex = cardId ? column.cards.findIndex(c => c.id === cardId) : 0;

      const newCards = [...column.cards];
      newCards.splice(cardIndex, 1);
      newCards.splice(dropIndex, 0, draggedCard);
      newColumns[sourceColumnIndex] = { ...column, cards: newCards };
    } else {
      const sourceColumn = newColumns[sourceColumnIndex];
      const targetColumn = newColumns[targetColumnIndex];
      const newSourceCards = sourceColumn.cards.filter(c => c.id !== draggedCard.id);
      const dropIndex = cardId ? targetColumn.cards.findIndex(c => c.id === cardId) : 0;

      const newTargetCards = [...targetColumn.cards];
      newTargetCards.splice(dropIndex, 0, draggedCard);

      newColumns[sourceColumnIndex] = { ...sourceColumn, cards: newSourceCards };
      newColumns[targetColumnIndex] = { ...targetColumn, cards: newTargetCards };
    }

    setColumns(newColumns);
    setDraggedCard(null);
    setDragSourceColumn(null);
    setDragOverCardId(null);
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
    setDragSourceColumn(null);
    setDragOverCardId(null);
  };

  return (
    <div className="app">
      <h1>Kanban</h1>
      <div className="board">
        {columns.map((column) => (
          <div key={column.id} className="column">
            <h2 className="column-title">{column.title}</h2>
            <div className="cards">
              <div
                className="drop-zone"
                onDragOver={(e) => handleDragOver(e, null, column.id)}
                onDrop={(e) => handleDrop(e, null, column.id)}
              />
              {column.cards.map((card) => (
                <div
                  key={card.id}
                  className={`card ${dragOverCardId === card.id ? 'drag-over' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, card, column.id)}
                  onDragOver={(e) => handleDragOver(e, card.id, column.id)}
                  onDrop={(e) => handleDrop(e, card.id, column.id)}
                  onDragEnd={handleDragEnd}
                >
                  <button
                    className="card-title-button"
                    onClick={(e) => openModal(e, card)}
                  >
                    {card.title}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {modal.isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000, 
          }}
          onClick={closeModal}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              width: '90%',
              maxWidth: '500px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              color: 'black', 
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
              }}
              onClick={closeModal}
            >
              &times;
            </button>
            <h2 style={{ color: 'black' }}>{modal.title}</h2>
            <p style={{ color: 'black' }}><strong>Description:</strong> {modal.description}</p>
            <p style={{ color: 'black' }}><strong>Date limite:</strong> {modal.dueDate}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
