import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tableau, MemberWithProfile } from '../model/types.ts';

interface BoardWithOwner extends Tableau {
  owner: MemberWithProfile;
  memberRole?: 'admin' | 'membre' | 'lecteur';
}

const Accueil: React.FC = () => {
  const navigate = useNavigate();
  const [user] = useState<MemberWithProfile>({
    cpt_id: '1',
    cpt_pseudo: 'jdupont',
    cpt_mdp: '', // Champ requis
    cpt_role: 'admin',
    profil: {
      pfl_nom: 'Dupont',
      pfl_prenom: 'Jean',
      pfl_mail: 'jean.dupont@example.com',
      pfl_etat: 'A',
      pfl_date: new Date().toISOString(),
      cpt_id: '1'
    }
  });

  const [boards, setBoards] = useState<BoardWithOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');

  // Données simulées - à remplacer par un appel API réel
  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));

        const mockBoards: BoardWithOwner[] = [
          // Tableaux créés par l'utilisateur actuel
          {
            tab_id: '1',
            tab_nom: 'Projet Alpha',
            tab_description: 'Développement de la nouvelle application mobile',
            tab_date: new Date().toISOString(),
            tab_etat: 'A',
            tab_image: null,
            owner: {
              cpt_id: '1',
              cpt_pseudo: 'jdupont',
              cpt_mdp: '',
              cpt_role: 'admin',
              profil: {
                pfl_nom: 'Dupont',
                pfl_prenom: 'Jean',
                pfl_mail: 'jean.dupont@example.com',
                pfl_etat: 'A',
                pfl_date: new Date().toISOString(),
                cpt_id: '1'
              }
            },
            memberRole: 'admin'
          },
          {
            tab_id: '3',
            tab_nom: 'Support Client',
            tab_description: 'Gestion des tickets clients',
            tab_date: new Date(Date.now() - 86400000).toISOString(),
            tab_etat: 'A',
            tab_image: null,
            owner: {
              cpt_id: '1',
              cpt_pseudo: 'jdupont',
              cpt_mdp: '',
              cpt_role: 'admin',
              profil: {
                pfl_nom: 'Dupont',
                pfl_prenom: 'Jean',
                pfl_mail: 'jean.dupont@example.com',
                pfl_etat: 'A',
                pfl_date: new Date().toISOString(),
                cpt_id: '1'
              }
            },
            memberRole: 'admin'
          },

          // Tableaux créés par d'autres utilisateurs
          {
            tab_id: '2',
            tab_nom: 'Marketing 2026',
            tab_description: 'Campagnes marketing pour le Q2 2026',
            tab_date: new Date(Date.now() - 172800000).toISOString(),
            tab_etat: 'A',
            tab_image: null,
            owner: {
              cpt_id: '2',
              cpt_pseudo: 'mmartin',
              cpt_mdp: '',
              cpt_role: 'user',
              profil: {
                pfl_nom: 'Martin',
                pfl_prenom: 'Marie',
                pfl_mail: 'marie.martin@example.com',
                pfl_etat: 'A',
                pfl_date: new Date().toISOString(),
                cpt_id: '2'
              }
            },
            memberRole: 'membre'
          },
          {
            tab_id: '4',
            tab_nom: 'RH - Recrutement',
            tab_description: 'Processus de recrutement 2026',
            tab_date: new Date(Date.now() - 259200000).toISOString(),
            tab_etat: 'A',
            tab_image: null,
            owner: {
              cpt_id: '3',
              cpt_pseudo: 'plambert',
              cpt_mdp: '',
              cpt_role: 'user',
              profil: {
                pfl_nom: 'Lambert',
                pfl_prenom: 'Pierre',
                pfl_mail: 'pierre.lambert@example.com',
                pfl_etat: 'A',
                pfl_date: new Date().toISOString(),
                cpt_id: '3'
              }
            },
            memberRole: 'lecteur'
          },
          {
            tab_id: '5',
            tab_nom: 'Ancien Projet',
            tab_description: 'Projet archivé en 2025',
            tab_date: new Date('2025-05-10').toISOString(),
            tab_etat: 'I',
            tab_image: null,
            owner: {
              cpt_id: '4',
              cpt_pseudo: 'sdurand',
              cpt_mdp: '',
              cpt_role: 'user',
              profil: {
                pfl_nom: 'Durand',
                pfl_prenom: 'Sophie',
                pfl_mail: 'sophie.durand@example.com',
                pfl_etat: 'A',
                pfl_date: new Date().toISOString(),
                cpt_id: '4'
              }
            },
            memberRole: 'lecteur'
          }
        ];

        setBoards(mockBoards);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  const getStatusStyle = (etat: 'A' | 'I') => ({
    color: etat === 'A' ? '#4CAF50' : '#9E9E9E',
    backgroundColor: etat === 'A' ? '#E8F5E9' : '#FAFAFA',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold' as const,
    display: 'inline-block'
  });

  const getRoleStyle = (role?: 'admin' | 'membre' | 'lecteur') => {
    if (!role) return { display: 'none' };

    const colors: Record<'admin' | 'membre' | 'lecteur', { bg: string; color: string }> = {
      admin: { bg: '#E53935', color: '#FFFFFF' },
      membre: { bg: '#42A5F5', color: '#FFFFFF' },
      lecteur: { bg: '#FFB74D', color: '#000000' }
    };

    const color = colors[role] || { bg: '#CCCCCC', color: '#000000' };

    return {
      padding: '3px 8px',
      backgroundColor: color.bg,
      color: color.color,
      borderRadius: '10px',
      fontSize: '11px',
      fontWeight: 'bold' as const,
      marginLeft: '8px'
    };
  };

  const userBoards = boards.filter(board => board.owner.cpt_id === user.cpt_id);
  const allBoards = user.cpt_role === 'admin' ? boards : userBoards;

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
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
        <h1 style={{ margin: 0, color: '#2c3e50' }}>Mes Tableaux</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type = "button"
            onClick={() => document.getElementById('create-board-modal')?.classList.add('open')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
          >
            + Nouveau Tableau
          </button>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d32f2f'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f44336'}
          >
            Se déconnecter
          </button>
        </div>
      </div>

      {/* Section Administration - SANS les pastilles de rôle */}
      {user.cpt_role === 'admin' && (
        <div style={{
          marginBottom: '40px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          padding: '25px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{ margin: 0, color: '#e74c3c' }}>🛠 Administration - Tous les tableaux</h2>
            <span style={{
              padding: '6px 10px',
              backgroundColor: '#e74c3c',
              color: 'white',
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              {allBoards.length} tableau{allBoards.length > 1 ? 'x' : ''}
            </span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{
                border: '3px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '50%',
                borderTop: '3px solid #e74c3c',
                width: '30px',
                height: '30px',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 15px'
              }}></div>
              <p style={{ color: '#666' }}>Chargement des tableaux...</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {allBoards.map((board) => (
                <div
                  key={board.tab_id}
                  style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    padding: '15px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: board.tab_etat === 'I' ? '1px solid #eee' : '1px solid #e3f2fd',
                    position: 'relative',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                  onClick={() => navigate(`/tableau/${board.tab_id}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                  }}
                >
                  {board.tab_etat === 'I' && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#9E9E9E',
                      borderRadius: '50%'
                    }}></div>
                  )}

                  <div style={{ marginBottom: '10px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <h3 style={{
                        margin: 0,
                        color: '#2c3e50',
                        fontSize: '16px',
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '200px'
                      }}>
                        {board.tab_nom}
                      </h3>
                      <div style={getStatusStyle(board.tab_etat)}>
                        {board.tab_etat === 'A' ? 'ACTIF' : 'ARCHIVÉ'}
                      </div>
                    </div>

                    {board.owner.cpt_id !== user.cpt_id && (
                      <div style={{
                        fontSize: '12px',
                        color: '#666',
                        marginBottom: '8px'
                      }}>
                        👤 {board.owner.profil?.pfl_prenom} {board.owner.profil?.pfl_nom}
                      </div>
                    )}
                  </div>

                  {board.tab_description && (
                    <p style={{
                      margin: '0 0 10px 0',
                      color: '#555',
                      fontSize: '14px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '40px'
                    }}>
                      {board.tab_description}
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
                      Créé le {new Date(board.tab_date).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Section Mes Tableaux - AVEC les pastilles de rôle */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        padding: '25px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0, color: '#2c3e50' }}>Mes Tableaux</h2>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{
              padding: '6px 10px',
              backgroundColor: '#3498db',
              color: 'white',
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              {userBoards.length} tableau{userBoards.length > 1 ? 'x' : ''}
            </span>
            <button
              type="button"
              onClick={() => document.getElementById('create-board-modal')?.classList.add('open')}
              style={{
                padding: '6px 12px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              + Nouveau tableau
            </button>
          </div>
        </div>

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
        ) : userBoards.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
            <p style={{ marginBottom: '15px' }}>Vous n'avez pas encore créé de tableaux.</p>
            <button
              type="button"
              onClick={() => document.getElementById('create-board-modal')?.classList.add('open')}
              style={{
                padding: '8px 16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Créer mon premier tableau
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {userBoards.map((board) => (
              <div
                key={board.tab_id}
                style={{
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  padding: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: board.tab_etat === 'I' ? '1px solid #eee' : '1px solid #e3f2fd',
                  position: 'relative',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                onClick={() => navigate(`/tableau/${board.tab_id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }}
              >
                {board.tab_etat === 'I' && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#9E9E9E',
                    borderRadius: '50%'
                  }}></div>
                )}

                <div style={{ marginBottom: '10px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <h3 style={{
                      margin: 0,
                      color: '#2c3e50',
                      fontSize: '16px',
                      fontWeight: '600',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '200px'
                    }}>
                      {board.tab_nom}
                    </h3>
                    <div style={getStatusStyle(board.tab_etat)}>
                      {board.tab_etat === 'A' ? 'ACTIF' : 'ARCHIVÉ'}
                    </div>
                  </div>
                </div>

                {board.tab_description && (
                  <p style={{
                    margin: '0 0 10px 0',
                    color: '#555',
                    fontSize: '14px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: '40px'
                  }}>
                    {board.tab_description}
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
                    Créé le {new Date(board.tab_date).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                  {board.memberRole && (
                    <span style={getRoleStyle(board.memberRole)}>
                      {board.memberRole}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal pour créer un nouveau tableau */}
      <div id="create-board-modal" className="modal" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'none',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          width: '500px',
          maxWidth: '90%',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        }}>
          <h2 style={{ marginTop: 0, color: '#2c3e50' }}>Créer un nouveau tableau</h2>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              color: '#555',
              fontWeight: '500'
            }}>
              Nom du tableau *
            </label>
            <input
              type="text"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 15px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
              placeholder="Ex: Projet Alpha, Marketing 2026..."
              required
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              color: '#555',
              fontWeight: '500'
            }}>
              Description (optionnelle)
            </label>
            <textarea
              value={newBoardDescription}
              onChange={(e) => setNewBoardDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 15px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                minHeight: '100px',
                resize: 'vertical'
              }}
              placeholder="Décrivez le but de ce tableau..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={() => {
                document.getElementById('create-board-modal')?.classList.remove('open');
                setNewBoardName('');
                setNewBoardDescription('');
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#95a5a6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={() => {
                if (!newBoardName.trim()) return;

                const newBoard: BoardWithOwner = {
                  tab_id: Date.now().toString(),
                  tab_nom: newBoardName,
                  tab_description: newBoardDescription || '',
                  tab_date: new Date().toISOString(),
                  tab_etat: 'A',
                  tab_image: null,
                  owner: {
                    cpt_id: user.cpt_id,
                    cpt_pseudo: user.cpt_pseudo,
                    cpt_mdp: '',
                    cpt_role: user.cpt_role,
                    profil: user.profil
                  },
                  memberRole: 'admin'
                };

                setBoards([...boards, newBoard]);
                document.getElementById('create-board-modal')?.classList.remove('open');
                setNewBoardName('');
                setNewBoardDescription('');
              }}
              disabled={!newBoardName.trim()}
              style={{
                padding: '8px 16px',
                backgroundColor: newBoardName.trim() ? '#4CAF50' : '#cccccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: newBoardName.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              Créer le tableau
            </button>
          </div>
        </div>
      </div>

      {/* CSS pour le modal */}
      <style>
        {`
          .modal.open {
            display: flex !important;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Accueil;
