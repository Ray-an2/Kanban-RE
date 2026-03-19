import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Profil } from '../model/types.ts';
import { useAuth } from '../hooks/useAuth.ts';
import { profilApi, compteApi } from '../api/apiClient.ts';

const Compte: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [profil, setProfil] = useState<Profil | null>(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ nom: '', prenom: '', mail: '', pseudo: '' });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;
        profilApi.getById(user.cpt_id)
            .then(data => {
                // ProfilDto champs : compteId, nom, prenom, mail, etat, dateCreation
                const p = data as Profil;
                setProfil(p);
                setFormData({ nom: p.nom ?? '', prenom: p.prenom ?? '', mail: p.mail ?? '', pseudo: user.cpt_pseudo });
            })
            .catch(err => setError(err instanceof Error ? err.message : 'Erreur'))
            .finally(() => setLoading(false));
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setError(null);
        try {
            // ProfilDto attend : nom, prenom, mail, etat
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
            setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
        }
    };

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '8px 12px', border: '1px solid #ddd',
        borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box',
    };

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
                <button type="button" onClick={() => navigate('/api/tableau')}
                        style={{ padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Retour
                </button>
            </div>

            {error && <div style={{ padding: '10px 15px', backgroundColor: '#fdecea', color: '#e74c3c', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}
            {success && <div style={{ padding: '10px 15px', backgroundColor: '#e8f5e9', color: '#2e7d32', borderRadius: '4px', marginBottom: '15px' }}>{success}</div>}

            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '30px', color: '#333' }}>
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
                            ['Nom',         profil?.nom],
                            ['Prénom',      profil?.prenom],
                            ['Email',       profil?.mail],
                            ['Pseudo',      user?.cpt_pseudo],
                            ['Rôle',        user?.cpt_role === 'A' ? 'Administrateur' : 'Utilisateur'],
                            ['Statut',      profil?.etat === 'A' ? 'Actif' : 'Désactivé'],
                            ['Membre depuis', profil?.dateCreation ? new Date(profil.dateCreation).toLocaleDateString('fr-FR') : '—'],
                        ].map(([label, value]) => (
                            <div key={label} style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
                                <strong style={{ minWidth: '120px', color: '#555' }}>{label} :</strong>
                                <span>{value ?? 'Non renseigné'}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '25px' }}>
                    <button type="button" onClick={() => { logout(); navigate('/auth/login'); }}
                            style={{ padding: '8px 16px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Se déconnecter
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Compte;