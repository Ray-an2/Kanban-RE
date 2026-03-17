import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type{ Profil,Compte } from '../model/types.ts';

const Compte: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profil | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    pfl_nom: '',
    pfl_prenom: '',
    pfl_mail: '',
    pfl_etat: 'A' as 'A' | 'D',
    cpt_pseudo: ''
  });
  const [compte, setCompte] = useState<Compte | null>(null);

  //à remplacer par un appel API réel
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        await new Promise(resolve => setTimeout(resolve, 800));

        const mockCompte: Compte = {
          cpt_id: '1',
          cpt_pseudo: 'jdupont',
          cpt_mdp: '',
          cpt_role: 'U'
        };
        setCompte(mockCompte);
        setFormData(prev => ({ ...prev, cpt_pseudo: mockCompte.cpt_pseudo }));

        const mockProfile: Profil = {
          pfl_nom: 'Dupont',
          pfl_prenom: 'Jean',
          pfl_mail: 'jean.dupont@example.com',
          pfl_etat: 'A',
          pfl_date: new Date().toISOString(),
          cpt_id: '1'
        };

        setProfile(mockProfile);
        setFormData({
          cpt_pseudo: "",
          pfl_nom: mockProfile.pfl_nom || '',
          pfl_prenom: mockProfile.pfl_prenom || '',
          pfl_mail: mockProfile.pfl_mail || '',
          pfl_etat: mockProfile.pfl_etat || 'A'
        });
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      //à remplacer par un appel API réel
      await new Promise(resolve => setTimeout(resolve, 500));
      if (compte) {
        setCompte({ ...compte, cpt_pseudo: formData.cpt_pseudo });
      }
      if (profile) {
        const updatedProfile: Profil = {
          ...profile,
          pfl_nom: formData.pfl_nom,
          pfl_prenom: formData.pfl_prenom,
          pfl_mail: formData.pfl_mail,
          pfl_etat: formData.pfl_etat,
          pfl_date: new Date().toISOString()
        };

        setProfile(updatedProfile);
        setEditMode(false);

        alert('Profil mis à jour avec succès!');
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      alert('Une erreur est survenue lors de la mise à jour du profil');
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

  if (loading) {
    return (
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
        <p>Chargement du profil...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
        <p>Profil non trouvé.</p>
        <button
          type = "button"
          onClick={() => navigate('/api/tableau')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '15px'
          }}
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '30px',
      fontFamily: 'Arial, sans-serif'
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
          onClick={() => navigate('/api/tableau')}
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

      <div style={{
        color:"black",
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        padding: '30px'
      }}>
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Informations du compte</h2>
          <div style={{ marginBottom: '15px' }}>
            <strong>ID du compte:</strong> {profile.cpt_id}
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2 style={{ margin: 0, color: '#2c3e50' }}>Profil</h2>
            {!editMode && (
              <button
                type="button"
                onClick={() => setEditMode(true)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Modifier
              </button>
            )}
          </div>

          {editMode ? (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Nom</label>
                <input
                  type="text"
                  value={formData.pfl_nom}
                  onChange={(e) => setFormData({...formData, pfl_nom: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Prénom</label>
                <input
                  type="text"
                  value={formData.pfl_prenom}
                  onChange={(e) => setFormData({...formData, pfl_prenom: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                <input
                  type="email"
                  value={formData.pfl_mail}
                  onChange={(e) => setFormData({...formData, pfl_mail: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Pseudo</label>
                <input
                    type="text"
                    value={formData.cpt_pseudo}
                    onChange={(e) => setFormData({...formData, cpt_pseudo: e.target.value})}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                    required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Statut</label>
                <div style={getStatusStyle(formData.pfl_etat)}>
                  {formData.pfl_etat === 'A' ? 'Actif' : 'Désactivé'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    setFormData({
                      cpt_pseudo: "",
                      pfl_nom: profile.pfl_nom || '',
                      pfl_prenom: profile.pfl_prenom || '',
                      pfl_mail: profile.pfl_mail || '',
                      pfl_etat: profile.pfl_etat || 'A'
                    });
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
                  Enregistrer
                </button>
              </div>
            </form>
          ) : (
            <>
              <div style={{ marginBottom: '10px' }}>
                <strong>Nom:</strong> {profile.pfl_nom || 'Non renseigné'}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Prénom:</strong> {profile.pfl_prenom || 'Non renseigné'}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Email:</strong> {profile.pfl_mail || 'Non renseigné'}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Pseudo:</strong> {compte?.cpt_pseudo || 'Non renseigné'}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Statut:</strong>
                <div style={getStatusStyle(profile.pfl_etat)}>
                  {profile.pfl_etat === 'A' ? 'Actif' : 'Désactivé'}
                </div>
              </div>
              <div style={{ marginBottom: '10px', color: '#666', fontSize: '12px' }}>
                <strong>Date de création:</strong> {profile.pfl_date ? new Date(profile.pfl_date).toLocaleString('fr-FR') : 'Non disponible'}
              </div>
            </>
          )}
        </div>

        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <h2 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Sécurité</h2>
          <div style={{ marginBottom: '10px' }}>
            <strong>Mot de passe:</strong> ••••••••
          </div>
          <button
            type="button"
            style={{
              padding: '6px 12px',
              backgroundColor: '#f44336',
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
  );
};
export default Compte


