import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, getToken, isAdmin, logout } from '../utils/auth.ts';
import type { Tableau } from '../model/types.ts';

const Accueil: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUser();
    if (!user) {
      navigate('/auth/login');
      return;
    }
    if (isAdmin()) {
      navigate('/admin/tableaux');
    }
  }, []);

  return <UserTableaux />;
};

const UserTableaux: React.FC = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [boards, setBoards] = useState<Tableau[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await fetch(
            `http://localhost:8081/api/tableau/compte/${user?.cpt_id}`,
            {
              headers: {
                'Authorization': `Bearer ${getToken()}`
              }
            }
        );
        const data = await response.json();
        setBoards(data);
      } catch (error) {
        console.error("Erreur lors du chargement des tableaux:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  const getStatusStyle = (etat: string) => ({
    color: etat === 'A' ? '#4CAF50' : '#9E9E9E',
    backgroundColor: etat === 'A' ? '#E8F5E9' : '#FAFAFA',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold' as const,
    display: 'inline-block'
  });

  return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ margin: 0, color: '#2c3e50' }}>
            Bonjour, {user?.cpt_pseudo} 👋
          </h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
                type="button"
                onClick={() => navigate('/api/compte')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#95a5a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
            >
              Mon compte
            </button>
            <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/auth/login');
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
            >
              Se déconnecter
            </button>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          padding: '25px'
        }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>Mes Tableaux</h2>

          {loading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{
                  border: '3px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '50%',
                  borderTop: '3px solid #3498db',
                  width: '30px',
                  height: '30px',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 15px'
                }}></div>
                <p style={{ color: '#666' }}>Chargement de vos tableaux...</p>
              </div>
          ) : boards.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
                <p>Vous n'avez pas encore de tableaux.</p>
              </div>
          ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px'
              }}>
                {boards.map((board) => (
                    <div
                        key={board.tab_id}
                        style={{
                          backgroundColor: '#f8f9fa',
                          borderRadius: '8px',
                          padding: '15px',
                          cursor: 'pointer',
                          border: board.tab_etat === 'I' ? '1px solid #eee' : '1px solid #e3f2fd',
                        }}
                        onClick={() => navigate(`/api/tableau/${board.tab_id}`)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3 style={{ margin: 0, color: '#2c3e50' }}>{board.tab_nom}</h3>
                        <div style={getStatusStyle(board.tab_etat)}>
                          {board.tab_etat === 'A' ? 'ACTIF' : 'ARCHIVÉ'}
                        </div>
                      </div>
                      {board.tab_description && (
                          <p style={{ color: '#555', fontSize: '14px', margin: '0 0 10px 0' }}>
                            {board.tab_description}
                          </p>
                      )}
                      <span style={{ fontSize: '12px', color: '#666' }}>
                                    Créé le {new Date(board.tab_date).toLocaleDateString('fr-FR')}
                                </span>
                    </div>
                ))}
              </div>
          )}
        </div>
        <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
      </div>
  );
};

export default Accueil;