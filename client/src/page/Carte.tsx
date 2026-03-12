import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Définition des interfaces directement dans le fichier
interface Compte {
  cpt_id: string;
  cpt_pseudo: string;
  cpt_mdp: string;
  cpt_role: string;
}

interface Profil {
  pfl_nom: string | null;
  pfl_prenom: string | null;
  pfl_mail: string | null;
  pfl_etat: 'A' | 'D';
  pfl_date: string | null;
  cpt_id: string;
}

interface Etiquette {
  eti_id: string;
  eti_nom: string;
  eti_couleur: string;
}

interface Liste {
  lis_id: string;
  lis_titre: string;
  lis_ordre: number;
  lis_etat: 'P' | 'A';
  tab_id: string;
}

interface MemberWithProfile extends Compte {
  profil?: Profil;
}

const CardDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Type complet pour la carte
  type CardType = {
    car_id: string;
    car_nom: string;
    car_des: string | null;
    car_archiver: 'O' | 'N';
    car_terminer: 'O' | 'N';
    car_priorite: number;
    car_ordre: number;
    car_dateCreation: string;
    car_dateDebut: string | null;
    car_dateFin: string | null;
    car_couverture: string | null;
    lis_id: string;
    etiquettes?: Etiquette[];
    membres?: MemberWithProfile[];
    liste?: Liste;
  };

  // Données simulées avec typage complet
  const [card] = useState<CardType>({
    car_id: id || '1',
    car_nom: 'Implémenter l\'API de paiement',
    car_des: 'Description détaillée...',
    car_archiver: 'N',
    car_terminer: 'N',
    car_priorite: 3,
    car_ordre: 1,
    car_dateCreation: '2026-03-01 10:00:00',
    car_dateDebut: '2026-03-05 09:00:00',
    car_dateFin: '2026-03-15 18:00:00',
    car_couverture: null,
    lis_id: '1',
    etiquettes: [
      { eti_id: '1', eti_nom: 'Urgent', eti_couleur: '#f44336' },
      { eti_id: '2', eti_nom: 'Backend', eti_couleur: '#2196F3' }
    ],
    membres: [
      {
        cpt_id: '1',
        cpt_pseudo: 'jdupont',
        cpt_mdp: '',
        cpt_role: 'admin',
        profil: {
          pfl_nom: 'Dupont',
          pfl_prenom: 'Jean',
          pfl_mail: 'jean.dupont@example.com',
          pfl_etat: 'A',
          pfl_date: '2025-01-10 14:30:00',
          cpt_id: '1'
        }
      },
      {
        cpt_id: '2',
        cpt_pseudo: 'mmartin',
        cpt_mdp: '',
        cpt_role: 'user',
        profil: {
          pfl_nom: 'Martin',
          pfl_prenom: 'Marie',
          pfl_mail: 'marie.martin@example.com',
          pfl_etat: 'A',
          pfl_date: '2024-11-15 09:20:00',
          cpt_id: '2'
        }
      }
    ],
    liste: {
      lis_id: '1',
      lis_titre: 'En cours',
      lis_ordre: 1,
      lis_etat: 'P',
      tab_id: '1'
    }
  });

  const [newComment, setNewComment] = useState('');
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [checklist, setChecklist] = useState([
    { id: '1', text: 'Créer les endpoints backend', completed: true },
    { id: '2', text: 'Intégrer Stripe au front-end', completed: false },
    { id: '3', text: 'Écrire les tests unitaires', completed: false }
  ]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      setNewComment('');
    }
  };

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setChecklist([
        ...checklist,
        {
          id: Date.now().toString(),
          text: newChecklistItem,
          completed: false
        }
      ]);
      setNewChecklistItem('');
    }
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist(checklist.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const getPriorityColor = () => {
    switch (card.car_priorite) {
      case 3: return '#f44336';
      case 2: return '#ff9800';
      case 1: return '#4caf50';
      default: return '#999';
    }
  };

  const getStatusColor = () => {
    if (card.car_terminer === 'O') return '#4caf50';
    if (card.car_archiver === 'O') return '#9e9e9e';
    return '#2196f3';
  };

  const handleBackToBoard = () => {
    if (card.liste?.tab_id) {
      navigate(`/tableau/${card.liste.tab_id}`);
    } else {
      console.error("Impossible de retourner au tableau: ID de tableau non trouvé");
      navigate('/accueil');
    }
  };

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#333'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{ margin: 0, color: '#2c3e50' }}>Détails de la carte</h1>
        <button
          type="button"
          onClick={handleBackToBoard}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retour au tableau
        </button>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        padding: '25px',
        marginBottom: '30px'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '15px'
          }}>
            <h2 style={{ margin: 0, color: '#2c3e50' }}>{card.car_nom}</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{
                padding: '4px 8px',
                backgroundColor: getPriorityColor(),
                color: 'white',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                Priorité: {card.car_priorite === 3 ? 'Haute' :
                          card.car_priorite === 2 ? 'Moyenne' :
                          card.car_priorite === 1 ? 'Faible' : 'Aucune'}
              </span>
              <span style={{
                padding: '4px 8px',
                backgroundColor: getStatusColor(),
                color: 'white',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                {card.car_terminer === 'O' ? 'Terminé' :
                 card.car_archiver === 'O' ? 'Archivé' : 'En cours'}
              </span>
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <p style={{ margin: '5px 0', color: '#555' }}>
              <strong>Liste:</strong> {card.liste?.lis_titre || 'Non définie'}
            </p>
            <p style={{ margin: '5px 0', color: '#555' }}>
              <strong>Créé le:</strong> {new Date(card.car_dateCreation).toLocaleString('fr-FR')}
            </p>
            {card.car_dateDebut && (
              <p style={{ margin: '5px 0', color: '#555' }}>
                <strong>Début:</strong> {new Date(card.car_dateDebut).toLocaleString('fr-FR')}
              </p>
            )}
            {card.car_dateFin && (
              <p style={{ margin: '5px 0', color: '#555' }}>
                <strong>Échéance:</strong> {new Date(card.car_dateFin).toLocaleString('fr-FR')}
              </p>
            )}
          </div>

          <div style={{
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            borderLeft: '4px solid #3498db'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Description</h3>
            <div style={{
              whiteSpace: 'pre-line',
              color: '#495057',
              lineHeight: '1.6'
            }}>
              {card.car_des}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Étiquettes</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
            {card.etiquettes?.map((etiquette: Etiquette) => (
              <span
                key={etiquette.eti_id}
                style={{
                  padding: '4px 8px',
                  backgroundColor: etiquette.eti_couleur,
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              >
                {etiquette.eti_nom}
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Membres</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {card.membres?.map((membre: MemberWithProfile) => (
              <div
                key={membre.cpt_id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px 10px',
                  backgroundColor: '#f0f8ff',
                  borderRadius: '20px',
                  border: '1px solid #e6f2ff'
                }}
                title={`${membre.profil?.pfl_prenom || ''} ${membre.profil?.pfl_nom || ''}\n${membre.profil?.pfl_mail || ''}`}
              >
                <img
                  src={membre.profil?.pfl_mail ? `https://avatars.dicebear.com/api/initials/${membre.profil.pfl_mail}.svg` : 'https://via.placeholder.com/30'}
                  alt={membre.cpt_pseudo}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    marginRight: '6px'
                  }}
                />
                <span style={{ fontSize: '14px' }}>{membre.cpt_pseudo}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Liste de contrôle</h3>
          <div style={{ marginBottom: '15px' }}>
            {checklist.map(item => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '8px',
                  padding: '8px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px'
                }}
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleChecklistItem(item.id)}
                  style={{ marginRight: '10px' }}
                />
                <span style={{
                  color: item.completed ? '#999' : '#495057',
                  textDecoration: item.completed ? 'line-through' : 'none'
                }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={newChecklistItem}
              onChange={(e) => setNewChecklistItem(e.target.value)}
              placeholder="Ajouter un élément..."
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
            <button
              type="button"
              onClick={handleAddChecklistItem}
              style={{
                padding: '8px 12px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Ajouter
            </button>
          </div>
        </div>

        <div>
          <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Commentaires</h3>
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              marginBottom: '15px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              borderLeft: '3px solid #3498db'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '5px'
              }}>
                <strong style={{ color: '#2c3e50' }}>Jean Dupont</strong>
                <span style={{ color: '#999', fontSize: '12px' }}>10/03/2026 14:30</span>
              </div>
              <p style={{ margin: 0, color: '#495057' }}>J'ai commencé l'implémentation des endpoints backend pour Stripe.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ajouter un commentaire..."
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
            <button
              type="button"
              onClick={handleAddComment}
              style={{
                padding: '8px 12px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Publier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailsPage;
