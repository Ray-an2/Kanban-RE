import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserWithProfile, Tableau, Journal } from '../model/types.ts';

const AccountPage: React.FC = () => {
  const navigate = useNavigate();

  // Données simulées adaptées à la base de données
  const [user, setUser] = useState<UserWithProfile>({
    cpt_id: '1',
    cpt_pseudo: 'jdupont',
    cpt_mdp: '', // Ne jamais stocker en clair dans le state
    cpt_role: 'admin',
    profil: {
      pfl_nom: 'Dupont',
      pfl_prenom: 'Jean',
      pfl_mail: 'jean.dupont@example.com',
      pfl_etat: 'A',
      pfl_date: '2025-01-10 14:30:00',
      cpt_id: '1'
    }
  });

  // Données simulées pour les tableaux
  const [boards, _setBoards] = useState<Tableau[]>([
    {
      tab_id: '1',
      tab_nom: 'Projet Alpha',
      tab_description: 'Développement nouvelle application',
      tab_date: '2026-02-05 09:00:00',
      tab_etat: 'A',
      tab_image: null
    },
    {
      tab_id: '2',
      tab_nom: 'Marketing 2026',
      tab_description: 'Campagnes marketing Q2',
      tab_date: '2026-01-15 10:00:00',
      tab_etat: 'A',
      tab_image: null
    },
    {
      tab_id: '3',
      tab_nom: 'Support Client',
      tab_description: 'Gestion des tickets clients',
      tab_date: '2025-12-20 14:30:00',
      tab_etat: 'A',
      tab_image: null
    }
  ]);

  // Données simulées pour les logs
  const [logs, _setLogs] = useState<Journal[]>([
    {
      jou_id: '1',
      jou_titre: 'Création de tableau',
      jou_description: 'Tableau "Projet Alpha" créé',
      jou_auteur: 'Jean Dupont',
      jou_action: 'CREATE_TABLEAU',
      jou_date: '2026-03-12 14:30:00',
      jou_etat: 'SUCCESS'
    },
    {
      jou_id: '2',
      jou_titre: 'Ajout de membre',
      jou_description: 'Marie Martin ajoutée au tableau Marketing 2026',
      jou_auteur: 'Admin',
      jou_action: 'ADD_MEMBER',
      jou_date: '2026-03-11 10:15:00',
      jou_etat: 'SUCCESS'
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: user.profil?.pfl_prenom || '',
    lastName: user.profil?.pfl_nom || '',
    email: user.profil?.pfl_mail || ''
  });

  const handleEdit = () => {
    setEditData({
      firstName: user.profil?.pfl_prenom || '',
      lastName: user.profil?.pfl_nom || '',
      email: user.profil?.pfl_mail || ''
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (user.profil) {
      setUser({
        ...user,
        profil: {
          ...user.profil,
          pfl_prenom: editData.firstName,
          pfl_nom: editData.lastName,
          pfl_mail: editData.email
        }
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '30px',
      fontFamily: 'Arial, sans-serif',
      color: '#333'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ margin: 0, color: '#2c3e50' }}>Mon Compte</h1>
        <button
          type="button"
          onClick={handleLogout}
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

      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        padding: '30px',
        marginBottom: '30px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '30px',
          borderBottom: '1px solid #eee',
          paddingBottom: '20px'
        }}>
          <div style={{ marginRight: '30px' }}>
            <img
              src={user.profil?.pfl_mail ? `https://avatars.dicebear.com/api/initials/${user.profil.pfl_mail}.svg` : 'https://via.placeholder.com/150'}
              alt="Photo de profil"
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #3498db'
              }}
            />
          </div>
          <div>
            <h2 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>
              {user.profil?.pfl_prenom} {user.profil?.pfl_nom}
            </h2>
            <p style={{ margin: '5px 0', color: '#666' }}>
              <strong>Pseudo:</strong> @{user.cpt_pseudo}
            </p>
            <p style={{ margin: '5px 0', color: '#666' }}>
              <strong>Rôle:</strong> {user.cpt_role === 'admin' ? 'Administrateur' : 'Utilisateur'}
            </p>
            <div style={{
              display: 'flex',
              gap: '10px',
              marginTop: '10px'
            }}>
              <span style={{
                padding: '4px 8px',
                backgroundColor: user.cpt_role === 'admin' ? '#e74c3c' : '#3498db',
                color: 'white',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                {user.cpt_role === 'admin' ? 'ADMIN' : 'UTILISATEUR'}
              </span>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Informations personnelles</h3>

          {isEditing ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Prénom</label>
                <input
                  type="text"
                  name="firstName"
                  value={editData.firstName}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Nom</label>
                <input
                  type="text"
                  name="lastName"
                  value={editData.lastName}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={handleSave}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#2ecc71',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
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
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <p style={{ margin: '5px 0', color: '#555' }}><strong>Prénom:</strong> {user.profil?.pfl_prenom}</p>
                  <p style={{ margin: '5px 0', color: '#555' }}><strong>Nom:</strong> {user.profil?.pfl_nom}</p>
                </div>
                <div>
                  <p style={{ margin: '5px 0', color: '#555' }}><strong>Email:</strong> {user.profil?.pfl_mail}</p>
                  <p style={{ margin: '5px 0', color: '#555' }}><strong>Pseudo:</strong> @{user.cpt_pseudo}</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <p style={{ margin: '5px 0', color: '#555' }}><strong>Date d'inscription:</strong> {user.profil?.pfl_date?.split(' ')[0]}</p>
                </div>
                <div>
                  <p style={{ margin: '5px 0', color: '#555' }}><strong>Dernière connexion:</strong> 12/03/2026 14:30</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleEdit}
                style={{
                  marginTop: '20px',
                  padding: '8px 16px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Modifier mes informations
              </button>
            </>
          )}
        </div>

        {/* Section sécurité */}
        <div style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          borderLeft: '4px solid #3498db'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#3498db' }}>🔒 Sécurité</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <p style={{ margin: '5px 0', color: '#555' }}><strong>Mot de passe:</strong> *********</p>
              <button
                type="button"
                onClick={() => navigate('/change-password')}
                style={{
                  marginTop: '10px',
                  padding: '6px 12px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Changer le mot de passe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section Administration pour les administrateurs */}
      {user.cpt_role === 'admin' && (
        <div style={{
          marginTop: '30px',
          padding: '30px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          {/* Pastilles d'informations */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '25px'
          }}>
            <h2 style={{ margin: 0, color: '#e74c3c' }}>🛠 Administration</h2>
            <div style={{ display: 'flex', gap: '20px' }}>
              {/* Pastille Tableaux */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                backgroundColor: '#e8f5e9',
                borderRadius: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#4caf50',
                  borderRadius: '50%'
                }}></div>
                <span style={{ fontSize: '14px', color: '#2c3e50' }}>
                  <strong>{boards.length}</strong> tableaux
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
            {/* Carte pour la gestion des tableaux */}
            <div style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              padding: '20px',
              borderLeft: '4px solid #3498db'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <h3 style={{ margin: 0, color: '#2c3e50' }}>📋 Tous les tableaux</h3>
                <span style={{
                  padding: '4px 8px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  {boards.length} tableaux
                </span>
              </div>

              <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '15px' }}>
                {boards.map(board => (
                  <div
                    key={board.tab_id}
                    style={{
                      padding: '10px 15px',
                      marginBottom: '10px',
                      backgroundColor: 'white',
                      borderRadius: '4px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                    onClick={() => navigate(`/tableau/${board.tab_id}`)}
                  >
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 5px 0', fontWeight: '600', color: '#2c3e50' }}>{board.tab_nom}</p>
                      <p style={{ margin: 0, color: '#666', fontSize: '12px' }}>{board.tab_description}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '12px' }}>Créé le {board.tab_date.split(' ')[0]}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => navigate('/admin/boards')}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Voir tous les tableaux
              </button>
            </div>

            {/* Carte pour les logs */}
            <div style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              padding: '20px',
              borderLeft: '4px solid #e74c3c'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <h3 style={{ margin: 0, color: '#2c3e50' }}>📜 Derniers logs</h3>
                <span style={{
                  padding: '4px 8px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  {logs.length} logs
                </span>
              </div>

              <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '15px' }}>
                {logs.slice(0, 5).map(log => (
                  <div
                    key={log.jou_id}
                    style={{
                      padding: '10px 15px',
                      marginBottom: '10px',
                      backgroundColor: 'white',
                      borderRadius: '4px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      borderLeft: '3px solid #e74c3c'
                    }}
                  >
                    <p style={{ margin: '0 0 5px 0', fontWeight: '600', color: '#2c3e50' }}>
                      {log.jou_titre} <span style={{ color: '#666', fontSize: '12px' }}>par {log.jou_auteur}</span>
                    </p>
                    <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '12px' }}>{log.jou_description}</p>
                    <p style={{ margin: 0, color: '#999', fontSize: '11px' }}>{log.jou_date.replace('T', ' ').split('.')[0]}</p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => navigate('/admin/logs')}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Voir tous les logs
              </button>
            </div>
          </div>

          {/* Autres cartes d'administration */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '25px' }}>
            {/* Carte Utilisateurs */}
            <div style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onClick={() => navigate('/admin/users')}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                backgroundColor: '#3498db',
                borderRadius: '50%',
                margin: '0 auto 15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px'
              }}>
                👥
              </div>
              <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Utilisateurs</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Gérer les comptes utilisateurs</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;