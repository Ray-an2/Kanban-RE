import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Tableau as TableauType, Liste, Carte } from '../model/types.ts';
import CarteComponent from '../components/Carte.tsx';

const API_URL = import.meta.env.VITE_API_URL;

const Tableau: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [tableau, setTableau] = useState<TableauType | null>(null);
  const [lists, setLists] = useState<Liste[]>([]);
  const [loading, setLoading] = useState(true);

  // --- État drag & drop ---
  const draggedCard = useRef<Carte | null>(null);
  const dragSourceListId = useRef<string | null>(null);
  const dragOverCardIndex = useRef<number>(-1);

  // -------------------------------------------------------------------------
  // Chargement initial
  // -------------------------------------------------------------------------
  useEffect(() => {
    const fetchTableauData = async () => {
      try {
        setLoading(true);
        const [tableauResponse, listesResponse] = await Promise.all([
          fetch(`${API_URL}/api/tableau/${id}`),
          fetch(`${API_URL}/api/liste/tableau/${id}`)
        ]);
        setTableau(await tableauResponse.json());
        setLists(await listesResponse.json());
      } catch (error) {
        console.error('Erreur lors du chargement du tableau:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTableauData();
  }, [id]);

  // -------------------------------------------------------------------------
  // Handlers drag & drop
  // -------------------------------------------------------------------------

  const handleDragStart = (e: React.DragEvent, card: Carte, listId: string) => {
    draggedCard.current = card;
    dragSourceListId.current = listId;
    e.dataTransfer.effectAllowed = 'move';
    // Stocker l'id dans dataTransfer pour compatibilité navigateur
    e.dataTransfer.setData('text/plain', card.car_id);
  };

  const handleDragOver = (e: React.DragEvent, cardIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    dragOverCardIndex.current = cardIndex;
  };

  /**
   * Drop sur une liste (zone vide ou sur une carte).
   * Calcule la position cible (newOrdre) et appelle l'API drag-drop.
   */
  const handleDrop = async (e: React.DragEvent, targetListId: string) => {
    e.preventDefault();

    const card = draggedCard.current;
    const sourceListId = dragSourceListId.current;

    if (!card || !sourceListId) return;

    // Position cible : où la carte a été survolée, sinon fin de liste
    const targetList = lists.find(l => l.lis_id === targetListId);
    let newOrdre = targetList ? targetList.cartes.length : 0;

    if (dragOverCardIndex.current >= 0) {
      newOrdre = dragOverCardIndex.current;
    }

    // Optimistic update — mettre à jour l'état local immédiatement
    // pour un rendu fluide, puis confirmer avec le serveur
    const prevLists = lists;
    setLists(applyDragDropLocally(lists, card, sourceListId, targetListId, newOrdre));

    try {
      const response = await fetch(
          `${API_URL}/api/carte/${card.car_id}/drag-drop`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sourceLisId: sourceListId,
              targetLisId: targetListId,
              newOrdre,
            }),
          }
      );

      if (!response.ok) {
        // Revert si l'API échoue
        console.error('Erreur API drag-drop, revert');
        setLists(prevLists);
        return;
      }

      // Mettre à jour avec la réponse serveur (listes recalculées)
      const updatedLists: Liste[] = await response.json();
      setLists(prev =>
          prev.map(list => {
            const updated = updatedLists.find(ul => ul.lis_id === list.lis_id);
            return updated ?? list;
          })
      );
    } catch (error) {
      console.error('Erreur lors du drag-drop:', error);
      setLists(prevLists);
    } finally {
      draggedCard.current = null;
      dragSourceListId.current = null;
      dragOverCardIndex.current = -1;
    }
  };

  const handleDragEnd = () => {
    draggedCard.current = null;
    dragSourceListId.current = null;
    dragOverCardIndex.current = -1;
  };

  const handleCardClick = (e: React.MouseEvent, card: Carte) => {
    e.stopPropagation();
    navigate(`/api/tableau/${id}/carte/${card.car_id}`);
  };

  // -------------------------------------------------------------------------
  // Rendu
  // -------------------------------------------------------------------------

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
          <style>{`@keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }`}</style>
        </div>
    );
  }

  if (!tableau) {
    return <div>Tableau non trouvé</div>;
  }

  return (
      <div style={{
        maxWidth: '100%',
        padding: '30px',
        fontFamily: 'Arial, sans-serif'
      }}>
        {/* En-tête */}
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
                onClick={() => navigate(`/api/tableau/${id}/log`)}
                style={{ padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Voir les logs
            </button>
            <button
                type="button"
                onClick={() => navigate('/api/tableau')}
                style={{ padding: '8px 16px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Retour à l'accueil
            </button>
          </div>
        </div>

        {/* Colonnes */}
        <div style={{
          display: 'flex',
          gap: '20px',
          overflowX: 'auto',
          paddingBottom: '20px',
          alignItems: 'flex-start'
        }}>
          {lists.map((list) => (
              <div
                  key={list.lis_id}
                  style={{
                    backgroundColor: '#f0f2f5',
                    borderRadius: '8px',
                    padding: '15px',
                    minWidth: '280px',
                    maxWidth: '280px',
                    flexShrink: 0
                  }}
                  onDragOver={(e) => handleDragOver(e, list.cartes.length)}
                  onDrop={(e) => handleDrop(e, list.lis_id)}
              >
                {/* Titre de la liste */}
                <h2 style={{
                  margin: '0 0 15px 0',
                  color: '#333',
                  fontSize: '15px',
                  fontWeight: '600',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  {list.lis_titre}
                  <span style={{
                    backgroundColor: '#dee2e6',
                    color: '#6c757d',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'normal'
                  }}>
                {list.cartes.length}
              </span>
                </h2>

                {/* Zone de cartes */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  minHeight: '60px'
                }}>
                  {list.cartes.map((card, index) => (
                      <div
                          key={card.car_id}
                          onDragOver={(e) => handleDragOver(e, index)}
                      >
                        <CarteComponent
                            carte={card}
                            onDragStart={(e, c) => handleDragStart(e, c, list.lis_id)}
                            onDragEnd={handleDragEnd}
                            onClick={handleCardClick}
                            isDragging={draggedCard.current?.car_id === card.car_id}
                        />
                      </div>
                  ))}
                </div>
              </div>
          ))}
        </div>
      </div>
  );
};

// -------------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------------

/**
 * Applique le déplacement de carte localement (optimistic update)
 * sans appel réseau — identique à l'algorithme côté serveur.
 */
function applyDragDropLocally(
    lists: Liste[],
    card: Carte,
    sourceListId: string,
    targetListId: string,
    newOrdre: number
): Liste[] {
  return lists.map(list => {
    if (list.lis_id === sourceListId && list.lis_id === targetListId) {
      // Réordonnancement dans la même liste
      const cartes = list.cartes.filter(c => c.car_id !== card.car_id);
      const clamped = Math.min(newOrdre, cartes.length);
      cartes.splice(clamped, 0, card);
      return { ...list, cartes };
    }

    if (list.lis_id === sourceListId) {
      return { ...list, cartes: list.cartes.filter(c => c.car_id !== card.car_id) };
    }

    if (list.lis_id === targetListId) {
      const cartes = [...list.cartes];
      const clamped = Math.min(newOrdre, cartes.length);
      cartes.splice(clamped, 0, { ...card, lis_id: targetListId });
      return { ...list, cartes };
    }

    return list;
  });
}

export default Tableau;