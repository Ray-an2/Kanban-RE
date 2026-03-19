import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Tableau as TableauType, Liste, Carte } from '../model/types.ts';
// CORRECTION : Carte.tsx est dans le même dossier (components/) → './Carte.tsx'
import CarteComponent from './Carte.tsx';
import { tableauApi, listeApi, carteApi } from '../api/apiClient.ts';

const Tableau: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [tableau, setTableau] = useState<TableauType | null>(null);
  const [lists, setLists] = useState<Liste[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const draggedCard = useRef<Carte | null>(null);
  const dragSourceListId = useRef<string | null>(null);
  const dragOverIndex = useRef<number>(-1);

  // ---- Chargement ----
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setLoading(true);
        const [tab, listes] = await Promise.all([
          tableauApi.getById(id) as Promise<TableauType>,
          listeApi.getByTableau(id) as Promise<Liste[]>,
        ]);
        setTableau(tab);
        setLists(listes);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // ---- Drag & drop ----
  const handleDragStart = (e: React.DragEvent, card: Carte, listId: string) => {
    draggedCard.current = card;
    dragSourceListId.current = listId;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', card.car_id);
  };

  const handleDragOver = (e: React.DragEvent, cardIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    dragOverIndex.current = cardIndex;
  };

  const handleDrop = async (e: React.DragEvent, targetListId: string) => {
    e.preventDefault();
    const card = draggedCard.current;
    const sourceListId = dragSourceListId.current;
    if (!card || !sourceListId) return;

    const targetList = lists.find(l => l.lis_id === targetListId);
    let newOrdre = targetList?.cartes.length ?? 0;
    if (dragOverIndex.current >= 0) newOrdre = dragOverIndex.current;

    // Optimistic update
    const prevLists = lists;
    setLists(applyDragLocally(lists, card, sourceListId, targetListId, newOrdre));

    try {
      await carteApi.dragDrop(card.car_id, {
        sourceLisId: sourceListId,
        targetLisId: targetListId,
        newOrdre,
      });
      // Recharger les listes pour avoir l'ordre serveur
      const refreshed = await listeApi.getByTableau(id!) as Liste[];
      setLists(refreshed);
    } catch (err) {
      console.error('Drag-drop échoué:', err);
      setLists(prevLists);
    } finally {
      draggedCard.current = null;
      dragSourceListId.current = null;
      dragOverIndex.current = -1;
    }
  };

  const handleDragEnd = () => {
    draggedCard.current = null;
    dragSourceListId.current = null;
    dragOverIndex.current = -1;
  };

  const handleCardClick = (e: React.MouseEvent, card: Carte) => {
    e.stopPropagation();
    navigate(`/api/tableau/${id}/carte/${card.car_id}`);
  };

  // ---- Rendu ----
  if (loading) return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ border: '4px solid rgba(0,0,0,0.1)', borderRadius: '50%', borderTop: '4px solid #3498db', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
        <p>Chargement du tableau...</p>
        <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
      </div>
  );

  if (error) return <div style={{ textAlign: 'center', padding: '50px', color: '#e74c3c' }}>{error}</div>;
  if (!tableau) return <div style={{ textAlign: 'center', padding: '50px' }}>Tableau non trouvé</div>;

  return (
      <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', minHeight: '100vh' }}>
        {/* En-tête */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ margin: 0, color: '#2c3e50' }}>{tableau.tab_nom}</h1>
            {tableau.tab_description && (
                <p style={{ color: '#666', margin: '5px 0 0 0', fontSize: '14px' }}>{tableau.tab_description}</p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={() => navigate(`/api/tableau/${id}/log`)}
                    style={{ padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Logs
            </button>
            <button type="button" onClick={() => navigate('/api/tableau')}
                    style={{ padding: '8px 16px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Retour
            </button>
          </div>
        </div>

        {/* Colonnes Kanban */}
        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px', alignItems: 'flex-start' }}>
          {lists.map((list) => (
              <div key={list.lis_id}
                   style={{ backgroundColor: '#f0f2f5', borderRadius: '8px', padding: '15px', minWidth: '280px', maxWidth: '280px', flexShrink: 0 }}
                   onDragOver={(e) => handleDragOver(e, list.cartes.length)}
                   onDrop={(e) => handleDrop(e, list.lis_id)}>

                {/* Titre liste */}
                <h2 style={{ margin: '0 0 15px 0', color: '#333', fontSize: '15px', fontWeight: '600', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {list.lis_titre}
                  <span style={{ backgroundColor: '#dee2e6', color: '#6c757d', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'normal' }}>
                {list.cartes.length}
              </span>
                </h2>

                {/* Cartes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '60px' }}>
                  {list.cartes.map((card, index) => (
                      <div key={card.car_id} onDragOver={(e) => handleDragOver(e, index)}>
                        <CarteComponent
                            carte={card}
                            listId={list.lis_id}
                            onDragStart={handleDragStart}
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

/** Applique le déplacement localement pour l'optimistic update */
function applyDragLocally(
    lists: Liste[], card: Carte,
    sourceListId: string, targetListId: string, newOrdre: number
): Liste[] {
  return lists.map(list => {
    if (list.lis_id === sourceListId && list.lis_id === targetListId) {
      const cartes = list.cartes.filter(c => c.car_id !== card.car_id);
      cartes.splice(Math.min(newOrdre, cartes.length), 0, card);
      return { ...list, cartes };
    }
    if (list.lis_id === sourceListId) {
      return { ...list, cartes: list.cartes.filter(c => c.car_id !== card.car_id) };
    }
    if (list.lis_id === targetListId) {
      const cartes = [...list.cartes];
      cartes.splice(Math.min(newOrdre, cartes.length), 0, { ...card, lis_id: targetListId });
      return { ...list, cartes };
    }
    return list;
  });
}

export default Tableau;