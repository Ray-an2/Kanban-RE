import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserWithProfile, Tableau, Role } from '../model/types.ts';

interface BoardWithOwner extends Tableau {
  owner: UserWithProfile;
  userRole?: Role;
}

const Accueil: React.FC = () => {
  const navigate = useNavigate();
  const [user] = useState<UserWithProfile>({
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
    }
  });

  const [boards, setBoards] = useState<BoardWithOwner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));

        const mockBoards: BoardWithOwner[] = [
          {
            tab_id: '1',
            tab_nom: 'Projet Alpha',
            tab_description: 'Développement de la nouvelle application mobile',
            tab_date: new Date().toISOString(),
            tab_etat: 'A',
            tab_image: null,
            owner: user,
            userRole: { cpt_id: user.cpt_id, tab_id: '1', rol_role: 'U' }
          },
          {
            tab_id: '2',
            tab_nom: 'Marketing 2026',
            tab_description: 'Campagnes marketing pour le Q2 2026',
            tab_date: new Date().toISOString(),
            tab_etat: 'A',
            tab_image: null,
            owner: {
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
              }
            },
            userRole: { cpt_id: user.cpt_id, tab_id: '2', rol_role: 'U' }
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
    navigate('/auth/login');
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

  const getRoleStyle = (role?: 'A' | 'U') => {
    if (!role) return { display: 'none' };

    const colors = {
      A: { bg: '#E53935', color: '#FFFFFF' },
      U: { bg: '#42A5F5', color: '#FFFFFF' }
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

  const userBoards = boards.filter(board => board.owner.cpt_id === user.cpt_id);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, color: '#2c3e50' }}>Mes Tableaux</h1>
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
        ) : userBoards.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
            <p>Vous n'avez pas encore de tableaux.</p>
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
                  border: board.tab_etat === 'I' ? '1px solid #eee' : '1px solid #e3f2fd',
                }}
                onClick={() => navigate(`/api/tableau/${board.tab_id}`)}
              >
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, color: '#2c3e50' }}>{board.tab_nom}</h3>
                    <div style={getStatusStyle(board.tab_etat)}>
                      {board.tab_etat === 'A' ? 'ACTIF' : 'ARCHIVÉ'}
                    </div>
                  </div>
                </div>

                {board.tab_description && (
                  <p style={{ color: '#555', fontSize: '14px', margin: '0 0 10px 0' }}>
                    {board.tab_description}
                  </p>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#666' }}>
                  <span>Créé le {new Date(board.tab_date).toLocaleDateString('fr-FR')}</span>
                  {board.userRole && (
                    <div style={getRoleStyle(board.userRole.rol_role)}>
                      {board.userRole.rol_role}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Accueil;
