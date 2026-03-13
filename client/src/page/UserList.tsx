import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserWithProfile } from '../model/types.ts';

interface UserWithRole extends UserWithProfile {
  role?: string; 
}

const UserManagementPage: React.FC = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    cpt_pseudo: '',
    role: 'user' as 'user' | 'admin',
    pfl_nom: '',
    pfl_prenom: '',
    pfl_mail: '',
    pfl_etat: 'A' as 'A' | 'D'
  });

  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));

        const mockUsers: UserWithRole[] = [
          {
            cpt_id: '1',
            cpt_pseudo: 'jdupont',
            cpt_mdp: '',
            profil: {
              pfl_nom: 'Dupont',
              pfl_prenom: 'Jean',
              pfl_mail: 'jean.dupont@example.com',
              pfl_etat: 'A',
              pfl_date: new Date().toISOString(),
              cpt_id: '1'
            },
            role: 'admin' 
          },
          {
            cpt_id: '2',
            cpt_pseudo: 'mmartin',
            cpt_mdp: '',
            profil: {
              pfl_nom: 'Martin',
              pfl_prenom: 'Marie',
              pfl_mail: 'marie.martin@example.com',
              pfl_etat: 'A',
              pfl_date: new Date().toISOString(),
              cpt_id: '2'
            },
            role: 'user'
          }
        ];

        setUsers(mockUsers);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const openCreateModal = () => {
    setFormData({
      cpt_pseudo: '',
      role: 'user',
      pfl_nom: '',
      pfl_prenom: '',
      pfl_mail: '',
      pfl_etat: 'A'
    });
    setModalMode('create');
    document.getElementById('user-modal')?.classList.add('open');
  };

  const openEditModal = (user: UserWithRole) => {
    setFormData({
      cpt_pseudo: user.cpt_pseudo,
      role: (user.role as 'user' | 'admin') || 'user', 
      pfl_nom: user.profil?.pfl_nom || '',
      pfl_prenom: user.profil?.pfl_prenom || '',
      pfl_mail: user.profil?.pfl_mail || '',
      pfl_etat: user.profil?.pfl_etat || 'A'
    });
    setCurrentUserId(user.cpt_id);
    setModalMode('edit');
    document.getElementById('user-modal')?.classList.add('open');
  };

  const closeModal = () => {
    document.getElementById('user-modal')?.classList.remove('open');
    setFormData({
      cpt_pseudo: '',
      role: 'user',
      pfl_nom: '',
      pfl_prenom: '',
      pfl_mail: '',
      pfl_etat: 'A'
    });
    setCurrentUserId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (modalMode === 'create') {
      const newUser: UserWithRole = {
        cpt_id: Date.now().toString(),
        cpt_pseudo: formData.cpt_pseudo,
        cpt_mdp: '',
        profil: {
          pfl_nom: formData.pfl_nom,
          pfl_prenom: formData.pfl_prenom,
          pfl_mail: formData.pfl_mail,
          pfl_etat: formData.pfl_etat,
          pfl_date: new Date().toISOString(),
          cpt_id: Date.now().toString()
        },
        role: formData.role
      };
      setUsers([...users, newUser]);
    } else if (modalMode === 'edit' && currentUserId) {
      setUsers(users.map(user => {
        if (user.cpt_id === currentUserId) {
          return {
            ...user,
            cpt_pseudo: formData.cpt_pseudo,
            profil: {
              ...user.profil,
              pfl_nom: formData.pfl_nom,
              pfl_prenom: formData.pfl_prenom,
              pfl_mail: formData.pfl_mail,
              pfl_etat: formData.pfl_etat,
              pfl_date: user.profil?.pfl_date || new Date().toISOString(),
              cpt_id: user.profil?.cpt_id || user.cpt_id
            },
            role: formData.role
          };
        }
        return user;
      }));
    }

    closeModal();
  };

  const handleDelete = (userId: string) => {
    if (globalThis.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUsers(users.filter(user => user.cpt_id !== userId));
    }
  };

  const getStatusStyle = (etat: 'A' | 'D') => ({
    color: etat === 'A' ? '#4CAF50' : '#9E9E9E',
    backgroundColor: etat === 'A' ? '#E8F5E9' : '#FAFAFA',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold' as const,
    display: 'inline-block'
  });

  const getRoleStyle = (role?: string) => {
    if (!role) return { display: 'none' };

    const colors: Record<string, { bg: string; color: string }> = {
      admin: { bg: '#E53935', color: '#FFFFFF' },
      user: { bg: '#42A5F5', color: '#FFFFFF' }
    };

    const color = colors[role] || { bg: '#CCCCCC', color: '#000000' };

    return {
      padding: '4px 8px',
      backgroundColor: color.bg,
      color: color.color,
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 'bold' as const,
      display: 'inline-block'
    };
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, color: '#2c3e50' }}>Gestion des utilisateurs</h1>
        <button
          type = "button"
          onClick={() => navigate('/accueil')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retour à l'accueil
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          type = "button"
          onClick={openCreateModal}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          + Ajouter un utilisateur
        </button>
      </div>

      {loading ? (
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
          <p>Chargement des utilisateurs...</p>
        </div>
      ) : users.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          <p>Aucun utilisateur trouvé.</p>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: '600' }}>ID</th>
                <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: '600' }}>Pseudo</th>
                <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: '600' }}>Nom</th>
                <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: '600' }}>Prénom</th>
                <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: '600' }}>Email</th>
                <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: '600' }}>Rôle</th>
                <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: '600' }}>Statut</th>
                <th style={{ padding: '12px 15px', textAlign: 'center', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.cpt_id}
                  style={{
                    borderBottom: '1px solid #eee',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <td style={{ padding: '12px 15px' }}>{user.cpt_id}</td>
                  <td style={{ padding: '12px 15px' }}>{user.cpt_pseudo}</td>
                  <td style={{ padding: '12px 15px' }}>{user.profil?.pfl_nom || '-'}</td>
                  <td style={{ padding: '12px 15px' }}>{user.profil?.pfl_prenom || '-'}</td>
                  <td style={{ padding: '12px 15px' }}>{user.profil?.pfl_mail || '-'}</td>
                  <td style={{ padding: '12px 15px' }}>
                    <div style={getRoleStyle(user.role)}>
                      {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                    </div>
                  </td>
                  <td style={{ padding: '12px 15px' }}>
                    <div style={getStatusStyle(user.profil?.pfl_etat || 'A')}>
                      {user.profil?.pfl_etat === 'A' ? 'Actif' : 'Désactivé'}
                    </div>
                  </td>
                  <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        type="button"
                        onClick={() => openEditModal(user)}
                        style={{
                          padding: '6px 10px',
                          backgroundColor: '#2196F3',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(user.cpt_id)}
                        style={{
                          padding: '6px 10px',
                          backgroundColor: '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div id="user-modal" className="modal" style={{
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
          <h2 style={{ marginTop: 0, color: '#2c3e50' }}>
            {modalMode === 'create' ? 'Ajouter un utilisateur' : 'Modifier un utilisateur'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>
                Pseudo *
              </label>
              <input
                type="text"
                value={formData.cpt_pseudo}
                onChange={(e) => setFormData({...formData, cpt_pseudo: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '10px 15px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>
                Nom
              </label>
              <input
                type="text"
                value={formData.pfl_nom}
                onChange={(e) => setFormData({...formData, pfl_nom: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px 15px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>
                Prénom
              </label>
              <input
                type="text"
                value={formData.pfl_prenom}
                onChange={(e) => setFormData({...formData, pfl_prenom: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px 15px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>
                Email *
              </label>
              <input
                type="email"
                value={formData.pfl_mail}
                onChange={(e) => setFormData({...formData, pfl_mail: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '10px 15px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>
                Rôle *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value as 'user' | 'admin'})}
                required
                style={{
                  width: '100%',
                  padding: '10px 15px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="user">Utilisateur</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>
                Statut *
              </label>
              <select
                value={formData.pfl_etat}
                onChange={(e) => setFormData({...formData, pfl_etat: e.target.value as 'A' | 'D'})}
                required
                style={{
                  width: '100%',
                  padding: '10px 15px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="A">Actif</option>
                <option value="D">Désactivé</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={closeModal}
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
                type="submit"
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {modalMode === 'create' ? 'Ajouter' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>
        {`
          .modal.open { display: flex !important; }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default UserManagementPage;
