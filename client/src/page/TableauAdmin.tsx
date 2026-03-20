import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.ts';
import type { Tableau } from '../model/types.ts';
import { tableauApi } from '../api/apiClient.ts';
import InvitationModal from '../components/InvitationModal.tsx';

const AdminTableaux: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [tableaux, setTableaux] = useState<Tableau[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [current, setCurrent] = useState<Tableau | null>(null);
    const [formData, setFormData] = useState({ tab_nom: '', tab_description: '' });
    const [error, setError] = useState<string | null>(null);
    const [invitationTableau, setInvitationTableau] = useState<{ id: string; nom: string } | null>(null);

    const load = async () => {
        try {
            setLoading(true);
            setTableaux(await tableauApi.getAll() as Tableau[]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const filtered = useMemo(() =>
            tableaux
                .filter(t =>
                    t.tab_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (t.tab_description ?? '').toLowerCase().includes(searchTerm.toLowerCase())
                )
                .sort((a, b) => new Date(b.tab_date).getTime() - new Date(a.tab_date).getTime()),
        [tableaux, searchTerm]
    );

    const openCreate = () => {
        setFormData({ tab_nom: '', tab_description: '' });
        setModalMode('create');
        setShowModal(true);
    };

    const openEdit = (t: Tableau) => {
        setFormData({ tab_nom: t.tab_nom, tab_description: t.tab_description ?? '' });
        setCurrent(t);
        setModalMode('edit');
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (modalMode === 'create') await tableauApi.create(formData);
            else if (current) await tableauApi.update(current.tab_id, formData);
            await load();
            setShowModal(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur');
        }
    };

    const handleDelete = async (id: string) => {
        if (!globalThis.confirm('Supprimer ce tableau ?')) return;
        try {
            await tableauApi.delete(id);
            setTableaux(prev => prev.filter(t => t.tab_id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur');
        }
    };

    const toggleStatus = async (t: Tableau) => {
        try {
            // tab_etat 'O' = Ouvert, 'F' = Fermé
            if (t.tab_etat === 'O') await tableauApi.fermer(t.tab_id);
            else await tableauApi.ouvrir(t.tab_id);
            setTableaux(prev =>
                prev.map(x => x.tab_id === t.tab_id ? { ...x, tab_etat: x.tab_etat === 'O' ? 'F' : 'O' } : x)
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur statut');
        }
    };

    const statusStyle = (etat: string): React.CSSProperties => ({
        color: etat === 'O' ? '#4CAF50' : '#9E9E9E',
        backgroundColor: etat === 'O' ? '#E8F5E9' : '#FAFAFA',
        padding: '4px 8px', borderRadius: '12px',
        fontSize: '12px', fontWeight: 'bold', display: 'inline-block',
    });

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ margin: 0, color: '#2c3e50' }}>Gestion des Tableaux</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="button" onClick={() => navigate('/api/admin/comptes')}
                            style={{ padding: '8px 16px', backgroundColor: '#9b59b6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Utilisateurs
                    </button>
                    <button type="button" onClick={() => navigate('/api/tableau/logs')}
                            style={{ padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Logs
                    </button>
                    <button type="button" onClick={() => navigate('/api/admin/compte')}
                            style={{ padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Mon compte
                    </button>
                    <button type="button" onClick={() => { logout(); navigate('/auth/login'); }}
                            style={{ padding: '8px 16px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Déconnecter
                    </button>
                </div>
            </div>

            {error && (
                <div style={{ padding: '10px 15px', backgroundColor: '#fdecea', color: '#e74c3c', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>
            )}

            <input type="text" placeholder="Rechercher..." value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                   style={{ width: '100%', maxWidth: '400px', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', marginBottom: '20px' }} />

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <div style={{ border: '4px solid rgba(0,0,0,0.1)', borderRadius: '50%', borderTop: '4px solid #3498db', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
                    <p>Chargement...</p>
                </div>
            ) : (
                <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    {filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Aucun tableau.</div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                            <tr style={{ backgroundColor: '#f8f9fa' }}>
                                {['Nom', 'Description', 'Créé le', 'Statut', 'Actions'].map(h => (
                                    <th key={h} style={{ padding: '12px 15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50' }}>{h}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {filtered.map(t => (
                                <tr key={t.tab_id} style={{ borderBottom: '1px solid #eee' }}
                                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
                                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}>
                                    <td style={{ padding: '12px 15px', color: '#2c3e50', fontWeight: '500' }}>{t.tab_nom}</td>
                                    <td style={{ padding: '12px 15px', color: '#555', fontSize: '13px' }}>{t.tab_description ?? '—'}</td>
                                    <td style={{ padding: '12px 15px', color: '#666', fontSize: '13px' }}>
                                        {new Date(t.tab_date).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td style={{ padding: '12px 15px' }}>
                                        {/* tab_etat : 'O' = Ouvert, 'F' = Fermé */}
                                        <div style={statusStyle(t.tab_etat)}>{t.tab_etat === 'O' ? 'Ouvert' : 'Fermé'}</div>
                                    </td>
                                    <td style={{ padding: '12px 15px' }}>
                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                            <button type="button" onClick={() => navigate(`/api/tableau/${t.tab_id}`)}
                                                    style={{ padding: '5px 10px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                                                Voir
                                            </button>
                                            <button type="button" onClick={() => openEdit(t)}
                                                    style={{ padding: '5px 10px', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                                                Modifier
                                            </button>
                                            <button type="button" onClick={() => toggleStatus(t)}
                                                    style={{ padding: '5px 10px', backgroundColor: t.tab_etat === 'O' ? '#f44336' : '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                                                {t.tab_etat === 'O' ? 'Fermer' : 'Ouvrir'}
                                            </button>
                                            <button type="button" onClick={() => setInvitationTableau({ id: t.tab_id, nom: t.tab_nom })}
                                                    style={{ padding: '5px 10px', backgroundColor: '#9b59b6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                                                Inviter
                                            </button>
                                            <button type="button" onClick={() => handleDelete(t.tab_id)}
                                                    style={{ padding: '5px 10px', backgroundColor: '#9E9E9E', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                                                Supprimer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td>
                            <button type="button" onClick={openCreate}
                                    style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                + Nouveau
                            </button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    )}
                    <div style={{ padding: '12px 15px', color: '#666', fontSize: '13px', textAlign: 'right' }}>
                        {filtered.length} tableau{filtered.length > 1 ? 'x' : ''}
                    </div>
                </div>
            )}

            {/* Modal création / édition */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '480px', maxWidth: '90%', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                        <h2 style={{ marginTop: 0, color: '#2c3e50' }}>
                            {modalMode === 'create' ? 'Nouveau tableau' : 'Modifier le tableau'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Nom *</label>
                                <input type="text" value={formData.tab_nom}
                                       onChange={e => setFormData(p => ({ ...p, tab_nom: e.target.value }))}
                                       required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' as const }} />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Description</label>
                                <textarea value={formData.tab_description}
                                          onChange={e => setFormData(p => ({ ...p, tab_description: e.target.value }))}
                                          style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px', resize: 'vertical', boxSizing: 'border-box' as const }} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setShowModal(false)}
                                        style={{ padding: '8px 16px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                    Annuler
                                </button>
                                <button type="submit"
                                        style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                    {modalMode === 'create' ? 'Créer' : 'Enregistrer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {invitationTableau && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <InvitationModal
                        tableauId={invitationTableau.id}
                        tableauNom={invitationTableau.nom}
                        onClose={() => setInvitationTableau(null)}
                    />
                </div>
            )}
            <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
        </div>
    );
};

export default AdminTableaux;