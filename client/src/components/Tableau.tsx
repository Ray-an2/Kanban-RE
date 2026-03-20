import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Tableau as TableauType, Liste, Carte } from '../model/types.ts';
import CarteComponent from './Carte.tsx';
import { tableauApi, listeApi, carteApi, roleApi, membreApi, compteApi } from '../api/apiClient.ts';
import { useAuth } from '../hooks/useAuth.ts';

interface MembreTableau { cptId: string; tabId: string; rolRole: string; cptPseudo?: string; }
interface MembreCarte  { cptId: string; carId: string; dateCreation: string; }
interface CompteSimple { id: string; pseudo: string; role: string; }

const ROLES = [
  { value: 'C', label: 'Créateur' },
  { value: 'A', label: 'Admin' },
  { value: 'M', label: 'Membre' },
];

const Tableau: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tableau, setTableau]   = useState<TableauType | null>(null);
  const [lists, setLists]       = useState<Liste[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const draggedCard       = useRef<Carte | null>(null);
  const dragSourceListId  = useRef<string | null>(null);
  const dragOverCardIdx   = useRef<number>(-1);
  const draggedListId     = useRef<string | null>(null);
  const dragOverListIdx   = useRef<number>(-1);


  const [showNewListe, setShowNewListe] = useState(false);
  const [titreListe, setTitreListe]     = useState('');


  const [showMembres, setShowMembres]       = useState(false);
  const [membresTab, setMembresTab]         = useState<MembreTableau[]>([]);
  const [loadingMembres, setLoadingMembres] = useState(false);
  const [membresError, setMembresError]     = useState<string | null>(null);

  const [showAddMembre, setShowAddMembre]   = useState(false);
  const [allComptes, setAllComptes]         = useState<CompteSimple[]>([]);
  const [selectedCptId, setSelectedCptId]   = useState('');
  const [selectedRole, setSelectedRole]     = useState('M');
  const [addLoading, setAddLoading]         = useState(false);

  const [editingMembre, setEditingMembre]   = useState<string | null>(null);
  const [editRole, setEditRole]             = useState('');


  const [showMembresCarte, setShowMembresCarte] = useState<string | null>(null);
  const [membresCarte, setMembresCarte]         = useState<MembreCarte[]>([]);

  // chargement
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const [tab, listes] = await Promise.all([
          await tableauApi.getById(id) as Promise<TableauType>,
          await listeApi.getByTableau(id) as Promise<Liste[]>,
        ]);
        setTableau(tab);
        setLists(listes);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur');
      } finally { setLoading(false); }
    })();
  }, [id]);

  const loadMembres = async () => {
    setLoadingMembres(true);
    setMembresError(null);
    try {
      const roles = await roleApi.getByTableau(id!) as MembreTableau[];
      setMembresTab(roles.filter(r => r.rolRole !== 'E'));
    } catch {
      setMembresError('Impossible de charger les membres.');
      setMembresTab([]);
    } finally { setLoadingMembres(false); }
  };

  const openMembres = async () => {
    setShowMembres(true);
    setShowAddMembre(false);
    setEditingMembre(null);
    await loadMembres();
  };

  const openAddMembre = async () => {
    setShowAddMembre(true);
    setSelectedCptId('');
    setSelectedRole('M');
    try {
      const comptes = await compteApi.getAll() as CompteSimple[];
      const dejaMembres = new Set(membresTab.map(m => m.cptId));
      setAllComptes(comptes.filter(c => !dejaMembres.has(c.id)));
    } catch {
      setAllComptes([]);
    }
  };

  const handleAddMembre = async () => {
    if (!selectedCptId || !id) return;
    setAddLoading(true);
    setMembresError(null);
    try {
      await roleApi.associer({ cptId: selectedCptId, tabId: id, rolRole: selectedRole });
      setShowAddMembre(false);
      await loadMembres();
    } catch (err) {
      setMembresError(err instanceof Error ? err.message : 'Erreur ajout membre');
    } finally { setAddLoading(false); }
  };


  const handleDeleteMembre = async (cptId: string) => {
    if (!id) return;
    if (!globalThis.confirm('Retirer ce membre du tableau ?')) return;
    setMembresError(null);
    try {
      await roleApi.delete(id, cptId);
      setMembresTab(prev => prev.filter(m => m.cptId !== cptId));
    } catch (err) {
      setMembresError(err instanceof Error ? err.message : 'Erreur suppression');
    }
  };

  const openEditRole = (m: MembreTableau) => {
    setEditingMembre(m.cptId);
    setEditRole(m.rolRole);
  };

  const handleUpdateRole = async (cptId: string) => {
    if (!id) return;
    setMembresError(null);
    try {
      await roleApi.update(id, cptId, editRole);
      setMembresTab(prev => prev.map(m => m.cptId === cptId ? { ...m, rolRole: editRole } : m));
      setEditingMembre(null);
    } catch (err) {
      setMembresError(err instanceof Error ? err.message : 'Erreur modification rôle');
    }
  };

  const openMembresCarte = async (carId: string) => {
    setShowMembresCarte(carId);
    try {
      const m = await membreApi.getByCarte(carId) as MembreCarte[];
      setMembresCarte(m);
    } catch { setMembresCarte([]); }
  };

  const ajouterListe = async () => {
    if (!titreListe.trim() || !id) return;
    try {
      const nl = await listeApi.create({ lis_titre: titreListe.trim(), lis_ordre: lists.length + 1, tab_id: id }) as Liste;
      setLists(prev => [...prev, { ...nl, cartes: [] }]);
      setTitreListe(''); setShowNewListe(false);
    } catch (err) { console.error(err); }
  };

  const onCardDragStart = (e: React.DragEvent, card: Carte, listId: string) => {
    draggedCard.current = card; dragSourceListId.current = listId; draggedListId.current = null;
    e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('dtype', 'card');
  };
  const onCardDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault(); e.dataTransfer.dropEffect = 'move'; dragOverCardIdx.current = idx;
  };
  const onCardDrop = async (e: React.DragEvent, targetLisId: string) => {
    e.preventDefault();
    if (e.dataTransfer.getData('dtype') !== 'card') return;
    const card = draggedCard.current; const srcId = dragSourceListId.current;
    if (!card || !srcId) return;
    const newOrdre = dragOverCardIdx.current >= 0 ? dragOverCardIdx.current
        : (lists.find(l => l.lis_id === targetLisId)?.cartes?.length ?? 0);
    const prev = lists;
    setLists(applyCardDrag(lists, card, srcId, targetLisId, newOrdre));
    try {
      await carteApi.dragDrop(card.car_id, { sourceLisId: srcId, targetLisId, newOrdre });
      const r = await listeApi.getByTableau(id!) as Liste[]; setLists(r);
    } catch { setLists(prev); }
    finally { draggedCard.current = null; dragSourceListId.current = null; dragOverCardIdx.current = -1; }
  };

  const onListDragStart = (e: React.DragEvent, lisId: string) => {
    draggedListId.current = lisId; draggedCard.current = null;
    e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('dtype', 'list');
  };
  const onListDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedCard.current) return;
    e.dataTransfer.dropEffect = 'move'; dragOverListIdx.current = idx;
  };
  const onListDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.getData('dtype') !== 'list') return;
    const srcId = draggedListId.current;
    if (!srcId || dragOverListIdx.current < 0) return;
    const srcIdx = lists.findIndex(l => l.lis_id === srcId);
    if (srcIdx === dragOverListIdx.current) return;
    const nl = [...lists];
    const [moved] = nl.splice(srcIdx, 1);
    nl.splice(dragOverListIdx.current, 0, moved);
    setLists(nl);
    try {
      await listeApi.updateOrdre(id!, nl.map((l, i) => ({ lisId: l.lis_id, ordre: i + 1 })));
    } catch (err) { console.error(err); }
    finally { draggedListId.current = null; dragOverListIdx.current = -1; }
  };

  const rolBadge = (rol: string) => {
    const map: Record<string, [string, string]> = {
      C: ['Créateur', '#9b59b6'], A: ['Admin', '#e74c3c'], M: ['Membre', '#3498db'],
    };
    const [label, color] = map[rol] ?? [rol, '#95a5a6'];
    return { label, color };
  };

  const isAdminOrCreateur = () => {
    const membre = membresTab.find(m => m.cptId === user?.cpt_id);
    return user?.cpt_role === 'A' || membre?.rolRole === 'C' || membre?.rolRole === 'A';
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '60px' }}><p>Chargement...</p></div>;
  if (error)   return <div style={{ textAlign: 'center', padding: '60px', color: '#e74c3c' }}>{error}</div>;
  if (!tableau) return <div style={{ textAlign: 'center', padding: '60px' }}>Tableau introuvable</div>;

  return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', minHeight: '100vh' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <h1 style={{ margin: 0, color: '#2c3e50' }}>{tableau.tab_nom}</h1>
            {tableau.tab_description && <p style={{ color: '#666', margin: '4px 0 0', fontSize: '14px' }}>{tableau.tab_description}</p>}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <button type="button" onClick={openMembres}
                    style={{ padding: '7px 14px', backgroundColor: '#9b59b6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>
              👥 Membres
            </button>
            <button type="button" onClick={() => navigate(`/api/tableau/${id}/log`)}
                    style={{ padding: '7px 14px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>
              Logs
            </button>
            <button type="button" onClick={() => navigate('/api/tableau')}
                    style={{ padding: '7px 14px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>
              ← Retour
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '20px', alignItems: 'flex-start' }}>
          {lists.map((list, listIdx) => (
              <div key={list.lis_id}
                   draggable
                   onDragStart={(e) => onListDragStart(e, list.lis_id)}
                   onDragOver={(e) => onListDragOver(e, listIdx)}
                   onDrop={onListDrop}
                   style={{ backgroundColor: '#f0f2f5', borderRadius: '8px', padding: '12px', minWidth: '272px', maxWidth: '272px', flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', cursor: 'grab', userSelect: 'none' }}>
                  <span style={{ fontWeight: '600', fontSize: '14px', color: '#333' }}>⠿ {list.lis_titre}</span>
                  <span style={{ backgroundColor: '#dee2e6', color: '#6c757d', padding: '1px 7px', borderRadius: '10px', fontSize: '11px' }}>
                    {list.cartes?.length ?? 0}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '40px' }}
                     onDragOver={(e) => onCardDragOver(e, list.cartes?.length ?? 0)}
                     onDrop={(e) => onCardDrop(e, list.lis_id)}>
                  {(list.cartes ?? []).map((card, cardIdx) => (
                      <div key={card.car_id} onDragOver={(e) => onCardDragOver(e, cardIdx)}>
                        <CarteComponent
                            carte={card}
                            listId={list.lis_id}
                            onDragStart={onCardDragStart}
                            onDragEnd={() => { draggedCard.current = null; dragSourceListId.current = null; }}
                            onClick={(e, c) => { e.stopPropagation(); navigate(`/api/tableau/${id}/carte/${c.car_id}`); }}
                            isDragging={draggedCard.current?.car_id === card.car_id}
                            onClickMembres={() => openMembresCarte(card.car_id)}
                        />
                      </div>
                  ))}
                </div>
                <button type="button"
                        style={{ marginTop: '8px', width: '100%', padding: '6px', background: 'transparent', border: '1px dashed #ccc', borderRadius: '4px', color: '#777', cursor: 'pointer', fontSize: '12px' }}>
                  + Ajouter une carte
                </button>
              </div>
          ))}

          <div style={{ minWidth: '272px', flexShrink: 0 }}>
            {showNewListe ? (
                <div style={{ backgroundColor: '#f0f2f5', borderRadius: '8px', padding: '12px' }}>
                  <input type="text" value={titreListe} onChange={e => setTitreListe(e.target.value)}
                         placeholder="Titre de la liste" autoFocus
                         onKeyDown={e => { if (e.key === 'Enter') ajouterListe(); if (e.key === 'Escape') { setShowNewListe(false); setTitreListe(''); } }}
                         style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', marginBottom: '8px' }} />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" onClick={ajouterListe}
                            style={{ padding: '6px 14px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Ajouter</button>
                    <button type="button" onClick={() => { setShowNewListe(false); setTitreListe(''); }}
                            style={{ padding: '6px 14px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Annuler</button>
                  </div>
                </div>
            ) : (
                <button type="button" onClick={() => setShowNewListe(true)}
                        style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(0,0,0,0.08)', border: 'none', borderRadius: '8px', color: '#555', cursor: 'pointer', fontSize: '14px', textAlign: 'left' }}>
                  + Ajouter une liste
                </button>
            )}
          </div>
        </div>

        {showMembres && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
              <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', width: '480px', maxWidth: '90%', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>

                {/* En-tête popup */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ margin: 0, color: '#2c3e50' }}>👥 Membres du tableau</h2>
                  <button type="button" onClick={() => { setShowMembres(false); setShowAddMembre(false); setEditingMembre(null); }}
                          style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#666' }}>✕</button>
                </div>

                {membresError && (
                    <div style={{ padding: '8px 12px', backgroundColor: '#fdecea', color: '#e74c3c', borderRadius: '4px', marginBottom: '12px', fontSize: '13px' }}>
                      {membresError}
                    </div>
                )}

                {/* Bouton ajouter membre (admin/créateur uniquement) */}
                {isAdminOrCreateur() && !showAddMembre && (
                    <button type="button" onClick={openAddMembre}
                            style={{ width: '100%', padding: '8px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', marginBottom: '16px' }}>
                      + Ajouter un membre
                    </button>
                )}

                {/* Formulaire ajout membre */}
                {showAddMembre && (
                    <div style={{ backgroundColor: '#f8f9fa', borderRadius: '6px', padding: '14px', marginBottom: '16px' }}>
                      <p style={{ margin: '0 0 10px 0', fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>Ajouter un membre</p>

                      <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '4px' }}>Compte</label>
                      <select value={selectedCptId} onChange={e => setSelectedCptId(e.target.value)}
                              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', marginBottom: '10px' }}>
                        <option value="">-- Sélectionner un compte --</option>
                        {allComptes.map(c => (
                            <option key={c.id} value={c.id}>{c.pseudo}</option>
                        ))}
                      </select>

                      <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '4px' }}>Rôle</label>
                      <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)}
                              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', marginBottom: '12px' }}>
                        {ROLES.filter(r => r.value !== 'C').map(r => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button type="button" onClick={handleAddMembre} disabled={!selectedCptId || addLoading}
                                style={{ flex: 1, padding: '7px', backgroundColor: selectedCptId ? '#4CAF50' : '#ccc', color: 'white', border: 'none', borderRadius: '4px', cursor: selectedCptId ? 'pointer' : 'not-allowed', fontSize: '13px' }}>
                          {addLoading ? 'Ajout...' : 'Confirmer'}
                        </button>
                        <button type="button" onClick={() => setShowAddMembre(false)}
                                style={{ flex: 1, padding: '7px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>
                          Annuler
                        </button>
                      </div>
                    </div>
                )}

                {/* Liste des membres */}
                {loadingMembres ? (
                    <p style={{ color: '#666', textAlign: 'center' }}>Chargement...</p>
                ) : membresTab.length === 0 ? (
                    <p style={{ color: '#999', textAlign: 'center' }}>Aucun membre.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {membresTab.map(m => {
                        const { label, color } = rolBadge(m.rolRole);
                        const isEditing = editingMembre === m.cptId;
                        const canManage = isAdminOrCreateur() && m.rolRole !== 'C';

                        return (
                            <div key={m.cptId} style={{ padding: '10px 14px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                {/* Avatar + pseudo */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#1976d2', fontSize: '14px' }}>
                                    {(m.cptPseudo ?? m.cptId).charAt(0).toUpperCase()}
                                  </div>
                                  <span style={{ fontWeight: '500', color: '#2c3e50' }}>{m.cptPseudo ?? m.cptId}</span>
                                </div>

                                {/* Rôle + actions */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  {!isEditing && (
                                      <span style={{ padding: '3px 10px', backgroundColor: color + '22', color, borderRadius: '10px', fontSize: '12px', fontWeight: '600' }}>
                                        {label}
                                      </span>
                                  )}
                                  {canManage && !isEditing && (
                                      <>
                                        <button type="button" onClick={() => openEditRole(m)}
                                                style={{ padding: '3px 8px', backgroundColor: '#FF9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>
                                          ✏️
                                        </button>
                                        <button type="button" onClick={() => handleDeleteMembre(m.cptId)}
                                                style={{ padding: '3px 8px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>
                                          🗑
                                        </button>
                                      </>
                                  )}
                                </div>
                              </div>

                              {isEditing && (
                                  <div style={{ marginTop: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <select value={editRole} onChange={e => setEditRole(e.target.value)}
                                            style={{ flex: 1, padding: '6px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}>
                                      {ROLES.filter(r => r.value !== 'C').map(r => (
                                          <option key={r.value} value={r.value}>{r.label}</option>
                                      ))}
                                    </select>
                                    <button type="button" onClick={() => handleUpdateRole(m.cptId)}
                                            style={{ padding: '6px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                                      ✓
                                    </button>
                                    <button type="button" onClick={() => setEditingMembre(null)}
                                            style={{ padding: '6px 10px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                                      ✕
                                    </button>
                                  </div>
                              )}
                            </div>
                        );
                      })}
                    </div>
                )}
              </div>
            </div>
        )}

        {/* POPUP MEMBRES CARTE */}
        {showMembresCarte && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
              <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', width: '360px', maxWidth: '90%', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '16px' }}>Membres de la carte</h2>
                  <button type="button" onClick={() => setShowMembresCarte(null)}
                          style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#666' }}>✕</button>
                </div>
                {membresCarte.length === 0 ? (
                    <p style={{ color: '#999', textAlign: 'center' }}>Aucun membre assigné à cette carte.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {membresCarte.map(m => (
                          <div key={m.cptId} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#1976d2', fontSize: '12px' }}>
                              {m.cptId.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ color: '#2c3e50', fontSize: '14px', fontWeight: '500' }}>{m.cptId}</div>
                              <div style={{ color: '#999', fontSize: '11px' }}>Depuis {new Date(m.dateCreation).toLocaleDateString('fr-FR')}</div>
                            </div>
                          </div>
                      ))}
                    </div>
                )}
              </div>
            </div>
        )}
      </div>
  );
};

function applyCardDrag(lists: Liste[], card: Carte, srcId: string, tgtId: string, ordre: number): Liste[] {
  return lists.map(l => {
    if (l.lis_id === srcId && l.lis_id === tgtId) {
      const c = l.cartes.filter(x => x.car_id !== card.car_id);
      c.splice(Math.min(ordre, c.length), 0, card);
      return { ...l, cartes: c };
    }
    if (l.lis_id === srcId) return { ...l, cartes: l.cartes.filter(x => x.car_id !== card.car_id) };
    if (l.lis_id === tgtId) {
      const c = [...l.cartes]; c.splice(Math.min(ordre, c.length), 0, { ...card, lis_id: tgtId }); return { ...l, cartes: c };
    }
    return l;
  });
}

export default Tableau;
