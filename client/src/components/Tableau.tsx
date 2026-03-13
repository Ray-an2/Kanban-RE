// Tableau.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Tableau as TableauType, Liste, Carte } from '../model/types.ts';
import CarteComponent from '../components/Carte.tsx';

const Tableau: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [tableau, setTableau] = useState<TableauType | null>(null);
  const [lists, setLists] = useState<Liste[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedCard, setDraggedCard] = useState<Carte | null>(null);

  useEffect(() => {
    const fetchTableauData = async () => {
      try {
        setLoading(true);

        //à remplacer par un vrai appel
        await new Promise(resolve => setTimeout(resolve, 800));

        const mockTableau: TableauType = {
          tab_id: id || '1',
          tab_nom: 'Projet Alpha',
          tab_description: 'Développement de la nouvelle application mobile',
          tab_date: new Date().toISOString(),
          tab_etat: 'A',
          tab_image: null
        };

        const mockLists: Liste[] = [
          {
            lis_id: '1',
            lis_titre: 'À faire',
            lis_ordre: 1,
            lis_etat: 'P',
            tab_id: id || '1',
            cartes: [
              {
                car_id: '1',
                car_nom: 'Créer la maquette',
                car_des: 'Créer la maquette de l\'application mobile',
                car_archiver: 'N',
                car_terminer: 'N',
                car_priorite: 2,
                car_ordre: 1,
                car_dateCreation: new Date().toISOString(),
                car_dateDebut: new Date().toISOString(),
                car_dateFin: new Date(Date.now() + 86400000).toISOString(),
                lis_id: '1'
              }
            ]
          },
          {
            lis_id: '2',
            lis_titre: 'En cours',
            lis_ordre: 2,
            lis_etat: 'P',
            tab_id: id || '1',
            cartes: [
              {
                car_id: '2',
                car_nom: 'Développer l\'API',
                car_des: 'Développer les endpoints de l\'API principale',
                car_archiver: 'N',
                car_terminer: 'N',
                car_priorite: 3,
                car_ordre: 1,
                car_dateCreation: new Date().toISOString(),
                car_dateDebut: new Date().toISOString(),
                car_dateFin: new Date(Date.now() + 172800000).toISOString(),
                lis_id: '2'
              }
            ]
          },
          {
            lis_id: '3',
            lis_titre: 'Terminé',
            lis_ordre: 3,
            lis_etat: 'P',
            tab_id: id || '1',
            cartes: []
          }
        ];

        setTableau(mockTableau);
        setLists(mockLists);
      } catch (error) {
        console.error("Erreur lors du chargement du tableau:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTableauData();
  }, [id]);

  const handleDragStart = (e: React.DragEvent, card: Carte) => {
    setDraggedCard(card);
    e.dataTransfer.setData('text/plain', card.car_id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetListId: string) => {
    e.preventDefault();

    if (!draggedCard) return;

    setLists(prevLists => {
      const newLists = [...prevLists];

      const sourceListIndex = newLists.findIndex(l => l.cartes.some(c => c.car_id === draggedCard.car_id));
      if (sourceListIndex !== -1) {
        newLists[sourceListIndex] = {
          ...newLists[sourceListIndex],
          cartes: newLists[sourceListIndex].cartes.filter(c => c.car_id !== draggedCard.car_id)
        };
      }

      const targetListIndex = newLists.findIndex(l => l.lis_id === targetListId);
      if (targetListIndex !== -1) {
        const updatedCard = { ...draggedCard, lis_id: targetListId };
        newLists[targetListIndex] = {
          ...newLists[targetListIndex],
          cartes: [...newLists[targetListIndex].cartes, updatedCard]
        };
      }

      return newLists;
    });

    setDraggedCard(null);
  };

  const handleCardClick = (e: React.MouseEvent, card: Carte) => {
    e.stopPropagation();
    navigate(`/tableau/${id}/carte/${card.car_id}`);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{
          border: '4px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '50%',
          borderTop: '4px solid #3498db',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }}></div>
        <p>Chargement du tableau...</p>
      </div>
    );
  }

  if (!tableau) {
    return <div>Tableau non trouvé</div>;
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '30px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#2c3e50' }}>{tableau.tab_nom}</h1>
          {tableau.tab_description && (
            <p style={{ color: '#666', margin: '5px 0 0 0' }}>{tableau.tab_description}</p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={() => navigate(`/tableau/${id}/log`)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Voir les logs
          </button>
          <button
            type="button"
            onClick={() => navigate('/accueil')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retour à l'accueil
          </button>
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '20px',
        overflowX: 'auto',
        paddingBottom: '20px'
      }}>
        {lists.map((list) => (
          <div
            key={list.lis_id}
            style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              padding: '15px',
              minWidth: '280px',
              flexShrink: 0
            }}
            onDragOver={handleDragOver}
          >
            <h2 style={{
              margin: '0 0 15px 0',
              color: '#333',
              fontSize: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              {list.lis_titre}
              <span style={{
                backgroundColor: '#e9ecef',
                color: '#6c757d',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px'
              }}>
                {list.cartes.length}
              </span>
            </h2>

            <div
              style={{
                minHeight: '100px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
              onDrop={(e) => handleDrop(e, list.lis_id)}
            >
              {list.cartes.map((card) => (
                <CarteComponent
                  key={card.car_id}
                  carte={card}
                  onDragStart={handleDragStart}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tableau;
