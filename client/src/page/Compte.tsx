import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  pseudo: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  registrationDate: string;
  lastLogin: string;
  profilePicture?: string;
}

interface Board {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  owner: string;
  membersCount: number;
  cardsCount: number;
}

interface Log {
  id: string;
  action: string;
  user: string;
  date: string;
  board: string;
}

interface AdminStats {
  totalUsers: number;
  totalBoards: number;
  totalCards: number;
}

const AccountPage: React.FC = () => {
  const navigate = useNavigate();

  // Données simulées de l'utilisateur connecté
  const [user, setUser] = useState<User>({
    id: '1',
    pseudo: 'jdupont',
    email: 'jean.dupont@example.com',
    firstName: 'Jean',
    lastName: 'Dupont',
    role: 'user',
    registrationDate: '10/01/2025',
    lastLogin: '12/03/2026 14:30',
    profilePicture: 'https://via.placeholder.com/150'
  });

   const [adminStats, _setAdminStats] = useState<AdminStats>({
    totalUsers: 42,
    totalBoards: 17,
    totalCards: 128
  });

  // Données simulées pour les tableaux (admin seulement)
  const [boards, _setBoards] = useState<Board[]>([
    { id: '1', name: 'Projet Alpha', description: 'Développement nouvelle application', createdAt: '05/02/2026', owner: 'Jean Dupont', membersCount: 4, cardsCount: 10 },
    { id: '2', name: 'Marketing 2026', description: 'Campagnes marketing Q2', createdAt: '15/01/2026', owner: 'Marie Martin', membersCount: 3, cardsCount: 8 },
    { id: '3', name: 'Support Client', description: 'Gestion des tickets clients', createdAt: '20/12/2025', owner: 'Pierre Durand', membersCount: 5, cardsCount: 15 },
    { id: '4', name: 'RH - Recrutement', description: 'Processus de recrutement 2026', createdAt: '10/11/2025', owner: 'Sophie Lambert', membersCount: 2, cardsCount: 5 }
  ]);

  // Données simulées pour les logs (admin seulement)
  const [logs, _setLogs] = useState<Log[]>([
    { id: '1', action: 'Création de tableau', user: 'Jean Dupont', date: '12/03/2026 14:30', board: 'Projet Alpha' },
    { id: '2', action: 'Ajout de membre', user: 'Marie Martin', date: '11/03/2026 10:15', board: 'Marketing 2026' },
    { id: '3', action: 'Modification de carte', user: 'Pierre Durand', date: '10/03/2026 16:45', board: 'Support Client' },
    { id: '4', action: 'Suppression de tableau', user: 'Admin', date: '09/03/2026 09:30', board: 'Ancien Projet' },
    { id: '5', action: 'Archivage de tableau', user: 'Sophie Lambert', date: '08/03/2026 14:00', board: 'Projet Bêta' }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    pseudo: user.pseudo
  });

  const handleEdit = () => {
    setEditData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      pseudo: user.pseudo
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    setUser({
      ...user,
      firstName: editData.firstName,
      lastName: editData.lastName,
      email: editData.email,
      pseudo: editData.pseudo
    });
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
            onClick={() => navigate('/tableau')}
            style={{
                padding: '8px 16px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'background-color 0.2s'
            }}
        >
          Retour à l'accueil
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
              src={user.profilePicture}
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
              {user.firstName} {user.lastName}
            </h2>
            <p style={{ margin: '5px 0', color: '#666' }}>
              <strong>Pseudo:</strong> @{user.pseudo}
            </p>
            <p style={{ margin: '5px 0', color: '#666' }}>
              <strong>Rôle:</strong> {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
            </p>
            <div style={{
              display: 'flex',
              gap: '10px',
              marginTop: '10px'
            }}>
              <span style={{
                padding: '4px 8px',
                backgroundColor: user.role === 'admin' ? '#e74c3c' : '#3498db',
                color: 'white',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                {user.role === 'admin' ? 'ADMIN' : 'UTILISATEUR'}
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
              <div>
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
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#555' }}>Pseudo</label>
                <input
                  type="text"
                  name="pseudo"
                  value={editData.pseudo}
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
                  <p style={{ margin: '5px 0', color: '#555' }}><strong>Prénom:</strong> {user.firstName}</p>
                  <p style={{ margin: '5px 0', color: '#555' }}><strong>Nom:</strong> {user.lastName}</p>
                </div>
                <div>
                  <p style={{ margin: '5px 0', color: '#555' }}><strong>Email:</strong> {user.email}</p>
                  <p style={{ margin: '5px 0', color: '#555' }}><strong>Pseudo:</strong> @{user.pseudo}</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <p style={{ margin: '5px 0', color: '#555' }}><strong>Date d'inscription:</strong> {user.registrationDate}</p>
                </div>
                <div>
                  <p style={{ margin: '5px 0', color: '#555' }}><strong>Dernière connexion:</strong> {user.lastLogin}</p>
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
            <div>
              <p style={{ margin: '5px 0', color: '#555' }}><strong>Authentification à 2 facteurs:</strong> Désactivée</p>
              <button
                type="button"
                style={{
                  marginTop: '10px',
                  padding: '6px 12px',
                  backgroundColor: '#95a5a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Configurer
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Section Administration pour les administrateurs */}
      {user.role === 'admin' && (
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
              {/* Pastille Comptes */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                backgroundColor: '#e3f2fd',
                borderRadius: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#2196f3',
                  borderRadius: '50%'
                }}></div>
                <span style={{ fontSize: '14px', color: '#2c3e50' }}>
                  <strong>{adminStats.totalUsers}</strong> comptes
                </span>
              </div>

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
                  <strong>{adminStats.totalBoards}</strong> tableaux
                </span>
              </div>

              {/* Pastille Cartes */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                backgroundColor: '#fff3e0',
                borderRadius: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#ff9800',
                  borderRadius: '50%'
                }}></div>
                <span style={{ fontSize: '14px', color: '#2c3e50' }}>
                  <strong>{adminStats.totalCards}</strong> cartes
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
            {/* Carte pour la gestion des tableaux (avec nombre de cartes) */}
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
                    key={board.id}
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
                    onClick={() => navigate(`/tableau/${board.id}`)}
                  >
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 5px 0', fontWeight: '600', color: '#2c3e50' }}>{board.name}</p>
                      <p style={{ margin: 0, color: '#666', fontSize: '12px' }}>{board.description}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '12px' }}>Créé le {board.createdAt}</p>
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <span style={{ color: '#666', fontSize: '12px' }}>{board.membersCount} membres</span>
                        <span style={{ color: '#666', fontSize: '12px' }}>{board.cardsCount} cartes</span>
                      </div>
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
                    key={log.id}
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
                      {log.action} <span style={{ color: '#666', fontSize: '12px' }}>par {log.user}</span>
                    </p>
                    <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '12px' }}>Tableau: {log.board}</p>
                    <p style={{ margin: 0, color: '#999', fontSize: '11px' }}>{log.date}</p>
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
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Gérer les {adminStats.totalUsers} comptes utilisateurs</p>
            </div>

            {/* Carte Paramètres */}
            <div style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onClick={() => navigate('/admin/settings')}
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
                backgroundColor: '#e74c3c',
                borderRadius: '50%',
                margin: '0 auto 15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px'
              }}>
                ⚙️
              </div>
              <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Paramètres</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Configuration système</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;