import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Carte,  Liste,  Journal } from '../model/types.ts';
import '../page/App.css';

const Tableau: React.FC = () => {
  // Conversion des types de la base de données en interfaces locales
  interface Column extends Liste {
    cartes: Carte[];
  }

  const [columns, setColumns] = useState<Column[]>([
    {
      lis_id: 'todo',
      lis_titre: 'À faire',
      lis_ordre: 1,
      lis_etat: 'P',
      tab_id: '1',
      cartes: [
        {
          car_id: '1',
          car_nom: 'Tâche 1',
          car_des: 'Terminer la maquette.',
          car_archiver: 'N',
          car_terminer: 'N',
          car_priorite: 2,
          car_ordre: 1,
          car_dateCreation: new Date().toISOString(),
          car_dateDebut: new Date().toISOString(),
          car_dateFin: '2026-03-15T00:00:00',
          car_couverture: null,
          lis_id: 'todo'
        },
        {
          car_id: '2',
          car_nom: 'Tâche 2',
          car_des: 'Préparer la réunion.',
          car_archiver: 'N',
          car_terminer: 'N',
          car_priorite: 1,
          car_ordre: 2,
          car_dateCreation: new Date().toISOString(),
          car_dateDebut: new Date().toISOString(),
          car_dateFin: '2026-03-12T00:00:00',
          car_couverture: null,
          lis_id: 'todo'
        },
      ],
    },
    {
      lis_id: 'in-progress',
      lis_titre: 'En cours',
      lis_ordre: 2,
      lis_etat: 'P',
      tab_id: '1',
      cartes: [
        {
          car_id: '3',
          car_nom: 'Tâche 3',
          car_des: 'Développer la fonctionnalité de login.',
          car_archiver: 'N',
          car_terminer: 'N',
          car_priorite: 3,
          car_ordre: 1,
          car_dateCreation: new Date().toISOString(),
          car_dateDebut: new Date().toISOString(),
          car_dateFin: '2026-03-20T00:00:00',
          car_couverture: null,
          lis_id: 'in-progress'
        },
      ],
    },
  ]);

  const [logs, setLogs] = useState<Journal[]>([]);

  const addLog = (jou_titre: string, jou_description: string) => {
    const newLog: Journal = {
      jou_id: Date.now().toString(),
      jou_titre,
      jou_description,
      jou_auteur: 'Utilisateur actuel',
      jou_action: 'MOVE_CARD',
      jou_date: new Date().toISOString(),
      jou_etat: 'SUCCESS'
    };
    setLogs([...logs, newLog]);
  };

  const [modal, setModal] = useState<{
    isOpen: boolean;
    car_nom: string;
    car_des: string;
    car_dateFin: string;
  }>({
    isOpen: false,
    car_nom: '',
    car_des: '',
    car_dateFin: '',
  });

  const [draggedCard, setDraggedCard] = useState<Carte | null>(null);
  const [dragSourceColumn, setDragSourceColumn] = useState<string | null>(null);
  const [dragOverCardId, setDragOverCardId] = useState<string | null>(null);
  const navigate = useNavigate();

  const openModal = (e: React.MouseEvent, card: Carte) => {
    e.stopPropagation();
    setModal({
      isOpen: true,
      car_nom: card.car_nom,
      car_des: card.car_des || '',
      car_dateFin: card.car_dateFin ? new Date(card.car_dateFin).toLocaleDateString('fr-FR') : '',
    });
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  const handleDragStart = (e: React.DragEvent, card: Carte, columnId: string) => {
    e.stopPropagation();
    setDraggedCard(card);
    setDragSourceColumn(columnId);
    e.dataTransfer.setData('text/plain', card.car_id);
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
    const sourceColumnIndex = newColumns.findIndex(col => col.lis_id === dragSourceColumn);
    const targetColumnIndex = newColumns.findIndex(col => col.lis_id === columnId);

    if (sourceColumnIndex === targetColumnIndex) {
      const column = newColumns[sourceColumnIndex];
      const cardIndex = column.cartes.findIndex(c => c.car_id === draggedCard.car_id);
      const dropIndex = cardId ? column.cartes.findIndex(c => c.car_id === cardId) : 0;

      const newCartes = [...column.cartes];
      newCartes.splice(cardIndex, 1);
      newCartes.splice(dropIndex, 0, draggedCard);
      newColumns[sourceColumnIndex] = { ...column, cartes: newCartes };
    } else {
      const sourceColumn = newColumns[sourceColumnIndex];
      const targetColumn = newColumns[targetColumnIndex];
      const newSourceCartes = sourceColumn.cartes.filter(c => c.car_id !== draggedCard.car_id);
      const dropIndex = cardId ? targetColumn.cartes.findIndex(c => c.car_id === cardId) : 0;

      const newTargetCartes = [...targetColumn.cartes];
      newTargetCartes.splice(dropIndex, 0, {
        ...draggedCard,
        lis_id: columnId // Mise à jour de la liste de la carte
      });

      newColumns[sourceColumnIndex] = { ...sourceColumn, cartes: newSourceCartes };
      newColumns[targetColumnIndex] = { ...targetColumn, cartes: newTargetCartes };
    }

    setColumns(newColumns);
    addLog(
      `Déplacement de carte: ${draggedCard.car_nom}`,
      `Carte "${draggedCard.car_nom}" déplacée de "${dragSourceColumn}" vers "${columnId}"`
    );
    setDraggedCard(null);
    setDragSourceColumn(null);
    setDragOverCardId(null);
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
    setDragSourceColumn(null);
    setDragOverCardId(null);
  };

  const tabId = '1';

  return (
    <div className="app">
      <div className="header">
        <h1>Tableau Kanban</h1>
        <button
          type="button"
          className="log-button"
          onClick={() => navigate(`/tableau/${tabId}/log`)}
        >
          Voir les logs
        </button>
        <button
          type="button"
          className="login-button"
          onClick={() => navigate('/login')}
        >
          Déconnexion
        </button>
      </div>

      <div className="board">
        {columns.map((column) => (
          <div key={column.lis_id} className="column">
            <h2 className="column-title">{column.lis_titre}</h2>
            <div className="cards">
              {/* Zone de drop pour ajouter en haut de la colonne */}
              <div
                className="drop-zone"
                onDragOver={(e) => handleDragOver(e, null, column.lis_id)}
                onDrop={(e) => handleDrop(e, null, column.lis_id)}
              />

              {column.cartes.map((card) => (
                <div
                  key={card.car_id}
                  className={`card ${dragOverCardId === card.car_id ? 'drag-over' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, card, column.lis_id)}
                  onDragOver={(e) => handleDragOver(e, card.car_id, column.lis_id)}
                  onDrop={(e) => handleDrop(e, card.car_id, column.lis_id)}
                  onDragEnd={handleDragEnd}
                >
                  <button
                    type="button"
                    className="card-title-button"
                    onClick={(e) => openModal(e, card)}
                  >
                    {card.car_nom}
                  </button>

                  {/* Affichage de la priorité */}
                  <div className="card-priority"
                       style={{
                         backgroundColor:
                           card.car_priorite === 3 ? '#f44336' :
                           card.car_priorite === 2 ? '#ff9800' :
                           '#4caf50',
                         color: 'white',
                         padding: '2px 6px',
                         borderRadius: '3px',
                         fontSize: '10px',
                         marginTop: '5px'
                       }}>
                    {card.car_priorite === 3 ? 'HAUTE' :
                     card.car_priorite === 2 ? 'MOYENNE' : 'FAIBLE'}
                  </div>

                  {/* Affichage de la date limite */}
                  {card.car_dateFin && (
                    <div className="card-due-date"
                         style={{
                           fontSize: '11px',
                           color: '#666',
                           marginTop: '5px'
                         }}>
                      Échéance: {new Date(card.car_dateFin).toLocaleDateString('fr-FR')}
                    </div>
                  )}
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
              padding: '25px',
              borderRadius: '8px',
              width: '90%',
              maxWidth: '500px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
              color: 'black',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666'
              }}
              onClick={closeModal}
            >
              &times;
            </button>

            <h2 style={{
              marginTop: 0,
              color: '#2c3e50',
              borderBottom: '1px solid #eee',
              paddingBottom: '10px'
            }}>
              {modal.car_nom}
            </h2>

            <div style={{ margin: '15px 0' }}>
              <h3 style={{
                fontSize: '16px',
                color: '#2c3e50',
                marginBottom: '8px'
              }}>Description</h3>
              <p style={{ color: '#555', lineHeight: '1.5' }}>
                {modal.car_des || 'Aucune description'}
              </p>
            </div>

            {modal.car_dateFin && (
              <div style={{ margin: '15px 0' }}>
                <h3 style={{
                  fontSize: '16px',
                  color: '#2c3e50',
                  marginBottom: '8px'
                }}>Date limite</h3>
                <p style={{ color: '#555' }}>{modal.car_dateFin}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tableau;
