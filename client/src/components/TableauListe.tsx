import React from 'react';
import { useNavigate } from 'react-router-dom';
import type {  Tableau } from '../model/types.ts';
import '../page/App.css';

interface UserBoardsProps {
  tableaux: Tableau[];
  isAdmin?: boolean;
}

const Accueil: React.FC<UserBoardsProps> = ({ tableaux, isAdmin = false }) => {
  const navigate = useNavigate();

  const handleBoardClick = (tabId: string) => {
    navigate(`/tableau/${tabId}`);
  };

  const userTableaux = isAdmin
    ? tableaux
    : tableaux.filter(_tableau => {
        return true; // À remplacer par votre logique réelle
      });

  return (
    <div className="user-boards-container">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: 0 }}>Mes Tableaux</h2>
        {isAdmin && (
          <span style={{
            padding: '4px 8px',
            backgroundColor: '#e74c3c',
            color: 'white',
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            Mode Admin
          </span>
        )}
      </div>

      {userTableaux.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#666',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px'
        }}>
          <p style={{ marginBottom: '15px' }}>Aucun tableau disponible.</p>
          <button
            type = "button"
            onClick={() => navigate('/tableau/creer')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Créer un nouveau tableau
          </button>
        </div>
      ) : (
        <div className="boards-list" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {userTableaux.map((tableau) => (
            <div
              key={tableau.tab_id}
              className="board-card"
              onClick={() => handleBoardClick(tableau.tab_id)}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '15px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              <h3 style={{
                margin: '0 0 10px 0',
                color: '#2c3e50',
                fontSize: '16px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {tableau.tab_nom}
              </h3>

              {tableau.tab_description && (
                <p style={{
                  margin: '0 0 10px 0',
                  color: '#555',
                  fontSize: '14px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {tableau.tab_description}
                </p>
              )}

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px',
                color: '#666'
              }}>
                <span>
                  Créé le {new Date(tableau.tab_date).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </span>
                <span style={{
                  padding: '2px 6px',
                  backgroundColor: tableau.tab_etat === 'A' ? '#e8f5e9' : '#f5f5f5',
                  borderRadius: '4px',
                  fontSize: '11px',
                  color: tableau.tab_etat === 'A' ? '#4caf50' : '#9e9e9e'
                }}>
                  {tableau.tab_etat === 'A' ? 'Actif' : 'Inactif'}
                </span>
              </div>
              
              {isAdmin && (
                <div style={{
                  marginTop: '8px',
                  fontSize: '12px',
                  color: '#757575',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <span>👤 Propriétaire: </span>
                  <span style={{ fontWeight: '500' }}>Utilisateur #{tableau.tab_id.slice(-4)}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Accueil;
