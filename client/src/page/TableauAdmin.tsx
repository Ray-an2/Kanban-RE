import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.ts';
import type { Tableau } from '../model/types.ts';
import { tableauApi } from '../api/apiClient.ts';
import TableauFormModal from '../components/TableauFormModal.tsx';
import InvitationModal from '../components/InvitationModal.tsx';

const AdminTableaux: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [tableaux, setTableaux] = useState<Tableau[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [current, setCurrent] = useState<Tableau | null>(null);
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

    const openCreate = () => { setCurrent(null); setShowModal(true); };

    const openEdit = (t: Tableau) => { setCurrent(t); setShowModal(true); };



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
                    <button type="button" onClick={openCreate}
                            style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        + Nouveau
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
                                                👥 Inviter
                                            </button>
                                            <button type="button" onClick={() => handleDelete(t.tab_id)}
                                                    style={{ padding: '5px 10px', backgroundColor: '#9E9E9E', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                                                Supprimer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
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
                <TableauFormModal
                    tableau={current}
                    onClose={() => { setShowModal(false); setCurrent(null); }}
                    onSuccess={async () => { await load(); }}
                />
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