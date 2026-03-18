import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.ts';
import type { Tableau } from '../model/types.ts';

const AdminTableaux: React.FC = () => {
    const navigate = useNavigate();
    const { token, logout } = useAuth();
    const [tableaux, setTableaux] = useState<Tableau[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Tableau;
        direction: 'asc' | 'desc'
    } | null>({
        key: 'tab_date',
        direction: 'desc'
    });

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [currentTableau, setCurrentTableau] = useState<Tableau | null>(null);
    const [formData, setFormData] = useState({
        tab_nom: '',
        tab_description: '',
        tab_etat: 'A' as 'A' | 'I'
    });

    const fetchTableaux = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8081/api/tableau', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setTableaux(data);
        } catch (error) {
            console.error("Erreur lors du chargement des tableaux:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTableaux();
    }, []);

    const requestSort = (key: keyof Tableau) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedTableaux = useMemo(() => {
        const sortableTableaux = [...tableaux];
        if (sortConfig) {
            sortableTableaux.sort((a, b) => {
                if (sortConfig.key === 'tab_date') {
                    const dateA = new Date(a.tab_date).getTime();
                    const dateB = new Date(b.tab_date).getTime();
                    return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
                }
                return 0;
            });
        }
        return sortableTableaux;
    }, [tableaux, sortConfig]);

    const filteredTableaux = sortedTableaux.filter(tableau =>
        tableau.tab_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tableau.tab_description && tableau.tab_description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const openCreateModal = () => {
        setFormData({ tab_nom: '', tab_description: '', tab_etat: 'A' });
        setModalMode('create');
        setShowModal(true);
    };

    const openEditModal = (tableau: Tableau) => {
        setFormData({
            tab_nom: tableau.tab_nom,
            tab_description: tableau.tab_description || '',
            tab_etat: tableau.tab_etat
        });
        setCurrentTableau(tableau);
        setModalMode('edit');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentTableau(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (modalMode === 'create') {
            await fetch('http://localhost:8081/api/tableau', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ tab_nom: formData.tab_nom, tab_description: formData.tab_description, tab_etat: formData.tab_etat })
            });
        } else if (modalMode === 'edit' && currentTableau) {
            await fetch(`http://localhost:8081/api/tableau/${currentTableau.tab_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ tab_nom: formData.tab_nom, tab_description: formData.tab_description, tab_etat: formData.tab_etat })
            });
        }
        await fetchTableaux();
        closeModal();
    };

    const handleDelete = async (tableauId: string) => {
        if (globalThis.confirm('Êtes-vous sûr de vouloir supprimer ce tableau ?')) {
            await fetch(`http://localhost:8081/api/tableau/${tableauId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setTableaux(tableaux.filter(t => t.tab_id !== tableauId));
        }
    };

    const toggleStatus = async (tableauId: string) => {
        const tableau = tableaux.find(t => t.tab_id === tableauId);
        if (!tableau) return;
        await fetch(`http://localhost:8081/api/tableau/${tableauId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ ...tableau, tab_etat: tableau.tab_etat === 'A' ? 'I' : 'A' })
        });
        setTableaux(tableaux.map(t =>
            t.tab_id === tableauId ? { ...t, tab_etat: t.tab_etat === 'A' ? 'I' : 'A' } : t
        ));
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

    const getSortIcon = (key: keyof Tableau) => {
        if (!sortConfig || sortConfig.key !== key) return '↕';
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ margin: 0, color: '#2c3e50' }}>Gestion des Tableaux</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        type="button"
                        onClick={() => navigate('/api/tableau')}
                        style={{ padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Retour à l'accueil
                    </button>
                    <button
                        type="button"
                        onClick={openCreateModal}
                        style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        + Nouveau Tableau
                    </button>
                    <button
                        type="button"
                        onClick={() => { logout(); navigate('/auth/login'); }}
                        style={{ padding: '8px 16px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Se déconnecter
                    </button>
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Rechercher un tableau..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', maxWidth: '400px' }}
                />
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
                    <p>Chargement des tableaux...</p>
                </div>
            ) : (
                <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    {filteredTableaux.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
                            <p>Aucun tableau trouvé.</p>
                            <button type="button" onClick={openCreateModal} style={{ marginTop: '15px', padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                Créer un nouveau tableau
                            </button>
                        </div>
                    ) : (
                        <>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                <tr style={{ backgroundColor: '#f8f9fa' }}>
                                    <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50', cursor: 'pointer' }} onClick={() => requestSort('tab_id')}>ID {getSortIcon('tab_id')}</th>
                                    <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50', cursor: 'pointer' }} onClick={() => requestSort('tab_nom')}>Nom {getSortIcon('tab_nom')}</th>
                                    <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50', cursor: 'pointer' }}>Description</th>
                                    <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50', cursor: 'pointer' }} onClick={() => requestSort('tab_date')}>Date de création {getSortIcon('tab_date')}</th>
                                    <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50', cursor: 'pointer' }} onClick={() => requestSort('tab_etat')}>Statut {getSortIcon('tab_etat')}</th>
                                    <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: '600', color: '#2c3e50', cursor: 'pointer' }}>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredTableaux.map((tableau) => (
                                    <tr
                                        key={tableau.tab_id}
                                        style={{ borderBottom: '1px solid #eee', transition: 'background-color 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                    >
                                        <td style={{ padding: '12px 15px', color: '#2c3e50' }}>{tableau.tab_id}</td>
                                        <td style={{ padding: '12px 15px', color: '#2c3e50' }}><div style={{ fontWeight: '500' }}>{tableau.tab_nom}</div></td>
                                        <td style={{ padding: '12px 15px', color: '#2c3e50' }}>{tableau.tab_description || <span style={{ color: '#999' }}>Aucune description</span>}</td>
                                        <td style={{ padding: '12px 15px', color: '#2c3e50' }}>{new Date(tableau.tab_date).toLocaleDateString('fr-FR')}</td>
                                        <td style={{ padding: '12px 15px' }}><div style={getStatusStyle(tableau.tab_etat)}>{tableau.tab_etat === 'A' ? 'Actif' : 'Archivé'}</div></td>
                                        <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button type="button" onClick={() => navigate(`/api/tableau/${tableau.tab_id}`)} style={{ padding: '6px 10px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>👁 Voir</button>
                                                <button type="button" onClick={() => openEditModal(tableau)} style={{ padding: '6px 10px', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>✏️ Modifier</button>
                                                <button type="button" onClick={() => toggleStatus(tableau.tab_id)} style={{ padding: '6px 10px', backgroundColor: tableau.tab_etat === 'A' ? '#f44336' : '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>{tableau.tab_etat === 'A' ? '📁 Archiver' : '🔄 Réactiver'}</button>
                                                <button type="button" onClick={() => handleDelete(tableau.tab_id)} style={{ padding: '6px 10px', backgroundColor: '#9E9E9E', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>🗑 Supprimer</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <div style={{ padding: '15px', textAlign: 'right', color: '#666', fontSize: '14px' }}>
                                {filteredTableaux.length} tableau{filteredTableaux.length > 1 ? 'x' : ''} trouvé{filteredTableaux.length > 1 ? 's' : ''}
                            </div>
                        </>
                    )}
                </div>
            )}

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '500px', maxWidth: '90%', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                        <h2 style={{ marginTop: 0, color: '#2c3e50' }}>
                            {modalMode === 'create' ? 'Créer un nouveau tableau' : 'Modifier le tableau'}
                        </h2>
                        <div style={{ marginTop: '20px' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Nom du tableau *</label>
                                <input
                                    type="text"
                                    id="tab_nom"
                                    name="tab_nom"
                                    value={formData.tab_nom}
                                    onChange={(e) => setFormData({...formData, tab_nom: e.target.value})}
                                    required
                                    style={{ width: '100%', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                                    placeholder="Ex: Projet Alpha..."
                                />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Description (optionnelle)</label>
                                <textarea
                                    id="tab_description"
                                    name="tab_description"
                                    value={formData.tab_description}
                                    onChange={(e) => setFormData({...formData, tab_description: e.target.value})}
                                    style={{ width: '100%', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', minHeight: '100px', resize: 'vertical' }}
                                    placeholder="Décrivez le but de ce tableau..."
                                />
                            </div>
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontWeight: '500' }}>Statut</label>
                                <select
                                    id="tab_etat"
                                    name="tab_etat"
                                    value={formData.tab_etat}
                                    onChange={(e) => setFormData({...formData, tab_etat: e.target.value as 'A' | 'I'})}
                                    style={{ width: '100%', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                                >
                                    <option value="A">Actif</option>
                                    <option value="I">Archivé</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={closeModal} style={{ padding: '8px 16px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Annuler</button>
                                <button type="button" onClick={handleSubmit} style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                    {modalMode === 'create' ? 'Créer' : 'Enregistrer'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default AdminTableaux;