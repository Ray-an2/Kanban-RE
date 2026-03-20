import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Profil } from '../model/types.ts';
import { useAuth } from '../hooks/useAuth.ts';
import { profilApi, compteApi, tableauApi, carteApi } from '../api/apiClient.ts';

const CompteAdmin: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profil, setProfil] = useState<Profil | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ nom: '', prenom: '', mail: '', pseudo: '' });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [stats, setStats] = useState<{ tableaux: number; utilisateurs: number; cartes: number } | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    profilApi.getById(user.cpt_id)
        .then(data => {
          const p = data as Profil;
          setProfil(p);
          setFormData({ nom: p.nom ?? '', prenom: p.prenom ?? '', mail: p.mail ?? '', pseudo: user.cpt_pseudo });
        })
        .catch(err => setError(err instanceof Error ? err.message : 'Erreur'))
        .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const [tableaux, comptes, cartes] = await Promise.all([
          await tableauApi.getNombre() as Promise<number>,
          compteApi.getAll().then((c: unknown) => (c as unknown[]).length),
          carteApi.getById('').catch(() => null).then(async () => {
            // On récupère toutes les listes de tous les tableaux pour compter les cartes
            const tabs = await tableauApi.getAll() as { tab_id: string }[];
            const counts = await Promise.all(
                tabs.map(t =>
                    fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:8000'}/api/carte/tableau/${t.tab_id}/archivees`, {
                      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
                    }).then(r => r.ok ? r.json() : []).then((arr: unknown[]) => arr.length).catch(() => 0)
                )
            );
            return counts.reduce((a, b) => a + b, 0);
          })
        ]);
        setStats({ tableaux: tableaux as number, utilisateurs: comptes, cartes });
      } catch {
        setStats(null);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError(null);
    try {
      await profilApi.update(user.cpt_id, {
        nom: formData.nom,
        prenom: formData.prenom,
        mail: formData.mail,
        etat: profil?.etat ?? 'A',
      });
      if (formData.pseudo !== user.cpt_pseudo) {
        await compteApi.updatePseudo(user.cpt_id, formData.pseudo);
      }
      setProfil(prev => prev ? { ...prev, nom: formData.nom, prenom: formData.prenom, mail: formData.mail } : prev);
      setEditMode(false);
      setSuccess('Profil mis à jour avec succès.');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur mise à jour');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 12px', border: '1px solid #ddd',
    borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box',
  };

  const statCardStyle = (color: string): React.CSSProperties => ({
    flex: 1,
    backgroundColor: `${color}15`,
    border: `1px solid ${color}40`,
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
  });

  if (loading) return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ border: '4px solid rgba(0,0,0,0.1)', borderRadius: '50%', borderTop: '4px solid #3498db', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
        <p>Chargement du profil...</p>
        <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
      </div>
  );

  return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '30px', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ margin: 0, color: '#2c3e50' }}>Mon Compte</h1>
          <button type="button" onClick={() => { logout(); navigate('/auth/login'); }}
                  style={{ padding: '8px 16px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Se déconnecter
          </button>
        </div>

        {error && <div style={{ padding: '10px 15px', backgroundColor: '#fdecea', color: '#e74c3c', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}
        {success && <div style={{ padding: '10px 15px', backgroundColor: '#e8f5e9', color: '#2e7d32', borderRadius: '4px', marginBottom: '15px' }}>{success}</div>}

        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '30px', color: '#333' }}>
          {/* Infos de sécurité */}
          <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
              <strong>ID :</strong> {user?.cpt_id}<br />
              <strong>Rôle :</strong> Administrateur
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, color: '#2c3e50' }}>Informations personnelles</h2>
            {!editMode && (
                <button type="button" onClick={() => setEditMode(true)}
                        style={{ padding: '6px 12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Modifier
                </button>
            )}
          </div>

          {editMode ? (
              <form onSubmit={handleSubmit}>
                {([
                  ['nom',    'Nom'],
                  ['prenom', 'Prénom'],
                  ['mail',   'Email'],
                  ['pseudo', 'Pseudo'],
                ] as [keyof typeof formData, string][]).map(([field, label]) => (
                    <div key={field} style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#555' }}>{label}</label>
                      <input
                          type={field === 'mail' ? 'email' : 'text'}
                          value={formData[field]}
                          onChange={e => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                          style={inputStyle}
                          required
                      />
                    </div>
                ))}
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button type="button" onClick={() => {
                    setEditMode(false);
                    setFormData({ nom: profil?.nom ?? '', prenom: profil?.prenom ?? '', mail: profil?.mail ?? '', pseudo: user?.cpt_pseudo ?? '' });
                  }}
                          style={{ padding: '8px 16px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Annuler
                  </button>
                  <button type="submit"
                          style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Enregistrer
                  </button>
                </div>
              </form>
          ) : (
              <div>
                {[
                  ['Nom',        profil?.nom],
                  ['Prénom',     profil?.prenom],
                  ['Email',      profil?.mail],
                  ['Pseudo',     user?.cpt_pseudo],
                  ['Statut',     profil?.etat === 'A' ? '✓ Actif' : '✗ Désactivé'],
                  ['Depuis le',  profil?.dateCreation ? new Date(profil.dateCreation).toLocaleDateString('fr-FR') : '—'],
                ].map(([label, value]) => (
                    <div key={label} style={{ marginBottom: '12px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <strong style={{ minWidth: '100px', color: '#555', flexShrink: 0 }}>{label} :</strong>
                      <span>{value ?? 'Non renseigné'}</span>
                    </div>
                ))}
              </div>
          )}

          <div style={{ borderTop: '1px solid #eee', paddingTop: '25px', marginTop: '25px' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>Statistiques</h2>

            {statsLoading ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                  Chargement des statistiques...
                </div>
            ) : stats ? (
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={statCardStyle('#3498db')}>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#3498db', marginBottom: '8px' }}>
                      {stats.tableaux}
                    </div>
                    <div style={{ fontSize: '14px', color: '#555', fontWeight: '500' }}>
                      Tableaux
                    </div>
                  </div>
                  <div style={statCardStyle('#9b59b6')}>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#9b59b6', marginBottom: '8px' }}>
                      {stats.utilisateurs}
                    </div>
                    <div style={{ fontSize: '14px', color: '#555', fontWeight: '500' }}>
                      Utilisateurs
                    </div>
                  </div>
                  <div style={statCardStyle('#e67e22')}>
                    <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#e67e22', marginBottom: '8px' }}>
                      {stats.cartes}
                    </div>
                    <div style={{ fontSize: '14px', color: '#555', fontWeight: '500' }}>
                      Cartes
                    </div>
                  </div>
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                  Impossible de charger les statistiques.
                </div>
            )}
          </div>

          <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '25px', display: 'flex', gap: '10px' }}>
            <button type="button" onClick={() => navigate('/api/admin/comptes')}
                    style={{ padding: '8px 16px', backgroundColor: '#9b59b6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Gérer les utilisateurs
            </button>
            <button type="button" onClick={() => navigate('/api/admin/tableaux')}
                    style={{ padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Gérer les tableaux
            </button>
          </div>
        </div>
      </div>
  );
};

export default CompteAdmin;