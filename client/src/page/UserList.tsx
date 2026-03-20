import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Compte, Profil } from '../model/types.ts';
import { compteApi, profilApi, authApi } from '../api/apiClient.ts';

interface UserRow {
  compte: Compte;
  profil?: Profil;
}

type ModalMode = 'edit' | 'create';

const UserManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('edit');
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ pseudo: '', role: 'U' });
  const [createData, setCreateData] = useState({
    pseudo: '',
    mdp: '',
    mdpConfirm: '',
    role: 'U',
    nom: '',
    prenom: '',
    mail: ''
  });
  const [createError, setCreateError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const comptes = await compteApi.getAll() as Compte[];
      const rows: UserRow[] = await Promise.all(
          comptes.map(async c => {
            try {
              const profil = await profilApi.getById(c.id) as Profil;
              return { compte: c, profil };
            } catch {
              return { compte: c };
            }
          })
      );
      setUsers(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = users.filter(u =>
      u.compte.pseudo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.profil?.nom ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.profil?.mail ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openEdit = (u: UserRow) => {
    setFormData({ pseudo: u.compte.pseudo, role: u.compte.role });
    setCurrentId(u.compte.id);
    setModalMode('edit');
    setShowModal(true);
  };

  const openCreate = () => {
    setCreateData({ pseudo: '', mdp: '', mdpConfirm: '', role: 'U', nom: '', prenom: '', mail: '' });
    setCreateError(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentId) return;
    try {
      if (formData.pseudo) await compteApi.updatePseudo(currentId, formData.pseudo);
      if (formData.role) await compteApi.updateRole(currentId, formData.role);
      await load();
      setShowModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur mise à jour');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    if (!createData.pseudo.trim()) {
      setCreateError('Le pseudo est obligatoire');
      return;
    }
    if (!createData.mdp.trim()) {
      setCreateError('Le mot de passe est obligatoire');
      return;
    }
    if (createData.mdp !== createData.mdpConfirm) {
      setCreateError('Les mots de passe ne correspondent pas');
      return;
    }
    if (!createData.mail.trim()) {
      setCreateError('L\'email est obligatoire');
      return;
    }

    try {
      // 1. Inscription via Deno (crée le compte + profil)
      await authApi.inscription({
        pseudo: createData.pseudo,
        motDePasse: createData.mdp,
        email: createData.mail,
        nom: createData.nom,
        prenom: createData.prenom
      });

      // 2. Si rôle admin, on récupère le compte créé et on met à jour son rôle
      if (createData.role === 'A') {
        const comptes = await compteApi.getAll() as Compte[];
        const newCompte = comptes.find(c => c.pseudo === createData.pseudo);
        if (newCompte) {
          await compteApi.updateRole(newCompte.id, 'A');
        }
      }

      await load();
      setShowModal(false);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Erreur lors de la création du compte');
    }
  };

  const handleDelete = async (id: string, pseudo: string) => {
    if (!globalThis.confirm(`Supprimer le compte "${pseudo}" ?`)) return;
    try {
      await compteApi.delete(id);
      setUsers(prev => prev.filter(u => u.compte.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur suppression');
    }
  };

  const roleLabel = (role: string) => role === 'A' ? 'Administrateur' : 'Utilisateur';
  const roleColor = (role: string) => role === 'A'
      ? { bg: '#E53935', color: '#fff' }
      : { bg: '#42A5F5', color: '#fff' };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box' as const,
    fontSize: '14px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    color: '#555',
    fontWeight: '500' as const,
    fontSize: '14px'
  };

  return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ margin: 0, color: '#2c3e50' }}>Gestion des utilisateurs</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={openCreate}
                    style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              + Nouveau compte
            </button>
            <button type="button" onClick={() => navigate('/api/admin/tableaux')}
                    style={{ padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Retour admin
            </button>
          </div>
        </div>

        {error && (
            <div style={{ padding: '10px 15px', backgroundColor: '#fdecea', color: '#e74c3c', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>
        )}

        <input type="text" placeholder="Rechercher par pseudo, nom ou email..." value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               style={{ width: '100%', maxWidth: '400px', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', marginBottom: '20px' }} />

        {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <div style={{ border: '4px solid rgba(0,0,0,0.1)', borderRadius: '50%', borderTop: '4px solid #3498db', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
              <p>Chargement des utilisateurs...</p>
            </div>
        ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>Aucun utilisateur trouvé.</div>
        ) : (
            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  {['Pseudo', 'Nom', 'Prénom', 'Email', 'Rôle', 'Statut', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>{h}</th>
                  ))}
                </tr>
                </thead>
                <tbody>
                {filtered.map(u => {
                  const c = u.compte;
                  const p = u.profil;
                  const rc = roleColor(c.role);
                  return (
                      <tr key={c.id} style={{ borderBottom: '1px solid #eee', color: '#333' }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}>
                        <td style={{ padding: '12px 15px', fontWeight: '500' }}>{c.pseudo}</td>
                        <td style={{ padding: '12px 15px' }}>{p?.nom ?? '—'}</td>
                        <td style={{ padding: '12px 15px' }}>{p?.prenom ?? '—'}</td>
                        <td style={{ padding: '12px 15px' }}>{p?.mail ?? '—'}</td>
                        <td style={{ padding: '12px 15px' }}>
                      <span style={{ padding: '3px 8px', backgroundColor: rc.bg, color: rc.color, borderRadius: '10px', fontSize: '12px', fontWeight: 'bold' }}>
                        {roleLabel(c.role)}
                      </span>
                        </td>
                        <td style={{ padding: '12px 15px' }}>
                      <span style={{ padding: '3px 8px', backgroundColor: p?.etat === 'A' ? '#E8F5E9' : '#FAFAFA', color: p?.etat === 'A' ? '#4CAF50' : '#9E9E9E', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold' }}>
                        {p?.etat === 'A' ? 'Actif' : 'Désactivé'}
                      </span>
                        </td>
                        <td style={{ padding: '12px 15px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button type="button" onClick={() => openEdit(u)}
                                    style={{ padding: '5px 10px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                              Modifier
                            </button>
                            <button type="button" onClick={() => handleDelete(c.id, c.pseudo)}
                                    style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                  );
                })}
                </tbody>
              </table>
              <div style={{ padding: '12px 15px', color: '#666', fontSize: '13px', textAlign: 'right' }}>
                {filtered.length} utilisateur{filtered.length > 1 ? 's' : ''}
              </div>
            </div>
        )}

        {/* Modal */}
        {showModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
              <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '480px', maxWidth: '90%', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>

                {/* ── MODE ÉDITION ── */}
                {modalMode === 'edit' && (
                    <>
                      <h2 style={{ marginTop: 0, color: '#2c3e50' }}>Modifier l'utilisateur</h2>
                      <form onSubmit={handleUpdate}>
                        <div style={{ marginBottom: '15px' }}>
                          <label style={labelStyle}>Pseudo</label>
                          <input type="text" value={formData.pseudo}
                                 onChange={e => setFormData(p => ({ ...p, pseudo: e.target.value }))}
                                 style={inputStyle} />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                          <label style={labelStyle}>Rôle</label>
                          <select value={formData.role} onChange={e => setFormData(p => ({ ...p, role: e.target.value }))}
                                  style={inputStyle}>
                            <option value="U">Utilisateur</option>
                            <option value="A">Administrateur</option>
                          </select>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                          <button type="button" onClick={() => setShowModal(false)}
                                  style={{ padding: '8px 16px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Annuler
                          </button>
                          <button type="submit"
                                  style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Enregistrer
                          </button>
                        </div>
                      </form>
                    </>
                )}

                {/* ── MODE CRÉATION ── */}
                {modalMode === 'create' && (
                    <>
                      <h2 style={{ marginTop: 0, color: '#2c3e50' }}>Créer un compte</h2>

                      {createError && (
                          <div style={{ padding: '10px', backgroundColor: '#fdecea', color: '#e74c3c', borderRadius: '4px', marginBottom: '15px', fontSize: '14px' }}>
                            {createError}
                          </div>
                      )}

                      <form onSubmit={handleCreate}>
                        <p style={{ margin: '0 0 15px 0', color: '#888', fontSize: '13px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                          Informations du compte
                        </p>

                        <div style={{ marginBottom: '15px' }}>
                          <label style={labelStyle}>Pseudo *</label>
                          <input type="text" value={createData.pseudo}
                                 onChange={e => setCreateData(p => ({ ...p, pseudo: e.target.value }))}
                                 placeholder="Ex: jdupont"
                                 style={inputStyle} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
                          <div>
                            <label style={labelStyle}>Mot de passe *</label>
                            <input type="password" value={createData.mdp}
                                   onChange={e => setCreateData(p => ({ ...p, mdp: e.target.value }))}
                                   placeholder="••••••••"
                                   style={inputStyle} />
                          </div>
                          <div>
                            <label style={labelStyle}>Confirmer *</label>
                            <input type="password" value={createData.mdpConfirm}
                                   onChange={e => setCreateData(p => ({ ...p, mdpConfirm: e.target.value }))}
                                   placeholder="••••••••"
                                   style={inputStyle} />
                          </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                          <label style={labelStyle}>Rôle</label>
                          <select value={createData.role}
                                  onChange={e => setCreateData(p => ({ ...p, role: e.target.value }))}
                                  style={inputStyle}>
                            <option value="U">Utilisateur</option>
                            <option value="A">Administrateur</option>
                          </select>
                        </div>

                        <p style={{ margin: '0 0 15px 0', color: '#888', fontSize: '13px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                          Informations du profil
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
                          <div>
                            <label style={labelStyle}>Nom</label>
                            <input type="text" value={createData.nom}
                                   onChange={e => setCreateData(p => ({ ...p, nom: e.target.value }))}
                                   placeholder="Ex: Dupont"
                                   style={inputStyle} />
                          </div>
                          <div>
                            <label style={labelStyle}>Prénom</label>
                            <input type="text" value={createData.prenom}
                                   onChange={e => setCreateData(p => ({ ...p, prenom: e.target.value }))}
                                   placeholder="Ex: Jean"
                                   style={inputStyle} />
                          </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                          <label style={labelStyle}>Email *</label>
                          <input type="email" value={createData.mail}
                                 onChange={e => setCreateData(p => ({ ...p, mail: e.target.value }))}
                                 placeholder="Ex: jean.dupont@email.com"
                                 style={inputStyle} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                          <button type="button" onClick={() => setShowModal(false)}
                                  style={{ padding: '8px 16px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Annuler
                          </button>
                          <button type="submit"
                                  style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Créer le compte
                          </button>
                        </div>
                      </form>
                    </>
                )}
              </div>
            </div>
        )}

        <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
      </div>
  );
};

export default UserManagementPage;