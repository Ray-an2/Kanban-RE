import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Carte as CarteType, Etiquette, Associer, Commentaire } from '../model/types.ts';
import { carteApi, associerApi, etiquetteApi, commentaireApi } from '../api/apiClient.ts';
import { useAuth } from '../hooks/useAuth.ts';

const CarteDetail: React.FC = () => {
  const { id: boardId, cardId } = useParams<{ id: string; cardId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [carte, setCarte] = useState<CarteType | null>(null);
  const [etiquettes, setEtiquettes] = useState<Etiquette[]>([]);
  const [commentaires, setCommentaires] = useState<Commentaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!cardId) return;
    const load = async () => {
      try {
        const [carteData, assocData, commData] = await Promise.all([
          carteApi.getById(cardId) as Promise<CarteType>,
          associerApi.getByCarte(cardId) as Promise<Associer[]>,
          commentaireApi.getByCarte(cardId) as Promise<Commentaire[]>,
        ]);
        setCarte(carteData);
        setCommentaires(commData);

        // AssocierDto.etiId → récupérer chaque étiquette
        const etiDetails = await Promise.all(
            assocData.map(a => etiquetteApi.getById(a.etiId) as Promise<Etiquette>)
        );
        setEtiquettes(etiDetails);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [cardId]);

  const handleToggleTerminer = async () => {
    if (!cardId) return;
    try {
      const updated = await carteApi.terminer(cardId) as CarteType;
      setCarte(updated);
    } catch (err) {
      console.error('Erreur terminer:', err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardId || !newComment.trim() || !user) return;
    setSubmitting(true);
    try {
      // CommentaireDto : carteId, auteurId, contenu
      const created = await commentaireApi.create({
        carteId: cardId,
        auteurId: user.cpt_pseudo,
        contenu: newComment.trim(),
      }) as Commentaire;
      setCommentaires(prev => [...prev, created]);
      setNewComment('');
    } catch (err) {
      console.error('Erreur commentaire:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      await commentaireApi.delete(id);
      setCommentaires(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Erreur suppression commentaire:', err);
    }
  };

  const priorityInfo = (p: number) => {
    if (p === 3) return { bg: '#f44336', text: 'Haute' };
    if (p === 2) return { bg: '#ff9800', text: 'Moyenne' };
    return { bg: '#4caf50', text: 'Faible' };
  };

  if (loading) return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ border: '4px solid rgba(0,0,0,0.1)', borderRadius: '50%', borderTop: '4px solid #3498db', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
        <p>Chargement de la carte...</p>
        <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
      </div>
  );

  if (error) return <div style={{ textAlign: 'center', padding: '50px', color: '#e74c3c' }}>{error}</div>;
  if (!carte) return <div style={{ textAlign: 'center', padding: '50px' }}>Carte non trouvée</div>;

  const prio = priorityInfo(carte.car_priorite);
  // car_date_fin : champ JSON réel depuis CarteDto (@JsonProperty("car_date_fin"))
  const isLate = carte.car_date_fin ? new Date(carte.car_date_fin) < new Date() : false;

  return (
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '30px', fontFamily: 'Arial, sans-serif' }}>
        {/* En-tête */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
          <div>
            <h1 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>{carte.car_nom}</h1>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ padding: '4px 10px', backgroundColor: prio.bg, color: 'white', borderRadius: '4px', fontSize: '12px' }}>
              Priorité : {prio.text}
            </span>
              <span
                  style={{ padding: '4px 10px', backgroundColor: carte.car_terminer === 'T' ? '#4CAF50' : '#ff9800', color: 'white', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                  onClick={handleToggleTerminer}
                  title="Cliquer pour changer le statut">
              {/* car_terminer : 'T' = Terminé, 'N' = Non terminé */}
                {carte.car_terminer === 'T' ? '✓ Terminée' : 'En cours'}
            </span>
              {carte.car_archiver === 'O' && (
                  <span style={{ padding: '4px 10px', backgroundColor: '#9e9e9e', color: 'white', borderRadius: '4px', fontSize: '12px' }}>Archivée</span>
              )}
            </div>
          </div>
          <button type="button" onClick={() => navigate(`/api/tableau/${boardId}`)}
                  style={{ padding: '8px 16px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Retour
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '25px' }}>

          {/* Colonne principale */}
          <div>
            {/* Description — champ JSON "car_description" dans CarteDto */}
            <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '20px' }}>
              <h2 style={{ margin: '0 0 12px 0', color: '#333', fontSize: '16px' }}>Description</h2>
              <p style={{ color: '#555', whiteSpace: 'pre-line', margin: 0, fontSize: '14px' }}>
                {carte.car_description ?? 'Aucune description.'}
              </p>
            </div>

            {/* Commentaires */}
            <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h2 style={{ margin: '0 0 15px 0', color: '#333', fontSize: '16px' }}>
                Commentaires ({commentaires.length})
              </h2>

              <form onSubmit={handleAddComment} style={{ marginBottom: '20px' }}>
              <textarea value={newComment} onChange={e => setNewComment(e.target.value)}
                        placeholder="Ajouter un commentaire..."
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical', minHeight: '80px', boxSizing: 'border-box', fontSize: '14px' }} />
                <button type="submit" disabled={submitting || !newComment.trim()}
                        style={{ marginTop: '8px', padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>
                  {submitting ? 'Envoi...' : 'Commenter'}
                </button>
              </form>

              {commentaires.length === 0 ? (
                  <p style={{ color: '#999', textAlign: 'center', margin: '20px 0', fontSize: '14px' }}>Aucun commentaire.</p>
              ) : (
                  commentaires.map(c => (
                      <div key={c.id} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '12px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <strong style={{ color: '#2c3e50', fontSize: '14px' }}>{c.auteurId}</strong>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#999', fontSize: '12px' }}>
                        {new Date(c.dateCreation).toLocaleString('fr-FR')}
                      </span>
                            {user?.cpt_pseudo === c.auteurId && (
                                <button type="button" onClick={() => handleDeleteComment(c.id)}
                                        style={{ padding: '2px 8px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>
                                  ×
                                </button>
                            )}
                          </div>
                        </div>
                        <p style={{ margin: 0, color: '#555', fontSize: '14px' }}>{c.contenu}</p>
                      </div>
                  ))
              )}
            </div>
          </div>

          {/* Colonne latérale */}
          <div>
            {/* Étiquettes — EtiquetteDto : id, nom, couleur */}
            <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '15px' }}>
              <h2 style={{ margin: '0 0 12px 0', color: '#333', fontSize: '16px' }}>Étiquettes</h2>
              {etiquettes.length === 0 ? (
                  <p style={{ color: '#999', fontSize: '13px', margin: 0 }}>Aucune étiquette.</p>
              ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {etiquettes.map(e => (
                        <span key={e.id}
                              style={{ padding: '4px 10px', backgroundColor: e.couleur, color: 'white', borderRadius: '12px', fontSize: '12px' }}>
                    {e.nom}
                  </span>
                    ))}
                  </div>
              )}
            </div>

            {/* Dates — car_date_creation, car_date_debut, car_date_fin */}
            <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h2 style={{ margin: '0 0 12px 0', color: '#333', fontSize: '16px' }}>Dates</h2>
              <div style={{ fontSize: '13px', color: '#555', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <strong>Création :</strong><br />
                  {new Date(carte.car_date_creation).toLocaleString('fr-FR')}
                </div>
                {carte.car_date_debut && (
                    <div>
                      <strong>Début :</strong><br />
                      {new Date(carte.car_date_debut).toLocaleString('fr-FR')}
                    </div>
                )}
                {carte.car_date_fin && (
                    <div style={{ color: isLate ? '#f44336' : '#555' }}>
                      <strong>Échéance :</strong><br />
                      {new Date(carte.car_date_fin).toLocaleString('fr-FR')}
                      {isLate && <span style={{ display: 'block', fontWeight: '600', marginTop: '2px' }}>⚠ En retard</span>}
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CarteDetail;